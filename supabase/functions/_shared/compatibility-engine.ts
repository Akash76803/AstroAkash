import { calculateAstrologyData, type AstrologyResult, type LocationInput, type PlanetPosition } from "./astrology-engine.ts";

interface PartnerBirthData {
  name?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: LocationInput;
  date?: string;
  time?: string;
  location?: LocationInput;
}

interface GunaScore {
  name: string;
  maxScore: number;
  obtainedScore: number;
  description: string;
}

interface AnalysisSection {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
}

interface PartnerOverview {
  name: string;
  moonSign: string;
  ascendant: string;
  venusSign: string;
  marsHouse: number;
  currentDasha: string;
}

export interface CompatibilityReport {
  score: number;
  max_score: number;
  strength_level: "Strong" | "Moderate" | "Needs Attention";
  analysis: string;
  guna_milan: GunaScore[];
  sections: AnalysisSection[];
  partner_overview: {
    partnerA: PartnerOverview;
    partnerB: PartnerOverview;
  };
}

interface GeocodingApiResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    timezone: string;
    country?: string;
    admin1?: string;
  }>;
  error?: boolean;
  reason?: string;
}

type GanaType = "Deva" | "Manushya" | "Rakshasa";
type NadiType = "Adi" | "Madhya" | "Antya";
type VashyaType = "Chatushpada" | "Dwipada" | "Jalachara" | "Vanachara" | "Keeta";
type YoniType =
  | "Horse"
  | "Elephant"
  | "Sheep"
  | "Serpent"
  | "Dog"
  | "Cat"
  | "Rat"
  | "Cow"
  | "Buffalo"
  | "Tiger"
  | "Hare"
  | "Monkey"
  | "Mongoose"
  | "Lion";

const PLANETARY_RULERS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const NATURAL_FRIENDSHIPS: Record<string, { friends: string[]; neutral: string[]; enemies: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], neutral: ["Mercury"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], neutral: ["Mars", "Jupiter", "Venus", "Saturn"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], neutral: ["Venus", "Saturn"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], neutral: ["Mars", "Jupiter", "Saturn"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutral: ["Saturn"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], neutral: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], neutral: ["Jupiter"], enemies: ["Sun", "Moon", "Mars"] },
};

const VARNA_RANK: Record<string, number> = {
  Cancer: 4,
  Scorpio: 4,
  Pisces: 4,
  Aries: 3,
  Leo: 3,
  Sagittarius: 3,
  Taurus: 2,
  Virgo: 2,
  Capricorn: 2,
  Gemini: 1,
  Libra: 1,
  Aquarius: 1,
};

const NAKSHATRA_META: Array<{ gana: GanaType; nadi: NadiType; yoni: YoniType }> = [
  { gana: "Deva", nadi: "Adi", yoni: "Horse" },       // Ashwini
  { gana: "Manushya", nadi: "Madhya", yoni: "Elephant" }, // Bharani
  { gana: "Rakshasa", nadi: "Antya", yoni: "Sheep" }, // Krittika
  { gana: "Manushya", nadi: "Antya", yoni: "Serpent" }, // Rohini
  { gana: "Deva", nadi: "Madhya", yoni: "Serpent" },  // Mrigashira
  { gana: "Manushya", nadi: "Adi", yoni: "Dog" },     // Ardra
  { gana: "Deva", nadi: "Adi", yoni: "Cat" },         // Punarvasu
  { gana: "Deva", nadi: "Madhya", yoni: "Sheep" },    // Pushya
  { gana: "Rakshasa", nadi: "Antya", yoni: "Cat" },   // Ashlesha
  { gana: "Rakshasa", nadi: "Antya", yoni: "Rat" },   // Magha
  { gana: "Manushya", nadi: "Madhya", yoni: "Rat" },  // Purva Phalguni
  { gana: "Manushya", nadi: "Adi", yoni: "Cow" },     // Uttara Phalguni
  { gana: "Deva", nadi: "Adi", yoni: "Buffalo" },     // Hasta
  { gana: "Rakshasa", nadi: "Madhya", yoni: "Tiger" },// Chitra
  { gana: "Deva", nadi: "Antya", yoni: "Buffalo" },   // Swati
  { gana: "Rakshasa", nadi: "Antya", yoni: "Tiger" }, // Vishakha
  { gana: "Deva", nadi: "Madhya", yoni: "Hare" },     // Anuradha
  { gana: "Rakshasa", nadi: "Adi", yoni: "Hare" },    // Jyeshtha
  { gana: "Rakshasa", nadi: "Adi", yoni: "Dog" },     // Mula
  { gana: "Manushya", nadi: "Madhya", yoni: "Monkey" }, // Purva Ashadha
  { gana: "Manushya", nadi: "Antya", yoni: "Mongoose" }, // Uttara Ashadha
  { gana: "Deva", nadi: "Antya", yoni: "Monkey" },    // Shravana
  { gana: "Rakshasa", nadi: "Madhya", yoni: "Lion" }, // Dhanishta
  { gana: "Rakshasa", nadi: "Adi", yoni: "Horse" },   // Shatabhisha
  { gana: "Manushya", nadi: "Adi", yoni: "Lion" },    // Purva Bhadrapada
  { gana: "Manushya", nadi: "Madhya", yoni: "Cow" },  // Uttara Bhadrapada
  { gana: "Deva", nadi: "Antya", yoni: "Elephant" },  // Revati
];

