import { useState } from "react";
import type { Application } from "./types";
import ExplorePage from "./components/ExplorePage";
import ManualForm from "./components/ManualForm";
import StatsCards from "./components/StatsCards";

export default function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [kaptenSkills, setKaptenSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "CSS",
  ]);

  const addApplication = (app: Application) =>
    setApplications((prev) => [...prev, app]);

  return (
    <>
      <StatsCards applications={applications} />
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