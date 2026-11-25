import type { Application } from "../types";

interface Props {
  deletedApp: Application | null;
  countdown: number;
  onUndo: () => void;
}

export default function UndoToast({ deletedApp, countdown, onUndo }: Props) {
  if (!deletedApp) return null;

  return (
    <div className="toast-undo" role="status" aria-live="polite">
      <span>
        Lamaran <strong>{deletedApp.company}</strong> ({deletedApp.role}) telah
        dihapus.
      </span>
      <button type="button" className="toast-btn" onClick={onUndo}>
        Undo ({countdown}d)
      </button>
    </div>
  );
}