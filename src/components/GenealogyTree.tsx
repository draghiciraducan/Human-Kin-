import React, { useState, useRef } from 'react';
import { Person } from '../types/genealogy';
import {
  Download,
  FileImage,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  GitCommit,
  BookOpen,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

interface GenealogyTreeProps {
  people: Person[];
  onSelectPerson: (personId: string) => void;
  selectedPersonId: string | null;
  onOpenExportModal: () => void;
}

export const GenealogyTree: React.FC<GenealogyTreeProps> = ({
  people,
  onSelectPerson,
  selectedPersonId,
  onOpenExportModal
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [lineageFilter, setLineageFilter] = useState<'all' | 'Sethite' | 'Cainite'>('all');

  // Primary Patriarchs
  const adam = people.find((p) => p.id === 'adam');
  const eva = people.find((p) => p.id === 'eva');
  const cain = people.find((p) => p.id === 'cain');
  const abel = people.find((p) => p.id === 'abel');
  const set = people.find((p) => p.id === 'set');

  // Additional people added dynamically by user
  const otherPeople = people.filter(
    (p) => !['adam', 'eva', 'cain', 'abel', 'set'].includes(p.id)
  );

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.tree-node-card') || (e.target as HTMLElement).closest('.tree-control')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetTreeCenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Export current tree view as Image (PNG)
  const handleExportPNG = () => {
    const svgElement = document.getElementById('genealogy-tree-svg');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f7f4ee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Human_Kin_Arbore_Genealogic.png';
        downloadLink.href = pngUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#f7f4ee] dark:bg-[#0f0d0b] overflow-hidden select-none">
      {/* TOP TREE TOOLBAR */}
      <div className="no-print absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Title & Lineage Filter */}
        <div className="pointer-events-auto bg-[#fbf9f5]/95 dark:bg-[#1a1714]/95 backdrop-blur-md px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-800 shadow-md flex items-center gap-4">
          <div>
            <h2 className="font-cinzel text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>Arborele Genealogic Primordial</span>
              <span className="text-[11px] font-sans font-normal text-stone-500">
                (Gen. 1 - 2)
              </span>
            </h2>
            <p className="text-[11px] font-serif text-stone-600 dark:text-stone-400">
              Geneza 1-5 · De la Adam și Eva la primii fii
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1 border-l border-stone-200 dark:border-stone-800 pl-4">
            <span className="text-xs text-stone-500 mr-1">Filtrează Linia:</span>
            <button
              onClick={() => setLineageFilter('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                lineageFilter === 'all'
                  ? 'bg-stone-900 text-stone-100 dark:bg-amber-400 dark:text-stone-900 font-medium'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              Toate
            </button>
            <button
              onClick={() => setLineageFilter('Sethite')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                lineageFilter === 'Sethite'
                  ? 'bg-blue-800 text-blue-100 font-medium'
                  : 'bg-stone-100 dark:bg-stone-800 text-blue-800 dark:text-blue-300 hover:bg-stone-200'
              }`}
            >
              Linia lui Set
            </button>
            <button
              onClick={() => setLineageFilter('Cainite')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                lineageFilter === 'Cainite'
                  ? 'bg-amber-800 text-amber-100 font-medium'
                  : 'bg-stone-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 hover:bg-stone-200'
              }`}
            >
              Linia lui Cain
            </button>
          </div>
        </div>

        {/* Action & Export Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-[#fbf9f5]/95 dark:bg-[#1a1714]/95 backdrop-blur-md p-1.5 rounded-lg border border-stone-300 dark:border-stone-800 shadow-md flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
              className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
              className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetTreeCenter}
              className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              title="Recentrează"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Export Dropdown / Buttons */}
          <div className="bg-[#fbf9f5]/95 dark:bg-[#1a1714]/95 backdrop-blur-md p-1.5 rounded-lg border border-stone-300 dark:border-stone-800 shadow-md flex items-center gap-1">
            <button
              onClick={handleExportPNG}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
              title="Descarcă imagine PNG"
            >
              <FileImage className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Export PNG</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
              title="Printează sau salvează PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAN & ZOOM TREE VIEWPORT */}
      <div
        ref={treeContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden flex items-center justify-center"
      >
        <div
          className="transition-transform duration-75 origin-center w-[1200px] h-[800px] relative"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* SVG Connecting Lines for Genealogy */}
          <svg
            id="genealogy-tree-svg"
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1200 800"
          >
            <defs>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Union Line Between Adam (x: 430, y: 150) and Eva (x: 770, y: 150) */}
            <path
              d="M 520 150 L 680 150"
              stroke="#b45309"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            {/* Union Heart / Covenant Marker */}
            <circle cx="600" cy="150" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <path
              d="M 596 148 C 596 145 599 143 600 145 C 601 143 604 145 604 148 C 604 151 600 154 600 154 C 600 154 596 151 596 148 Z"
              fill="#b45309"
            />

            {/* Stem line down from marital union to branch junction */}
            <path d="M 600 160 L 600 280" stroke="#78350f" strokeWidth="2.5" />

            {/* Horizontal Branch Bar to 3 Sons: Cain (x: 250), Abel (x: 600), Set (x: 950) */}
            <path
              d="M 250 280 L 950 280"
              stroke="#78350f"
              strokeWidth="2.5"
            />

            {/* Branch drops to children */}
            {/* Drop to Cain */}
            <path
              d="M 250 280 L 250 370"
              stroke={lineageFilter === 'Sethite' ? '#d6d3d1' : '#b91c1c'}
              strokeWidth={lineageFilter === 'Cainite' ? 3.5 : 2}
            />
            {/* Drop to Abel */}
            <path
              d="M 600 280 L 600 370"
              stroke={lineageFilter !== 'all' ? '#d6d3d1' : '#78350f'}
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            {/* Drop to Set */}
            <path
              d="M 950 280 L 950 370"
              stroke={lineageFilter === 'Cainite' ? '#d6d3d1' : '#1d4ed8'}
              strokeWidth={lineageFilter === 'Sethite' ? 3.5 : 2}
            />

            {/* If there are extended children / lineage */}
            {otherPeople.length > 0 && (
              <g>
                <path d="M 950 510 L 950 580" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="3 2" />
              </g>
            )}
          </svg>

          {/* HTML TREE NODES */}

          {/* GENERATION 1: Adam & Eva */}
          {/* Adam Card */}
          {adam && (
            <div
              style={{ left: '330px', top: '80px' }}
              className="absolute tree-node-card z-10"
            >
              <TreeNodeCard
                person={adam}
                isSelected={selectedPersonId === 'adam'}
                onSelect={() => onSelectPerson('adam')}
                badge="Patriarh Primordial"
                themeColor="amber"
              />
            </div>
          )}

          {/* Eva Card */}
          {eva && (
            <div
              style={{ left: '690px', top: '80px' }}
              className="absolute tree-node-card z-10"
            >
              <TreeNodeCard
                person={eva}
                isSelected={selectedPersonId === 'eva'}
                onSelect={() => onSelectPerson('eva')}
                badge="Mama Omenirii"
                themeColor="amber"
              />
            </div>
          )}

          {/* GENERATION 2: The Three Sons */}

          {/* Cain Card */}
          {cain && (
            <div
              style={{ left: '140px', top: '370px' }}
              className={`absolute tree-node-card z-10 transition-opacity ${
                lineageFilter === 'Sethite' ? 'opacity-30 pointer-events-none' : 'opacity-100'
              }`}
            >
              <TreeNodeCard
                person={cain}
                isSelected={selectedPersonId === 'cain'}
                onSelect={() => onSelectPerson('cain')}
                badge="Linia Cainită · Întâiul Născut"
                themeColor="red"
                secondaryBadge="Cetatea Enoh"
              />
            </div>
          )}

          {/* Abel Card */}
          {abel && (
            <div
              style={{ left: '490px', top: '370px' }}
              className={`absolute tree-node-card z-10 transition-opacity ${
                lineageFilter !== 'all' ? 'opacity-30 pointer-events-none' : 'opacity-100'
              }`}
            >
              <TreeNodeCard
                person={abel}
                isSelected={selectedPersonId === 'abel'}
                onSelect={() => onSelectPerson('abel')}
                badge="Al Doilea Fiu · Păstorul"
                themeColor="stone"
                secondaryBadge="Primul Martir"
              />
            </div>
          )}

          {/* Set Card */}
          {set && (
            <div
              style={{ left: '840px', top: '370px' }}
              className={`absolute tree-node-card z-10 transition-opacity ${
                lineageFilter === 'Cainite' ? 'opacity-30 pointer-events-none' : 'opacity-100'
              }`}
            >
              <TreeNodeCard
                person={set}
                isSelected={selectedPersonId === 'set'}
                onSelect={() => onSelectPerson('set')}
                badge="Linia Setită · Promisiunea"
                themeColor="blue"
                secondaryBadge="912 ani · Spre Noe"
              />
            </div>
          )}

          {/* Additional Dynamic People Nodes (if added by user) */}
          {otherPeople.map((person, index) => (
            <div
              key={person.id}
              style={{
                left: `${840 + (index % 2 === 0 ? -120 : 120)}px`,
                top: `${590 + Math.floor(index / 2) * 150}px`
              }}
              className="absolute tree-node-card z-10"
            >
              <TreeNodeCard
                person={person}
                isSelected={selectedPersonId === person.id}
                onSelect={() => onSelectPerson(person.id)}
                badge={`Generația ${person.generation}`}
                themeColor="purple"
              />
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM EXPLANATORY BANNER */}
      <div className="no-print absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div className="bg-[#fbf9f5]/90 dark:bg-[#1a1714]/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-300 dark:border-stone-800 shadow-md text-xs text-stone-600 dark:text-stone-300 flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            Linia Adamică
          </span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="flex items-center gap-1.5 font-medium text-red-700 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            Linia Cainită (Urbanism & Nomadism)
          </span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="flex items-center gap-1.5 font-medium text-blue-700 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Linia Setită (Patriarhală & Sacră)
          </span>
        </div>
      </div>
    </div>
  );
};

// Tree Node Card Component
interface TreeNodeCardProps {
  person: Person;
  isSelected: boolean;
  onSelect: () => void;
  badge: string;
  themeColor: 'amber' | 'red' | 'blue' | 'stone' | 'purple';
  secondaryBadge?: string;
}

const TreeNodeCard: React.FC<TreeNodeCardProps> = ({
  person,
  isSelected,
  onSelect,
  badge,
  themeColor,
  secondaryBadge
}) => {
  const colorStyles = {
    amber: 'border-amber-400/80 bg-gradient-to-b from-[#fffefc] to-[#fbf7ed] dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100',
    red: 'border-red-400/80 bg-gradient-to-b from-[#fffbfc] to-[#fef2f2] dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100',
    blue: 'border-blue-400/80 bg-gradient-to-b from-[#fbfcff] to-[#eff6ff] dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100',
    stone: 'border-stone-400/80 bg-gradient-to-b from-[#fcfcfb] to-[#f5f5f4] dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100',
    purple: 'border-purple-400/80 bg-gradient-to-b from-[#faf5ff] to-[#f3e8ff] dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-stone-100'
  };

  const headerColors = {
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
    red: 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-300',
    blue: 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
    stone: 'bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200',
    purple: 'bg-purple-100 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300'
  };

  return (
    <div
      onClick={onSelect}
      className={`w-64 rounded-lg shadow-lg border-2 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
        colorStyles[themeColor]
      } ${isSelected ? 'ring-2 ring-amber-500 scale-105 shadow-2xl' : ''}`}
    >
      {/* Node Header Badge */}
      <div className={`px-3 py-1.5 text-[11px] font-medium flex items-center justify-between rounded-t-md ${headerColors[themeColor]}`}>
        <span className="truncate">{badge}</span>
        {secondaryBadge && (
          <span className="text-[10px] opacity-80 shrink-0 ml-1">
            {secondaryBadge}
          </span>
        )}
      </div>

      <div className="p-3.5 space-y-2">
        {/* Name and Hebrew Script */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-cinzel text-lg font-bold tracking-wide">
              {person.name}
            </h3>
            <p className="text-xs font-serif text-stone-500 italic mt-0.5">
              „{person.hebrewMeaning}”
            </p>
          </div>
          <span className="font-serif text-base font-semibold text-amber-800 dark:text-amber-400" dir="rtl">
            {person.hebrewName}
          </span>
        </div>

        {/* Lifespan & Chronological details */}
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-200/80 dark:border-stone-800">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          {person.lifespanYears ? (
            <span>Vârstă: {person.lifespanYears} ani</span>
          ) : (
            <span>Consemnat în Geneza</span>
          )}
          {person.deathYearAM && (
            <span className="text-[11px] font-mono text-stone-500">
              (AM {person.deathYearAM})
            </span>
          )}
        </div>

        {/* Sources Count & Quick action */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-stone-400" />
            <span>{person.sources.length} surse biblice</span>
          </span>
          <span className="text-amber-700 dark:text-amber-400 font-semibold hover:underline">
            Atinge pt. detalii →
          </span>
        </div>
      </div>
    </div>
  );
};
