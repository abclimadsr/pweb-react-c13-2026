// utils/stats.ts
import type { Application, ApplicationStatus } from "../types";
import { isGhostingRisk } from "./ghosting";

export interface Stats {
  total: number;
  responseRate: number;
  interviewRate: number;
  ghostingCount: number;
  offerCount: number;
  responded: number;
  interviewed: number;
  sent: number;
}

const RESPONDED: ApplicationStatus[] = [
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export function calcStats(applications: Application[], now: number): Stats {
  const sentApps = applications.filter((a) => a.status !== "WISHLIST");
  const sent = sentApps.length;
  const responded = sentApps.filter((a) => RESPONDED.includes(a.status)).length;
  const interviewed = sentApps.filter(
    (a) =>
      a.status === "INTERVIEW" ||
      a.status === "OFFER" ||
      a.interviewDateTime !== undefined,
  ).length;

  const pct = (n: number) => (sent === 0 ? 0 : Math.round((n / sent) * 100));

  return {
    total: applications.length,
    responseRate: pct(responded),
    interviewRate: pct(interviewed),
    ghostingCount: applications.filter((a) => isGhostingRisk(a, now)).length,
    offerCount: applications.filter((a) => a.status === "OFFER").length,
    responded,
    interviewed,
    sent,
  };
}