import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, ChevronsDown } from 'lucide-react';

const COLS = 10;
const ROWS = 18;

type Board = number[][];

const SHAPES: Record<string, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const SHAPE_KEYS = Object.keys(SHAPES);

function rotate(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const res: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      res[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return res;
}

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
  const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  return { key, shape: SHAPES[key], x: Math.floor(COLS / 2) - 1, y: 0 };
}

function collides(shape: number[][], x: number, y: number, b: Board) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const nx = x + c;
        const ny = y + r;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && b[ny][nx]) return true;
      }
    }
  }
  return false;
}

function merge(b: Board, shape: number[][], x: number, y: number) {
  const nb = b.map((row) => [...row]);
  shape.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) {
        const ny = y + r;
        const nx = x + c;
        if (ny >= 0) nb[ny][nx] = 1;
      }
    }),
  );
  return nb;
}

function clearLines(b: Board, onCleared: (count: number) => void) {
  let cleared = 0;
  const filtered = b.filter((row) => {
    const full = row.every((c) => c);
    if (full) cleared++;
    return !full;
  });
  while (filtered.length < ROWS) filtered.unshift(Array(COLS).fill(0));
  if (cleared) onCleared(cleared);
  return filtered;
}

export default function TetrisGame() {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [piece, setPiece] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const boardRef = useRef(board);
  boardRef.current = board;

  const spawnNext = useCallback((b: Board) => {
    const next = randomPiece();
    if (collides(next.shape, next.x, next.y, b)) {
      setGameOver(true);
      setIsPlaying(false);
    }
    setPiece(next);
  }, []);

  const drop = useCallback(() => {
    setPiece((p) => {
      const b = boardRef.current;
      if (!collides(p.shape, p.x, p.y + 1, b)) {
        return { ...p, y: p.y + 1 };
      }
      const merged = merge(b, p.shape, p.x, p.y);
      const cleared = clearLines(merged, (count) => setScore((s) => s + count * 100));
      setBoard(cleared);
      spawnNext(cleared);
      return p;
    });
  }, [spawnNext]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const interval = setInterval(drop, 500);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, drop]);

  // Shared move actions — used by both keyboard handler and on-screen touch buttons.
  const moveLeft = useCallback(() => {
    setPiece((p) => {
      const b = boardRef.current;
      return !collides(p.shape, p.x - 1, p.y, b) ? { ...p, x: p.x - 1 } : p;
    });
  }, []);

  const moveRight = useCallback(() => {
    setPiece((p) => {
      const b = boardRef.current;
      return !collides(p.shape, p.x + 1, p.y, b) ? { ...p, x: p.x + 1 } : p;
    });
  }, []);

  const softDrop = useCallback(() => {
    setPiece((p) => {
      const b = boardRef.current;
      return !collides(p.shape, p.x, p.y + 1, b) ? { ...p, y: p.y + 1 } : p;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setPiece((p) => {
      const b = boardRef.current;
      let ny = p.y;
      while (!collides(p.shape, p.x, ny + 1, b)) ny++;
      return { ...p, y: ny };
    });
  }, []);

  const rotatePiece = useCallback(() => {
    setPiece((p) => {
      const b = boardRef.current;
      const rotated = rotate(p.shape);
      return !collides(rotated, p.x, p.y, b) ? { ...p, shape: rotated } : p;
    });
  }, []);

  const guarded = (fn: () => void) => () => {
    if (!isPlaying || gameOver) return;
    fn();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft') moveLeft();
      else if (e.key === 'ArrowRight') moveRight();
      else if (e.key === 'ArrowDown') softDrop();
      else if (e.key === 'ArrowUp') rotatePiece();
      else if (e.key === ' ') hardDrop();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, gameOver, moveLeft, moveRight, softDrop, rotatePiece, hardDrop]);

  const startGame = () => {
    setBoard(emptyBoard());
    setScore(0);
    setGameOver(false);
    setPiece(randomPiece());
    setIsPlaying(true);
  };

  const displayBoard = board.map((row) => [...row]);
  piece.shape.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) {
        const ny = piece.y + r;
        const nx = piece.x + c;
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) displayBoard[ny][nx] = 1;
      }
    }),
  );

  const ctrlBtn = 'brutalist-button bg-white text-black p-2 flex items-center justify-center active:translate-x-0';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black text-white h-full min-h-[300px]">
      <div className="flex justify-between w-full max-w-[160px] mb-2 font-pixel text-[10px]">
        <span>SCORE:{score}</span>
      </div>
      <div
        className="grid border-2 border-white"
        style={{ gridTemplateColumns: `repeat(${COLS}, 14px)`, gridTemplateRows: `repeat(${ROWS}, 14px)` }}
      >
        {displayBoard.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-[14px] h-[14px] border-[0.5px] border-white/10 ${cell ? 'bg-cyan-400' : 'bg-transparent'}`}
            />
          )),
        )}
      </div>
      {gameOver && <div className="mt-2 text-red-500 font-pixel text-[10px] animate-pulse">GAME OVER</div>}
      {!isPlaying || gameOver ? (
        <button onClick={startGame} className="mt-4 brutalist-button bg-white text-black px-4 py-2 font-pixel text-[10px] uppercase">
          {gameOver ? 'RETRY' : 'START TETRIS'}
        </button>
      ) : (
        <>
          <div className="mt-4 font-mono text-[10px] opacity-60 text-center hidden md:block">
            &larr;&rarr; Move &middot; &uarr; Rotate
            <br />
            &darr; Soft drop &middot; Space hard drop
          </div>
          {/* On-screen controls — always shown so touch devices can play too */}
          <div className="mt-4 flex items-center gap-2 select-none touch-none">
            <button className={ctrlBtn} onClick={guarded(moveLeft)} aria-label="Move left">
              <ArrowLeft size={18} />
            </button>
            <button className={ctrlBtn} onClick={guarded(rotatePiece)} aria-label="Rotate">
              <RotateCw size={18} />
            </button>
            <button className={ctrlBtn} onClick={guarded(moveRight)} aria-label="Move right">
              <ArrowRight size={18} />
            </button>
            <button className={ctrlBtn} onClick={guarded(softDrop)} aria-label="Soft drop">
              <ArrowDown size={18} />
            </button>
            <button className={ctrlBtn} onClick={guarded(hardDrop)} aria-label="Hard drop">
              <ChevronsDown size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
