import type { Application } from "../types";
import type { ApplicationActions } from "../hooks/useApplicationActions";
import StatusTransition from "./StatusTransition";
import Checklist from "./Checklist";
import ActivityLog from "./ActivityLog";

interface Props {
  app: Application;
  actions: ApplicationActions;
}

export default function ApplicationDetail({ app, actions }: Props) {
  const canSimulate = app.status === "APPLIED" || app.status === "SCREENING";

  return (
    <section className="card">
      <div className="row between">
        <div>
          <h3 style={{ margin: 0 }}>{app.company} - {app.role}</h3>
          <div className="muted">
            {app.workMode} | {app.status}
            {app.interviewDateTime && ` | Interview ${new Date(app.interviewDateTime).toLocaleString("id-ID")}`}
            {app.salaryOffer !== undefined && ` | Offer Rp ${app.salaryOffer.toLocaleString("id-ID")}`}
          </div>
        </div>
        {canSimulate && (
          <button onClick={() => actions.simulate15Days(app.id)}>Simulasi +15 Hari</button>
        )}
      </div>

      <StatusTransition
        key={`${app.id}-${app.status}`}
        app={app}
        onChange={(target, payload) => actions.changeStatus(app, target, payload)}
      />
      <Checklist
        items={app.checklist}
        onToggle={(itemId) => actions.toggleChecklist(app.id, itemId)}
        onAdd={(text) => actions.addChecklist(app.id, text)}
        onRemove={(itemId) => actions.removeChecklist(app.id, itemId)}
      />
      <ActivityLog logs={app.activityLogs} onAddNote={(text) => actions.addNote(app.id, text)} />
    </section>
  );
}