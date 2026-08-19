import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redroom | UPSC Preparation",
  description: "Plan, practise, revise, and track your UPSC preparation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
