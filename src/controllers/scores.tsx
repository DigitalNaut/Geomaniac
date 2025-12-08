const neutralStyle = "fill-slate-800 stroke-slate-400";

const perfectScoreStyle = "fill-lime-500 stroke-lime-400/25";
const greatScoreStyle = "fill-lime-600 stroke-lime-500/25";
const goodScoreStyle = "fill-lime-700 stroke-lime-600/25";
const okScoreStyle = "fill-yellow-700 stroke-yellow-600/25";
const badScoreStyle = "fill-amber-700 stroke-amber-600/25";

const scoreStyles = [perfectScoreStyle, greatScoreStyle, goodScoreStyle, okScoreStyle, badScoreStyle] as const;

export function qualifyScore(score: number) {
  const roundedScore = Math.round(score);
  const isScoreInRange = roundedScore >= 0 && roundedScore < scoreStyles.length;

  return isScoreInRange ? Object.keys(scoreStyles)[roundedScore] : neutralStyle;
}
