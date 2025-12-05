"use client";

type ScoreBoardProps = {
  score: number;
};

export function ScoreBoard({ score }: ScoreBoardProps) {
  return <div className="mb-4 text-xl text-slate-500">Score: {score / 10}/6</div>;
}
