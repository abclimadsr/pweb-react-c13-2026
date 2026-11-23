import type { Application } from "../types";
import { calcMatch } from "../utils/skillMatch";
import { isGhostingRisk } from "../utils/ghosting";
import MatchBadge from "./MatchBadge";

interface Props {
  app: Application;
  kaptenSkills: string[];
  now: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function ApplicationCard({ app, kaptenSkills, now, selected, onSelect }: Props) {
  const match = calcMatch(kaptenSkills, app.requiredSkills);
  const done = app.checklist.filter((c) => c.done).length;
  const ghosting = isGhostingRisk(app, now);

  return (
    <article
      className={`card clickable${selected ? " selected" : ""}`}
      onClick={() => onSelect(app.id)}
    >
      <div className="row between">
        <strong>{app.company}</strong>
        <span className={`status status-${app.status.toLowerCase()}`}>{app.status}</span>
      </div>
      <div>{app.role}</div>
      <div className="muted">
        CV: {app.cvVersion ?? "-"} | Checklist {done}/{app.checklist.length}
      </div>
      <div className="row between">
        <MatchBadge score={match.score} />
        {ghosting && <span className="badge badge-low">Rawan Ghosting</span>}
      </div>
    </article>
  );
}