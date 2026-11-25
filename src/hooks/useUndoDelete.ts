import { useCallback, useEffect, useRef, useState } from "react";
import type { Application } from "../types";

export function useUndoDelete(
  onRestore: (app: Application) => void,
  durationSeconds = 5,
) {
  const [deletedApp, setDeletedApp] = useState<Application | null>(null);
  const [countdown, setCountdown] = useState<number>(durationSeconds);

  const deletedAppRef = useRef<Application | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const triggerDelete = useCallback(
    (app: Application) => {
      clearTimers();

      deletedAppRef.current = app;
      setDeletedApp(app);
      setCountdown(durationSeconds);

      intervalRef.current = window.setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      timeoutRef.current = window.setTimeout(() => {
        clearTimers();
        deletedAppRef.current = null;
        setDeletedApp(null);
      }, durationSeconds * 1000);
    },
    [clearTimers, durationSeconds],
  );

  const handleUndo = useCallback(() => {
    if (!deletedAppRef.current) return;
    const appToRestore = deletedAppRef.current;

    clearTimers();
    deletedAppRef.current = null;
    setDeletedApp(null);

    onRestore(appToRestore);
  }, [clearTimers, onRestore]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return {
    deletedApp,
    countdown,
    triggerDelete,
    handleUndo,
  };
}