const YONI_RELATIONS: Partial<Record<YoniType, { friends?: YoniType[]; enemies?: YoniType[] }>> = {
  Horse: { friends: ["Elephant"], enemies: ["Buffalo"] },
  Elephant: { friends: ["Horse", "Cow"], enemies: ["Lion"] },
  Sheep: { friends: ["Cow"], enemies: ["Monkey"] },
  Serpent: { friends: ["Cat"], enemies: ["Mongoose"] },
  Dog: { friends: ["Monkey"], enemies: ["Hare"] },
  Cat: { friends: ["Serpent"], enemies: ["Rat"] },
  Rat: { friends: ["Buffalo"], enemies: ["Cat", "Serpent"] },
  Cow: { friends: ["Elephant", "Sheep"], enemies: ["Tiger"] },
  Buffalo: { friends: ["Rat"], enemies: ["Horse"] },
  Tiger: { friends: ["Lion"], enemies: ["Cow"] },
  Hare: { friends: ["Mongoose"], enemies: ["Dog"] },
  Monkey: { friends: ["Dog"], enemies: ["Sheep"] },
  Mongoose: { friends: ["Hare"], enemies: ["Serpent"] },
  Lion: { friends: ["Tiger"], enemies: ["Elephant"] },
};

const VASHYA_MATRIX: Record<VashyaType, Record<VashyaType, number>> = {
  Chatushpada: { Chatushpada: 2, Dwipada: 1, Jalachara: 1.5, Vanachara: 1, Keeta: 0.5 },
  Dwipada: { Chatushpada: 1, Dwipada: 2, Jalachara: 1, Vanachara: 1, Keeta: 0 },
  Jalachara: { Chatushpada: 1.5, Dwipada: 1, Jalachara: 2, Vanachara: 0.5, Keeta: 1 },
  Vanachara: { Chatushpada: 1, Dwipada: 1, Jalachara: 0.5, Vanachara: 2, Keeta: 0 },
  Keeta: { Chatushpada: 0.5, Dwipada: 0, Jalachara: 1, Vanachara: 0, Keeta: 2 },
};

const GANA_MATRIX: Record<GanaType, Record<GanaType, number>> = {
  Deva: { Deva: 6, Manushya: 5, Rakshasa: 1 },
  Manushya: { Deva: 5, Manushya: 6, Rakshasa: 0 },
  Rakshasa: { Deva: 1, Manushya: 0, Rakshasa: 6 },
};

function getPlanet(chart: AstrologyResult, planetName: string): PlanetPosition {
  const planet = chart.planetary_positions.find((entry) => entry.planet === planetName);
  if (!planet) {
    throw new Error(`Missing ${planetName} in calculated chart.`);
  }
  return planet;
}

function normalizePartnerInput(partner: PartnerBirthData) {
  const date = partner.dateOfBirth ?? partner.date;
  const time = partner.timeOfBirth ?? partner.time;
  const location = partner.placeOfBirth ?? partner.location;

  if (!date || !time || !location) {
    throw new Error("Each partner must include date, time, and place of birth.");
  }

  return {
    name: partner.name?.trim() || "Partner",
    date,
    time,
    location,
  };
}

