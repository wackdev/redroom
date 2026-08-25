import { MockTest } from "@/lib/core/types";
import { parseRawModulePayload } from "../module-engine";
import envRawData from "@/data/mock-tests/modules/environment/environment-modules.json";

export const ENVIRONMENT_MODULES: MockTest[] = parseRawModulePayload(envRawData as any);
