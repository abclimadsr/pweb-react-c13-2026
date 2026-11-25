import { useCountdown } from "../hooks/useCountdown";

const INTERVIEW_QUESTIONS: string[] = [
  "Ceritakan proyek web atau aplikasi paling menantang yang pernah kamu bangun dan peran spesifikmu di dalamnya.",
  "Ceritakan bug tersulit saat mengelola state di proyek React yang pernah kamu buat, dan bagaimana kamu memperbaikinya?",
  "Bagaimana cara kerja Virtual DOM di React dan kapan kamu perlu menggunakan useMemo atau useCallback?",
  "Apa perbedaan mendasar antara REST API dan GraphQL, serta bagaimana kamu menangani error saat melakukan fetch data?",
  "Jika tenggat waktu rilis tinggal 2 hari tetapi masih ada fitur yang belum selesai, langkah apa yang kamu ambil bersama tim?",
];

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function InterviewTimer() {
  const { secondsLeft, isRunning, questionIndex, toggle, reset, next } =
    useCountdown(120, INTERVIEW_QUESTIONS.length);

  return (
    <div className="timer-box">
      <div className="row between">
        <h4 style={{ margin: 0 }}>LATIHAN INTERVIEW</h4>
        <span className="muted">
          Soal {questionIndex + 1} / {INTERVIEW_QUESTIONS.length}
        </span>
      </div>

      <p className="timer-question">"{INTERVIEW_QUESTIONS[questionIndex]}"</p>

      <div className="row between" style={{ marginBottom: 0 }}>
        <div
          className={`timer-display ${secondsLeft <= 15 ? "timer-danger" : ""}`}
        >
          {formatTime(secondsLeft)}
        </div>
        <div className="row" style={{ marginBottom: 0 }}>
          <button type="button" onClick={toggle} disabled={secondsLeft === 0}>
            {isRunning ? "Jeda" : "Mulai"}
          </button>
          <button type="button" className="btn-secondary" onClick={reset}>
            Reset
          </button>
          <button type="button" className="btn-secondary" onClick={next}>
            Soal Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}