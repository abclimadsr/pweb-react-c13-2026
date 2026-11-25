import { useCallback, useState } from "react";
import type { Application } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useUndoDelete } from "./hooks/useUndoDelete";
import ExplorePage from "./components/ExplorePage";
import ManualForm from "./components/ManualForm";
import StatsCards from "./components/StatsCards";
import Pipeline from "./components/Pipeline";
import OfferComparator from "./components/OfferComparator";
import UndoToast from "./components/UndoToast";

type ActiveTab = "explore" | "pipeline" | "compare";

export default function App() {
  const [applications, setApplications] = useLocalStorage<Application[]>(
    "aku-mw-magang:applications",
    [],
  );
  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>(
    "aku-mw-magang:skills",
    ["React", "TypeScript", "CSS"],
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("explore");
  const [showManualForm, setShowManualForm] = useState<boolean>(false);

  const addApplication = useCallback(
    (app: Application) => {
      setApplications((prev) => [...prev, app]);
    },
    [setApplications],
  );

  const updateApplication = useCallback(
    (id: string, updater: (app: Application) => Application) => {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? updater(a) : a)),
      );
    },
    [setApplications],
  );

  const restoreApplication = useCallback(
    (app: Application) => {
      setApplications((prev) => {
        if (prev.some((item) => item.id === app.id)) return prev;
        return [app, ...prev];
      });
    },
    [setApplications],
  );

  const { deletedApp, countdown, triggerDelete, handleUndo } =
    useUndoDelete(restoreApplication);

  const deleteApplication = useCallback(
    (id: string) => {
      const target = applications.find((a) => a.id === id);
      if (!target) return;
      setApplications((prev) => prev.filter((a) => a.id !== id));
      triggerDelete(target);
    },
    [applications, setApplications, triggerDelete],
  );

  const offerCount = applications.filter((a) => a.status === "OFFER").length;

  return (
    <div>
      <header className="navbar">
        <div className="navbar-brand">
          <span className="brand-logo">AM</span>
          <strong>Aku Mw Magang</strong>
        </div>

        <nav className="nav-tabs">
          <button
            type="button"
            className={`nav-tab ${activeTab === "explore" ? "active" : ""}`}
            onClick={() => setActiveTab("explore")}
          >
            Eksplorasi Lowongan
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === "pipeline" ? "active" : ""}`}
            onClick={() => setActiveTab("pipeline")}
          >
            Pipeline Lamaran ({applications.length})
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === "compare" ? "active" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            Bandingkan Offer ({offerCount})
          </button>
        </nav>

        <button
          type="button"
          className="btn-catat"
          onClick={() => setShowManualForm((prev) => !prev)}
        >
          {showManualForm ? "Tutup Form" : "+ Catat Lamaran"}
        </button>
      </header>

      <StatsCards applications={applications} />

      {showManualForm && (
        <div style={{ paddingTop: 16 }}>
          <ManualForm
            applications={applications}
            onAdd={(app) => {
              addApplication(app);
              setShowManualForm(false);
            }}
          />
        </div>
      )}

      {activeTab === "explore" && (
        <ExplorePage
          kaptenSkills={kaptenSkills}
          setKaptenSkills={setKaptenSkills}
          applications={applications}
          addApplication={addApplication}
        />
      )}

      {activeTab === "pipeline" && (
        <Pipeline
          applications={applications}
          kaptenSkills={kaptenSkills}
          updateApplication={updateApplication}
          deleteApplication={deleteApplication}
        />
      )}

      {activeTab === "compare" && (
        <OfferComparator
          applications={applications}
          kaptenSkills={kaptenSkills}
        />
      )}

      <UndoToast
        deletedApp={deletedApp}
        countdown={countdown}
        onUndo={handleUndo}
      />
    </div>
  );
}