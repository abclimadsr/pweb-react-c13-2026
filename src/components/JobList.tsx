import type { Application, JobListing } from "../types";
import type { MatchResult } from "../utils/skillMatch";
import { isDuplicate } from "../utils/duplicate";
import JobCard from "./JobCard";

interface Row {
  job: JobListing;
  match: MatchResult;
}

interface Props {
  rows: Row[];
  loading: boolean;
  error: string | null;
  applications: Application[];
  onSave: (job: JobListing) => void;
  onRetry: () => void;
  onUseFallback: () => void;
}

export default function JobList(p: Props) {
  if (p.loading) return <p className="state">Memuat lowongan...</p>;

  if (p.error)
    return (
      <div className="state">
        <p className="error">{p.error}</p>
        <div className="row">
          <button onClick={p.onRetry}>Coba Lagi</button>
          <button onClick={p.onUseFallback}>Pakai Dataset Lokal</button>
        </div>
      </div>
    );

  if (p.rows.length === 0)
    return <p className="state">Tidak ada lowongan yang cocok.</p>;

  return (
    <div className="grid">
      {p.rows.map(({ job, match }) => (
        <JobCard
          key={job.id}
          job={job}
          match={match}
          alreadyApplied={isDuplicate(p.applications, job.company_name, job.title)}
          onSave={p.onSave}
        />
      ))}
    </div>
  );
}