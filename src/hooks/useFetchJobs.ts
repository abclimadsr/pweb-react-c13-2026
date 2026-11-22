import { useCallback, useEffect, useState } from "react";
import type { JobListing, JobSource } from "../types";
import { fetchJobs } from "../services/jobService";

export function useFetchJobs() {
  const [source, setSource] = useState<JobSource>("remotive");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchJobs(source, controller.signal)
      .then((data) => setJobs(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setJobs([]);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [source, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { jobs, loading, error, source, setSource, retry };
}