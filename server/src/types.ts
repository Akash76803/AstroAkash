export type SupportedLanguage = "hi" | "en" | "hinglish" | "mr";

export interface LocationInput {
  name?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
}

export interface BirthInput {
  name?: string;
  date: string;
  time: string;
  location: LocationInput;
}

export interface PlanetPosition {
  planet: string;
  longitude: number;
  sign: string;
  degree?: number;
  house: number;
  nakshatra?: string;
  pada?: number;
  isRetrograde?: boolean;
  nodeType?: "Rahu" | "Ketu";
}

export interface ChartSnapshot {
  lagna: string;
  ascendantLongitude?: number;
  houses: Array<{ house: number; sign: string; cuspLongitude: number }>;
  planets?: PlanetPosition[];
  planetaryPositions: PlanetPosition[];
  nakshatras?: Array<{
    planet: string;
    nakshatra: string;
    pada: number;
  }>;
  zodiacPlacements: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
  };
  panchang?: {
    tithi?: string;
    nakshatra?: string;
    yoga?: string;
    karana?: string;
    message?: string;
  };
  dasha?:
    | Array<{ planet: string; startDate?: string; endDate?: string }>
    | {
        currentMahadasha: string;
        moonNakshatra: string;
      };
}

export interface SectionContent {
  title: string;
  body: string;
}

export interface DetailedReportData {
  summary: string;
  relationship: string;
  marriage: string;
  emotional: string;
  career: string;
  family: string;
  health: string;
  planetary: string;
  timing: string;
  dosha: string;
  remedies: string;
  sections: SectionContent[];
  chart?: ChartSnapshot;
}

export interface PermissionResponse {
  permission_required: boolean;
  message: string;
  language: SupportedLanguage;
  data: {
    summary: string;
    relationship?: string;
    career?: string;
    dosha?: string;
    remedies?: string;
    sections?: SectionContent[];
  };
}

export interface CompatibilitySnapshot {
  score: number;
  maxScore: number;
  strengthLevel: "Strong" | "Moderate" | "Needs Attention";
  partnerA: ChartSnapshot;
  partnerB: ChartSnapshot;
  gunaMilan: Array<{
    name: string;
    maxScore: number;
    obtainedScore: number;
    description: string;
  }>;
}
