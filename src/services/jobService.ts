import type { JobListing, JobSource } from "../types";

const REMOTIVE_URL =
  "https://remotive.com/api/remote-jobs?category=software-dev&limit=30";
const LOCAL_URL = "/magang-fallback.json";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseJobs(data: unknown): JobListing[] {
  let list: unknown[] = [];
  if (Array.isArray(data)) list = data;
  else if (isRecord(data) && Array.isArray(data.jobs)) list = data.jobs;

  return list.filter(isRecord).map((item) => ({
    id: Number(item.id),
    title: String(item.title ?? ""),
    company_name: String(item.company_name ?? ""),
    category: String(item.category ?? "Lainnya"),
    candidate_required_location: String(item.candidate_required_location ?? ""),
    salary: String(item.salary ?? ""),
    tags: Array.isArray(item.tags) ? item.tags.map((t) => String(t)) : [],
  }));
}

export async function fetchJobs(
  source: JobSource,
  signal: AbortSignal,
): Promise<JobListing[]> {
  const url = source === "remotive" ? REMOTIVE_URL : LOCAL_URL;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Gagal mengambil data (HTTP ${res.status})`);
  const data: unknown = await res.json();
  return parseJobs(data);
}