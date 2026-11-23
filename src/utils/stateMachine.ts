import type { Application, ApplicationStatus, WorkMode } from "../types";

export const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: ["APPLIED"],
  APPLIED: ["SCREENING", "REJECTED", "GHOSTED"],
  SCREENING: ["INTERVIEW", "REJECTED", "GHOSTED"],
  INTERVIEW: ["OFFER", "REJECTED", "GHOSTED"],
  OFFER: [],
  REJECTED: [],
  GHOSTED: ["SCREENING"],
};

export interface TransitionPayload {
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string;
  salaryOffer?: number;
  workMode?: WorkMode;
}

export function getNextStatuses(status: ApplicationStatus): ApplicationStatus[] {
  return TRANSITIONS[status];
}

export function validateTransition(
  app: Application,
  target: ApplicationStatus,
  payload: TransitionPayload,
): string[] {
  if (!TRANSITIONS[app.status].includes(target)) {
    return [`Transisi dari ${app.status} ke ${target} tidak diizinkan`];
  }

  const errors: string[] = [];

  if (target === "APPLIED") {
    if (!payload.cvVersion?.trim()) errors.push("Versi CV wajib diisi");
    if (!payload.appliedDate) errors.push("Tanggal melamar wajib diisi");
  }

  if (target === "INTERVIEW") {
    const t = payload.interviewDateTime
      ? new Date(payload.interviewDateTime).getTime()
      : NaN;
    if (Number.isNaN(t)) errors.push("Jadwal interview wajib diisi");
  }

  if (target === "OFFER") {
    if (payload.salaryOffer === undefined || !(payload.salaryOffer > 0))
      errors.push("Nominal gaji harus lebih dari 0");
    if (!payload.workMode) errors.push("Mode kerja wajib dipilih");
  }

  return errors;
}