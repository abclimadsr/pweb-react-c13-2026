interface Props {
  score: number;
}

export default function MatchBadge({ score }: Props) {
  const level = score >= 70 ? "high" : score >= 40 ? "mid" : "low";
  return <span className={`badge badge-${level}`}>{score}% Match</span>;
}