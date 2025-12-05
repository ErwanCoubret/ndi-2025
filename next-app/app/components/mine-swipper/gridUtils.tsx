// utils/gridUtils.ts

import Image from "next/image";

export const generateGrid = (
	cellImages: string[][],
	handleLeftClick: (row: number, col: number) => void,
	handleRightClick: (row: number, col: number) => void,
	gameOver: boolean,
	rows: number,
	cols: number,
	cellSize: number,
	DEM_CASE: string,
	DEM_FLAG: string
) => {
	const grid = [];
	for (let i = 0; i < rows; i++) {
		const row = [];
		for (let j = 0; j < cols; j++) {
			row.push(
				<div
					key={`${i}-${j}`}
					className=""
					style={{
						width: `${cellSize}px`,
						height: `${cellSize - 4}px`,
					}}
				>
					<Image
						src={cellImages[i][j]}
            width={cellSize}
            height={cellSize}
						alt="Cell"
						className={`w-full h-full object-cover ${(cellImages[i][j] === DEM_CASE || cellImages[i][j] === DEM_FLAG) && `hover:scale-110`}`}
						onClick={() => !gameOver && handleLeftClick(i, j)}
						onContextMenu={() =>
							!gameOver && handleRightClick(i, j)
						}
					/>
				</div>
			);
		}
		grid.push(
			<div key={i} className="flex gap-0.5">
				{row}
			</div>
		);
	}
	return grid;
};

export const initialGrid = (rows: number, cols: number, initialVal: string) => {
	return Array.from({ length: rows }, () =>
		Array.from({ length: cols }, () => initialVal)
	);
};

export const initializeGridReveal = (
	rows: number,
	cols: number,
	numBombs: number,
	RFC: number,
	CFC: number,
	DEM_NUMBERS: string[],
	DEM_BOMB: string
) => {
	const grid = Array.from({ length: rows }, () =>
		Array.from({ length: cols }, () => DEM_NUMBERS[0])
	);

	const bombPositions = new Set<number>();

	while (bombPositions.size < numBombs) {
		const bombIndex = Math.floor(Math.random() * rows * cols);
		const row = Math.floor(bombIndex / cols);
		const col = bombIndex % cols;

		if (
			!(
				row >= RFC - 1 &&
				row <= RFC + 1 &&
				col >= CFC - 1 &&
				col <= CFC + 1
			)
		) {
			bombPositions.add(bombIndex);
		}
	}

	bombPositions.forEach((position) => {
		const row = Math.floor(position / cols);
		const col = position % cols;
		grid[row][col] = DEM_BOMB;
	});

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (grid[i][j] !== DEM_BOMB) {
				let bombCount = 0;
				for (let x = -1; x <= 1; x++) {
					for (let y = -1; y <= 1; y++) {
						if (
							i + x >= 0 &&
							i + x < rows &&
							j + y >= 0 &&
							j + y < cols
						) {
							if (grid[i + x][j + y] === DEM_BOMB) {
								bombCount++;
							}
						}
					}
				}
				grid[i][j] = DEM_NUMBERS[bombCount];
			}
		}
	}
	return grid;
};

export const revealAllBombs = (
	newImages: string[][],
	gridReveal: string[][],
	DEM_BOMB: string
) => {
	for (let i = 0; i < newImages.length; i++) {
		for (let j = 0; j < newImages[i].length; j++) {
			if (gridReveal[i][j] === DEM_BOMB) {
				newImages[i][j] = DEM_BOMB;
			}
		}
	}
};

export const revealAdjacentCells = (
	row: number,
	col: number,
	newImages: string[][],
	grid: string[][]
) => {
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (
				row + x >= 0 &&
				row + x < newImages.length &&
				col + y >= 0 &&
				col + y < newImages[0].length
			) {
				if (newImages[row + x][col + y] === "/demineur/DemCase.png") {
					newImages[row + x][col + y] = grid[row + x][col + y];
					if (grid[row + x][col + y] === "/demineur/Dem0.png") {
						revealAdjacentCells(row + x, col + y, newImages, grid);
					}
				}
			}
		}
	}
};

export const countAdjacentFlags = (
	row: number,
	col: number,
	cellImages: string[][],
	DEM_FLAG: string,
	gridReveal: string[][],
	DEM_BOMB: string
) => {
	let flagCount = 0;
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (
				(x !== 0 || y !== 0) &&
				row + x >= 0 &&
				row + x < cellImages.length &&
				col + y >= 0 &&
				col + y < cellImages[0].length
			) {
				if (cellImages[row + x][col + y] === DEM_FLAG) {
					flagCount++;
				}
				if (
					gridReveal[row + x][col + y] === DEM_BOMB &&
					cellImages[row + x][col + y] !== DEM_FLAG
				) {
					flagCount += 10;
				}
			}
		}
	}
	return flagCount;
};
