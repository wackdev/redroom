"use client";

import { useMemo, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface DayActivity {
  date: string;
  hours: number;
  tasksCount: number;
  hasTest: boolean;
  level: 0 | 1 | 2 | 3 | 4;
}

interface Props {
  plans?: Record<string, any>;
  testResults?: any[];
}

export default function RevisionHeatmap({ plans = {}, testResults = [] }: Props) {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  // Generate grid for past 16 weeks (112 days)
  const { weeks, stats } = useMemo(() => {
    const today = new Date();
    const days: DayActivity[] = [];
    const totalDays = 112; // 16 weeks * 7 days

    let totalHours = 0;
    let activeDaysCount = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate dates backwards
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const plan = plans[dateStr];
      let dayHours = 0;
      let tasksCount = 0;

      if (plan && Array.isArray(plan.tasks)) {
        tasksCount = plan.tasks.length;
        dayHours = plan.tasks.reduce(
          (sum: number, t: any) => (t.completed ? sum + (Number(t.hours) || 0) : sum),
          0
        );
      }

      // Check if test was taken on this day
      const hasTest = testResults.some((t) => t.date && t.date.startsWith(dateStr));
      if (hasTest) dayHours += 1.5;

      totalHours += dayHours;

      // Activity intensity level
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (dayHours >= 6) level = 4;
      else if (dayHours >= 4) level = 3;
      else if (dayHours >= 2) level = 2;
      else if (dayHours > 0) level = 1;

      if (dayHours > 0) {
        activeDaysCount++;
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }

      days.push({
        date: dateStr,
        hours: Math.round(dayHours * 10) / 10,
        tasksCount,
        hasTest,
        level,
      });
    }

    currentStreak = tempStreak;

    // Chunk into 16 weeks of 7 days each
    const weekChunks: DayActivity[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weekChunks.push(days.slice(i, i + 7));
    }

    return {
      weeks: weekChunks,
      stats: {
        totalHours: Math.round(totalHours * 10) / 10,
        activeDaysCount,
        currentStreak,
        longestStreak,
      },
    };
  }, [plans, testResults]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-[#D8A63A] shadow-[0_0_8px_rgba(216,166,58,0.6)]";
      case 3:
        return "bg-[#D8A63A]/80";
      case 2:
        return "bg-[#D8A63A]/45";
      case 1:
        return "bg-[#D8A63A]/20 border border-[#D8A63A]/30";
      default:
        return "bg-white/5 border border-white/5";
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      {/* Header with KPI Metrics */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#D8A63A] animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
              TELEMETRY RADAR // CONSISTENCY ENGINE
            </span>
          </div>
          <h3 className="mt-1 font-mono text-lg font-bold text-white">
            Daily Study & Retention Heatmap
          </h3>
          <p className="text-xs text-[#8C8C8C]">
            Tracking daily focus hours, mock tests attempted, and active retention streaks over the last 16 weeks.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-center">
            <span className="block text-[10px] text-[#8C8C8C]">CURRENT STREAK</span>
            <strong className="text-[#F4C95D] text-sm">🔥 {stats.currentStreak} Days</strong>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-center">
            <span className="block text-[10px] text-[#8C8C8C]">RECORD STREAK</span>
            <strong className="text-white text-sm">⚡ {stats.longestStreak} Days</strong>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-center">
            <span className="block text-[10px] text-[#8C8C8C]">TOTAL HOURS</span>
            <strong className="text-[#D8A63A] text-sm">⏱️ {stats.totalHours}h</strong>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex min-w-[580px] gap-1.5">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => {
                    setHoveredDay(day);
                    sound.playHover();
                  }}
                  className={`h-4 w-4 rounded-md transition-transform hover:scale-125 hover:z-20 cursor-pointer ${getLevelColor(
                    day.level
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Legend & Hover Details */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-3 font-mono text-[11px] text-[#8C8C8C]">
        <div className="min-h-[20px]">
          {hoveredDay ? (
            <span className="text-white">
              📅 <strong className="text-[#F4C95D]">{hoveredDay.date}</strong>:{" "}
              {hoveredDay.hours > 0 ? (
                <>
                  <span className="text-emerald-400">{hoveredDay.hours} hours logged</span>{" "}
                  ({hoveredDay.tasksCount} tasks completed
                  {hoveredDay.hasTest ? " + 1 Mock Exam" : ""})
                </>
              ) : (
                <span className="text-[#8C8C8C]">No focus sessions logged</span>
              )}
            </span>
          ) : (
            <span>Hover over any day node to view focus telemetry</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-white/5" />
          <div className="h-3 w-3 rounded-sm bg-[#D8A63A]/20" />
          <div className="h-3 w-3 rounded-sm bg-[#D8A63A]/45" />
          <div className="h-3 w-3 rounded-sm bg-[#D8A63A]/80" />
          <div className="h-3 w-3 rounded-sm bg-[#D8A63A]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
