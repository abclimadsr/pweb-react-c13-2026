import type { Application } from "../types";

export interface Conflict {
  a: Application;
  b: Application;
  diffMinutes: number;
}

const LIMIT_MINUTES = 60;

export function findConflicts(allApps: Application[]): Conflict[] {
  const scheduled = allApps
    .filter((a) => a.status === "INTERVIEW" && a.interviewDateTime)
    .map((app) => ({ app, time: new Date(app.interviewDateTime as string).getTime() }))
    .filter((x) => !Number.isNaN(x.time));

  const result: Conflict[] = [];
  for (let i = 0; i < scheduled.length; i++) {
    for (let j = i + 1; j < scheduled.length; j++) {
      const diff = Math.abs(scheduled[i].time - scheduled[j].time) / 60_000;
      if (diff < LIMIT_MINUTES)
        result.push({ a: scheduled[i].app, b: scheduled[j].app, diffMinutes: Math.round(diff) });
    }
  }
  return result;
}