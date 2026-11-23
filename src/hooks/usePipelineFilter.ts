import { useMemo, useState } from "react";
import type { Application, ApplicationStatus } from "../types";
import { useDebounce } from "./useDebounce";
import { isGhostingRisk } from "../utils/ghosting";

export type PipelineSort = "newest" | "interview" | "offer";

export interface PipelineFilters {
  query: string;
  status: ApplicationStatus | "ALL";
  ghostingOnly: boolean;
  sort: PipelineSort;
}

const INITIAL: PipelineFilters = {
  query: "",
  status: "ALL",
  ghostingOnly: false,
  sort: "newest",
};

const time = (iso?: string) => (iso ? new Date(iso).getTime() : NaN);

export function usePipelineFilter(applications: Application[], now: number) {
  const [filters, setFilters] = useState<PipelineFilters>(INITIAL);
  const debouncedQuery = useDebounce(filters.query, 400);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    const result = applications.filter(
      (a) =>
        (q === "" ||
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q)) &&
        (filters.status === "ALL" || a.status === filters.status) &&
        (!filters.ghostingOnly || isGhostingRisk(a, now)),
    );

    return result.sort((a, b) => {
      if (filters.sort === "newest")
        return time(b.lastUpdatedAt) - time(a.lastUpdatedAt);

      if (filters.sort === "offer")
        return (b.salaryOffer ?? -1) - (a.salaryOffer ?? -1);

      const rank = (x: Application) => {
        const t = time(x.interviewDateTime);
        if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
        return t >= now ? t - now : Number.MAX_SAFE_INTEGER / 2 + (now - t);
      };
      return rank(a) - rank(b);
    });
  }, [applications, debouncedQuery, filters.status, filters.ghostingOnly, filters.sort, now]);

  return { filtered, filters, setFilters };
}