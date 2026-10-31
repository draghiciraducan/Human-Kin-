export type Gender = 'male' | 'female';

export interface SourceCitation {
  book: string;
  chapterVerses: string;
  textSnippet: string;
  tradition: 'Masoretic' | 'Septuagint' | 'Jubilees' | 'Josephus' | 'Tradition';
}

export interface Person {
  id: string;
  name: string;
  hebrewName: string;
  hebrewMeaning: string;
  gender: Gender;
  generation: number;
  chronologicalOrder: number;
  parents: string[]; // Person IDs
  spouses?: string[]; // Person IDs or names
  children: string[]; // Person IDs
  lifespanYears?: number;
  birthYearAM?: number; // Anno Mundi
  deathYearAM?: number;
  primaryLocationId?: string;
  summary: string;
  biography: string[];
  keyEvents: {
    event: string;
    reference: string;
    yearAM?: number;
  }[];
  sources: SourceCitation[];
  lineage: 'Adamic' | 'Cainite' | 'Sethite';
  occupation?: string;
}

export interface MapLocation {
  id: string;
  name: string;
  biblicalName: string;
  hebrewName?: string;
  type: 'garden' | 'city' | 'region' | 'mountain' | 'river';
  coordinates: { x: number; y: number }; // parchment map coordinates (0-100)
  satelliteCoordinates: { x: number; y: number }; // world satellite map coordinates (0-100)
  regionalCoordinates: { x: number; y: number }; // 1km/pixel HD Near East regional map coordinates (0-100)
  associatedPersonIds: string[];
  period: string;
  description: string;
  biblicalReference: string;
  significance: string;
  archaeologicalNotes?: string;
}

export interface MigrationPath {
  id: string;
  title: string;
  personId: string;
  startLocationId: string;
  endLocationId: string;
  startCoord: { x: number; y: number };
  endCoord: { x: number; y: number };
  controlPoint?: { x: number; y: number };
  satelliteStartCoord: { x: number; y: number };
  satelliteEndCoord: { x: number; y: number };
  satelliteControlPoint?: { x: number; y: number };
  regionalStartCoord: { x: number; y: number };
  regionalEndCoord: { x: number; y: number };
  regionalControlPoint?: { x: number; y: number };
  period: string;
  biblicalReference: string;
  description: string;
  color: string;
}

export interface TerritoryArea {
  id: string;
  name: string;
  biblicalName: string;
  period: string;
  path: string; // SVG path data for parchment map (1000x562.5 space)
  satellitePath: string; // SVG path data for world satellite map (2000x1000 space)
  regionalPath: string; // SVG path data for regional 1km map (3000x2000 space)
  hatchPattern: 'diagonal' | 'dots' | 'cross' | 'waves';
  color: string;
  description: string;
  biblicalReference: string;
}

export type ActiveScreen = 'map' | 'tree' | 'people' | 'settings';
