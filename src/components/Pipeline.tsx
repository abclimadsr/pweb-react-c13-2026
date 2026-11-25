import { useState } from "react";
import type { Application, ApplicationStatus } from "../types";
import { useNow } from "../hooks/useNow";
import { usePipelineFilter, type PipelineSort } from "../hooks/usePipelineFilter";
import { useApplicationActions, type UpdateApplication } from "../hooks/useApplicationActions";
import ConflictBanner from "./ConflictBanner";
import ApplicationCard from "./ApplicationCard";
import ApplicationDetail from "./ApplicationDetail";

interface Props {
  applications: Application[];
  kaptenSkills: string[];
  updateApplication: UpdateApplication;
  deleteApplication: (id: string) => void;
}

const STATUSES: ApplicationStatus[] = [
  "WISHLIST", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "GHOSTED",
];

export default function Pipeline({
  applications,
  kaptenSkills,
  updateApplication,
  deleteApplication,
}: Props) {
  const now = useNow();
  const { filtered, filters, setFilters } = usePipelineFilter(applications, now);
  const actions = useApplicationActions(updateApplication);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = applications.find((a) => a.id === selectedId);

  const handleDelete = (id: string) => {
    deleteApplication(id);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <section className="pipeline">
      <h2>War Room: Pipeline Lamaran</h2>
      <ConflictBanner applications={applications} />

      <div className="row">
        <input
          className="grow"
          placeholder="Cari perusahaan atau posisi..."
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
        />
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value as ApplicationStatus | "ALL" }))
          }
        >
          <option value="ALL">Semua Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as PipelineSort }))}
        >
          <option value="newest">Terbaru</option>
          <option value="interview">Jadwal Interview Terdekat</option>
          <option value="offer">Offer Tertinggi</option>
        </select>
        <label className="row">
          <input
            type="checkbox"
            checked={filters.ghostingOnly}
            onChange={(e) => setFilters((f) => ({ ...f, ghostingOnly: e.target.checked }))}
          />
          Hanya Rawan Ghosting
        </label>
      </div>

      {applications.length === 0 ? (
        <p className="state">Belum ada lamaran. Simpan dari lowongan atau catat manual.</p>
      ) : filtered.length === 0 ? (
        <p className="state">Tidak ada lamaran yang cocok dengan filter.</p>
      ) : (
        <div className="grid">
          {filtered.map((a) => (
            <ApplicationCard
              key={a.id}
              app={a}
              kaptenSkills={kaptenSkills}
              now={now}
              selected={a.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      )}

      {selected && (
        <ApplicationDetail
          key={selected.id}
          app={selected}
          actions={actions}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}