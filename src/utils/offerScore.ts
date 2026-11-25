import type { Application, WorkMode } from "../types";
import { calcMatch } from "./skillMatch";

export interface OfferScoreDetail {
  salary: number;
  maxSalary: number;
  normalizedSalary: number;
  salaryWeighted: number;
  workMode: WorkMode;
  modeRawScore: number;
  modeWeighted: number;
  matchScore: number;
  matchedCount: number;
  totalRequired: number;
  matchWeighted: number;
  totalScore: number;
}

const MODE_SCORES: Record<WorkMode, number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

function round1(num: number): number {
  return Math.round(num * 10) / 10;
}

export function calcOfferScore(
  app: Application,
  allOffers: Application[],
  kaptenSkills: string[],
): OfferScoreDetail {
  const salary = app.salaryOffer ?? 0;
  const maxSalary = allOffers.reduce(
    (max, item) => Math.max(max, item.salaryOffer ?? 0),
    0,
  );

  const normalizedSalary = maxSalary > 0 ? (salary / maxSalary) * 100 : 0;
  const modeRawScore = MODE_SCORES[app.workMode];
  const matchResult = calcMatch(kaptenSkills, app.requiredSkills);

  const salaryWeighted = round1(normalizedSalary * 0.5);
  const modeWeighted = round1(modeRawScore * 0.25);
  const matchWeighted = round1(matchResult.score * 0.25);
  const totalScore = round1(salaryWeighted + modeWeighted + matchWeighted);

  return {
    salary,
    maxSalary,
    normalizedSalary,
    salaryWeighted,
    workMode: app.workMode,
    modeRawScore,
    modeWeighted,
    matchScore: matchResult.score,
    matchedCount: matchResult.matched.length,
    totalRequired: app.requiredSkills.length,
    matchWeighted,
    totalScore,
  };
}