import { useState } from "react";
import type { ChecklistItem } from "../types";

interface Props {
  items: ChecklistItem[];
  onToggle: (itemId: string) => void;
  onAdd: (text: string) => void;
  onRemove: (itemId: string) => void;
}

export default function Checklist({ items, onToggle, onAdd, onRemove }: Props) {
  const [text, setText] = useState("");
  const done = items.filter((i) => i.done).length;
  const pct = items.length === 0 ? 0 : Math.round((done / items.length) * 100);

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <section>
      <h4>Checklist Persiapan ({done}/{items.length})</h4>
      <div className="progress" aria-label={`Progress ${done} dari ${items.length}`}>
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <ul className="plain">
        {items.map((i) => (
          <li key={i.id} className="row between">
            <label className="row">
              <input type="checkbox" checked={i.done} onChange={() => onToggle(i.id)} />
              <span className={i.done ? "done" : ""}>{i.text}</span>
            </label>
            <button aria-label={`Hapus ${i.text}`} onClick={() => onRemove(i.id)}>×</button>
          </li>
        ))}
      </ul>
      <div className="row">
        <input
          className="grow"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Tambah item checklist..."
        />
        <button onClick={submit}>Tambah</button>
      </div>
    </section>
  );
}