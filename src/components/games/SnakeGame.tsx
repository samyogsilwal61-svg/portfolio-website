import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 15;

export default function SnakeGame() {
  const [snake, setSnake] = useState([[7, 7]]);
  const [food, setFood] = useState([3, 3]);
  const [dir, setDir] = useState([0, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const moveSnake = () => {
      setSnake((prev) => {
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]];

        if (
          head[0] < 0 ||
          head[0] >= GRID_SIZE ||
          head[1] < 0 ||
          head[1] >= GRID_SIZE ||
          prev.some((seg) => seg[0] === head[0] && seg[1] === head[1])
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => s + 10);
          setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [dir, isPlaying, gameOver, food]);

  // Shared direction setter used by both keyboard and on-screen touch controls.
  const changeDir = useCallback((next: [number, number]) => {
    setDir((cur) => {
      // block reversing directly into the snake's own body
      if (cur[0] === -next[0] && cur[1] === -next[1]) return cur;
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          changeDir([0, -1]);
          break;
        case 'ArrowDown':
          changeDir([0, 1]);
          break;
        case 'ArrowLeft':
          changeDir([-1, 0]);
          break;
        case 'ArrowRight':
          changeDir([1, 0]);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDir]);

  const startGame = () => {
    setSnake([[7, 7]]);
    setDir([0, -1]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const dpadBtn = 'brutalist-button bg-white text-primary p-2 flex items-center justify-center active:translate-x-0';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-primary text-white h-full min-h-[300px]">
      <div className="flex justify-between w-full max-w-[240px] mb-2 font-pixel text-[10px]">
        <span>SCORE:{score}</span>
        {gameOver && <span className="text-red-500 animate-pulse">GAME OVER</span>}
      </div>

      <div
        className="grid bg-black border-2 border-border"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 16px)`, gridTemplateRows: `repeat(${GRID_SIZE}, 16px)` }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((s) => s[0] === x && s[1] === y);
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={i}
              className={`w-4 h-4 border-[0.5px] border-primary/20 ${
                isSnake ? 'bg-white' : isFood ? 'bg-red-500' : 'bg-transparent'
              }`}
            />
          );
        })}
      </div>

      {!isPlaying || gameOver ? (
        <button onClick={startGame} className="mt-4 brutalist-button bg-white text-primary px-4 py-2 font-pixel text-[10px] uppercase">
          {gameOver ? 'RETRY' : 'START SNAKE'}
        </button>
      ) : (
        <>
          <div className="mt-4 font-mono text-xs opacity-50 hidden md:block">Use Arrow Keys</div>
          {/* On-screen D-pad — always shown so touch devices can play too */}
          <div className="mt-4 grid grid-cols-3 grid-rows-3 gap-1 w-[132px] select-none touch-none">
            <div />
            <button className={dpadBtn} onClick={() => changeDir([0, -1])} aria-label="Move up">
              <ArrowUp size={18} />
            </button>
            <div />
            <button className={dpadBtn} onClick={() => changeDir([-1, 0])} aria-label="Move left">
              <ArrowLeft size={18} />
            </button>
            <div />
            <button className={dpadBtn} onClick={() => changeDir([1, 0])} aria-label="Move right">
              <ArrowRight size={18} />
            </button>
            <div />
            <button className={dpadBtn} onClick={() => changeDir([0, 1])} aria-label="Move down">
              <ArrowDown size={18} />
            </button>
            <div />
          </div>
        </>
      )}
    </div>
  );
}
