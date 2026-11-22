import type { JobListing } from "../types";
import type { MatchResult } from "../utils/skillMatch";
import MatchBadge from "./MatchBadge";

interface Props {
  job: JobListing;
  match: MatchResult;
  alreadyApplied: boolean;
  onSave: (job: JobListing) => void;
}

export default function JobCard({ job, match, alreadyApplied, onSave }: Props) {
  return (
    <article className="card">
      <div className="row between">
        <div>
          <strong>{job.company_name}</strong>
          <div className="muted">{job.candidate_required_location}</div>
        </div>
        <MatchBadge score={match.score} />
      </div>
      <h4>{job.title}</h4>
      <div className="chips">
        {match.matched.map((s) => (
          <span key={`m-${s}`} className="chip chip-ok">{s}</span>
        ))}
        {match.missing.map((s) => (
          <span key={`x-${s}`} className="chip chip-missing">{s}</span>
        ))}
      </div>
      <div className="row between">
        <span className="muted">{job.salary}</span>
        <button disabled={alreadyApplied} onClick={() => onSave(job)}>
          {alreadyApplied ? "Sudah Dilamar" : "Simpan ke Wishlist"}
        </button>
      </div>
    </article>
  );
}