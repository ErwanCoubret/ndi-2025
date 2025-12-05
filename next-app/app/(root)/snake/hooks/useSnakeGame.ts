"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Position, Direction, GameState } from "../types";
import {
  GRID_SIZE,
  INITIAL_SPEED,
  SCORE_INCREMENT,
  INITIAL_SNAKE_POSITION,
  INITIAL_DIRECTION,
} from "../constants";

const TOTAL_IMAGES = 6;

export function useSnakeGame() {
  const [snake, setSnake] = useState<Position[]>([INITIAL_SNAKE_POSITION]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [poison, setPoison] = useState<Position>({ x: 5, y: 5 });
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [imageIndex, setImageIndex] = useState(1);

  // Utiliser des refs pour éviter les re-renders et le double comptage
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const lastDirectionRef = useRef<Direction>(INITIAL_DIRECTION);
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const poisonRef = useRef<Position>({ x: 5, y: 5 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  // Génère une nouvelle position pour la nourriture
  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeBody.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  const generatePoison = useCallback((snakeBody: Position[], foodPosition: Position): Position => {
    let newPoison: Position;
    do {
      newPoison = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snakeBody.some(
        (segment) => segment.x === newPoison.x && segment.y === newPoison.y
      ) || (newPoison.x === foodPosition.x && newPoison.y === foodPosition.y)
    );
    return newPoison;
  }, []);

  const gameOver = useCallback(() => {
    setGameState("gameOver");
    setImageIndex(1);
  }, []);

  // Réinitialise le jeu
  const resetGame = useCallback(() => {
    const initialSnake = [INITIAL_SNAKE_POSITION];
    const newFood = generateFood(initialSnake);
    const newPoison = generatePoison(initialSnake, newFood);
    
    setSnake(initialSnake);
    setFood(newFood);
    setPoison(newPoison);
    
    foodRef.current = newFood;
    poisonRef.current = newPoison;
    directionRef.current = INITIAL_DIRECTION;
    lastDirectionRef.current = INITIAL_DIRECTION;
    
    setGameState("playing");
    setScore(0);
    setImageIndex(1);
  }, [generateFood, generatePoison]);

  // Gestion des touches du clavier
  useEffect(() => {
    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent default scrolling for game controls
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState === "idle" && e.key === " ") {
        resetGame();
        return;
      }

      if (gameState === "gameOver" && e.key === " ") {
        resetGame();
        return;
      }

      if (gameState === "gameWon" && e.key === " ") {
        resetGame();
        return;
      }

      if (gameState !== "playing") return;

      let newDirection: Direction | null = null;

      switch (e.key) {
        case "ArrowUp":
          newDirection = "UP";
          break;
        case "ArrowDown":
          newDirection = "DOWN";
          break;
        case "ArrowLeft":
          newDirection = "LEFT";
          break;
        case "ArrowRight":
          newDirection = "RIGHT";
          break;
      }

      // Change direction seulement si ce n'est pas la direction opposée
      if (newDirection && opposites[newDirection] !== lastDirectionRef.current) {
        directionRef.current = newDirection;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, resetGame]);

  // Gestion des gestes tactiles (swipe) - seulement sur le game board
  useEffect(() => {
    const gameBoard = gameBoardRef.current;
    if (!gameBoard) return;

    const opposites: Record<Direction, Direction> = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Empêche le scroll de la page quand on swipe sur le jeu
      if (touchStartRef.current) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipeDistance = 30;

      // Start game on tap if idle or game over
      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        if (gameState === "idle" || gameState === "gameOver" || gameState === "gameWon") {
          resetGame();
        }
        touchStartRef.current = null;
        return;
      }

      if (gameState !== "playing") {
        touchStartRef.current = null;
        return;
      }

      let newDirection: Direction | null = null;

      // Determine swipe direction based on the larger delta
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        newDirection = deltaX > 0 ? "RIGHT" : "LEFT";
      } else {
        // Vertical swipe
        newDirection = deltaY > 0 ? "DOWN" : "UP";
      }

      // Change direction only if it's not the opposite direction
      if (newDirection && opposites[newDirection] !== lastDirectionRef.current) {
        directionRef.current = newDirection;
      }

      touchStartRef.current = null;
    };

    gameBoard.addEventListener("touchstart", handleTouchStart, { passive: true });
    gameBoard.addEventListener("touchmove", handleTouchMove, { passive: false });
    gameBoard.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      gameBoard.removeEventListener("touchstart", handleTouchStart);
      gameBoard.removeEventListener("touchmove", handleTouchMove);
      gameBoard.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState, resetGame]);

  // Boucle de jeu principale
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveSnake = () => {
      const direction = directionRef.current;
      lastDirectionRef.current = direction;

      const prevSnake = snake;
      const head = { ...prevSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Vérifie les collisions avec les murs
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        gameOver();
        return;
      }

      // Vérifie les collisions avec le corps
      if (
        prevSnake.some(
          (segment) => segment.x === head.x && segment.y === head.y
        )
      ) {
        gameOver();
        return;
      }

      // Vérifie si le serpent mange le poison
      const currentPoison = poisonRef.current;
      if (head.x === currentPoison.x && head.y === currentPoison.y) {
        gameOver();
        return;
      }

      const newSnake = [head, ...prevSnake];

      // Vérifie si le serpent mange la nourriture
      const currentFood = foodRef.current;
      if (head.x === currentFood.x && head.y === currentFood.y) {
        const newFood = generateFood(newSnake);
        const newPoison = generatePoison(newSnake, newFood);
        foodRef.current = newFood;
        poisonRef.current = newPoison;
        setFood(newFood);
        setPoison(newPoison);
        setScore((prev) => {
          const newScore = prev + SCORE_INCREMENT;
          if (newScore >= 60) {
            setGameState("gameWon");
          }
          return newScore;
        });
        setImageIndex((prev) => (prev % TOTAL_IMAGES) + 1);
        setSnake(newSnake); // Le serpent grandit (pas de pop)
      } else {
        newSnake.pop();
        setSnake(newSnake);
      }
    };

    const gameInterval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameInterval);
  }, [snake, gameState, generateFood, generatePoison, gameOver]);

  return {
    snake,
    food,
    poison,
    score,
    gameState,
    resetGame,
    imageIndex,
    gameBoardRef,
  };
}
