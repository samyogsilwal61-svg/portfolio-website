import React, { useEffect, useState } from 'react';
import { Github, ShieldCheck, Gamepad2, ExternalLink } from 'lucide-react';
import { profile } from '../data';

function GithubCard() {
  const [stats, setStats] = useState<{ public_repos: number; followers: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`https://api.github.com/users/${profile.links.githubUsername}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (active) setStats({ public_repos: d.public_repos, followers: d.followers });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <a
      href={profile.links.github}
      target="_blank"
      rel="noreferrer"
      className="border-3 border-border p-4 flex flex-col gap-2 bg-accent/10 hover:bg-primary hover:text-white transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-pixel text-[10px] uppercase">
          <Github size={16} /> GitHub
        </div>
        <ExternalLink size={14} />
      </div>
      <div className="font-mono text-xs md:text-sm min-h-[36px]">
        {stats ? (
          <>
            <div>Public repos: {stats.public_repos}</div>
            <div>Followers: {stats.followers}</div>
          </>
        ) : failed ? (
          <div>View profile &rarr;</div>
        ) : (
          <div className="opacity-60">Loading stats...</div>
        )}
      </div>
    </a>
  );
}

function TryHackMeCard() {
  return (
    <a
      href={profile.links.tryhackme}
      target="_blank"
      rel="noreferrer"
      className="border-3 border-border p-4 flex flex-col gap-2 bg-accent/10 hover:bg-primary hover:text-white transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-pixel text-[10px] uppercase">
          <ShieldCheck size={16} /> TryHackMe
        </div>
        <ExternalLink size={14} />
      </div>
      <div className="font-mono text-xs md:text-sm opacity-80 min-h-[36px]">View rank, badges &amp; completed rooms &rarr;</div>
    </a>
  );
}

function ItchCard() {
  return (
    <a
      href={profile.links.itch}
      target="_blank"
      rel="noreferrer"
      className="border-3 border-border p-4 flex flex-col gap-2 bg-accent/10 hover:bg-primary hover:text-white transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-pixel text-[10px] uppercase">
          <Gamepad2 size={16} /> itch.io
        </div>
        <ExternalLink size={14} />
      </div>
      <div className="font-mono text-xs md:text-sm opacity-80 min-h-[36px]">Browse published games &rarr;</div>
    </a>
  );
}

export default function StatsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GithubCard />
      <TryHackMeCard />
      <ItchCard />
    </div>
  );
}
