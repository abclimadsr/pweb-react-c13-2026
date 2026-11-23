import type { Application } from "../types";
import { findConflicts } from "../utils/conflict";

interface Props {
  applications: Application[];
}

export default function ConflictBanner({ applications }: Props) {
  const conflicts = findConflicts(applications);
  if (conflicts.length === 0) return null;

  return (
    <div className="banner-conflict" role="alert">
      <strong>Jadwal interview bentrok ({conflicts.length})</strong>
      <ul>
        {conflicts.map((c) => (
          <li key={`${c.a.id}-${c.b.id}`}>
            {c.a.company} ({c.a.role}) &amp; {c.b.company} ({c.b.role}), selisih{" "}
            {c.diffMinutes} menit
          </li>
        ))}
      </ul>
    </div>
  );
}