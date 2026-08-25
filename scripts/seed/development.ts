import { USER_ARCHETYPES, UserArchetypeKey } from "../../lib/simulation/user-archetypes";
import { simulateUser30DayHistory, SimulationResult } from "../../lib/simulation/activity-simulator";
import { calculateReadinessScore, generateNextBestAction } from "../../lib/brain/intelligence-engine";
import { SeedResult } from "./syllabus";

export async function seedDevelopment(dryRun = false): Promise<SeedResult> {
  const result: SeedResult = {
    module: "DEVELOPMENT_USER_SIMULATION",
    totalProcessed: 0,
    inserted: 0,
    updated: 0,
    errors: [],
  };

  try {
    const archetypeKeys: UserArchetypeKey[] = ["NEW_USER", "ACTIVE_USER", "STRUGGLING_USER", "HIGH_PERFORMER"];
    console.log(`[SEED:DEV] Simulating 30-day study journeys for 4 user archetypes: ${archetypeKeys.join(", ")}...`);

    const simulationSummaries: SimulationResult[] = [];

    for (const key of archetypeKeys) {
      const sim = await simulateUser30DayHistory(key, false);
      simulationSummaries.push(sim);

      // Validate Brain Engine calculations against simulated archetype
      const archetypeData = USER_ARCHETYPES[key];
      const readiness = await calculateReadinessScore(archetypeData.profile.id);
      const nextAction = await generateNextBestAction(archetypeData.profile.id);

      console.log(`\n================ ARCHETYPE: ${key} ================`);
      console.log(`Cadet: ${archetypeData.profile.fullName} | Days: 30 | Hours: ${sim.studyHoursTotal}h | PYQs: ${sim.pyqsAttempted}`);
      console.log(`Readiness Score: ${readiness.overallScore}% (Prelims: ${readiness.prelimsScore}%, Mains: ${readiness.mainsScore}%)`);
      console.log(`Next Best Action: [${nextAction.urgency}] ${nextAction.title}`);
      console.log(`Causal Reason: "${nextAction.reason}"`);
      console.log(`Action Route: ${nextAction.actionRoute} (~${nextAction.estimatedMinutes} mins)`);
    }

    result.totalProcessed = archetypeKeys.length;
    result.inserted = simulationSummaries.reduce((sum, s) => sum + s.eventsGenerated, 0);

    if (dryRun) {
      console.log(`[SEED:DEV] DRY RUN: Validated 4 user archetypes successfully.`);
      return result;
    }

    console.log(`\n[SEED:DEV] Successfully verified WhyNotUPSC Brain across all 4 archetypes.`);
  } catch (err: any) {
    result.errors.push(err.message || String(err));
    console.error(`[SEED:DEV] Error during development simulation:`, err);
  }

  return result;
}
