import { MockTest } from "@/lib/core/types";
import { parseRawModulePayload } from "../module-engine";
import economyRawData from "@/data/mock-tests/modules/economy/economy-modules.json";

export const ECONOMY_MODULES: MockTest[] = parseRawModulePayload(economyRawData as any);
