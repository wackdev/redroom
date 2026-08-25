import { UserArchetypeKey, USER_ARCHETYPES, SimulatedUserState } from "./user-archetypes";
import { dexieDb } from "@/lib/db/dexie";
import { ActivityEvent } from "@/lib/brain/activity-events";

export interface SimulationResult {
  archetype: UserArchetypeKey;
  daysSimulated: number;
  eventsGenerated: number;
  studyHoursTotal: number;
  pyqsAttempted: number;
  mockTestsCompleted: number;
  revisionCardsProcessed: number;
}

/**
 * Generate 30 days of study history and activity events for a given archetype
 */
export async function simulateUser30DayHistory(
  archetypeKey: UserArchetypeKey,
  persistToDexie = false
): Promise<SimulationResult> {
  const archetype: SimulatedUserState = USER_ARCHETYPES[archetypeKey];
  const now = Date.now();
  const dayMs = 86400000;

  const generatedEvents: ActivityEvent[] = [];
  let totalMinutes = 0;
  let pyqCount = 0;
  let testCount = 0;
  let revisionCount = 0;

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const dayTimestamp = new Date(now - dayOffset * dayMs).toISOString();

    // Determine day activity probability based on archetype
    let isStudyDay = false;
    let dailyTargetMinutes = 0;

    switch (archetypeKey) {
      case "HIGH_PERFORMER":
        isStudyDay = dayOffset % 10 !== 0; // 90% attendance
        dailyTargetMinutes = 330 + (dayOffset % 5) * 20; // 5.5h - 6.5h
        break;
      case "ACTIVE_USER":
        isStudyDay = dayOffset % 7 !== 6; // 85% attendance
        dailyTargetMinutes = 240 + (dayOffset % 4) * 15; // 4.0h - 5.0h
        break;
      case "STRUGGLING_USER":
        isStudyDay = dayOffset % 3 === 0; // 33% attendance
        dailyTargetMinutes = 90 + (dayOffset % 3) * 30; // 1.5h - 2.5h
        break;
      case "NEW_USER":
        isStudyDay = dayOffset === 0; // Only joined today
        dailyTargetMinutes = 60;
        break;
    }

    if (!isStudyDay) continue;

    totalMinutes += dailyTargetMinutes;

    // 1. Study session event
    generatedEvents.push({
      userId: archetype.profile.id,
      eventType: "STUDY_SESSION_COMPLETED",
      payload: {
        durationMinutes: dailyTargetMinutes,
        subject: dayOffset % 2 === 0 ? "Polity" : "Economy",
        topic: "Core Concept Consolidation",
      },
      createdAt: dayTimestamp,
    });

    // 2. PYQ Attempts
    const dailyPyqs = archetypeKey === "HIGH_PERFORMER" ? 15 : archetypeKey === "ACTIVE_USER" ? 8 : 4;
    for (let i = 0; i < dailyPyqs; i++) {
      pyqCount++;
      const isCorrect = archetypeKey === "HIGH_PERFORMER" ? Math.random() > 0.12 : archetypeKey === "ACTIVE_USER" ? Math.random() > 0.32 : Math.random() > 0.58;

      generatedEvents.push({
        userId: archetype.profile.id,
        eventType: isCorrect ? "PYQ_CORRECT" : "PYQ_INCORRECT",
        payload: {
          subject: i % 2 === 0 ? "Polity" : "Economy",
          topic: "Fundamental Rights",
          isCorrect,
          year: 2020 + (i % 4),
        },
        createdAt: dayTimestamp,
      });

      if (!isCorrect) {
        generatedEvents.push({
          userId: archetype.profile.id,
          eventType: "MISTAKE_LOGGED",
          payload: {
            subject: "Polity",
            topic: "Fundamental Rights",
            trapType: "extreme_word_trap",
          },
          createdAt: dayTimestamp,
        });
      }
    }

    // 3. Spaced Revision Completed
    if (archetypeKey !== "NEW_USER" && dayOffset % 3 === 0) {
      revisionCount += 3;
      generatedEvents.push({
        userId: archetype.profile.id,
        eventType: "REVISION_COMPLETED",
        payload: {
          topicId: "polity-4",
          subject: "Polity",
          repetitionCount: 2,
        },
        createdAt: dayTimestamp,
      });
    }

    // 4. Weekly Mock Test
    if (dayOffset % 7 === 0 && archetypeKey !== "NEW_USER") {
      testCount++;
      generatedEvents.push({
        userId: archetype.profile.id,
        eventType: "TEST_COMPLETED",
        payload: {
          title: `Simulation Mock Test (Week ${Math.floor((30 - dayOffset) / 7) + 1})`,
          score: archetypeKey === "HIGH_PERFORMER" ? 86 : archetypeKey === "ACTIVE_USER" ? 68 : 44,
          total: 100,
        },
        createdAt: dayTimestamp,
      });
    }
  }

  if (persistToDexie && typeof window !== "undefined" && dexieDb) {
    try {
      if ((dexieDb as any).activity_events) {
        await (dexieDb as any).activity_events.bulkPut(generatedEvents as any);
      }
    } catch {}
  }

  return {
    archetype: archetypeKey,
    daysSimulated: 30,
    eventsGenerated: generatedEvents.length,
    studyHoursTotal: Math.round((totalMinutes / 60) * 10) / 10,
    pyqsAttempted: pyqCount,
    mockTestsCompleted: testCount,
    revisionCardsProcessed: revisionCount,
  };
}
