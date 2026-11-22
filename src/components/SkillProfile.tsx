import { useState } from "react";

interface Props {
  skills: string[];
  onChange: (next: string[]) => void;
}

export default function SkillProfile({ skills, onChange }: Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const add = () => {
    const value = input.trim();
    if (!value) return setError("Skill tidak boleh kosong");
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase()))
      return setError("Skill sudah ada");
    onChange([...skills, value]);
    setInput("");
    setError("");
  };

  const remove = (skill: string) => onChange(skills.filter((s) => s !== skill));

  return (
    <section className="card">
      <h3>Profil Skill Kapten</h3>
      <div className="row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Tambah skill..."
        />
        <button onClick={add}>Tambah</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="chips">
        {skills.map((s) => (
          <span key={s} className="chip">
            {s}
            <button aria-label={`Hapus ${s}`} onClick={() => remove(s)}>
              ×
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}