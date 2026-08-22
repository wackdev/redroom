import { MockTest } from "@/lib/core/types";
import { parseRawModulePayload } from "../module-engine";
import hist1and2Raw from "@/data/mock-tests/modules/history/history-modules-1-2.json";
import { HISTORY_MODULES_3_TO_8 } from "../history-modules-3-8";
import { HISTORY_MODULES_9_TO_13 } from "../history-modules-9-13";

const hist1and2: MockTest[] = parseRawModulePayload(hist1and2Raw as any);

export const HISTORY_MODULES: MockTest[] = [
  ...hist1and2,
  ...HISTORY_MODULES_3_TO_8,
  ...HISTORY_MODULES_9_TO_13,
];
