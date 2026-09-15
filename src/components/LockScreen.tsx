import React, { useEffect, useState } from 'react';
import { Lock, LockOpen } from 'lucide-react';

const FAKE_PASSWORD = 'samyog123';

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [typed, setTyped] = useState(0);
  const [granted, setGranted] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (typed < FAKE_PASSWORD.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), 90 + Math.random() * 70);
      return () => clearTimeout(t);
    }
    if (!granted) {
      const t = setTimeout(() => setGranted(true), 450);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setHide(true), 650);
    const t2 = setTimeout(() => onUnlock(), 1150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [typed, granted, onUnlock]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-green-400 transition-opacity duration-500 ${
        hide ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="border-3 border-green-400 p-6 md:p-8 w-[280px] md:w-[320px] flex flex-col items-center gap-4 bg-black">
        {granted ? (
          <LockOpen size={36} className="text-green-400" />
        ) : (
          <Lock size={36} className="text-green-400 animate-pulse" />
        )}
        <div className="font-pixel text-[9px] md:text-[10px] tracking-widest uppercase text-center">
          {granted ? 'Access Granted' : 'System Locked'}
        </div>
        <div className="w-full border-2 border-green-400 px-3 py-2 text-sm tracking-[6px] bg-black min-h-[36px] flex items-center">
          {'•'.repeat(typed)}
          <span className="animate-pulse">_</span>
        </div>
        <div className="text-[10px] opacity-60 text-center">
          {granted ? 'Booting desktop...' : 'Authenticating user: samyog'}
        </div>
      </div>
    </div>
  );
}
