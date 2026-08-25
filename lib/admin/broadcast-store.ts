export interface AdminBroadcastMessage {
  id: string;
  title: string;
  message: string;
  type: "directive" | "announcement" | "alert" | "system";
  priority: "Urgent" | "High" | "Normal";
  actionLink?: string;
  actionLabel?: string;
  createdAt: string;
  author: string;
  isActive: boolean;
}

// In-memory persistent fallback store
export let globalBroadcastStore: AdminBroadcastMessage[] = [
  {
    id: "broadcast-seed-1",
    title: "⚡ Prelims 2026 High-Yield Mission Active",
    message:
      "234+ Authentic UPSC CSE Prelims PYQs (2018-2026) are now fully indexed with live Indian Express & PIB daily news feeds. Keep your study streak active!",
    type: "directive",
    priority: "High",
    actionLink: "/pyqs",
    actionLabel: "Practice PYQs →",
    createdAt: new Date().toISOString(),
    author: "Chief Mentor",
    isActive: true,
  },
];

export function addBroadcastToStore(item: AdminBroadcastMessage) {
  globalBroadcastStore = [item, ...globalBroadcastStore.filter((b) => b.id !== item.id)];
}

export function removeBroadcastFromStore(id: string) {
  globalBroadcastStore = globalBroadcastStore.filter((b) => b.id !== id);
}
