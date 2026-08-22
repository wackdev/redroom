import { MockTest } from "@/lib/core/types";
import { parseRawModulePayload } from "../module-engine";
import polityRawData from "@/data/mock-tests/modules/polity/polity-modules.json";

export const POLITY_MODULES: MockTest[] = parseRawModulePayload(polityRawData as any);
