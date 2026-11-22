import { useMemo, useState } from "react";
import type { Application, JobListing } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { useFetchJobs } from "../hooks/useFetchJobs";
import { calcMatch } from "../utils/skillMatch";
import { jobToApplication } from "../utils/application";
import SkillProfile from "./SkillProfile";
import SearchFilterBar, { type SortMode } from "./SearchFilterBar";
import JobList from "./JobList";

interface Props {
  kaptenSkills: string[];
  setKaptenSkills: (next: string[]) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
}

export default function ExplorePage({
  kaptenSkills,
  setKaptenSkills,
  applications,
  addApplication,
}: Props) {
  const { jobs, loading, error, source, setSource, retry } = useFetchJobs();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortMode>("match");
  const debouncedKeyword = useDebounce(keyword, 400);

  const categories = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.category))),
    [jobs],
  );

  const rows = useMemo(() => {
    const q = debouncedKeyword.trim().toLowerCase();
    const result = jobs
      .filter(
        (j) =>
          (category === "all" || j.category === category) &&
          (q === "" ||
            j.title.toLowerCase().includes(q) ||
            j.company_name.toLowerCase().includes(q)),
      )
      .map((job) => ({ job, match: calcMatch(kaptenSkills, job.tags) }));
    if (sort === "match") result.sort((a, b) => b.match.score - a.match.score);
    return result;
  }, [jobs, debouncedKeyword, category, sort, kaptenSkills]);

  const handleSave = (job: JobListing) => addApplication(jobToApplication(job));

  return (
    <div className="layout">
      <aside>
        <SkillProfile skills={kaptenSkills} onChange={setKaptenSkills} />
        <section className="card">
          <h3>Sumber Data Lowongan</h3>
          <label>
            <input
              type="radio"
              checked={source === "remotive"}
              onChange={() => setSource("remotive")}
            />{" "}
            Remotive API (Live)
          </label>
          <label>
            <input
              type="radio"
              checked={source === "local"}
              onChange={() => setSource("local")}
            />{" "}
            Dataset Magang ID (Lokal)
          </label>
        </section>
      </aside>

      <main>
        <SearchFilterBar
          keyword={keyword}
          onKeywordChange={setKeyword}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          sort={sort}
          onSortChange={setSort}
        />
        <JobList
          rows={rows}
          loading={loading}
          error={error}
          applications={applications}
          onSave={handleSave}
          onRetry={retry}
          onUseFallback={() => setSource("local")}
        />
      </main>
    </div>
  );
}