async function geocodeLocationString(query: string): Promise<LocationInput> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Location lookup failed while checking compatibility.");
  }

  const data = (await response.json()) as GeocodingApiResponse;
  if (data.error) {
    throw new Error(data.reason || "Location lookup failed while checking compatibility.");
  }

  const first = data.results?.[0];
  if (!first) {
    throw new Error(`Could not find a matching birthplace for "${query}".`);
  }

  return {
    name: [first.name, first.admin1, first.country].filter(Boolean).join(", "),
    latitude: first.latitude,
    longitude: first.longitude,
    timezone: first.timezone,
    timezoneName: first.timezone,
    elevation: first.elevation ?? 0,
  };
}

async function ensureLocationInput(location: LocationInput): Promise<LocationInput> {
  if (typeof location !== "string") return location;
  return geocodeLocationString(location);
}

function signDistance(a: number, b: number): number {
  return (b - a + 12) % 12;
}

function roundedScore(value: number): number {
  return Math.max(0, Number(value.toFixed(1)));
}

function getCurrentDasha(chart: AstrologyResult): string {
  const now = new Date();
  const current = chart.dasha_periods.find((period) => {
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return now >= start && now <= end;
  });
  return current?.planet ?? chart.dasha_periods[0]?.planet ?? "Unknown";
}

function getNakshatraMeta(moon: PlanetPosition) {
  return NAKSHATRA_META[moon.nakshatraIndex];
}

function getVashyaType(moon: PlanetPosition): VashyaType {
  switch (moon.sign) {
    case "Aries":
    case "Taurus":
      return "Chatushpada";
    case "Gemini":
    case "Virgo":
    case "Libra":
    case "Aquarius":
      return "Dwipada";
    case "Cancer":
    case "Pisces":
      return "Jalachara";
    case "Leo":
      return "Vanachara";
    case "Scorpio":
      return "Keeta";
    case "Sagittarius":
      return moon.degree < 15 ? "Chatushpada" : "Dwipada";
    case "Capricorn":
      return moon.degree < 15 ? "Chatushpada" : "Jalachara";
    default:
      return "Dwipada";
  }
}

function taraValue(fromIndex: number, toIndex: number): number {
  const count = ((toIndex - fromIndex + 27) % 27) + 1;
  const remainder = count % 9;
  return remainder === 0 ? 9 : remainder;
}

function isTaraAuspicious(value: number): boolean {
  return ![3, 5, 7].includes(value);
}

function getPlanetFriendshipScore(planetA: string, planetB: string): number {
  if (planetA === planetB) return 5;

  const a = NATURAL_FRIENDSHIPS[planetA];
  const b = NATURAL_FRIENDSHIPS[planetB];
  const aFriend = a.friends.includes(planetB);
  const bFriend = b.friends.includes(planetA);
  const aEnemy = a.enemies.includes(planetB);
  const bEnemy = b.enemies.includes(planetA);

  if (aFriend && bFriend) return 5;
  if ((aFriend && !bEnemy) || (bFriend && !aEnemy)) return 4;
  if (aEnemy && bEnemy) return 0;
  if (aEnemy || bEnemy) return 1;
  return 3;
}

function getYoniScore(yoniA: YoniType, yoniB: YoniType): number {
  if (yoniA === yoniB) return 4;
  if (YONI_RELATIONS[yoniA]?.enemies?.includes(yoniB) || YONI_RELATIONS[yoniB]?.enemies?.includes(yoniA)) return 0;
  if (YONI_RELATIONS[yoniA]?.friends?.includes(yoniB) || YONI_RELATIONS[yoniB]?.friends?.includes(yoniA)) return 3;
  return 2;
}

function scoreVarna(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const moonA = getPlanet(chartA, "Moon");
  const moonB = getPlanet(chartB, "Moon");
  const rankA = VARNA_RANK[moonA.sign];
  const rankB = VARNA_RANK[moonB.sign];

  return {
    name: "Varna",
    maxScore: 1,
    obtainedScore: rankA === rankB ? 1 : Math.abs(rankA - rankB) === 1 ? 0.5 : 0,
    description: "Spiritual outlook and value system alignment",
  };
}

