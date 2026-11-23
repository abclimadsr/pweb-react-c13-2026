import { useCallback, useState } from "react";
import type { Application } from "./types";
import ExplorePage from "./components/ExplorePage";
import ManualForm from "./components/ManualForm";
import StatsCards from "./components/StatsCards";
import Pipeline from "./components/Pipeline";

export default function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [kaptenSkills, setKaptenSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "CSS",
  ]);

  const addApplication = (app: Application) =>
    setApplications((prev) => [...prev, app]);

  const updateApplication = useCallback(
    (id: string, updater: (app: Application) => Application) =>
      setApplications((prev) => prev.map((a) => (a.id === id ? updater(a) : a))),
    [],
  );

  return (
    <>
      <StatsCards applications={applications} />
      <Pipeline
        applications={applications}
        kaptenSkills={kaptenSkills}
        updateApplication={updateApplication}
      />
      <ExplorePage
        kaptenSkills={kaptenSkills}
        setKaptenSkills={setKaptenSkills}
        applications={applications}
        addApplication={addApplication}
      />
      <ManualForm applications={applications} onAdd={addApplication} />
    </>
  );
}