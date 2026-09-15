import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Square,
  Terminal,
  Briefcase,
  FileText,
  Book,
  Gamepad2,
  Image as ImageIcon,
  BarChart3,
  Github,
  Linkedin,
  Youtube,
} from 'lucide-react';
import LockScreen from './components/LockScreen';
import TerminalWindow from './components/TerminalWindow';
import StatsPanel from './components/StatsPanel';
import ProjectsPanel from './components/ProjectsPanel';
import SnakeGame from './components/games/SnakeGame';
import TetrisGame from './components/games/TetrisGame';
import MemoryGame from './components/games/MemoryGame';
import { profile, experience } from './data';

// ----------------------------------------------------------------------
// DATA (writing / articles are placeholder content — edit or remove freely)
// ----------------------------------------------------------------------

const articles: { id: number; title: string; date: string }[] = [];

// ----------------------------------------------------------------------
// UI COMPONENTS
// ----------------------------------------------------------------------

const OsWindow = ({
  title,
  icon: Icon,
  children,
  className = '',
  onClose,
  bodyClass = 'p-4 md:p-6 brutalist-window-body',
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  bodyClass?: string;
}) => {
  return (
    <div className={`brutalist-window flex flex-col ${className}`}>
      <div className="bg-primary text-primary-foreground border-b-3 border-border p-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} />}
          <h2 className="font-pixel text-[10px] md:text-xs uppercase tracking-widest">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:bg-selection p-1 border-2 border-transparent hover:border-white transition-colors">
            <Minus size={14} />
          </button>
          <button className="hover:bg-selection p-1 border-2 border-transparent hover:border-white transition-colors">
            <Square size={12} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-red-500 p-1 border-2 border-transparent hover:border-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className={`overflow-y-auto flex-1 ${bodyClass}`}>{children}</div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MATRIX RAIN BACKGROUND
// ----------------------------------------------------------------------

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[-1] bg-black" />;
};

// ----------------------------------------------------------------------
// APP
// ----------------------------------------------------------------------

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [theme, setTheme] = useState('bw');
  const [windows, setWindows] = useState({
    profile: true,
    about: true,
    projects: true,
    stats: true,
    terminal: true,
    experience: true,
    games: false,
  });
  const [activeGame, setActiveGame] = useState<'SNAKE' | 'TETRIS' | 'MEMORY'>('SNAKE');

  useEffect(() => {
    document.body.className = theme === 'bw' ? 'dot-bg' : `theme-${theme} dot-bg`;
  }, [theme]);

  const toggleWindow = (key: keyof typeof windows) => {
    setWindows((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <>
      <div className="crt-overlay" />
      <MatrixRain />
      <div className="min-h-screen p-2 md:p-8 flex flex-col selection:bg-primary selection:text-primary-foreground pb-24 relative z-10">
        {/* Header / Nav */}
        <header className="mb-4 md:mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="brutalist-window bg-white inline-block p-3 md:p-4 self-start">
            <h1 className="font-pixel text-lg md:text-2xl uppercase">{profile.name}</h1>
            <p className="font-mono text-xs md:text-sm mt-1 md:mt-2 font-bold">{profile.tag}</p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => toggleWindow('profile')}
              className={`brutalist-button px-3 py-2 font-pixel text-[8px] md:text-[10px] uppercase ${
                windows.profile ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
              }`}
            >
              Profile.jpg
            </button>
            <button
              onClick={() => toggleWindow('about')}
              className={`brutalist-button px-3 py-2 font-pixel text-[8px] md:text-[10px] uppercase ${
                windows.about ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
              }`}
            >
              About.txt
            </button>
            <button
              onClick={() => toggleWindow('projects')}
              className={`brutalist-button px-3 py-2 font-pixel text-[8px] md:text-[10px] uppercase ${
                windows.projects ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
              }`}
            >
              Projects.exe
            </button>
            <button
              onClick={() => toggleWindow('stats')}
              className={`brutalist-button px-3 py-2 font-pixel text-[8px] md:text-[10px] uppercase ${
                windows.stats ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
              }`}
            >
              Stats.exe
            </button>
            <button
              onClick={() => toggleWindow('terminal')}
              className={`brutalist-button px-3 py-2 font-pixel text-[8px] md:text-[10px] uppercase ${
                windows.terminal ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
              }`}
            >
              Terminal.sh
            </button>
            <button
              onClick={() => toggleWindow('games')}
              className={`brutalist-button px-3 py-2 font-pixel text-[8px] md:text-[10px] uppercase ${
                windows.games ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
              }`}
            >
              Games.exe
            </button>

            <div className="h-6 w-[2px] bg-border mx-1 hidden sm:block"></div>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="brutalist-button bg-background text-foreground border-2 border-border p-1.5 md:p-2 font-pixel text-[8px] md:text-[10px] uppercase outline-none focus:ring-0 cursor-pointer"
            >
              <option value="bw">B&amp;W Theme</option>
              <option value="matrix">Matrix Green</option>
              <option value="amber">Amber CRT</option>
              <option value="cyber">Cyberpunk</option>
            </select>
          </div>
        </header>

        {/* PROFILE WINDOW (Centered Prominently) */}
        {windows.profile && (
          <div className="flex justify-center w-full mb-8">
            <OsWindow
              title="profile.jpg"
              icon={ImageIcon}
              onClose={() => toggleWindow('profile')}
              className="w-full max-w-sm"
              bodyClass="p-8 bg-white flex justify-center"
            >
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-black pixel-art-filter brutalist-button"
              />
            </OsWindow>
          </div>
        )}

        {/* Grid Layout for Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            {/* ABOUT WINDOW */}
            {windows.about && (
              <OsWindow title="about.txt" icon={FileText} onClose={() => toggleWindow('about')}>
                <div className="font-mono text-sm md:text-base leading-relaxed space-y-4">
                  <p>{profile.bio}</p>
                  <p>{profile.hobbies}</p>
                  <div className="flex gap-4 pt-4 border-t-3 border-border flex-wrap">
                    <a
                      href={profile.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:bg-selection hover:text-white px-2 py-1 transition-colors font-bold"
                    >
                      <Github size={16} /> GitHub
                    </a>
                    <a
                      href={profile.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:bg-selection hover:text-white px-2 py-1 transition-colors font-bold"
                    >
                      <Linkedin size={16} /> LinkedIn
                    </a>
                    <a
                      href={profile.links.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:bg-selection hover:text-white px-2 py-1 transition-colors font-bold"
                    >
                      <Youtube size={16} /> YouTube
                    </a>
                  </div>
                </div>
              </OsWindow>
            )}

            {/* PROJECTS WINDOW */}
            {windows.projects && (
              <OsWindow title="projects.exe" icon={Terminal} onClose={() => toggleWindow('projects')}>
                <ProjectsPanel />
              </OsWindow>
            )}

            {/* EXPERIENCE WINDOW */}
            {windows.experience && (
              <OsWindow title="experience.dat" icon={Briefcase} onClose={() => toggleWindow('experience')}>
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i} className="p-4 border-3 border-border bg-accent/10">
                      <div className="font-pixel text-[10px] mb-2 uppercase">{exp.role}</div>
                      <div className="font-mono text-sm md:text-base font-bold flex justify-between items-center">
                        <span>{exp.company}</span>
                        {exp.years && <span className="text-xs bg-primary text-white px-2 py-1">{exp.years}</span>}
                      </div>
                    </div>
                  ))}

                  {articles.length > 0 && (
                    <div className="pt-4 border-t-3 border-border mt-4">
                      <h3 className="font-pixel text-[10px] uppercase mb-4">Writing</h3>
                      <div className="flex flex-col gap-2">
                        {articles.map((a) => (
                          <a
                            key={a.id}
                            href="#"
                            className="flex justify-between items-center p-2 hover:bg-selection hover:text-white transition-colors group border-2 border-transparent hover:border-primary"
                          >
                            <div className="flex items-center gap-2 font-mono text-sm font-bold">
                              <Book size={14} className="group-hover:animate-bounce" /> {a.title}
                            </div>
                            <span className="font-mono text-xs">{a.date}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </OsWindow>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* STATS WINDOW */}
            {windows.stats && (
              <OsWindow title="stats.exe" icon={BarChart3} onClose={() => toggleWindow('stats')}>
                <StatsPanel />
              </OsWindow>
            )}

            {/* TERMINAL WINDOW */}
            {windows.terminal && (
              <OsWindow title="terminal.sh" icon={Terminal} bodyClass="p-0" onClose={() => toggleWindow('terminal')}>
                <TerminalWindow changeTheme={setTheme} />
              </OsWindow>
            )}

            {/* GAMES WINDOW */}
            {windows.games && (
              <OsWindow title="games.exe" icon={Gamepad2} bodyClass="p-0 flex flex-col" onClose={() => toggleWindow('games')}>
                <div className="flex border-b-3 border-border text-center font-pixel text-[9px] md:text-[10px]">
                  <button
                    onClick={() => setActiveGame('SNAKE')}
                    className={`flex-1 p-3 transition-colors ${activeGame === 'SNAKE' ? 'bg-primary text-white' : 'hover:bg-accent/20'}`}
                  >
                    SNAKE
                  </button>
                  <button
                    onClick={() => setActiveGame('TETRIS')}
                    className={`flex-1 p-3 border-l-3 border-border transition-colors ${
                      activeGame === 'TETRIS' ? 'bg-primary text-white' : 'hover:bg-accent/20'
                    }`}
                  >
                    TETRIS
                  </button>
                  <button
                    onClick={() => setActiveGame('MEMORY')}
                    className={`flex-1 p-3 border-l-3 border-border transition-colors ${
                      activeGame === 'MEMORY' ? 'bg-primary text-white' : 'hover:bg-accent/20'
                    }`}
                  >
                    MEMORY
                  </button>
                </div>

                {activeGame === 'SNAKE' && <SnakeGame />}
                {activeGame === 'TETRIS' && <TetrisGame />}
                {activeGame === 'MEMORY' && <MemoryGame />}
              </OsWindow>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