function scoreVashya(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const typeA = getVashyaType(getPlanet(chartA, "Moon"));
  const typeB = getVashyaType(getPlanet(chartB, "Moon"));

  return {
    name: "Vashya",
    maxScore: 2,
    obtainedScore: VASHYA_MATRIX[typeA][typeB],
    description: "Mutual attraction, influence, and adaptability",
  };
}

function scoreTara(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const moonA = getPlanet(chartA, "Moon");
  const moonB = getPlanet(chartB, "Moon");
  const taraAB = isTaraAuspicious(taraValue(moonA.nakshatraIndex, moonB.nakshatraIndex));
  const taraBA = isTaraAuspicious(taraValue(moonB.nakshatraIndex, moonA.nakshatraIndex));

  let score = 0;
  if (taraAB && taraBA) score = 3;
  else if (taraAB || taraBA) score = 1.5;

  return {
    name: "Tara",
    maxScore: 3,
    obtainedScore: score,
    description: "Well-being, destiny support, and rhythm matching",
  };
}

function scoreYoni(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const yoniA = getNakshatraMeta(getPlanet(chartA, "Moon")).yoni;
  const yoniB = getNakshatraMeta(getPlanet(chartB, "Moon")).yoni;

  return {
    name: "Yoni",
    maxScore: 4,
    obtainedScore: getYoniScore(yoniA, yoniB),
    description: "Chemistry, attraction, and intimate comfort",
  };
}

function scoreGrahaMaitri(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const rulerA = PLANETARY_RULERS[getPlanet(chartA, "Moon").sign];
  const rulerB = PLANETARY_RULERS[getPlanet(chartB, "Moon").sign];

  return {
    name: "Graha Maitri",
    maxScore: 5,
    obtainedScore: getPlanetFriendshipScore(rulerA, rulerB),
    description: "Mental compatibility and friendship in marriage",
  };
}

function scoreGana(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const ganaA = getNakshatraMeta(getPlanet(chartA, "Moon")).gana;
  const ganaB = getNakshatraMeta(getPlanet(chartB, "Moon")).gana;

  return {
    name: "Gana",
    maxScore: 6,
    obtainedScore: GANA_MATRIX[ganaA][ganaB],
    description: "Temperament, response style, and ego balance",
  };
}

function scoreBhakoot(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const distance = signDistance(getPlanet(chartA, "Moon").signIndex, getPlanet(chartB, "Moon").signIndex);
  const difficult = [2, 6, 8, 12, 5, 9].includes(distance === 0 ? 12 : distance);

  return {
    name: "Bhakoot",
    maxScore: 7,
    obtainedScore: difficult ? 0 : 7,
    description: "Family harmony, prosperity, and domestic flow",
  };
}

function scoreNadi(chartA: AstrologyResult, chartB: AstrologyResult): GunaScore {
  const nadiA = getNakshatraMeta(getPlanet(chartA, "Moon")).nadi;
  const nadiB = getNakshatraMeta(getPlanet(chartB, "Moon")).nadi;

  return {
    name: "Nadi",
    maxScore: 8,
    obtainedScore: nadiA === nadiB ? 0 : 8,
    description: "Health, vitality, and energetic compatibility",
  };
}

function getStrengthLabel(score: number): CompatibilityReport["strength_level"] {
  if (score >= 28) return "Strong";
  if (score >= 18) return "Moderate";
  return "Needs Attention";
}

function describeStrength(score: number): string {
  if (score >= 28) return "This pairing shows a strong traditional match with multiple supportive marriage indicators.";
  if (score >= 18) return "This pairing has workable marriage potential, with some areas needing maturity and conscious adjustment.";
  return "This pairing needs careful thought and deeper discussion before major commitments, because several classical indicators are weak.";
}

function isManglik(chart: AstrologyResult): boolean {
  const mars = getPlanet(chart, "Mars");
  return [1, 2, 4, 7, 8, 12].includes(mars.house);
}

function hasManglikCancellation(chartA: AstrologyResult, chartB: AstrologyResult): boolean {
  return isManglik(chartA) && isManglik(chartB);
}

