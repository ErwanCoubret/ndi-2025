"use client";

import { useSnakeGame } from "./hooks/useSnakeGame";
import {
  GameBoard,
  GameGrid,
  Snake,
  Food,
  GameOverlay,
  ScoreBoard,
  Controls,
} from "./components";
import { Poison } from "./components/Food";

export default function SnakePage() {
  const { snake, food, poison, score, gameState, resetGame, imageIndex, gameBoardRef } = useSnakeGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="mb-4 text-xl sm:text-2xl md:text-4xl font-bold text-green-400 mt-20 md:mt-40 text-center px-2">🐍 Débarassez-vous de toutes les mauvaises pratiques !</h1>

      <ScoreBoard score={score} />

      <GameBoard ref={gameBoardRef}>
        <GameGrid />
        <Snake segments={snake} />
        <Food position={food} imgPath={`/snake/image_${imageIndex}.png`} />
        <Poison position={poison} imgPath={`/snake/poison_${imageIndex}.png`} />
        <GameOverlay
          gameState={gameState}
          score={score}
          onRestart={resetGame}
        />
      </GameBoard>

      <Controls />
    </div>
  );
}
