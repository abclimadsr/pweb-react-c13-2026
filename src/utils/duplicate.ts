import type { Application } from "../types";

export function isDuplicate(
  apps: Application[],
  company: string,
  role: string,
): boolean {
  const c = company.trim().toLowerCase();
  const r = role.trim().toLowerCase();
  return apps.some(
    (a) =>
      a.company.trim().toLowerCase() === c &&
      a.role.trim().toLowerCase() === r,
  );
}