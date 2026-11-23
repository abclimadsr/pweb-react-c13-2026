import { useState } from "react";
import type { ActivityLog as Log } from "../types";

interface Props {
  logs: Log[];
  onAddNote: (text: string) => void;
}

export default function ActivityLog({ logs, onAddNote }: Props) {
  const [note, setNote] = useState("");

  const submit = () => {
    if (!note.trim()) return;
    onAddNote(note);
    setNote("");
  };

  return (
    <section>
      <h4>Activity Log</h4>
      <div className="row">
        <input
          className="grow"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Tambah catatan manual..."
        />
        <button onClick={submit}>Simpan</button>
      </div>
      <ul className="plain">
        {[...logs].reverse().map((l) => (
          <li key={l.id}>
            <span className="muted">{new Date(l.timestamp).toLocaleString("id-ID")}</span>
            <br />
            {l.message}
          </li>
        ))}
      </ul>
    </section>
  );
}