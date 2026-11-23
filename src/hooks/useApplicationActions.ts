import { useCallback } from "react";
import type { Application, ApplicationStatus } from "../types";
import { validateTransition, type TransitionPayload } from "../utils/stateMachine";

export type UpdateApplication = (
  id: string,
  updater: (app: Application) => Application,
) => void;

const DAY_MS = 24 * 60 * 60 * 1000;

const log = (message: string) => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  message,
});

export function useApplicationActions(updateApplication: UpdateApplication) {
  const changeStatus = useCallback(
    (app: Application, target: ApplicationStatus, payload: TransitionPayload): string[] => {
      const errors = validateTransition(app, target, payload);
      if (errors.length > 0) return errors;

      updateApplication(app.id, (cur) => ({
        ...cur,
        status: target,
        cvVersion: target === "APPLIED" ? payload.cvVersion?.trim() : cur.cvVersion,
        appliedDate: target === "APPLIED" ? payload.appliedDate : cur.appliedDate,
        interviewDateTime:
          target === "INTERVIEW" ? payload.interviewDateTime : cur.interviewDateTime,
        salaryOffer: target === "OFFER" ? payload.salaryOffer : cur.salaryOffer,
        workMode: target === "OFFER" && payload.workMode ? payload.workMode : cur.workMode,
        lastUpdatedAt: new Date().toISOString(),
        activityLogs: [
          ...cur.activityLogs,
          log(`Status diubah dari ${cur.status} ke ${target}`),
        ],
      }));
      return [];
    },
    [updateApplication],
  );

  const toggleChecklist = useCallback(
    (id: string, itemId: string) =>
      updateApplication(id, (cur) => {
        const item = cur.checklist.find((c) => c.id === itemId);
        if (!item) return cur;
        return {
          ...cur,
          checklist: cur.checklist.map((c) =>
            c.id === itemId ? { ...c, done: !c.done } : c,
          ),
          activityLogs: [
            ...cur.activityLogs,
            log(`Checklist "${item.text}" ${item.done ? "dibatalkan" : "selesai"}`),
          ],
        };
      }),
    [updateApplication],
  );

  const addChecklist = useCallback(
    (id: string, text: string) => {
      const t = text.trim();
      if (!t) return;
      updateApplication(id, (cur) => ({
        ...cur,
        checklist: [...cur.checklist, { id: crypto.randomUUID(), text: t, done: false }],
        activityLogs: [...cur.activityLogs, log(`Checklist ditambahkan: "${t}"`)],
      }));
    },
    [updateApplication],
  );

  const removeChecklist = useCallback(
    (id: string, itemId: string) =>
      updateApplication(id, (cur) => {
        const item = cur.checklist.find((c) => c.id === itemId);
        if (!item) return cur;
        return {
          ...cur,
          checklist: cur.checklist.filter((c) => c.id !== itemId),
          activityLogs: [...cur.activityLogs, log(`Checklist dihapus: "${item.text}"`)],
        };
      }),
    [updateApplication],
  );

  const addNote = useCallback(
    (id: string, text: string) => {
      const t = text.trim();
      if (!t) return;
      updateApplication(id, (cur) => ({
        ...cur,
        activityLogs: [...cur.activityLogs, log(`Catatan: ${t}`)],
      }));
    },
    [updateApplication],
  );

  const simulate15Days = useCallback(
    (id: string) =>
      updateApplication(id, (cur) => ({
        ...cur,
        lastUpdatedAt: new Date(new Date(cur.lastUpdatedAt).getTime() - 15 * DAY_MS).toISOString(),
        activityLogs: [...cur.activityLogs, log("Simulasi +15 hari (lastUpdatedAt dimundurkan)")],
      })),
    [updateApplication],
  );

  return { changeStatus, toggleChecklist, addChecklist, removeChecklist, addNote, simulate15Days };
}

export type ApplicationActions = ReturnType<typeof useApplicationActions>;