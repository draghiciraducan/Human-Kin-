import React, { useState } from 'react';
import { Person, Gender } from '../types/genealogy';
import {
  Sliders,
  UserPlus,
  BookMarked,
  RotateCcw,
  Download,
  Upload,
  Moon,
  Sun,
  Check,
  Info,
  Calendar,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface SettingsScreenProps {
  people: Person[];
  onAddPerson: (person: Person) => void;
  onResetToDefaults: () => void;
  onExportJSON: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  chronologyStandard: 'masoretic' | 'septuagint';
  onChangeChronology: (standard: 'masoretic' | 'septuagint') => void;
  datingFormat: 'am' | 'bce' | 'both';
  onChangeDatingFormat: (format: 'am' | 'bce' | 'both') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  people,
  onAddPerson,
  onResetToDefaults,
  onExportJSON,
  isDarkMode,
  onToggleDarkMode,
  chronologyStandard,
  onChangeChronology,
  datingFormat,
  onChangeDatingFormat
}) => {
  // Add person form state
  const [formName, setFormName] = useState('');
  const [formHebrewName, setFormHebrewName] = useState('');
  const [formHebrewMeaning, setFormHebrewMeaning] = useState('');
  const [formGender, setFormGender] = useState<Gender>('male');
  const [formGeneration, setFormGeneration] = useState(3);
  const [formParentId, setFormParentId] = useState('set');
  const [formLifespan, setFormLifespan] = useState('905');
  const [formBirthAM, setFormBirthAM] = useState('235');
  const [formSummary, setFormSummary] = useState('');
  const [formSourceBook, setFormSourceBook] = useState('Geneza');
  const [formSourceVerses, setFormSourceVerses] = useState('5:6-11');
  const [formSourceSnippet, setFormSourceSnippet] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newPersonId = formName.toLowerCase().trim().replace(/\s+/g, '_');
    const newPerson: Person = {
      id: newPersonId,
      name: formName.trim(),
      hebrewName: formHebrewName.trim() || formName.trim(),
      hebrewMeaning: formHebrewMeaning.trim() || 'Semnificație consemnată',
      gender: formGender,
      generation: Number(formGeneration) || 3,
      chronologicalOrder: people.length + 1,
      parents: formParentId ? [formParentId] : [],
      children: [],
      lifespanYears: formLifespan ? Number(formLifespan) : undefined,
      birthYearAM: formBirthAM ? Number(formBirthAM) : undefined,
      lineage: formParentId === 'cain' ? 'Cainite' : 'Sethite',
      summary:
        formSummary.trim() ||
        `${formName.trim()} a fost consemnat în succesiunea generațiilor patriarhale.`,
      biography: [
        `Născut din linia patriarhală a lui ${people.find((p) => p.id === formParentId)?.name || 'înaintașilor'}.`,
        `A trăit ${formLifespan || 'mulți'} ani conform consemnării scripturistice.`
      ],
      keyEvents: [
        {
          event: `Consemnarea nașterii lui ${formName.trim()}`,
          reference: `${formSourceBook} ${formSourceVerses}`
        }
      ],
      sources: [
        {
          book: formSourceBook || 'Geneza',
          chapterVerses: formSourceVerses || '5:6',
          textSnippet:
            formSourceSnippet.trim() ||
            `Și a trăit și a născut fii și fiice conform textului canonic.`,
          tradition: 'Masoretic'
        }
      ]
    };

    onAddPerson(newPerson);
    setFormSuccessMessage(`Personajul „${formName}” a fost adăugat cu succes în arborele genealogic!`);
    
    // Reset form fields
    setFormName('');
    setFormHebrewName('');
    setFormHebrewMeaning('');
    setFormSummary('');
    setFormSourceSnippet('');

    setTimeout(() => {
      setFormSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] dark:bg-[#0c0a09] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="border-b border-stone-300 dark:border-stone-800 pb-4">
          <span className="text-xs uppercase tracking-widest font-sans text-stone-500">
            Configurare & Personalizare
          </span>
          <h1 className="font-cinzel text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Setările Aplicației Human Kin
          </h1>
          <p className="font-cormorant text-lg text-stone-600 dark:text-stone-400 italic mt-0.5">
            Ajustează parametrii cronologici biblici, extinde arborele cu noi personaje și gestionează arhiva de date.
          </p>
        </div>

        {/* SECTION 1: Chronological & Dating Standards */}
        <div className="bg-white dark:bg-[#141210] p-6 rounded-lg border border-stone-300/80 dark:border-stone-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <Sliders className="w-5 h-5 text-amber-700" />
            <h2 className="font-cinzel text-lg font-bold">
              Standarde Cronologice & Datare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Text Standard */}
            <div className="space-y-2">
              <label className="block font-medium text-stone-700 dark:text-stone-300 text-xs uppercase tracking-wider">
                Tradiție Textuală Biblică
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 cursor-pointer">
                  <input
                    type="radio"
                    name="chronology"
                    value="masoretic"
                    checked={chronologyStandard === 'masoretic'}
                    onChange={() => onChangeChronology('masoretic')}
                    className="mt-1 text-amber-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold block text-stone-900 dark:text-stone-100">
                      Textul Masoretic (MT)
                    </span>
                    <span className="text-xs text-stone-500 leading-normal block mt-0.5">
                      Cronologia clasică iudaică și protestantă (Ussher): 1.656 de ani de la Adam la Potop.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 cursor-pointer">
                  <input
                    type="radio"
                    name="chronology"
                    value="septuagint"
                    checked={chronologyStandard === 'septuagint'}
                    onChange={() => onChangeChronology('septuagint')}
                    className="mt-1 text-amber-700 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-semibold block text-stone-900 dark:text-stone-100">
                      Septuaginta (LXX)
                    </span>
                    <span className="text-xs text-stone-500 leading-normal block mt-0.5">
                      Cronologia creștină timpurie și a Bisericii Răsăritene: adaugă 100 de ani la vârstele patriarhilor la nașterea primilor fii (~2.242 ani până la Potop).
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dating display */}
            <div className="space-y-2">
              <label className="block font-medium text-stone-700 dark:text-stone-300 text-xs uppercase tracking-wider">
                Sistemul de Afișare a Anilor
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onChangeDatingFormat('am')}
                  className={`w-full text-left p-2.5 rounded-md border transition-colors ${
                    datingFormat === 'am'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 font-medium'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900'
                  }`}
                >
                  <span className="block text-stone-900 dark:text-stone-100">Anno Mundi (AM)</span>
                  <span className="text-xs text-stone-500">De la Facerea Lumii (ex: Adam născut în AM 0, moarte AM 930)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChangeDatingFormat('both')}
                  className={`w-full text-left p-2.5 rounded-md border transition-colors ${
                    datingFormat === 'both'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 font-medium'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900'
                  }`}
                >
                  <span className="block text-stone-900 dark:text-stone-100">AM + Înainte de Hristos (î.Hr. / BCE)</span>
                  <span className="text-xs text-stone-500">Format hibrid arhivistic cu echivalent istoric</span>
                </button>
              </div>

              {/* Dark mode switch */}
              <div className="pt-3">
                <label className="block font-medium text-stone-700 dark:text-stone-300 text-xs uppercase tracking-wider mb-1.5">
                  Temă Vizuală
                </label>
                <button
                  onClick={onToggleDarkMode}
                  className="flex items-center justify-between w-full p-2.5 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-100"
                >
                  <span className="flex items-center gap-2">
                    {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-700" />}
                    <span>{isDarkMode ? 'Mod Întunecat (Nocturn)' : 'Mod Papiros Clasic (Luminos)'}</span>
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800">
                    Schimbă
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Add New Person to Family Tree (Scopul: de la Adam până astăzi) */}
        <div className="bg-white dark:bg-[#141210] p-6 rounded-lg border border-stone-300/80 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
              <UserPlus className="w-5 h-5 text-amber-700" />
              <h2 className="font-cinzel text-lg font-bold">
                Adaugă Oameni Noi în Arborele Genealogic
              </h2>
            </div>
            <span className="text-xs text-stone-500">
              Extinde genealogia spre Noe, Avraam și astăzi
            </span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif">
            Pentru a construi lanțul complet al omenirii de la Adam și până astăzi, completează datele unui nou personaj biblic sau descendent.
          </p>

          {formSuccessMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Nume Personaj *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Enos, Noe, Irad, Mahalaleel"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Nume în Ebraică
                </label>
                <input
                  type="text"
                  placeholder="ex: אֱנוֹשׁ"
                  value={formHebrewName}
                  onChange={(e) => setFormHebrewName(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600 font-serif"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Semnificație Nume
                </label>
                <input
                  type="text"
                  placeholder="ex: Muritor, om slab"
                  value={formHebrewMeaning}
                  onChange={(e) => setFormHebrewMeaning(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Părinte Direct
                </label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.lineage})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Gen
                </label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as Gender)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                >
                  <option value="male">Bărbat</option>
                  <option value="female">Femeie</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Vârstă / Ani Trăiți
                </label>
                <input
                  type="number"
                  placeholder="ex: 905"
                  value={formLifespan}
                  onChange={(e) => setFormLifespan(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Generație
                </label>
                <input
                  type="number"
                  value={formGeneration}
                  onChange={(e) => setFormGeneration(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>
            </div>

            {/* Scripture source inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Referință Biblică (Carte și Verset)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formSourceBook}
                    onChange={(e) => setFormSourceBook(e.target.value)}
                    className="w-1/3 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                  />
                  <input
                    type="text"
                    placeholder="ex: 5:6-11"
                    value={formSourceVerses}
                    onChange={(e) => setFormSourceVerses(e.target.value)}
                    className="w-2/3 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Citat din Textul Biblic
                </label>
                <input
                  type="text"
                  placeholder="Textul versetului relevant..."
                  value={formSourceSnippet}
                  onChange={(e) => setFormSourceSnippet(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-400 dark:text-stone-900 text-white font-medium rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Adaugă în Arbore & Cronologie</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 3: Archive & Data Management */}
        <div className="bg-white dark:bg-[#141210] p-6 rounded-lg border border-stone-300/80 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <BookMarked className="w-5 h-5 text-amber-700" />
            <h2 className="font-cinzel text-lg font-bold">
              Gestiune Arhivă & Date
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2">
            <div className="space-y-1">
              <p className="font-medium text-stone-800 dark:text-stone-200">
                În prezent sunt înregistrate {people.length} persoane în baza de date.
              </p>
              <p className="text-stone-500">
                Poți exporta întregul arbore genealogic ca JSON sau poți reveni la cei 5 patriarhi inițiali (Adam, Eva, Cain, Abel, Set).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded border border-stone-300 dark:border-stone-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportă JSON</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Sigur dorești să resetezi datele la cei 5 patriarhi inițiali: Adam, Eva, Cain, Abel și Set?')) {
                    onResetToDefaults();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-900 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetează la Adam, Eva, Cain, Abel, Set</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: About Human Kin & Vision */}
        <div className="p-6 bg-stone-100 dark:bg-stone-900/60 rounded-lg border border-stone-300 dark:border-stone-800 text-xs space-y-2 text-stone-600 dark:text-stone-400 font-serif">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-cinzel font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Despre Inițiativa „Human Kin”</span>
          </div>
          <p className="leading-relaxed">
            Human Kin este o platformă cartografică și genealogică dedicată reconstituirii arborelui neamului omenesc, începând cu relatările primordiale din cartea Genezei (Adam și Eva în Grădina Edenului, fiii lor Cain, Abel și Set) și urmărind marile migrații, fondarea primelor așezări urbane (cetatea Enoh din Ținutul Nod) și ramificațiile generațiilor umane.
          </p>
          <p className="italic text-[11px] text-stone-500">
            Surse de referință: Textul Masoretic ebraic (Biblia Ebraică / Tanakh), Septuaginta (LXX), Iosif Flaviu („Antichități Iudaice”), Cartea Jubileelor și cronologiile istorice clasice.
          </p>
        </div>

      </div>
    </div>
  );
};
