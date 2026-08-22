import { MockTest } from "@/lib/core/types";
import { parseRawModulePayload } from "../module-engine";
import geoRawData from "@/data/mock-tests/modules/geography/geography-modules.json";

export const GEOGRAPHY_MODULES: MockTest[] = parseRawModulePayload(geoRawData as any);
