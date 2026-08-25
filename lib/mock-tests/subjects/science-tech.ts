import { MockTest } from "@/lib/core/types";
import { parseRawModulePayload } from "../module-engine";
import sciRawData from "@/data/mock-tests/modules/science-tech/science-tech-modules.json";

export const SCIENCE_TECH_MODULES: MockTest[] = parseRawModulePayload(sciRawData as any);
