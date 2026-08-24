import { getBrowserClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { MultiplayerDuelState } from "../types";

export type DuelCallback = (state: Partial<MultiplayerDuelState>) => void;

/**
 * Generates an easy-to-share 6-character room code (e.g., RED123)
 */
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "RED";
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export class QuickDuelChannelManager {
  private channel: any = null;
  private matchChannel: any = null;
  private roomCode: string = "";
  private onStateChange: DuelCallback | null = null;
  private isSimulatedBot: boolean = false;
  private botTimeout: any = null;
  private uniquePlayerKey: string = "";
  private playerName: string = "";

  constructor(roomCode: string, onStateChange: DuelCallback) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.onStateChange = onStateChange;
  }

  public async initialize(isHost: boolean, playerName: string): Promise<boolean> {
    this.playerName = playerName;
    this.uniquePlayerKey = `${playerName.replace(/\s+/g, "_")}_${Math.random().toString(36).slice(2, 7)}`;

    if (!isSupabaseConfigured()) {
      // Offline/Local Simulated Opponent Mode
      this.isSimulatedBot = true;
      this.simulateMatchmaking(isHost);
      return true;
    }

    try {
      const supabase = getBrowserClient();
      const channelName = `duel_room_${this.roomCode}`;

      this.channel = supabase.channel(channelName, {
        config: {
          presence: { key: this.uniquePlayerKey },
          broadcast: { self: false },
        },
      });

      this.channel
        .on("presence", { event: "sync" }, () => {
          const presenceState = this.channel.presenceState();
          const presentKeys = Object.keys(presenceState);

          if (presentKeys.length >= 2) {
            // Find opponent key
            const opponentKey = presentKeys.find((k) => k !== this.uniquePlayerKey) || "Challenger Cadet";
            const opponentPresence = presenceState[opponentKey]?.[0] as any;
            const opponentDisplayName = opponentPresence?.user || opponentKey.split("_")[0] || "Aspirant Rival";

            this.onStateChange?.({
              status: "matched",
              opponentName: opponentDisplayName,
            });

            // Announce presence via broadcast as a double-handshake guarantee
            this.channel.send({
              type: "broadcast",
              event: "player_joined",
              payload: { user: this.playerName, senderKey: this.uniquePlayerKey },
            });
          }
        })
        .on("broadcast", { event: "player_joined" }, (payload: any) => {
          if (payload?.payload?.senderKey !== this.uniquePlayerKey) {
            this.onStateChange?.({
              status: "matched",
              opponentName: payload?.payload?.user || "Aspirant Rival",
            });
          }
        })
        .on("broadcast", { event: "player_ready" }, () => {
          this.onStateChange?.({ status: "ready" });
        })
        .on("broadcast", { event: "start_countdown" }, (payload: any) => {
          const data = payload?.payload || payload;
          this.onStateChange?.({
            status: "waiting_signal",
            signalTimestamp: data.signalTimestamp,
          });

          // Schedule local 'go' trigger synchronized to the signal timestamp
          const delay = Math.max(50, data.signalTimestamp - Date.now());
          setTimeout(() => {
            this.onStateChange?.({ status: "go" });
          }, delay);
        })
        .on("broadcast", { event: "round_result" }, (payload: any) => {
          const data = payload?.payload || payload;
          this.onStateChange?.({
            status: "finished",
            opponentReactionTime: data.reactionTime,
            winner: data.winner || "opponent",
          });
        })
        .subscribe(async (status: string) => {
          if (status === "SUBSCRIBED") {
            await this.channel.track({
              user: this.playerName,
              key: this.uniquePlayerKey,
              online_at: new Date().toISOString(),
            });

            // Broadcast join announcement immediately
            this.channel.send({
              type: "broadcast",
              event: "player_joined",
              payload: { user: this.playerName, senderKey: this.uniquePlayerKey },
            });
          }
        });

      return true;
    } catch (e) {
      console.warn("Supabase Realtime fallback to Simulated Cadet Opponent:", e);
      this.isSimulatedBot = true;
      this.simulateMatchmaking(isHost);
      return true;
    }
  }

  /**
   * Global Quick Matchmaker: Finds open rooms or broadcasts a host room
   */
  public async findOrHostQuickMatch(playerName: string, onRoomFound: (code: string, isHost: boolean) => void) {
    if (!isSupabaseConfigured()) {
      const code = generateRoomCode();
      onRoomFound(code, true);
      return;
    }

    try {
      const supabase = getBrowserClient();
      this.matchChannel = supabase.channel("duel_matchmaking_lobby", {
        config: { broadcast: { self: false } },
      });

      let matched = false;

      this.matchChannel
        .on("broadcast", { event: "seeking_opponent" }, (payload: any) => {
          if (matched) return;
          const hostCode = payload?.payload?.roomCode;
          if (hostCode) {
            matched = true;
            this.matchChannel.unsubscribe();
            onRoomFound(hostCode, false);
          }
        })
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            // Check for 1.5 seconds if an existing host is waiting
            setTimeout(() => {
              if (!matched) {
                // No host found, become host and broadcast room code
                const newRoomCode = generateRoomCode();
                this.matchChannel?.send({
                  type: "broadcast",
                  event: "seeking_opponent",
                  payload: { roomCode: newRoomCode, host: playerName },
                });
                onRoomFound(newRoomCode, true);
              }
            }, 1200);
          }
        });
    } catch {
      const code = generateRoomCode();
      onRoomFound(code, true);
    }
  }

  public sendReady() {
    if (this.isSimulatedBot) {
      setTimeout(() => {
        this.onStateChange?.({ status: "ready" });
        this.simulateRoundStart();
      }, 500);
      return;
    }

    this.onStateChange?.({ status: "ready" });

    this.channel?.send({
      type: "broadcast",
      event: "player_ready",
      payload: { ready: true },
    });

    // Random trigger delay between 2.2s and 4.5s
    const triggerDelay = Math.floor(2200 + Math.random() * 2300);
    const signalTimestamp = Date.now() + triggerDelay;

    this.broadcastSignal(signalTimestamp);
  }

  public broadcastSignal(signalTimestamp: number) {
    if (this.isSimulatedBot) return;

    this.channel?.send({
      type: "broadcast",
      event: "start_countdown",
      payload: { signalTimestamp },
    });

    this.onStateChange?.({
      status: "waiting_signal",
      signalTimestamp,
    });

    const delay = Math.max(50, signalTimestamp - Date.now());
    setTimeout(() => {
      this.onStateChange?.({ status: "go" });
    }, delay);
  }

  public submitClick(reactionTime: number, isTooEarly: boolean) {
    if (isTooEarly) {
      this.onStateChange?.({
        status: "too_early",
        winner: "opponent",
      });
      if (this.channel) {
        this.channel.send({
          type: "broadcast",
          event: "round_result",
          payload: { winner: "player", reactionTime: 9999 },
        });
      }
      return;
    }

    if (this.isSimulatedBot) {
      const botTime = Math.floor(210 + Math.random() * 70);
      const won = reactionTime < botTime;
      this.onStateChange?.({
        status: "finished",
        playerReactionTime: reactionTime,
        opponentReactionTime: botTime,
        winner: won ? "player" : "opponent",
      });
      return;
    }

    this.channel?.send({
      type: "broadcast",
      event: "round_result",
      payload: { reactionTime, winner: "opponent" },
    });
  }

  private simulateMatchmaking(isHost: boolean) {
    this.onStateChange?.({ status: "searching" });
    const delay = isHost ? 1000 : 700;
    const botOpponents = [
      "Neural Reflex Bot (~230ms)",
      "Prelims Reflex Cadence (~215ms)",
      "Focus Trainer AI (~250ms)",
    ];
    const opponent = botOpponents[Math.floor(Math.random() * botOpponents.length)];

    setTimeout(() => {
      this.onStateChange?.({
        status: "matched",
        opponentName: opponent,
        isHost,
      });
    }, delay);
  }

  private simulateRoundStart() {
    const randomDelay = Math.floor(2000 + Math.random() * 2200);
    this.botTimeout = setTimeout(() => {
      this.onStateChange?.({
        status: "go",
        signalTimestamp: Date.now(),
      });
    }, randomDelay);
  }

  public cleanup() {
    if (this.botTimeout) clearTimeout(this.botTimeout);
    if (this.channel) {
      try {
        const supabase = getBrowserClient();
        supabase.removeChannel(this.channel);
      } catch {}
      this.channel = null;
    }
    if (this.matchChannel) {
      try {
        const supabase = getBrowserClient();
        supabase.removeChannel(this.matchChannel);
      } catch {}
      this.matchChannel = null;
    }
  }
}