function buildOverallSection(score: number, strength: CompatibilityReport["strength_level"], gunas: GunaScore[]): AnalysisSection {
  const strongest = [...gunas].sort((a, b) => (b.obtainedScore / b.maxScore) - (a.obtainedScore / a.maxScore)).slice(0, 2);
  const weakest = [...gunas].sort((a, b) => (a.obtainedScore / a.maxScore) - (b.obtainedScore / b.maxScore)).slice(0, 2);

  return {
    id: "overall-summary",
    title: "Overall Compatibility Summary",
    summary: `The couple scores ${score}/36 in traditional Ashta Koota matching, which places the relationship in the ${strength.toLowerCase()} band.`,
    highlights: [
      describeStrength(score),
      `The strongest areas are ${strongest.map((item) => item.name).join(" and ")}.`,
      `The areas needing more conscious work are ${weakest.map((item) => item.name).join(" and ")}.`,
    ],
  };
}

function buildEmotionalSection(chartA: AstrologyResult, chartB: AstrologyResult): AnalysisSection {
  const moonA = getPlanet(chartA, "Moon");
  const moonB = getPlanet(chartB, "Moon");
  const grahaMaitri = scoreGrahaMaitri(chartA, chartB).obtainedScore;
  const tara = scoreTara(chartA, chartB).obtainedScore;

  return {
    id: "emotional-mental",
    title: "Emotional & Mental Compatibility",
    summary: `Moon signs ${moonA.sign} and ${moonB.sign} show how both partners feel, react, and seek emotional safety in the relationship.`,
    highlights: [
      `Graha Maitri score ${grahaMaitri}/5 reflects the friendship and mental understanding between the Moon sign rulers.`,
      `Tara score ${tara}/3 reflects how smoothly both partners support each other's emotional rhythm and general well-being.`,
      grahaMaitri >= 4
        ? "Mental understanding is one of the supportive strengths of this match."
        : "Communication needs patience, because emotional logic and expectations may differ.",
    ],
  };
}

function buildMarriageSection(chartA: AstrologyResult, chartB: AstrologyResult, bhakoot: GunaScore): AnalysisSection {
  const venusA = getPlanet(chartA, "Venus");
  const venusB = getPlanet(chartB, "Venus");
  const jupiterA = getPlanet(chartA, "Jupiter");
  const jupiterB = getPlanet(chartB, "Jupiter");

  return {
    id: "marriage-stability",
    title: "Marriage & Relationship Stability",
    summary: "The 7th-house tone, Venus, Jupiter, and Bhakoot together help indicate how marriage may settle over time.",
    highlights: [
      `Venus in ${venusA.sign} and ${venusB.sign} shows how both partners express love and relationship expectations.`,
      `Jupiter in houses ${jupiterA.house} and ${jupiterB.house} shows wisdom, support, and long-term growth patterns.`,
      bhakoot.obtainedScore === 7
        ? "Bhakoot is supportive, which is a positive sign for family harmony and continuity."
        : "Bhakoot needs attention, so long-term family and emotional adjustment should be handled carefully.",
    ],
  };
}

function buildManglikSection(chartA: AstrologyResult, chartB: AstrologyResult): AnalysisSection {
  const manglikA = isManglik(chartA);
  const manglikB = isManglik(chartB);
  const cancelled = hasManglikCancellation(chartA, chartB);

  return {
    id: "manglik-dosha",
    title: "Manglik Dosha Analysis",
    summary: manglikA || manglikB
      ? cancelled
        ? "Manglik influence exists in both charts, which traditionally softens the imbalance and reduces mismatch risk."
        : "Manglik influence is present, so the relationship may need extra maturity around anger, impatience, and adjustment."
      : "Manglik influence is not strongly triggered by the primary house rule in this pair.",
    highlights: [
      `Partner A Manglik: ${manglikA ? "Yes" : "No"}.`,
      `Partner B Manglik: ${manglikB ? "Yes" : "No"}.`,
      cancelled
        ? "Classically, similar Mars signatures are considered a balancing factor."
        : "If only one chart is Manglik, wedding timing and emotional maturity become more important.",
    ],
  };
}

