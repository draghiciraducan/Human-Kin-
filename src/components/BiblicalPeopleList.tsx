import React, { useState } from 'react';
import { Person } from '../types/genealogy';
import {
  Search,
  BookOpen,
  Calendar,
  Compass,
  GitFork,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

interface BiblicalPeopleListProps {
  people: Person[];
  onSelectPerson: (personId: string) => void;
  onLocateOnMap: (locationId?: string) => void;
  onViewInTree: (personId: string) => void;
}

export const BiblicalPeopleList: React.FC<BiblicalPeopleListProps> = ({
  people,
  onSelectPerson,
  onLocateOnMap,
  onViewInTree
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLineage, setSelectedLineage] = useState<string>('all');

  // Sort strictly by chronological order in biblical narrative
  const sortedPeople = [...people].sort(
    (a, b) => a.chronologicalOrder - b.chronologicalOrder
  );

  const filteredPeople = sortedPeople.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hebrewMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sources.some((s) => s.chapterVerses.includes(searchQuery));

    const matchesLineage =
      selectedLineage === 'all' || p.lineage === selectedLineage;

    return matchesSearch && matchesLineage;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] dark:bg-[#0c0a09] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Editorial Section Header */}
        <div className="border-b border-stone-300 dark:border-stone-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-sans text-stone-500 dark:text-stone-400">
                Arhiva Documentară · Cartea Facerii (Geneza)
              </span>
              <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                Cronologia Oamenilor Primordiali
              </h1>
              <p className="font-cormorant text-lg text-stone-600 dark:text-stone-400 italic mt-1 max-w-2xl">
                Așezați în ordinea exactă a apariției lor în narațiunea biblică, cu specificarea surselor canonice și a tradițiilor consemnate.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="text-right text-xs font-mono text-stone-500 dark:text-stone-400 shrink-0">
              <span className="font-semibold text-stone-900 dark:text-stone-100">{filteredPeople.length}</span> / {people.length} consemnați
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Caută după nume, semnificație, verset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md pl-9 pr-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Lineage Filter Buttons */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedLineage('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedLineage === 'all'
                    ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                }`}
              >
                Toate Liniile
              </button>
              <button
                onClick={() => setSelectedLineage('Adamic')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedLineage === 'Adamic'
                    ? 'bg-amber-800 text-white'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                }`}
              >
                Adamică (Adam & Eva)
              </button>
              <button
                onClick={() => setSelectedLineage('Cainite')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedLineage === 'Cainite'
                    ? 'bg-red-800 text-white'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                }`}
              >
                Cainită (Cain)
              </button>
              <button
                onClick={() => setSelectedLineage('Sethite')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedLineage === 'Sethite'
                    ? 'bg-blue-800 text-white'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                }`}
              >
                Setită (Set)
              </button>
            </div>
          </div>
        </div>

        {/* CHRONOLOGICAL LIST OF PEOPLE */}
        <div className="space-y-4">
          {filteredPeople.map((person) => {
            return (
              <div
                key={person.id}
                className="group bg-white dark:bg-[#141210] rounded-lg border border-stone-300/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Top Bar with Editorial Index and Hebrew Name */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-amber-800 dark:text-amber-400">
                        {String(person.chronologicalOrder).padStart(2, '0')}.
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2
                            onClick={() => onSelectPerson(person.id)}
                            className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 hover:text-amber-800 dark:hover:text-amber-400 cursor-pointer transition-colors"
                          >
                            {person.name}
                          </h2>
                          <span className="text-xs text-stone-500 font-serif">
                            · Generația {person.generation}
                          </span>
                        </div>
                        <p className="font-serif text-sm text-stone-500 italic mt-0.5">
                          Semnificație ebraică: „{person.hebrewMeaning}”
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-300" dir="rtl">
                        {person.hebrewName}
                      </span>
                      {person.lifespanYears && (
                        <div className="text-xs font-mono text-stone-500 mt-1">
                          {person.lifespanYears} ani de viață
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary & Occupation */}
                  <div className="mt-3">
                    <p className="font-cormorant text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                      {person.summary}
                    </p>
                    {person.occupation && (
                      <div className="mt-1 text-xs text-stone-500">
                        <span className="font-medium text-stone-700 dark:text-stone-300">Vocație / Rol:</span> {person.occupation}
                      </div>
                    )}
                  </div>

                  {/* Biblical Source Snippet (Specificând de unde provin datele) */}
                  {person.sources.length > 0 && (
                    <div className="mt-4 p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Sursă Canonică Principală: {person.sources[0].book} {person.sources[0].chapterVerses}</span>
                        </div>
                        <span className="text-[11px] font-mono text-stone-500">
                          Tradiție: {person.sources[0].tradition}
                        </span>
                      </div>
                      <p className="font-cormorant italic text-stone-600 dark:text-stone-400 text-sm leading-normal">
                        „{person.sources[0].textSnippet}”
                      </p>
                    </div>
                  )}

                  {/* Bottom Action Ribbon */}
                  <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>{person.sources.length} referințe canonice</span>
                      <span>·</span>
                      <span>{person.keyEvents.length} evenimente consemnate</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onLocateOnMap(person.primaryLocationId)}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        <span>Vezi pe Hartă</span>
                      </button>

                      <button
                        onClick={() => onViewInTree(person.id)}
                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded transition-colors"
                      >
                        <GitFork className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                        <span>Vezi în Arbore</span>
                      </button>

                      <button
                        onClick={() => onSelectPerson(person.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-amber-900 dark:bg-amber-400 dark:text-stone-900 hover:bg-amber-800 rounded transition-colors"
                      >
                        <span>Date Complete</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
