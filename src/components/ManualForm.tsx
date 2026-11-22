import { useRef, useState } from "react";
import type { Application, WorkMode } from "../types";
import { isDuplicate } from "../utils/duplicate";
import { createApplication } from "../utils/application";

interface Props {
  applications: Application[];
  onAdd: (app: Application) => void;
}

interface FormState {
  company: string;
  role: string;
  workMode: WorkMode;
  status: "WISHLIST" | "APPLIED";
  skills: string;
  cvVersion: string;
  appliedDate: string;
}

type FieldKey = "company" | "role" | "cvVersion" | "appliedDate";
type Errors = Partial<Record<FieldKey, string>>;

const INITIAL: FormState = {
  company: "",
  role: "",
  workMode: "Remote",
  status: "WISHLIST",
  skills: "",
  cvVersion: "",
  appliedDate: "",
};

const FIELD_ORDER: FieldKey[] = ["company", "role", "cvVersion", "appliedDate"];

export default function ManualForm({ applications, onAdd }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const refs = useRef<Record<FieldKey, HTMLInputElement | null>>({
    company: null,
    role: null,
    cvVersion: null,
    appliedDate: null,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.company.trim()) e.company = "Perusahaan wajib diisi";
    if (!form.role.trim()) e.role = "Posisi wajib diisi";
    if (!e.company && !e.role && isDuplicate(applications, form.company, form.role))
      e.role = "Lamaran company + role ini sudah ada";
    if (form.status === "APPLIED") {
      if (!form.cvVersion.trim()) e.cvVersion = "Versi CV wajib diisi";
      if (!form.appliedDate) e.appliedDate = "Tanggal melamar wajib diisi";
    }
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);

    const firstError = FIELD_ORDER.find((key) => e[key]);
    if (firstError) {
      refs.current[firstError]?.focus();
      return;
    }

    const skills: string[] = [];
    for (const raw of form.skills.split(",")) {
      const s = raw.trim();
      if (s && !skills.some((x) => x.toLowerCase() === s.toLowerCase())) skills.push(s);
    }

    onAdd(
      createApplication({
        company: form.company,
        role: form.role,
        workMode: form.workMode,
        status: form.status,
        requiredSkills: skills,
        cvVersion: form.status === "APPLIED" ? form.cvVersion.trim() : undefined,
        appliedDate: form.status === "APPLIED" ? form.appliedDate : undefined,
      }),
    );
    setForm(INITIAL);
    setErrors({});
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h3>Catat Lamaran Manual</h3>

      <label>
        Perusahaan
        <input
          ref={(el) => { refs.current.company = el; }}
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
        {errors.company && <span className="error">{errors.company}</span>}
      </label>

      <label>
        Posisi / Role
        <input
          ref={(el) => { refs.current.role = el; }}
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        />
        {errors.role && <span className="error">{errors.role}</span>}
      </label>

      <label>
        Mode Kerja
        <select
          value={form.workMode}
          onChange={(e) => update("workMode", e.target.value as WorkMode)}
        >
          <option>Remote</option>
          <option>Hybrid</option>
          <option>Onsite</option>
        </select>
      </label>

      <label>
        Status Awal
        <select
          value={form.status}
          onChange={(e) => update("status", e.target.value as FormState["status"])}
        >
          <option value="WISHLIST">WISHLIST</option>
          <option value="APPLIED">APPLIED</option>
        </select>
      </label>

      {form.status === "APPLIED" && (
        <>
          <label>
            Versi CV
            <input
              ref={(el) => { refs.current.cvVersion = el; }}
              value={form.cvVersion}
              onChange={(e) => update("cvVersion", e.target.value)}
              placeholder="Kapten-CV-v2.pdf"
            />
            {errors.cvVersion && <span className="error">{errors.cvVersion}</span>}
          </label>
          <label>
            Tanggal Melamar
            <input
              type="date"
              ref={(el) => { refs.current.appliedDate = el; }}
              value={form.appliedDate}
              onChange={(e) => update("appliedDate", e.target.value)}
            />
            {errors.appliedDate && <span className="error">{errors.appliedDate}</span>}
          </label>
        </>
      )}

      <label>
        Required Skills (pisahkan dengan koma)
        <input
          value={form.skills}
          onChange={(e) => update("skills", e.target.value)}
          placeholder="React, TypeScript, Docker"
        />
      </label>

      <button type="submit">Simpan Lamaran</button>
    </form>
  );
}