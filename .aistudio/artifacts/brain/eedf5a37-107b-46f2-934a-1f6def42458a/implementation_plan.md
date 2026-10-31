# Human Kin - Actualizare Hartă Satelitară & Încadrare Viewport

Integrarea hărții de utilizator (`world.200408.3x21600x10800_926be725.jpg`), adăugarea butonului de restrângere a meniului contextual într-o iconiță plutitoare și optimizarea încadrării la ecran complet 100% fără scroll exterior.

## User Review & Critical Decisions

> [!IMPORTANT]
> Deciziile confirmate în urma consultării:
> - **Harta principală**: Se activează ca fundal implicit harta satelitară a utilizatorului (`/assets/aistudio/world.200408.3x21600x10800_926be725.jpg`), cu opțiune rapidă de comutare la harta antică pergament.
> - **Meniul contextual de pe hartă**: Se adaugă un buton dedicat de restrângere/închidere într-o iconiță compactă plutitoare (cu tooltip și indicator de stare activă), eliberând complet vizibilitatea hărții.
> - **Încadrare în pagină**: Ecran complet 100% fără scroll exterior (`h-[calc(100vh-4rem)]`, `overflow-hidden`), centrat inițial pe regiunea biblică a Mesopotamiei/Edenului cu zoom optim.

---

### 1. Overview & Core Concept

- **Harta Satelitară Reală**: Fundal cartografic global satelitar de înaltă fidelitate furnizat de utilizator, peste care sunt ancorate cu precizie geografică teritoriile primordiale (Eden, Nod, Mesopotamia, Ararat, Havila), rutele migrațiilor și așezările urbane.
- **Interfață Degajată (Zero Clutter)**: Utilizatorul poate plia meniul contextual printr-un click pe butonul de închidere/restrângere. Când este restrâns, meniul se transformă într-un buton elegant plutitor `[Filtre & Perioade]`, lăsând întregul ecran deschis explorării cartografice.
- **Încadrare Perfectă în Viewport**: Eliminarea oricăror bare de derulare parazite pe axele X/Y la nivelul hărții și al header-ului, cu container flexibil calibrat pe înălțimea vizibilă (`100dvh`).

---

### 2. User Experience & Visual Design

#### Fluxul Utilizatorului pe Hartă
```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Human Kin | Hartă Istorică | Arbore | Cronologie | Setări     │
├────────────────────────────────────────────────────────────────────────┤
│ [Iconiță Meniu: Filtre (3)] ──> [Deschide / Restrânge panou plutitor]   │
│                                                                        │
│                HARTĂ SATELITARĂ / ECRAN COMPLET 100%                    │
│                                                                        │
│          ▲ Ararat (39.7°N, 44.3°E)                                     │
│               │                                                        │
│               ▼ Câmpia Șinear (Tigru & Eufrat)                         │
│               ├───► [Săgeată Migrație Cain] ───► Cetatea Enoh / Nod   │
│               │                                                        │
│           ★ Grădina Edenului (Confluență primordială)                 │
│                                                                        │
│ [Zoom +, -, Reset]              [Card Detaliu Punct: Cetatea Enoh (X)] │
└────────────────────────────────────────────────────────────────────────┘
```

- **Stil Vizual & Paletă**:
  - Harta satelitară a lumii prezintă tonuri naturale topografice (albastru marin profund, relief verde-auriu).
  - Punctele distincte, hașurile și săgețile de migrație utilizează culori de contrast înalt (auriu chihlimbar, rubiniu și albastru cobalt) cu umbre fine pentru lizibilitate maximă pe orice relief.
  - Butonul de restrângere a meniului: iconiță stilizată cu chevron și filtru, având stare activă/inactivă clar semnalizată.
- **Comutator de Fundal**:
  - Un comutator subtil în panoul de control: `Fundal: Satelit Real (Utilizator) | Pergament Istoric`.

---

### 3. Key Technical Decisions & Architecture

#### Coordonate Geografice Calibrate pe Harta Lumii (Equirectangular 2:1)
Pe harta lumii standard (format 2:1):
- $X\% = \frac{\text{Longitudine} + 180}{360} \times 100$
- $Y\% = \frac{90 - \text{Latitudine}}{180} \times 100$

| Repere Biblice | Coordonate Reale | Poziție $X\%$ | Poziție $Y\%$ |
| :--- | :--- | :--- | :--- |
| **Grădina Edenului** (Confluență Shatt al-Arab) | 31.0°N, 47.4°E | 63.17% | 32.78% |
| **Ținutul Nod** (Podișul Zagros oriental) | 33.5°N, 50.5°E | 64.03% | 31.39% |
| **Cetatea Enoh** (Prima așezare) | 34.0°N, 49.8°E | 63.83% | 31.11% |
| **Câmpia Șinear / Babilonia** | 32.5°N, 44.4°E | 62.33% | 31.94% |
| **Munții Ararat** | 39.7°N, 44.3°E | 62.30% | 27.94% |
| **Hebron (Peștera Macpela)** | 31.5°N, 35.1°E | 59.75% | 32.50% |
| **Țara Havila** (Bazinul Arab) | 26.5°N, 45.0°E | 62.50% | 35.28% |

#### Centrare Inițială Automată
La deschiderea hărții satelitare, camera este automată centrată pe Orientul Apropiat ($X \approx 63\%$, $Y \approx 32\%$) cu un factor de zoom inițial de `2.4x`, astfel încât utilizatorul vede imediat regiunea biblică detaliată, putând micșora pentru a vedea întreaga planetă.

---

### 4. Component Structure & Changes

```
src/
├── components/
│   ├── HistoricalMap.tsx     # Integrare fundal /assets/aistudio/world..., toggle restrângere meniu, încadrare 100%
│   ├── Header.tsx            # Păstrare contract 3 zone, încadrare compactă fără overflow
│   ├── GenealogyTree.tsx     # Arbore genealogic cu export PNG/PDF
│   ├── BiblicalPeopleList.tsx# Catalog cronologic al patriarhilor
│   └── SettingsScreen.tsx    # Setări de cronologie și gestionare arhivă
└── data/
    └── biblicalData.ts       # Coordonate universale calibrate pe ambele hărți
```
