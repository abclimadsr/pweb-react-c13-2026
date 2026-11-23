import { useState } from "react";
import type { Application, ApplicationStatus, WorkMode } from "../types";
import { getNextStatuses, type TransitionPayload } from "../utils/stateMachine";

interface Props {
  app: Application;
  onChange: (target: ApplicationStatus, payload: TransitionPayload) => string[];
}

export default function StatusTransition({ app, onChange }: Props) {
  const options = getNextStatuses(app.status);
  const [target, setTarget] = useState<ApplicationStatus | "">("");
  const [cvVersion, setCvVersion] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [interview, setInterview] = useState("");
  const [salary, setSalary] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>(app.workMode);
  const [errors, setErrors] = useState<string[]>([]);

  if (options.length === 0)
    return <p className="muted">Status {app.status} bersifat final.</p>;

  const submit = () => {
    if (!target) return setErrors(["Pilih status tujuan"]);
    const errs = onChange(target, {
      cvVersion,
      appliedDate,
      interviewDateTime: interview || undefined,
      salaryOffer: salary === "" ? undefined : Number(salary),
      workMode,
    });
    setErrors(errs);
    if (errs.length === 0) {
      setTarget("");
      setCvVersion("");
      setAppliedDate("");
      setInterview("");
      setSalary("");
    }
  };

  return (
    <section>
      <h4>Pindah Status</h4>
      <div className="form-inline">
        <select value={target} onChange={(e) => setTarget(e.target.value as ApplicationStatus | "")}>
          <option value="">Pilih tujuan</option>
          {options.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {target === "APPLIED" && (
          <>
            <input placeholder="Versi CV" value={cvVersion} onChange={(e) => setCvVersion(e.target.value)} />
            <input type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
          </>
        )}
        {target === "INTERVIEW" && (
          <input type="datetime-local" value={interview} onChange={(e) => setInterview(e.target.value)} />
        )}
        {target === "OFFER" && (
          <>
            <input
              type="number"
              min={1}
              placeholder="Gaji (Rp)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <select value={workMode} onChange={(e) => setWorkMode(e.target.value as WorkMode)}>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
          </>
        )}
        <button onClick={submit}>Pindahkan</button>
      </div>
      {errors.map((e) => (
        <p key={e} className="error">{e}</p>
      ))}
    </section>
  );
}