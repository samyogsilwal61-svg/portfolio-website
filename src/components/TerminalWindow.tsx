import React, { useState, useEffect, useRef } from 'react';
import { profile, projectCategories } from '../data';

type Line = { type: 'input' | 'output'; text: string };

const BOOT_LINES = ['Welcome to Samyog_OS v2.0', "Type 'help' to see available commands."];

export default function TerminalWindow({ changeTheme }: { changeTheme: (theme: string) => void }) {
  const [history, setHistory] = useState<Line[]>(BOOT_LINES.map((t) => ({ type: 'output', text: t })));
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const push = (lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const openLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const handleCommand = (raw: string) => {
    const cmd = raw.trim();
    const trimmed = cmd.toLowerCase();
    const out: Line[] = [{ type: 'input', text: raw }];

    if (cmd !== '') setCmdHistory((h) => [...h, cmd]);
    setHistIndex(-1);

    if (trimmed === '') {
      push(out);
      return;
    }

    const [base, ...args] = trimmed.split(' ');

    switch (base) {
      case 'help':
        out.push(
          { type: 'output', text: 'AVAILABLE COMMANDS:' },
          { type: 'output', text: '  help            - Show this message' },
          { type: 'output', text: '  clear           - Clear terminal output' },
          { type: 'output', text: '  whoami          - Print current user' },
          { type: 'output', text: '  date            - Show current system date' },
          { type: 'output', text: '  theme [name]    - List/change theme' },
          { type: 'output', text: '  ls              - List project folders' },
          { type: 'output', text: '  cd <folder>     - Enter a project folder' },
          { type: 'output', text: '  social          - List all profile links' },
          { type: 'output', text: '  github          - Open GitHub profile' },
          { type: 'output', text: '  linkedin        - Open LinkedIn profile' },
          { type: 'output', text: '  tryhackme       - Open TryHackMe profile' },
          { type: 'output', text: '  itch            - Open itch.io profile' },
          { type: 'output', text: '  youtube         - Open YouTube channel' },
          { type: 'output', text: '  neofetch        - Show profile summary' },
          { type: 'output', text: '  banner          - Print ASCII banner' },
          { type: 'output', text: '  sudo hack       - ???' },
          { type: 'output', text: '  history         - Show command history' },
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        out.push({ type: 'output', text: 'samyog_silwal' });
        break;
      case 'date':
        out.push({ type: 'output', text: new Date().toString() });
        break;
      case 'theme':
        if (args.length === 0) {
          out.push({ type: 'output', text: 'Available themes: bw, matrix, amber, cyber' });
        } else if (['bw', 'matrix', 'amber', 'cyber'].includes(args[0])) {
          changeTheme(args[0]);
          out.push({ type: 'output', text: `Theme changed to: ${args[0]}` });
        } else {
          out.push({ type: 'output', text: `Unknown theme: ${args[0]}` });
        }
        break;
      case 'ls':
        out.push({ type: 'output', text: 'projects/' });
        projectCategories.forEach((c) => out.push({ type: 'output', text: `  ${c.folderName}/` }));
        break;
      case 'cd': {
        if (!args[0]) {
          out.push({ type: 'output', text: 'usage: cd <folder>' });
          break;
        }
        const match = projectCategories.find((c) => c.folderName === args[0] || c.id === args[0]);
        if (match) {
          out.push({
            type: 'output',
            text: match.items.length ? `${match.items.length} item(s) found.` : 'Directory is empty. Check back soon.',
          });
        } else {
          out.push({ type: 'output', text: `cd: no such folder: ${args[0]}` });
        }
        break;
      }
      case 'social':
        out.push(
          { type: 'output', text: `GitHub:    ${profile.links.github}` },
          { type: 'output', text: `LinkedIn:  ${profile.links.linkedin}` },
          { type: 'output', text: `TryHackMe: ${profile.links.tryhackme}` },
          { type: 'output', text: `itch.io:   ${profile.links.itch}` },
          { type: 'output', text: `YouTube:   ${profile.links.youtube}` },
        );
        break;
      case 'github':
        out.push({ type: 'output', text: 'Opening GitHub...' });
        openLink(profile.links.github);
        break;
      case 'linkedin':
        out.push({ type: 'output', text: 'Opening LinkedIn...' });
        openLink(profile.links.linkedin);
        break;
      case 'tryhackme':
        out.push({ type: 'output', text: 'Opening TryHackMe...' });
        openLink(profile.links.tryhackme);
        break;
      case 'itch':
        out.push({ type: 'output', text: 'Opening itch.io...' });
        openLink(profile.links.itch);
        break;
      case 'youtube':
        out.push({ type: 'output', text: 'Opening YouTube...' });
        openLink(profile.links.youtube);
        break;
      case 'neofetch':
        out.push(
          { type: 'output', text: `${profile.name}@portfolio` },
          { type: 'output', text: '-----------------' },
          { type: 'output', text: 'OS: Samyog_OS v2.0' },
          { type: 'output', text: `Role: ${profile.role}` },
          { type: 'output', text: `School: ${profile.school}` },
          { type: 'output', text: 'Interests: gamedev, cybersecurity, real-world projects' },
        );
        break;
      case 'banner':
        out.push(
          { type: 'output', text: 'SSSSS  AAAAA  M   M  Y   Y  OOOOO  GGGGG' },
          { type: 'output', text: 'S      A   A  MM MM   Y Y   O   O  G' },
          { type: 'output', text: 'SSSSS  AAAAA  M M M    Y    O   O  G GGG' },
          { type: 'output', text: '    S  A   A  M   M    Y    O   O  G   G' },
          { type: 'output', text: 'SSSSS  A   A  M   M    Y    OOOOO  GGGGG' },
        );
        break;
      case 'sudo':
        if (args.join(' ') === 'hack') {
          out.push({ type: 'output', text: 'ACCESS DENIED. Nice try.' });
        } else {
          out.push({ type: 'output', text: 'Permission denied.' });
        }
        break;
      case 'history':
        cmdHistory.forEach((c, i) => out.push({ type: 'output', text: `${i + 1}  ${c}` }));
        break;
      default:
        out.push({ type: 'output', text: `Command not found: ${trimmed}. Type 'help'.` });
    }

    push(out);
  };

  return (
    <div className="bg-primary text-primary-foreground font-mono text-xs md:text-sm flex flex-col min-h-[300px] h-full p-4 md:p-6">
      <div className="flex-1 overflow-y-auto space-y-1 mb-4">
        {history.map((h, i) => (
          <div key={i} className={h.type === 'input' ? 'text-accent' : 'text-primary-foreground whitespace-pre-wrap'}>
            {h.type === 'input' && <span className="mr-2">&gt;</span>}
            {h.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t-2 border-primary-foreground/20">
        <span className="font-bold animate-pulse">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (cmdHistory.length === 0) return;
              const idx = histIndex === -1 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1);
              setHistIndex(idx);
              setInput(cmdHistory[idx]);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (histIndex === -1) return;
              const idx = histIndex + 1;
              if (idx >= cmdHistory.length) {
                setHistIndex(-1);
                setInput('');
              } else {
                setHistIndex(idx);
                setInput(cmdHistory[idx]);
              }
            }
          }}
          className="bg-transparent border-none outline-none flex-1 font-mono text-primary-foreground placeholder-primary-foreground/30"
          placeholder="Type 'help'..."
          autoFocus
        />
      </div>
    </div>
  );
}
