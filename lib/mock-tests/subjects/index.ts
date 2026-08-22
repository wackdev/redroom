import { POLITY_MODULES } from "./polity";
import { HISTORY_MODULES } from "./history";
import { ECONOMY_MODULES } from "./economy";
import { GEOGRAPHY_MODULES } from "./geography";
import { MockTest } from "@/lib/core/types";

export { POLITY_MODULES, HISTORY_MODULES, ECONOMY_MODULES, GEOGRAPHY_MODULES };

export const ALL_MOCK_MODULES: MockTest[] = [
  ...POLITY_MODULES,
  ...HISTORY_MODULES,
  ...ECONOMY_MODULES,
  ...GEOGRAPHY_MODULES,
];
