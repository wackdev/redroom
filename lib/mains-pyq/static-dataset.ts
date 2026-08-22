import { MainsPYQQuestion } from "../core/types";

import gs1Questions from "../../data/mains-pyq/gs1.json";
import gs2Questions from "../../data/mains-pyq/gs2.json";
import gs3Questions from "../../data/mains-pyq/gs3.json";
import gs4Questions from "../../data/mains-pyq/gs4.json";
import essayQuestions from "../../data/mains-pyq/essay.json";

export const STATIC_MAINS_PYQ_DATASET: MainsPYQQuestion[] = [
  ...(gs1Questions as unknown as MainsPYQQuestion[]),
  ...(gs2Questions as unknown as MainsPYQQuestion[]),
  ...(gs3Questions as unknown as MainsPYQQuestion[]),
  ...(gs4Questions as unknown as MainsPYQQuestion[]),
  ...(essayQuestions as unknown as MainsPYQQuestion[]),
];
