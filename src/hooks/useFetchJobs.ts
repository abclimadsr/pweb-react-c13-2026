import { useCallback, useEffect, useState } from "react";
import type { JobListing, JobSource } from "../types";
import { fetchJobs } from "../services/jobService";

export function useFetchJobs() {
  const [source, setSourceState] = useState<JobSource>("remotive");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchJobs(source, controller.signal)
      .then((data) => setJobs(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setJobs([]);
        if (err instanceof TypeError) {
          setError("Tidak dapat terhubung ke server. Periksa koneksi internet kamu.");
        } else {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [source, reloadKey]);

  const setSource = useCallback(
    (next: JobSource) => {
      if (next === source) return;
      setLoading(true);
      setError(null);
      setSourceState(next);
    },
    [source],
  );

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  return { jobs, loading, error, source, setSource, retry };
}