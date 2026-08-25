"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/performance");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070707] text-white">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-400 font-mono">Redirecting to Performance & Error Intelligence Hub...</p>
      </div>
    </div>
  );
}
