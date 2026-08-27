"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnswerLabRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mains-writing");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#040406] text-white">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8A63A] border-t-transparent mx-auto" />
        <p className="font-mono text-xs text-white/70">Redirecting to Mains Speed Lab & QCAB Studio...</p>
      </div>
    </div>
  );
}
