"use client";

import { useState, useEffect } from "react";
import {
  generateGrid,
  initialGrid,
  initializeGridReveal,
  revealAllBombs,
  revealAdjacentCells,
  countAdjacentFlags,
} from "./gridUtils";

import Modal from "../utils/modal";
import { RiInformation2Line } from "react-icons/ri";
import {
  FaClock,
  FaFlag,
  FaPlay,
  FaRecycle,
  FaSkull,
  FaTrophy,
} from "react-icons/fa";
import Link from "next/link";

const DEM_CASE = "/demineur/DemCase.png";
const DEM_FLAG = "/demineur/DemFlag.png";
const DEM_BOMB = "/demineur/DemBomb.png";
const DEM_NUMBERS = [
  "/demineur/Dem0.png",
  "/demineur/Dem1.png",
  "/demineur/Dem2.png",
  "/demineur/Dem3.png",
  "/demineur/Dem4.png",
  "/demineur/Dem5.png",
  "/demineur/Dem6.png",
  "/demineur/Dem7.png",
  "/demineur/Dem8.png",
];

export default function MineSwipperSection() {
  const rows = 5;
  const cols = 5;
  const bombs = 4;
  const [cellSize, setCellSize] = useState((16 / rows) * 50);

  const [cellImages, setCellImages] = useState(
    initialGrid(rows, cols, DEM_CASE)
  );
  const [gridReveal, setGridReveal] = useState(
    initialGrid(rows, cols, DEM_NUMBERS[0])
  );
  const [gameOver, setGameOver] = useState(false);
  const [gamewin, setGamewin] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [load, setLoad] = useState(true);
  const [rule, setRule] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timerActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!timerActive && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerActive, time]);

  const handleReset = () => {
    setCellImages(initialGrid(rows, cols, DEM_CASE));
    setGridReveal(initialGrid(rows, cols, DEM_NUMBERS[0]));
    setGameOver(false);
    setFlagCount(0);
    setFirstClick(false);
    setTime(0);
    setTimerActive(false);
    setLoad(true);
  };

  const handleFirstClick = (row: number, col: number) => {
    const newGridReveal = initializeGridReveal(
      rows,
      cols,
      bombs,
      row,
      col,
      DEM_NUMBERS,
      DEM_BOMB
    );
    setGridReveal(newGridReveal);
    setFirstClick(true);
    setTimerActive(true); // Start the timer
    revealCellsOnFirstClick(row, col, newGridReveal);
  };

  const revealCellsOnFirstClick = (
    row: number,
    col: number,
    newGridReveal: string[][]
  ) => {
    const newImages = cellImages.map((r, rowIndex) =>
      r.map((img, colIndex) =>
        rowIndex === row && colIndex === col ? newGridReveal[row][col] : img
      )
    );

    if (newGridReveal[row][col] === DEM_NUMBERS[0]) {
      revealAdjacentCells(row, col, newImages, newGridReveal);
    }

    setCellImages(newImages);
  };

  const handleLeftClick = (row: number, col: number) => {
    if (!firstClick) {
      handleFirstClick(row, col);
      return;
    }

    const newImages = cellImages.map((r, rowIndex) =>
      r.map((img, colIndex) =>
        rowIndex === row && colIndex === col ? gridReveal[row][col] : img
      )
    );

    if (cellImages[row][col] === DEM_CASE) {
      if (gridReveal[row][col] === DEM_BOMB) {
        revealAllBombs(newImages, gridReveal, DEM_BOMB);
        setGameOver(true);
      } else if (gridReveal[row][col] === DEM_NUMBERS[0]) {
        revealAdjacentCells(row, col, newImages, gridReveal);
      }
      setCellImages(newImages);
    } else if (
      gridReveal[row][col].includes("Dem") &&
      !gridReveal[row][col].includes("Bomb") &&
      !gridReveal[row][col].includes("0")
    ) {
      const bombCount = parseInt(
        gridReveal[row][col].replace("/demineur/Dem", "").replace(".png", "")
      );
      const nb_adjacentflags = countAdjacentFlags(
        row,
        col,
        cellImages,
        DEM_FLAG,
        gridReveal,
        DEM_BOMB
      );
      if (nb_adjacentflags === bombCount) {
        revealAdjacentCells(row, col, newImages, gridReveal);
      } else if (nb_adjacentflags === bombCount + 10) {
        revealAllBombs(newImages, gridReveal, DEM_BOMB);
        setGameOver(true);
        setTimerActive(false); // Stop the timer
      }
      setCellImages(newImages);
    }

    const allBombsFlagged = gridReveal.every((r, rowIndex) =>
      r.every(
        (cell, colIndex) =>
          (cell !== DEM_BOMB && newImages[rowIndex][colIndex] !== DEM_CASE) ||
          (cell === DEM_BOMB && newImages[rowIndex][colIndex] === DEM_FLAG)
      )
    );

    if (allBombsFlagged) {
      setGamewin(true); // Fin de partie lorsque toutes les bombes sont bien signalées
      setTimerActive(false); // Stop the timer
    }
  };

  const handleRightClick = (row: number, col: number) => {
    if (event) {
      event.preventDefault(); // Empêche le menu contextuel par défaut
    }

    if (
      cellImages[row][col] !== DEM_CASE &&
      cellImages[row][col] !== DEM_FLAG
    ) {
      return;
    }

    const newImages = cellImages.map((r, rowIndex) =>
      r.map((img, colIndex) =>
        rowIndex === row && colIndex === col
          ? cellImages[row][col] === DEM_FLAG
            ? DEM_CASE
            : DEM_FLAG
          : img
      )
    );
    setFlagCount((prevCount) =>
      cellImages[row][col] === DEM_FLAG ? prevCount - 1 : prevCount + 1
    );
    setCellImages(newImages);

    const allBombsFlagged = gridReveal.every((r, rowIndex) =>
      r.every(
        (cell, colIndex) =>
          (cell !== DEM_BOMB && newImages[rowIndex][colIndex] !== DEM_CASE) ||
          (cell === DEM_BOMB && newImages[rowIndex][colIndex] === DEM_FLAG)
      )
    );

    if (allBombsFlagged) {
      setGamewin(true); // End game when all bombs are correctly flagged
      setTimerActive(false); // Stop the timer
    }
  };

  const handleRule = () => {
    setRule(true);
  };

  useEffect(() => {
    function updateCellSize() {
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        // Sur desktop, on a plus d'espace car les panneaux sont sur les côtés
        // On soustrait les panneaux latéraux (~450px) et les marges
        const availableHeight = window.innerHeight - 200; // navbar + marges
        const availableWidth = window.innerWidth - 500; // panneaux latéraux + marges

        const maxCellFromHeight = availableHeight / rows;
        const maxCellFromWidth = availableWidth / cols;

        // Sur desktop on peut avoir des cellules plus grandes (jusqu'à 100px)
        const maxCellSize = Math.min(maxCellFromHeight, maxCellFromWidth, 100);
        const minCellSize = 60;

        setCellSize(Math.max(minCellSize, maxCellSize));
      } else {
        // Sur mobile, version compacte
        const availableHeight = window.innerHeight - 280;
        const availableWidth = window.innerWidth - 80;

        const maxCellFromHeight = availableHeight / rows;
        const maxCellFromWidth = availableWidth / cols;

        const maxCellSize = Math.min(maxCellFromHeight, maxCellFromWidth, 80);
        const minCellSize = 40;

        setCellSize(
          Math.max(minCellSize, Math.min(maxCellSize, (16 / rows) * 42))
        );
      }
    }

    // Update cellSize on initial render
    updateCellSize();

    // Add event listener for window resize
    window.addEventListener("resize", updateCellSize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", updateCellSize);
  }, [rows, cols]);

  useEffect(() => {
    if (gamewin) {
      window.localStorage.setItem("mineFlag", "1");
    }
  }, [gamewin]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pt-28 pb-4 px-4 bg-slate-100">
      {/* Version Mobile (< 1024px) - Carte compacte */}
      <div className="lg:hidden relative bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-purple-200/50 max-h-[calc(100vh-8rem)] overflow-auto">
        {/* Header avec titre et info */}
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-xl md:text-2xl font-bold text-purple-400 mb-1">
            💣 TimeBomb
          </h1>
          <p className="text-slate-500 text-xs md:text-sm text-center max-w-md">
            Déminez l&apos;obsolescence programmée
          </p>
        </div>

        {/* Bouton d'info */}
        <button
          onClick={handleRule}
          className="flex items-center gap-2 mx-auto mb-3 px-3 py-1.5 rounded-full bg-white border border-purple-200 text-slate-500 hover:text-purple-400 hover:border-purple-400 transition-all duration-300 group text-sm"
        >
          <RiInformation2Line className="text-lg group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-medium">Comment jouer ?</span>
        </button>

        {/* Stats bar */}
        <div className="flex justify-center gap-2 md:gap-3 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <FaClock className="text-purple-400 text-sm" />
            <span className="font-mono text-slate-700 font-medium text-sm">
              {formatTime(time)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <FaFlag className="text-green-500 text-sm" />
            <span className="font-mono text-slate-700 font-medium text-sm">
              {flagCount} / {bombs}
            </span>
          </div>
        </div>

        {/* Grille de jeu */}
        <div
          className="relative mx-auto"
          style={{
            width: `${cols * cellSize + 16}px`,
            height: `${rows * cellSize + 16}px`,
          }}
        >
          <div className="relative grid gap-0.5 grid-cols-1 items-center bg-purple-100 p-2 rounded-xl border border-purple-200 shadow-inner">
            {load &&
              generateGrid(
                cellImages,
                handleLeftClick,
                handleRightClick,
                gameOver,
                rows,
                cols,
                cellSize,
                DEM_CASE,
                DEM_FLAG
              )}
          </div>
        </div>

        {/* Bouton Rejouer */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="bg-purple-400 w-fit text-white flex items-center justify-center px-5 py-1.5 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-500 transition-all cursor-pointer font-medium text-sm shadow-md shadow-purple-200"
          >
            <FaPlay className="mr-2" />
            Rejouer
          </button>
        </div>

        {/* Messages */}
        {gameOver && (
          <div className="mt-3 flex items-center justify-center gap-2 text-red-500 animate-pulse text-sm">
            <FaSkull className="text-lg" />
            <span className="font-semibold">Game Over !</span>
          </div>
        )}
        {gamewin && (
          <div className="mt-3 flex items-center justify-center gap-2 text-green-500 animate-pulse text-sm">
            <FaTrophy className="text-lg" />
            <span className="font-semibold">Bravo !</span>
          </div>
        )}
      </div>

      {/* Version Desktop (>= 1024px) - Grande carte unifiée */}
      <div className="hidden lg:flex flex-col bg-white rounded-3xl shadow-xl border border-purple-200/50 p-8 max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-purple-400">💣 TimeBomb</h1>
            <span className="text-slate-400">|</span>
            <p className="text-slate-500">
              Déminez l&apos;obsolescence programmée
            </p>
          </div>
          <button
            onClick={handleRule}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:text-purple-400 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group"
          >
            <RiInformation2Line className="text-xl group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Comment jouer ?</span>
          </button>
        </div>

        {/* Contenu principal */}
        <div className="flex items-center justify-center gap-12 flex-1">
          {/* Panneau Stats à gauche - Temps */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center gap-1 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-200">
              <FaClock className="text-purple-400 text-2xl mb-1" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                Temps
              </span>
              <span className="font-mono text-slate-700 font-bold text-2xl">
                {formatTime(time)}
              </span>
            </div>
            {/* Message Game Over à gauche */}
            {gameOver && (
              <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-2xl border border-red-200 text-red-500 animate-pulse">
                <FaSkull className="text-2xl" />
                <span className="font-semibold text-center text-sm">
                  Game Over !
                </span>
              </div>
            )}
          </div>

          {/* Grille centrale */}
          <div
            className="relative"
            style={{
              width: `${cols * cellSize + 16}px`,
              height: `${rows * cellSize + 16}px`,
            }}
          >
            <div className="relative grid gap-0.5 grid-cols-1 items-center bg-purple-100 p-2 rounded-xl border border-purple-200 shadow-inner">
              {load &&
                generateGrid(
                  cellImages,
                  handleLeftClick,
                  handleRightClick,
                  gameOver,
                  rows,
                  cols,
                  cellSize,
                  DEM_CASE,
                  DEM_FLAG
                )}
            </div>
          </div>

          {/* Panneau Stats à droite - Drapeaux */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col items-center gap-1 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-200">
              <FaFlag className="text-green-500 text-2xl mb-1" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                Drapeaux
              </span>
              <span className="font-mono text-slate-700 font-bold text-2xl">
                {flagCount} / {bombs}
              </span>
            </div>
            {/* Message Victoire à droite */}
            {gamewin && (
              <div className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-2xl border border-green-200 text-green-500 animate-pulse">
                <FaTrophy className="text-2xl" />
                <span className="font-semibold text-center text-sm">
                  Victoire !
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec bouton Rejouer */}
        <div className="mt-6 pt-4 border-t w-full border-slate-100 flex justify-center">
          {gamewin && (
            <Link
              href="/"
              className="bg-white w-fit h-fit text-green-400 flex items-center justify-center px-8 py-3 rounded-full transform hover:scale-105 duration-300 hover:bg-green-400 hover:text-white transition-all cursor-pointer font-medium shadow shadow-green-200 mb-4 mr-6"
            >
              Retour à l'accueil
            </Link>
          )}

          <button
            onClick={handleReset}
            className="bg-purple-400 w-fit h-fit text-white flex items-center justify-center px-8 py-3 rounded-full transform hover:scale-105 duration-300 hover:bg-purple-500 transition-all cursor-pointer font-medium shadow-lg shadow-purple-200"
          >
            <FaPlay className="mr-2" />
            Rejouer
          </button>
        </div>
      </div>

      {/* Modal des règles (partagé) */}
      {rule && (
        <Modal
          showModal={rule}
          setShowModal={setRule}
          title={"🎮 Règles de TimeBomb"}
        >
          <div className="space-y-3 text-slate-600 text-sm">
            <div className="flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
              <span className="text-xl">🎯</span>
              <p>
                Révélez toutes les cases sans tomber sur les pièges de
                l&apos;obsolescence programmée cachés par les fabricants.
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
              <span className="text-xl">🔢</span>
              <p>
                Chaque chiffre indique combien de pièges d&apos;obsolescence se
                cachent dans les cases adjacentes.
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 bg-slate-100 rounded-lg">
              <span className="text-xl">🚩</span>
              <p>
                Clic droit pour signaler une pratique d&apos;obsolescence
                programmée avec un drapeau.
              </p>
            </div>
            <div className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-xl">♻️</span>
              <p className="text-purple-600">
                Identifiez tous les pièges pour prolonger la durée de vie de vos
                appareils !
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
