import React, { useState } from 'react';
import { Folder, FolderOpen } from 'lucide-react';
import { projectCategories } from '../data';

export default function ProjectsPanel() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projectCategories.map((cat) => {
        const isOpen = open === cat.id;
        return (
          <div key={cat.id} className="border-3 border-border bg-accent/10">
            <button
              onClick={() => setOpen(isOpen ? null : cat.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-primary hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2 font-pixel text-[10px] uppercase">
                {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
                {cat.label}
              </div>
              <span className="font-mono text-xs font-bold">{cat.items.length}</span>
            </button>
            {isOpen && (
              <div className="p-4 border-t-2 border-border font-mono text-xs md:text-sm opacity-70">
                {cat.items.length === 0
                  ? 'Empty for now — projects coming soon.'
                  : cat.items.map((p) => <div key={p.title}>{p.title}</div>)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
