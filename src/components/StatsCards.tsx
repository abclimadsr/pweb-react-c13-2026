import type { Application } from "../types";
import { calcStats } from "../utils/stats";
import { useNow } from "../hooks/useNow";

interface Props {
  applications: Application[];
}

export default function StatsCards({ applications }: Props) {
  const now = useNow();
  const s = calcStats(applications, now);

  const cards = [
    { label: "Total Lamaran", value: String(s.total), hint: `${s.sent} sudah dikirim` },
    { label: "Response Rate", value: `${s.responseRate}%`, hint: `${s.responded} dari ${s.sent} diproses` },
    { label: "Interview Rate", value: `${s.interviewRate}%`, hint: `${s.interviewed} masuk wawancara` },
    { label: "Rawan Ghosting", value: String(s.ghostingCount), hint: "> 14 hari tanpa kabar" },
    { label: "Offer Diterima", value: String(s.offerCount), hint: "Siap dibandingkan" },
  ];

  return (
    <div className="stats">
      {cards.map((c) => (
        <div key={c.label} className="card">
          <div className="muted">{c.label}</div>
          <div className="stat-value">{c.value}</div>
          <div className="muted">{c.hint}</div>
        </div>
      ))}
    </div>
  );
}