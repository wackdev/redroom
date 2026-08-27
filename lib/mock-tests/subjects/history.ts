import { MockTest } from "@/lib/core/types";
import { HISTORY_MODULES_3_TO_8 } from "./history-modules-3-8";
import { HISTORY_MODULES_9_TO_13 } from "./history-modules-9-13";

export const HISTORY_MODULES: MockTest[] = [
  ...HISTORY_MODULES_3_TO_8,
  ...HISTORY_MODULES_9_TO_13,
];
