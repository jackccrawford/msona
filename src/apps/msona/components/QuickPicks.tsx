import React from 'react';
import { Disc, Mic2, Radio, Headphones, Music2, Podcast } from 'lucide-react';
import type { Theme } from '../../../types/Theme';

interface QuickPicksProps {
  theme: Theme;
  isDark: boolean;
  onSelect: (query: string) => void;
}

const allPicks = [
  { query: 'Electronic Dance', icon: Disc, color: 'purple' },
  { query: 'Acoustic Guitar', icon: Music2, color: 'amber' },
  { query: 'Jazz Piano', icon: Radio, color: 'blue' },
  { query: 'Hip Hop', icon: Mic2, color: 'red' },
  { query: 'Classical', icon: Headphones, color: 'emerald' },
  { query: 'Rock Classics', icon: Podcast, color: 'orange' },
  { query: 'Pop Hits', icon: Music2, color: 'pink' },
  { query: 'Indie Folk', icon: Radio, color: 'teal' },
  { query: 'R&B Soul', icon: Mic2, color: 'indigo' },
  { query: 'Latin Beats', icon: Disc, color: 'yellow' },
  { query: 'Metal', icon: Headphones, color: 'slate' },
  { query: 'Ambient', icon: Radio, color: 'cyan' }
];

export function QuickPicks({ theme, isDark, onSelect }: QuickPicksProps) {
  // Randomly select 6 picks
  const [picks] = React.useState(() => {
    const shuffled = [...allPicks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {picks.map((pick, index) => {
        const Icon = pick.icon;
        return (
          <button
            key={pick.query}
            onClick={() => onSelect(pick.query)}
            className={`
              relative p-6 rounded-xl text-left
              transition-all duration-300 group
              ${isDark 
                ? 'bg-gray-800/50 hover:bg-gray-800' 
                : 'bg-white hover:shadow-lg'
              }
            `}
          >
            <div className={`
              absolute top-0 right-0 w-24 h-24 opacity-5 transform translate-x-4 -translate-y-4
              transition-transform group-hover:translate-x-2 group-hover:-translate-y-2
              ${isDark ? 'text-white' : `text-${pick.color}-500`}
            `}>
              <Icon className="w-full h-full" />
            </div>
            <Icon className={`
              w-8 h-8 mb-3
              ${isDark ? 'text-white' : `text-${pick.color}-500`}
            `} />
            <h3 className={`
              text-lg font-medium
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              {pick.query}
            </h3>
            <p className={`
              text-sm mt-1
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
              Discover tracks
            </p>
          </button>
        );
      })}
    </div>
  );
}