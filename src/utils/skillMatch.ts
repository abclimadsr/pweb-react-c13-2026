export interface MatchResult {
  score: number;
  matched: string[];
  missing: string[];
}

export function calcMatch(
  kaptenSkills: string[],
  requiredSkills: string[],
): MatchResult {
  const owned = new Set(kaptenSkills.map((s) => s.trim().toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    if (owned.has(skill.trim().toLowerCase())) matched.push(skill);
    else missing.push(skill);
  }

  const total = requiredSkills.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);
  return { score, matched, missing };
}