function buildPlanetarySection(chartA: AstrologyResult, chartB: AstrologyResult): AnalysisSection {
  const venusA = getPlanet(chartA, "Venus");
  const venusB = getPlanet(chartB, "Venus");
  const marsA = getPlanet(chartA, "Mars");
  const marsB = getPlanet(chartB, "Mars");
  const saturnA = getPlanet(chartA, "Saturn");
  const saturnB = getPlanet(chartB, "Saturn");

  return {
    id: "planetary-influence",
    title: "Planetary Influence",
    summary: "Venus, Mars, Moon, and Saturn are the key relationship planets in this reading.",
    highlights: [
      `Venus signs ${venusA.sign} and ${venusB.sign} shape affection, romance, and relationship style.`,
      `Mars in houses ${marsA.house} and ${marsB.house} shapes passion, conflict response, and assertiveness.`,
      saturnA.isRetrograde || saturnB.isRetrograde
        ? "Saturn asks this relationship to grow with patience, responsibility, and realistic expectations."
        : "Saturn is steadier here, so stability grows more naturally through discipline and time.",
    ],
  };
}

function buildDashaSection(chartA: AstrologyResult, chartB: AstrologyResult): AnalysisSection {
  const dashaA = getCurrentDasha(chartA);
  const dashaB = getCurrentDasha(chartB);
  const favorable = ["Venus", "Jupiter", "Moon"];

  return {
    id: "dasha-timing",
    title: "Dasha & Timing Insights",
    summary: `Current Mahadasha periods are ${dashaA} for Partner A and ${dashaB} for Partner B.`,
    highlights: [
      favorable.includes(dashaA) || favorable.includes(dashaB)
        ? "At least one chart is in a traditionally more relationship-supportive period."
        : "Current timing may feel slower or heavier, so patience around marriage decisions is wise.",
      "Marriage timing usually feels smoother in Venus, Jupiter, and Moon-related periods.",
      "If timing is not ideal now, use the period to improve trust, family clarity, and practical planning.",
    ],
  };
}

function buildFinancialSection(chartA: AstrologyResult, chartB: AstrologyResult): AnalysisSection {
  const jupiterA = getPlanet(chartA, "Jupiter");
  const jupiterB = getPlanet(chartB, "Jupiter");
  const saturnA = getPlanet(chartA, "Saturn");
  const saturnB = getPlanet(chartB, "Saturn");

  return {
    id: "financial-lifestyle",
    title: "Financial & Lifestyle Compatibility",
    summary: "Money management, ambition, and life goals are judged here through Jupiter and Saturn tendencies.",
    highlights: [
      `Jupiter in houses ${jupiterA.house} and ${jupiterB.house} indicates how each partner grows, plans, and thinks long-term.`,
      `Saturn in houses ${saturnA.house} and ${saturnB.house} indicates how each partner handles pressure, duties, and stability.`,
      "Lifestyle compatibility is strongest when both partners discuss expectations around work, comfort, and savings openly.",
    ],
  };
}

function buildFamilySection(chartA: AstrologyResult, chartB: AstrologyResult, bhakoot: GunaScore): AnalysisSection {
  const moonA = getPlanet(chartA, "Moon");
  const moonB = getPlanet(chartB, "Moon");

  return {
    id: "family-social",
    title: "Family & Social Harmony",
    summary: "Family and social harmony depend on emotional maturity, respect for traditions, and the pair's ability to align publicly and privately.",
    highlights: [
      `Moon signs ${moonA.sign} and ${moonB.sign} influence how family pressure and emotional expectations are handled.`,
      bhakoot.obtainedScore === 7
        ? "The Moon-sign relationship is supportive for domestic peace and shared family rhythm."
        : "The Moon-sign relationship may create differences in family expectations or emotional pacing.",
      "Social compatibility improves when both sides communicate clearly and respect cultural differences without rigidity.",
    ],
  };
}

function buildHealthSection(chartA: AstrologyResult, chartB: AstrologyResult, nadi: GunaScore): AnalysisSection {
  const jupiterA = getPlanet(chartA, "Jupiter");
  const jupiterB = getPlanet(chartB, "Jupiter");

  return {
    id: "health-progeny",
    title: "Health & Progeny",
    summary: nadi.obtainedScore === 8
      ? "Nadi is supportive, which is traditionally considered positive for vitality and health balance."
      : "Nadi is not supportive, which traditionally calls for more care around health, energy balance, and progeny concerns.",
    highlights: [
      `Nadi score is ${nadi.obtainedScore}/8, based on the partners' nakshatra grouping.`,
      `Jupiter in houses ${jupiterA.house} and ${jupiterB.house} gives additional context for optimism, support, and children-related themes.`,
      "Health and children-related outcomes should always be treated with practical, medical, and emotional realism alongside astrology.",
    ],
  };
}

