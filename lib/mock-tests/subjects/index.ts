import { POLITY_MODULES } from "./polity";
import { HISTORY_MODULES } from "./history";
import { ECONOMY_MODULES } from "./economy";
import { GEOGRAPHY_MODULES } from "./geography";
import { ENVIRONMENT_MODULES } from "./environment";
import { SCIENCE_TECH_MODULES } from "./science-tech";
import { CSAT_MOCK_MODULES } from "./csat";
import { PRELIMS_YEARLY_MOCK_TESTS } from "./prelims-yearly";
import { UPSC_SUBJECT_TAXONOMY, normalizeSubjectKey } from "../taxonomy";
import { MockTest } from "@/lib/core/types";

export {
  POLITY_MODULES,
  HISTORY_MODULES,
  ECONOMY_MODULES,
  GEOGRAPHY_MODULES,
  ENVIRONMENT_MODULES,
  SCIENCE_TECH_MODULES,
  CSAT_MOCK_MODULES,
  PRELIMS_YEARLY_MOCK_TESTS,
  UPSC_SUBJECT_TAXONOMY,
  normalizeSubjectKey,
};

export const ALL_MOCK_MODULES: MockTest[] = [
  ...PRELIMS_YEARLY_MOCK_TESTS,
  ...POLITY_MODULES,
  ...HISTORY_MODULES,
  ...ECONOMY_MODULES,
  ...GEOGRAPHY_MODULES,
  ...ENVIRONMENT_MODULES,
  ...SCIENCE_TECH_MODULES,
  ...CSAT_MOCK_MODULES,
];
