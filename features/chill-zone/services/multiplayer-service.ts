import { getBrowserClient, isSupabaseConfigured } from "@/lib/db/supabase";
import { MultiplayerDuelState } from "../types";

export type DuelCallback = (state: Partial<MultiplayerDuelState>) => void;

/**
 * Generates an easy-to-share 6-character room code (e.g., WHY123)
 */
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "WHY";
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export class QuickDuelChannelManager {
  private channel: any = null;
  private roomCode: string = "";
  private onStateChange: DuelCallback | null = null;
  private isSimulatedBot: boolean = false;
  private botTimeout: any = null;

  constructor(roomCode: string, onStateChange: DuelCallback) {
    this.roomCode = roomCode.toUpperCase();
    this.onStateChange = onStateChange;
  }

  public async initialize(isHost: boolean, playerName: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      // Offline/Local Simulated Opponent Mode
      this.isSimulatedBot = true;
      this.simulateMatchmaking(isHost);
      return true;
    }

    try {
      const supabase = getBrowserClient();
      this.channel = supabase.channel(`duel_room_${this.roomCode}`, {
        config: {
          presence: { key: playerName },
        },
      });

      this.channel
        .on("presence", { event: "sync" }, () => {
          const presenceState = this.channel.presenceState();
          const players = Object.keys(presenceState);
          if (players.length >= 2) {
            const opponent = players.find((p) => p !== playerName) || "Aspirant Rival";
            this.onStateChange?.({
              status: "matched",
              opponentName: opponent,
            });
          }
        })
        .on("broadcast", { event: "player_ready" }, (payload: any) => {
          this.onStateChange?.({ status: "ready" });
        })
        .on("broadcast", { event: "start_countdown" }, (payload: any) => {
          this.onStateChange?.({
            status: "waiting_signal",
            signalTimestamp: payload.signalTimestamp,
          });
        })
        .on("broadcast", { event: "round_result" }, (payload: any) => {
          this.onStateChange?.({
            status: "finished",
            opponentReactionTime: payload.reactionTime,
            winner: payload.winner,
          });
        })
        .subscribe(async (status: string) => {
          if (status === "SUBSCRIBED") {
            await this.channel.track({
              user: playerName,
              online_at: new Date().toISOString(),
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

  public sendReady() {
    if (this.isSimulatedBot) {
      setTimeout(() => {
        this.onStateChange?.({ status: "ready" });
        this.simulateRoundStart();
      }, 600);
      return;
    }

    this.channel?.send({
      type: "broadcast",
      event: "player_ready",
      payload: { ready: true },
    });
  }

  public broadcastSignal(signalTimestamp: number) {
    if (this.isSimulatedBot) {
      return;
    }
    this.channel?.send({
      type: "broadcast",
      event: "start_countdown",
      payload: { signalTimestamp },
    });
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
      // Bot reaction between 200ms - 290ms
      const botTime = Math.floor(210 + Math.random() * 80);
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
      payload: { reactionTime },
    });
  }

  private simulateMatchmaking(isHost: boolean) {
    this.onStateChange?.({ status: "searching" });
    const delay = isHost ? 2200 : 1500;
    const peerNames = [
      "IAS Aspirant (AIR 14)",
      "Cadet Vikram (LBSNAA Bound)",
      "Ananya (Polity Ace)",
      "Kavya (GS Master)",
    ];
    const opponent = peerNames[Math.floor(Math.random() * peerNames.length)];

    setTimeout(() => {
      this.onStateChange?.({
        status: "matched",
        opponentName: opponent,
        isHost,
      });
    }, delay);
  }

  private simulateRoundStart() {
    const randomDelay = Math.floor(2000 + Math.random() * 2500);
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
    }
  }
}
