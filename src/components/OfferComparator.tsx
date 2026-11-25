import { useMemo, useState } from "react";
import type { Application } from "../types";
import { calcOfferScore } from "../utils/offerScore";

interface Props {
  applications: Application[];
  kaptenSkills: string[];
}

export default function OfferComparator({ applications, kaptenSkills }: Props) {
  const offers = useMemo(
    () => applications.filter((app) => app.status === "OFFER"),
    [applications],
  );

  const [selectedA, setSelectedA] = useState<string>("");
  const [selectedB, setSelectedB] = useState<string>("");

  if (offers.length < 2) {
    return (
      <section className="pipeline">
        <h2>Bandingkan Offer Magang</h2>
        <div className="card state">
          <p style={{ margin: 0 }}>
            Minimal dibutuhkan <strong>2 lamaran berstatus OFFER</strong> untuk
            membandingkan tawaran secara objektif (saat ini baru ada{" "}
            {offers.length} offer).
          </p>
        </div>
      </section>
    );
  }

  const offerA =
    offers.find((o) => o.id === selectedA) ?? offers[0];
  const offerB =
    offers.find((o) => o.id === selectedB && o.id !== offerA.id) ??
    offers.find((o) => o.id !== offerA.id) ??
    offers[1];

  const scoreA = calcOfferScore(offerA, offers, kaptenSkills);
  const scoreB = calcOfferScore(offerB, offers, kaptenSkills);

  const isABest = scoreA.totalScore >= scoreB.totalScore;
  const isBBest = scoreB.totalScore > scoreA.totalScore;

  return (
    <section className="pipeline">
      <div className="row between" style={{ flexWrap: "wrap" }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Bandingkan Offer Magang</h2>
          <div className="muted">
            Bobot penilaian: Uang Saku 50% • Mode Kerja 25% • Kecocokan Skill 25%
          </div>
        </div>

        <div className="row">
          <label className="row" style={{ marginBottom: 0 }}>
            <span className="muted">Offer A:</span>
            <select
              value={offerA.id}
              onChange={(e) => setSelectedA(e.target.value)}
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.company} — {o.role}
                </option>
              ))}
            </select>
          </label>
          <span className="muted">vs</span>
          <label className="row" style={{ marginBottom: 0 }}>
            <span className="muted">Offer B:</span>
            <select
              value={offerB.id}
              onChange={(e) => setSelectedB(e.target.value)}
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.company} — {o.role}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="offer-grid">
        {[
          { app: offerA, detail: scoreA, best: isABest },
          { app: offerB, detail: scoreB, best: isBBest },
        ].map(({ app, detail, best }) => (
          <div
            key={app.id}
            className={`card ${best ? "offer-card-best" : ""}`}
          >
            <div className="row between">
              <div>
                <h3 style={{ margin: 0 }}>{app.company}</h3>
                <div className="muted">{app.role}</div>
              </div>
              {best && (
                <span className="badge badge-high">Rekomendasi Terbaik</span>
              )}
            </div>

            <div className="offer-rows">
              <div className="row between offer-item">
                <span className="muted">Uang Saku / Bulan</span>
                <strong>Rp {detail.salary.toLocaleString("id-ID")}</strong>
                <span>{detail.salaryWeighted.toFixed(1)} / 50</span>
              </div>

              <div className="row between offer-item">
                <span className="muted">Mode Kerja</span>
                <strong>
                  {detail.workMode} ({detail.modeRawScore})
                </strong>
                <span>{detail.modeWeighted.toFixed(1)} / 25</span>
              </div>

              <div className="row between offer-item">
                <span className="muted">Kecocokan Skill</span>
                <strong>
                  {detail.matchScore}% ({detail.matchedCount} dari{" "}
                  {detail.totalRequired} skill)
                </strong>
                <span>{detail.matchWeighted.toFixed(1)} / 25</span>
              </div>
            </div>

            <div className="offer-total row between">
              <span className="muted" style={{ fontWeight: 700 }}>
                TOTAL SKOR BERBOBOT
              </span>
              <span className="stat-value">{detail.totalScore.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}