function buildRemediesSection(chartA: AstrologyResult, chartB: AstrologyResult, strength: CompatibilityReport["strength_level"]): AnalysisSection {
  const manglikA = isManglik(chartA);
  const manglikB = isManglik(chartB);
  const suggestions = [
    "Keep communication regular and calm, especially before fixing marriage timelines.",
    "Do one grounding practice together each week such as prayer, gratitude, journaling, or a device-free check-in.",
    "Use astrology as guidance, not fear. Real compatibility also depends on values, trust, and behavior.",
  ];

  if (manglikA || manglikB) {
    suggestions.unshift("For Mars imbalance, traditional remedies like Hanuman Chalisa, Tuesday discipline, or charitable acts can help channel tension more constructively.");
  }

  if (strength === "Needs Attention") {
    suggestions.unshift("Take more time before commitment and discuss family roles, finances, and emotional expectations very clearly.");
  }

  return {
    id: "remedies",
    title: "Remedies & Suggestions",
    summary: "Traditional remedies are most helpful when they reduce stress and improve relationship behavior in practical ways.",
    highlights: suggestions,
  };
}

export async function buildCompatibilityReport(partnerAInput: PartnerBirthData, partnerBInput: PartnerBirthData): Promise<CompatibilityReport> {
  const partnerA = normalizePartnerInput(partnerAInput);
  const partnerB = normalizePartnerInput(partnerBInput);
  const [locationA, locationB] = await Promise.all([
    ensureLocationInput(partnerA.location),
    ensureLocationInput(partnerB.location),
  ]);

  const chartA = calculateAstrologyData({
    date: partnerA.date,
    time: partnerA.time,
    location: locationA,
  });
  const chartB = calculateAstrologyData({
    date: partnerB.date,
    time: partnerB.time,
    location: locationB,
  });

  const gunaMilan = [
    scoreVarna(chartA, chartB),
    scoreVashya(chartA, chartB),
    scoreTara(chartA, chartB),
    scoreYoni(chartA, chartB),
    scoreGrahaMaitri(chartA, chartB),
    scoreGana(chartA, chartB),
    scoreBhakoot(chartA, chartB),
    scoreNadi(chartA, chartB),
  ];

  const totalScore = roundedScore(gunaMilan.reduce((sum, item) => sum + item.obtainedScore, 0));
  const strength = getStrengthLabel(totalScore);
  const bhakoot = gunaMilan.find((item) => item.name === "Bhakoot")!;
  const nadi = gunaMilan.find((item) => item.name === "Nadi")!;

  const sections = [
    buildOverallSection(totalScore, strength, gunaMilan),
    buildEmotionalSection(chartA, chartB),
    buildMarriageSection(chartA, chartB, bhakoot),
    buildManglikSection(chartA, chartB),
    buildPlanetarySection(chartA, chartB),
    buildDashaSection(chartA, chartB),
    buildFinancialSection(chartA, chartB),
    buildFamilySection(chartA, chartB, bhakoot),
    buildHealthSection(chartA, chartB, nadi),
    buildRemediesSection(chartA, chartB, strength),
  ];

  return {
    score: totalScore,
    max_score: 36,
    strength_level: strength,
    analysis: describeStrength(totalScore),
    guna_milan: gunaMilan,
    sections,
    partner_overview: {
      partnerA: {
        name: partnerA.name,
        moonSign: getPlanet(chartA, "Moon").sign,
        ascendant: chartA.lagna,
        venusSign: getPlanet(chartA, "Venus").sign,
        marsHouse: getPlanet(chartA, "Mars").house,
        currentDasha: getCurrentDasha(chartA),
      },
      partnerB: {
        name: partnerB.name,
        moonSign: getPlanet(chartB, "Moon").sign,
        ascendant: chartB.lagna,
        venusSign: getPlanet(chartB, "Venus").sign,
        marsHouse: getPlanet(chartB, "Mars").house,
        currentDasha: getCurrentDasha(chartB),
      },
    },
  };
}
