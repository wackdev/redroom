import type { Metadata } from "next";
import "./globals.css";
import GlobalBroadcastBanner from "@/components/GlobalBroadcastBanner";
import CommandPalette from "@/components/CommandPalette";
import FocusSanctuaryModal from "@/components/FocusSanctuaryModal";
import RedroomCursor from "@/components/RedroomCursor";
import PWAClientInitializer from "@/components/PWAClientInitializer";

export const metadata: Metadata = {
  title: "WHYNOTUPSC | Why Not You?",
  description:
    "Every aspirant can dream of UPSC. The real question is — WHY NOT YOU? The digital operating system for UPSC Civil Services preparation.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        <PWAClientInitializer />
        <RedroomCursor />
        <GlobalBroadcastBanner />
        <CommandPalette />
        <FocusSanctuaryModal />
        {children}
      </body>
    </html>
  );
}
