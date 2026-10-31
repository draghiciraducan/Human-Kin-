/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveScreen, Person } from './types/genealogy';
import { INITIAL_PEOPLE } from './data/biblicalData';
import { Header } from './components/Header';
import { HistoricalMap } from './components/HistoricalMap';
import { GenealogyTree } from './components/GenealogyTree';
import { BiblicalPeopleList } from './components/BiblicalPeopleList';
import { SettingsScreen } from './components/SettingsScreen';
import { PersonDetailModal } from './components/PersonDetailModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('map');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [targetLocationId, setTargetLocationId] = useState<string | null>('eden');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [chronologyStandard, setChronologyStandard] = useState<'masoretic' | 'septuagint'>('masoretic');
  const [datingFormat, setDatingFormat] = useState<'am' | 'bce' | 'both'>('am');

  // People State (Adam, Eva, Cain, Abel, Set) with persistence
  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const saved = localStorage.getItem('human_kin_people');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_PEOPLE;
  });

  // Sync dark class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save people to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('human_kin_people', JSON.stringify(people));
    } catch {
      // Ignore storage errors
    }
  }, [people]);

  // Add person handler
  const handleAddPerson = (newPerson: Person) => {
    setPeople((prev) => [...prev, newPerson]);
  };

  // Reset to initial 5 patriarchs
  const handleResetToDefaults = () => {
    setPeople(INITIAL_PEOPLE);
    localStorage.removeItem('human_kin_people');
  };

  // Export JSON handler
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(people, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'human_kin_genealogy_archive.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Navigation handlers
  const handleSelectPerson = (personId: string) => {
    setSelectedPersonId(personId);
  };

  const handleLocateOnMap = (locationId?: string) => {
    if (locationId) {
      setTargetLocationId(locationId);
    }
    setActiveScreen('map');
  };

  const handleViewInTree = (personId: string) => {
    setSelectedPersonId(personId);
    setActiveScreen('tree');
  };

  const selectedPerson = people.find((p) => p.id === selectedPersonId) || null;

  return (
    <div className={`min-h-screen ${activeScreen === 'map' || activeScreen === 'tree' ? 'h-screen overflow-hidden' : ''} bg-[#f7f4ee] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors`}>
      {/* GLOBAL HEADER */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        peopleCount={people.length}
      />

      {/* SCREEN ROUTING */}
      <main className="flex-1 w-full relative overflow-hidden">
        {activeScreen === 'map' && (
          <HistoricalMap
            onSelectPerson={handleSelectPerson}
            people={people}
            selectedLocationId={targetLocationId}
          />
        )}

        {activeScreen === 'tree' && (
          <GenealogyTree
            people={people}
            onSelectPerson={handleSelectPerson}
            selectedPersonId={selectedPersonId}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeScreen === 'people' && (
          <BiblicalPeopleList
            people={people}
            onSelectPerson={handleSelectPerson}
            onLocateOnMap={handleLocateOnMap}
            onViewInTree={handleViewInTree}
          />
        )}

        {activeScreen === 'settings' && (
          <SettingsScreen
            people={people}
            onAddPerson={handleAddPerson}
            onResetToDefaults={handleResetToDefaults}
            onExportJSON={handleExportJSON}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((d) => !d)}
            chronologyStandard={chronologyStandard}
            onChangeChronology={setChronologyStandard}
            datingFormat={datingFormat}
            onChangeDatingFormat={setDatingFormat}
          />
        )}
      </main>

      {/* DETAIL MODAL (Opens on clicking any person name) */}
      <PersonDetailModal
        person={selectedPerson}
        onClose={() => setSelectedPersonId(null)}
        onSelectPerson={handleSelectPerson}
        onLocateOnMap={handleLocateOnMap}
        onViewInTree={handleViewInTree}
        allPeople={people}
      />

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        people={people}
      />

      {/* DEDICATED PRINTABLE DOCUMENT (Visible only when printing to PDF / Paper) */}
      <div className="print-only hidden p-8 bg-white text-black font-serif">
        <div className="border-b-2 border-stone-800 pb-4 mb-6">
          <h1 className="font-cinzel text-3xl font-bold uppercase tracking-wider text-stone-900">
            Human Kin · Arborele Genealogic al Omenirii
          </h1>
          <p className="text-sm italic text-stone-600 mt-1">
            Reconstituire genealogică canonică de la Adam până în prezent · Textul Masoretic și Septuaginta
          </p>
          <div className="text-xs text-stone-500 mt-2">
            Data generării: {new Date().toLocaleDateString('ro-RO')} · Persoane înregistrate: {people.length}
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-stone-800 text-stone-900 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-2">#</th>
              <th className="py-2">Nume Canonic</th>
              <th className="py-2">Ebraică</th>
              <th className="py-2">Semnificație</th>
              <th className="py-2">Generație</th>
              <th className="py-2">Vârstă / Ani</th>
              <th className="py-2">Linie</th>
              <th className="py-2">Referință Biblică</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p, idx) => (
              <tr key={p.id} className="border-b border-stone-200">
                <td className="py-2 font-mono">{idx + 1}</td>
                <td className="py-2 font-bold">{p.name}</td>
                <td className="py-2">{p.hebrewName}</td>
                <td className="py-2 italic">„{p.hebrewMeaning}”</td>
                <td className="py-2">Gen. {p.generation}</td>
                <td className="py-2">{p.lifespanYears ? `${p.lifespanYears} ani` : '-'}</td>
                <td className="py-2">{p.lineage}</td>
                <td className="py-2 font-mono text-[11px]">{p.sources[0]?.book} {p.sources[0]?.chapterVerses}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-t border-stone-300 pt-4 text-xs text-stone-600">
          <p className="font-bold mb-1">Note Metodologice:</p>
          <p>
            Cronologia respectă consemnările din Geneza capitolele 1-5. Pentru început, au fost introduși patriarhii primordiali: Adam, Eva, Cain, Abel și Set, marcând începutul liniilor genealogice ale umanității.
          </p>
        </div>
      </div>
    </div>
  );
}
