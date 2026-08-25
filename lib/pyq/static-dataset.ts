import { PYQQuestion } from "../core/types";

import polityQuestions from "../../data/pyq/polity.json";
import historyQuestions from "../../data/pyq/history.json";
import ancientHistoryQuestions from "../../data/pyq/ancient-history.json";
import economyQuestions from "../../data/pyq/economy.json";
import geographyQuestions from "../../data/pyq/geography.json";
import environmentQuestions from "../../data/pyq/environment.json";
import scienceTechQuestions from "../../data/pyq/science-tech.json";

export const STATIC_PYQ_DATASET: PYQQuestion[] = [
  ...(polityQuestions as unknown as PYQQuestion[]),
  ...(historyQuestions as unknown as PYQQuestion[]),
  ...(ancientHistoryQuestions as unknown as PYQQuestion[]),
  ...(economyQuestions as unknown as PYQQuestion[]),
  ...(geographyQuestions as unknown as PYQQuestion[]),
  ...(environmentQuestions as unknown as PYQQuestion[]),
  ...(scienceTechQuestions as unknown as PYQQuestion[]),
];

export const STATIC_PYQS = STATIC_PYQ_DATASET;

