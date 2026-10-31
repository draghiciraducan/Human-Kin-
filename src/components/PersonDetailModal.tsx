import React from 'react';
import { Person } from '../types/genealogy';
import {
  X,
  BookOpen,
  Calendar,
  Compass,
  GitFork,
  Heart,
  Users,
  Shield,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';

interface PersonDetailModalProps {
  person: Person | null;
  onClose: () => void;
  onSelectPerson: (personId: string) => void;
  onLocateOnMap: (locationId?: string) => void;
  onViewInTree: (personId: string) => void;
  allPeople: Person[];
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  person,
  onClose,
  onSelectPerson,
  onLocateOnMap,
  onViewInTree,
  allPeople
}) => {
  if (!person) return null;

  // Resolve relatives
  const parents = allPeople.filter((p) => person.parents.includes(p.id));
  const children = allPeople.filter((p) => person.children.includes(p.id));
  const spouses = allPeople.filter((p) => (person.spouses || []).includes(p.id));
  const siblings = allPeople.filter(
    (p) =>
      p.id !== person.id &&
      p.parents.length > 0 &&
      p.parents.some((parentId) => person.parents.includes(parentId))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#fbf9f5] dark:bg-[#141210] rounded-xl shadow-2xl border border-stone-300 dark:border-stone-800 overflow-hidden flex flex-col text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-6 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-900/80 dark:to-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400">
              <span>{person.lineage === 'Adamic' ? 'Linia Primordială Adamică' : person.lineage === 'Cainite' ? 'Linia Cainită' : 'Linia Setită'}</span>
              <span>·</span>
              <span>Generația {person.generation}</span>
              <span>·</span>
              <span>Ordin Narativ #{person.chronologicalOrder}</span>
            </div>

            <div className="flex items-baseline gap-4 mt-2">
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {person.name}
              </h2>
              <span className="font-serif text-2xl font-bold text-amber-900 dark:text-amber-300" dir="rtl">
                {person.hebrewName}
              </span>
            </div>

            <p className="font-cormorant italic text-lg text-stone-600 dark:text-stone-300 mt-1">
              Semnificația numelui în ebraică: „{person.hebrewMeaning}”
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-md border border-stone-200 dark:border-stone-800">
              <span className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Vârstă Totală
              </span>
              <span className="font-mono text-base font-semibold text-stone-900 dark:text-stone-100">
                {person.lifespanYears ? `${person.lifespanYears} ani` : 'Nespecificat'}
              </span>
            </div>

            <div className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-md border border-stone-200 dark:border-stone-800">
              <span className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                An Naștere / Creație
              </span>
              <span className="font-mono text-base font-semibold text-stone-900 dark:text-stone-100">
                {person.birthYearAM !== undefined ? `AM ${person.birthYearAM}` : 'AM ~'}
              </span>
            </div>

            <div className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-md border border-stone-200 dark:border-stone-800">
              <span className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                An Trecere
              </span>
              <span className="font-mono text-base font-semibold text-stone-900 dark:text-stone-100">
                {person.deathYearAM ? `AM ${person.deathYearAM}` : 'Nespecificat'}
              </span>
            </div>

            <div className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-md border border-stone-200 dark:border-stone-800">
              <span className="block text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Surse Consemnate
              </span>
              <span className="font-mono text-base font-semibold text-amber-800 dark:text-amber-400">
                {person.sources.length} canoane / texte
              </span>
            </div>
          </div>

          {/* Biographical Overview */}
          <div>
            <h3 className="font-cinzel text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
              Biografie & Fapte Consemnate
            </h3>
            <p className="font-cormorant text-lg text-stone-800 dark:text-stone-200 leading-relaxed mb-3">
              {person.summary}
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-stone-600 dark:text-stone-300 font-serif">
              {person.biography.map((point, idx) => (
                <li key={idx} className="leading-normal">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Chronological Events */}
          {person.keyEvents.length > 0 && (
            <div>
              <h3 className="font-cinzel text-base font-bold text-stone-900 dark:text-stone-100 mb-2.5">
                Evenimente-Cheie pe Axă Temporală
              </h3>
              <div className="space-y-2 border-l-2 border-amber-600/40 pl-4 ml-1">
                {person.keyEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-stone-100 dark:border-stone-900"></div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {evt.event}
                      </span>
                      <span className="font-mono text-xs text-amber-800 dark:text-amber-400 shrink-0">
                        {evt.reference} {evt.yearAM !== undefined && `(AM ${evt.yearAM})`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTARY SOURCES (De unde provin datele) */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <h3 className="font-cinzel text-base font-bold text-stone-900 dark:text-stone-100">
                Sursele Documentare & Textele Canonice
              </h3>
            </div>
            <div className="space-y-2.5">
              {person.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-100/80 dark:bg-stone-900/80 rounded-lg border border-stone-200 dark:border-stone-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5 font-medium">
                    <span className="text-amber-900 dark:text-amber-300 font-semibold text-sm">
                      {src.book} {src.chapterVerses}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                      Tradiție: {src.tradition}
                    </span>
                  </div>
                  <p className="font-cormorant italic text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    „{src.textSnippet}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Kinship / Family Relations */}
          <div>
            <h3 className="font-cinzel text-base font-bold text-stone-900 dark:text-stone-100 mb-2.5">
              Relații de Familie & Genealogie
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Parents */}
              <div className="p-3 bg-stone-100/50 dark:bg-stone-900/40 rounded border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-500 block mb-1">Părinți:</span>
                {parents.length > 0 ? (
                  <div className="space-y-1">
                    {parents.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectPerson(p.id)}
                        className="text-amber-900 dark:text-amber-400 hover:underline block font-medium"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-stone-400 italic">Creat direct de Dumnezeu</span>
                )}
              </div>

              {/* Spouses */}
              <div className="p-3 bg-stone-100/50 dark:bg-stone-900/40 rounded border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-500 block mb-1">Partener / Soție:</span>
                {spouses.length > 0 ? (
                  <div className="space-y-1">
                    {spouses.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onSelectPerson(s.id)}
                        className="text-amber-900 dark:text-amber-400 hover:underline block font-medium"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                ) : (person.spouses && person.spouses.length > 0) ? (
                  <span className="text-stone-600 dark:text-stone-400">{person.spouses.join(', ')}</span>
                ) : (
                  <span className="text-stone-400 italic">Nenominalizată în text</span>
                )}
              </div>

              {/* Children */}
              <div className="p-3 bg-stone-100/50 dark:bg-stone-900/40 rounded border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-500 block mb-1">Descendenți Direcți:</span>
                {children.length > 0 ? (
                  <div className="space-y-1">
                    {children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onSelectPerson(c.id)}
                        className="text-amber-900 dark:text-amber-400 hover:underline block font-medium"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-stone-400 italic">Fără descendenți consemnați</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onLocateOnMap(person.primaryLocationId);
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md hover:bg-stone-50"
          >
            <Compass className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Localizează pe Hartă</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewInTree(person.id);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md hover:bg-stone-50"
            >
              <GitFork className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
              <span>Evidențiază în Arbore</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:bg-stone-800"
            >
              Închide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
