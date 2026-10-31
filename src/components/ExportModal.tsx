import React, { useState } from 'react';
import { Person } from '../types/genealogy';
import {
  X,
  Printer,
  FileImage,
  FileText,
  Download,
  Check,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  people
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export as High-Resolution PNG
  const handleExportPNG = () => {
    const svgElement = document.getElementById('genealogy-tree-svg');
    if (!svgElement) {
      alert('Te rugăm să navighezi în ecranul Arbore Genealogic pentru exportul imaginii grafice.');
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1800;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f7f4ee';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header on canvas
        ctx.fillStyle = '#1c1917';
        ctx.font = 'bold 36px "Cinzel", Georgia, serif';
        ctx.fillText('HUMAN KIN - ARBORELE GENEALOGIC PRIMORDIAL', 60, 70);

        ctx.font = 'italic 18px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#78350f';
        ctx.fillText('De la Adam și Eva la patriarhii biblici · Geneza 1-5', 60, 105);

        ctx.drawImage(image, 50, 130, 1700, 1000);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'Human_Kin_Arbore_Genealogic.png';
        downloadLink.href = pngUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setDownloadSuccess('Imaginea PNG de înaltă rezoluție a fost descărcată!');
        setTimeout(() => setDownloadSuccess(null), 3000);
      }
    };
    image.src = blobURL;
  };

  // 2. Export as SVG Vector
  const handleExportSVG = () => {
    const svgElement = document.getElementById('genealogy-tree-svg');
    if (!svgElement) {
      alert('Te rugăm să navighezi în ecranul Arbore Genealogic pentru exportul SVG.');
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.download = 'Human_Kin_Arbore_Vectorial.svg';
    downloadLink.href = blobURL;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setDownloadSuccess('Fișierul vectorial SVG a fost descărcat!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // 3. Print / PDF Export
  const handlePrintPDF = () => {
    window.print();
  };

  // 4. Download Text / Markdown Dossier
  const handleExportDossier = () => {
    let content = `# HUMAN KIN - DOSARUL GENEALOGIC AL OMENIRII\n\n`;
    content += `Data arhivării: ${new Date().toLocaleDateString('ro-RO')}\n`;
    content += `Persoane consemnate: ${people.length}\n`;
    content += `Bază canonică: Textul Masoretic și Septuaginta (Cartea Genezei)\n\n`;
    content += `------------------------------------------------------------\n\n`;

    people.forEach((person) => {
      content += `## ${person.chronologicalOrder}. ${person.name} (${person.hebrewName})\n`;
      content += `- Semnificație ebraică: ${person.hebrewMeaning}\n`;
      content += `- Generație: ${person.generation} | Linia: ${person.lineage}\n`;
      if (person.lifespanYears) {
        content += `- Durată viață: ${person.lifespanYears} ani (AM ${person.birthYearAM ?? 0} - AM ${person.deathYearAM ?? person.lifespanYears})\n`;
      }
      content += `- Rezumat: ${person.summary}\n`;
      content += `- Surse canonice: ${person.sources.map((s) => `${s.book} ${s.chapterVerses}`).join('; ')}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Human_Kin_Cronologie_Biblica.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess('Dosarul documentar Markdown a fost descărcat!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#fbf9f5] dark:bg-[#141210] rounded-xl shadow-2xl border border-stone-300 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest font-sans text-stone-500">
              Export Arhivistic & Standarde Digitale
            </span>
            <h3 className="font-cinzel text-xl font-bold mt-0.5">
              Exportă Arborele Genealogic „Human Kin”
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
            Alege formatul dorit pentru exportul arborelui genealogic și al cronologiei patriarhale de la Adam, Eva, Cain, Abel și Set.
          </p>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. PDF / Print */}
            <button
              onClick={handlePrintPDF}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-700 text-left transition-all hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5 text-amber-800 dark:text-amber-400 font-semibold text-sm">
                <Printer className="w-4 h-4" />
                <span>Document PDF / Tipar</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Generează un document gata de tipar sau export ca PDF (A4/A3) cu tabelul complet al patriarhilor.
              </p>
            </button>

            {/* 2. PNG High-Res */}
            <button
              onClick={handleExportPNG}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-emerald-700 text-left transition-all hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5 text-emerald-800 dark:text-emerald-400 font-semibold text-sm">
                <FileImage className="w-4 h-4" />
                <span>Imagine PNG (1800×1200)</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Imagine rasterizată de înaltă definiție cu grafica arborelui și legăturile genealogice.
              </p>
            </button>

            {/* 3. SVG Vector */}
            <button
              onClick={handleExportSVG}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-blue-700 text-left transition-all hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5 text-blue-800 dark:text-blue-400 font-semibold text-sm">
                <Download className="w-4 h-4" />
                <span>Vectorial SVG Scalabil</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Format vectorial fără pierderi de calitate, editabil în Illustrator sau vizualizatoare grafice.
              </p>
            </button>

            {/* 4. Markdown Dossier */}
            <button
              onClick={handleExportDossier}
              className="p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-purple-700 text-left transition-all hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5 text-purple-800 dark:text-purple-400 font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>Dosar Documentar (.MD)</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Text complet structurat cu versete biblice, semnificații ebraice și date biografice.
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};
