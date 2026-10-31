import React from 'react';
import { ActiveScreen } from '../types/genealogy';
import { Compass, GitFork, BookOpen, Settings, Download } from 'lucide-react';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  onOpenExportModal: () => void;
  peopleCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenExportModal,
  peopleCount
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-[#fbf9f5]/95 dark:bg-[#141210]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectScreen('tree')}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-md bg-stone-900 dark:bg-amber-100 flex items-center justify-center text-amber-100 dark:text-stone-900 font-cinzel font-bold text-lg shadow-sm">
              HK
            </div>
            <div>
              <span className="font-cinzel text-xl font-bold tracking-wider text-stone-900 dark:text-stone-100 uppercase">
                Human Kin
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-serif text-stone-500 dark:text-stone-400 italic">
                · De la Adam până astăzi
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectScreen('map')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeScreen === 'map'
                ? 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Harta Istorică</span>
          </button>

          <button
            onClick={() => onSelectScreen('tree')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeScreen === 'tree'
                ? 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>Arbore Genealogic</span>
          </button>

          <button
            onClick={() => onSelectScreen('people')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeScreen === 'people'
                ? 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Narațiune Biblică ({peopleCount})</span>
          </button>

          <button
            onClick={() => onSelectScreen('settings')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeScreen === 'settings'
                ? 'bg-amber-900/10 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300 font-semibold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Setări</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-white shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportă Arborele</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
