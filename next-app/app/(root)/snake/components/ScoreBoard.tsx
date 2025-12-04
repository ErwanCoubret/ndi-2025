"use client";

type ScoreBoardProps = {
  score: number;
};

export function ScoreBoard({ score }: ScoreBoardProps) {
  return <div className="mb-4 text-xl text-white">Score: {score}</div>;
}
