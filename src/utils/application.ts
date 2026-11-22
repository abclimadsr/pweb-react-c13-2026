import type { Application, JobListing, WorkMode } from "../types";

interface NewApplicationInput {
  company: string;
  role: string;
  workMode: WorkMode;
  status: "WISHLIST" | "APPLIED";
  requiredSkills: string[];
  cvVersion?: string;
  appliedDate?: string;
}

export function createApplication(input: NewApplicationInput): Application {
  const now = new Date().toISOString();
  const message =
    input.status === "APPLIED"
      ? `Lamaran dibuat dan dikirim (CV: ${input.cvVersion ?? "-"})`
      : "Lamaran dibuat (Wishlist)";

  return {
    id: crypto.randomUUID(),
    company: input.company.trim(),
    role: input.role.trim(),
    workMode: input.workMode,
    status: input.status,
    requiredSkills: input.requiredSkills,
    cvVersion: input.cvVersion,
    appliedDate: input.appliedDate,
    lastUpdatedAt: now,
    checklist: [],
    activityLogs: [{ id: crypto.randomUUID(), timestamp: now, message }],
  };
}

function guessWorkMode(location: string): WorkMode {
  const loc = location.toLowerCase();
  if (loc.includes("hybrid")) return "Hybrid";
  if (loc.includes("onsite") || loc.includes("on-site")) return "Onsite";
  return "Remote";
}

export function jobToApplication(job: JobListing): Application {
  return createApplication({
    company: job.company_name,
    role: job.title,
    workMode: guessWorkMode(job.candidate_required_location),
    status: "WISHLIST",
    requiredSkills: job.tags,
  });
}