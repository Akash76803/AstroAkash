import * as Astronomy from "npm:astronomy-engine@2.1.19";

export type AyanamsaMode = "lahiri" | "krishnamurti";

export interface CoordinatesInput {
  name?: string;
  latitude: number;
  longitude: number;
  timezone?: number | string;
  timezoneOffset?: number | string;
  timezoneName?: string;
  elevation?: number;
}

export type LocationInput = string | CoordinatesInput;

export interface AstrologyInput {
  date: string;
  time: string;
  location: LocationInput;
  ayanamsa?: AyanamsaMode;
}

export interface ResolvedLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone: number;
  timezoneName?: string;
  elevation: number;
}

export interface PlanetPosition {
  planet: string;
  longitude: number;
  tropicalLongitude: number;
  sign: string;
  signIndex: number;
  degree: number;
  minute: number;
  nakshatra: string;
  nakshatraIndex: number;
  pada: number;
  house: number;
  isRetrograde: boolean;
  speed?: number;
}

export interface HouseData {
  house: number;
  cuspLongitude: number;
  sign: string;
  signIndex: number;
  degree: number;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  years: number;
  subPeriods?: DashaPeriod[];
}

export interface PanchangData {
  vara: string;
  tithi: string;
  tithiIndex: number;
  paksha: "Shukla" | "Krishna";
  nakshatra: string;
  nakshatraIndex: number;
  yoga: string;
  yogaIndex: number;
  karana: string;
  moonPhaseAngle: number;
}

export interface TransitAspect {
  transitPlanet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
}

export interface TransitAnalysis {
  timestamp: string;
  transits: PlanetPosition[];
  notableAspects: TransitAspect[];
  activatedHouses: Array<{ house: number; planets: string[] }>;
}

export interface AstrologyInsights {
  dominantElement: string;
  dominantModality: string;
  strongestHouses: Array<{ house: number; score: number }>;
  retrogradePlanets: string[];
  keyThemes: string[];
  panchangSummary: string;
}

export interface AstrologyResult {
  input: {
    date: string;
    time: string;
    utc: string;
    ayanamsa: AyanamsaMode;
    ayanamsaDegrees: number;
    julianDay: number;
    location: ResolvedLocation;
  };
  lagna: string;
  lagnaLongitude: number;
  ascendantIndex: number;
  houses: HouseData[];
  planetary_positions: PlanetPosition[];
  zodiac_placements: {
    sun_sign: string;
    moon_sign: string;
    ascendant: string;
  };
  dasha_periods: DashaPeriod[];
  panchang: PanchangData;
  astrology_insights: AstrologyInsights;
}

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const SIGN_ELEMENTS = [
  "Fire",
  "Earth",
  "Air",
  "Water",
  "Fire",
  "Earth",
  "Air",
  "Water",
  "Fire",
  "Earth",
  "Air",
  "Water",
];

const SIGN_MODALITIES = [
  "Cardinal",
  "Fixed",
  "Mutable",
  "Cardinal",
  "Fixed",
  "Mutable",
  "Cardinal",
  "Fixed",
  "Mutable",
  "Cardinal",
  "Fixed",
  "Mutable",
];

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const TITHIS = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
];

const YOGAS = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];

const VARAS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"];

const DASHA_SEQUENCE = [
  { planet: "Ketu", years: 7 },
  { planet: "Venus", years: 20 },
  { planet: "Sun", years: 6 },
  { planet: "Moon", years: 10 },
  { planet: "Mars", years: 7 },
  { planet: "Rahu", years: 18 },
  { planet: "Jupiter", years: 16 },
  { planet: "Saturn", years: 19 },
  { planet: "Mercury", years: 17 },
];

const PLANET_BODIES = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
] as const;

const KNOWN_LOCATIONS: Record<string, ResolvedLocation> = {
  "mumbai": { name: "Mumbai, India", latitude: 19.076, longitude: 72.8777, timezone: 5.5, elevation: 14 },
  "mumbai, india": { name: "Mumbai, India", latitude: 19.076, longitude: 72.8777, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 14 },
  "delhi": { name: "Delhi, India", latitude: 28.6139, longitude: 77.209, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 216 },
  "new delhi": { name: "New Delhi, India", latitude: 28.6139, longitude: 77.209, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 216 },
  "new delhi, india": { name: "New Delhi, India", latitude: 28.6139, longitude: 77.209, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 216 },
  "bangalore": { name: "Bengaluru, India", latitude: 12.9716, longitude: 77.5946, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 920 },
  "bengaluru": { name: "Bengaluru, India", latitude: 12.9716, longitude: 77.5946, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 920 },
  "kolkata": { name: "Kolkata, India", latitude: 22.5726, longitude: 88.3639, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 9 },
  "chennai": { name: "Chennai, India", latitude: 13.0827, longitude: 80.2707, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 6 },
  "hyderabad": { name: "Hyderabad, India", latitude: 17.385, longitude: 78.4867, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 542 },
  "pune": { name: "Pune, India", latitude: 18.5204, longitude: 73.8567, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 560 },
  "ahmedabad": { name: "Ahmedabad, India", latitude: 23.0225, longitude: 72.5714, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 53 },
  "jaipur": { name: "Jaipur, India", latitude: 26.9124, longitude: 75.7873, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 431 },
  "lucknow": { name: "Lucknow, India", latitude: 26.8467, longitude: 80.9462, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 123 },
  "varanasi": { name: "Varanasi, India", latitude: 25.3176, longitude: 82.9739, timezone: 5.5, timezoneName: "Asia/Kolkata", elevation: 80 },
  "london": { name: "London, United Kingdom", latitude: 51.5072, longitude: -0.1276, timezone: 0, timezoneName: "Europe/London", elevation: 11 },
  "new york": { name: "New York, USA", latitude: 40.7128, longitude: -74.006, timezone: -5, timezoneName: "America/New_York", elevation: 10 },
  "los angeles": { name: "Los Angeles, USA", latitude: 34.0522, longitude: -118.2437, timezone: -8, timezoneName: "America/Los_Angeles", elevation: 71 },
  "dubai": { name: "Dubai, UAE", latitude: 25.2048, longitude: 55.2708, timezone: 4, timezoneName: "Asia/Dubai", elevation: 16 },
  "singapore": { name: "Singapore", latitude: 1.3521, longitude: 103.8198, timezone: 8, timezoneName: "Asia/Singapore", elevation: 15 },
};

function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

function signedAngleDelta(next: number, current: number): number {
  return ((next - current + 540) % 360) - 180;
}

function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function getTimeZoneOffsetHours(dateInput: string, timeInput: string, timeZone: string): number {
  const [year, month, day] = dateInput.split("-").map(Number);
  const [hour, minute] = timeInput.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(utcGuess).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return (asUtc - utcGuess.getTime()) / 3600000;
}

function parseDateTime(input: AstrologyInput, location: ResolvedLocation): { utcDate: Date; localDate: Date } {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.time.split(":").map(Number);

  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) {
    throw new Error("Invalid date or time format. Expected YYYY-MM-DD and HH:mm.");
  }

  const timezoneHours = location.timezoneName
    ? getTimeZoneOffsetHours(input.date, input.time, location.timezoneName)
    : location.timezone;
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - timezoneHours * 3600000;
  const utcDate = new Date(utcMs);
  const localDate = new Date(utcMs + timezoneHours * 3600000);

  return { utcDate, localDate };
}

export function calculateAyanamsaDegrees(julianDay: number, mode: AyanamsaMode): number {
  const yearsSinceJ2000 = (julianDay - 2451545) / 365.2425;
  const lahiri = 23.8530556 + (yearsSinceJ2000 * 50.290966) / 3600;
  if (mode === "krishnamurti") {
    return lahiri + 0.1;
  }
  return lahiri;
}

function getSignInfo(longitude: number) {
  const signIndex = Math.floor(normalizeDegrees(longitude) / 30);
  const degreeInSign = normalizeDegrees(longitude) % 30;
  return {
    signIndex,
    sign: SIGNS[signIndex],
    degree: Math.floor(degreeInSign),
    minute: Math.floor((degreeInSign % 1) * 60),
  };
}

export function calculateZodiacSign(longitude: number) {
  return getSignInfo(longitude);
}

function getNakshatraInfo(longitude: number) {
  const span = 360 / 27;
  const normalized = normalizeDegrees(longitude);
  const nakshatraIndex = Math.floor(normalized / span);
  const offset = normalized % span;
  const pada = Math.floor(offset / (span / 4)) + 1;
  return {
    nakshatraIndex,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada,
    remainderFraction: 1 - offset / span,
  };
}

function getMeanObliquity(julianDay: number): number {
  const t = (julianDay - 2451545) / 36525;
  return 23.439291 - 0.0130042 * t;
}

function getLocalSiderealDegrees(julianDay: number, longitude: number): number {
  const t = (julianDay - 2451545) / 36525;
  const gmst =
    280.46061837 +
    360.98564736629 * (julianDay - 2451545) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  return normalizeDegrees(gmst + longitude);
}

function getAscendantLongitude(julianDay: number, latitude: number, longitude: number): number {
  const epsilon = (getMeanObliquity(julianDay) * Math.PI) / 180;
  const theta = (getLocalSiderealDegrees(julianDay, longitude) * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;

  const numerator = -Math.cos(theta);
  const denominator = Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon);

  return normalizeDegrees((Math.atan2(numerator, denominator) * 180) / Math.PI);
}

export function calculateLagna(julianDay: number, latitude: number, longitude: number, ayanamsa: number) {
  const tropicalAscendant = getAscendantLongitude(julianDay, latitude, longitude);
  const siderealLongitude = normalizeDegrees(tropicalAscendant - ayanamsa);
  return {
    longitude: siderealLongitude,
    tropicalLongitude: tropicalAscendant,
    ...getSignInfo(siderealLongitude),
  };
}

export function calculateHouses(lagnaLongitude: number): HouseData[] {
  return Array.from({ length: 12 }, (_, index) => {
    const cuspLongitude = normalizeDegrees(lagnaLongitude + index * 30);
    const sign = getSignInfo(cuspLongitude);
    return {
      house: index + 1,
      cuspLongitude,
      sign: sign.sign,
      signIndex: sign.signIndex,
      degree: sign.degree,
    };
  });
}

function getHouseFromLongitude(longitude: number, lagnaLongitude: number): number {
  return Math.floor(normalizeDegrees(longitude - lagnaLongitude) / 30) + 1;
}

function getNodeLongitude(julianDay: number, ayanamsa: number): number {
  const t = (julianDay - 2451545) / 36525;
  const meanNode = 125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000;
  return normalizeDegrees(meanNode - ayanamsa);
}

function getTropicalLongitude(body: (typeof PLANET_BODIES)[number], date: Date): number {
  if (body === "Moon") {
    return normalizeDegrees(Astronomy.EclipticGeoMoon(date).lon);
  }

  if (body === "Sun") {
    return normalizeDegrees(Astronomy.SunPosition(date).elon);
  }

  return normalizeDegrees(Astronomy.Ecliptic(Astronomy.GeoVector(body, date, false)).elon);
}

function buildPlanetPosition(
  planet: string,
  tropicalLongitude: number,
  ayanamsa: number,
  lagnaLongitude: number,
  isRetrograde: boolean,
  speed?: number,
): PlanetPosition {
  const siderealLongitude = normalizeDegrees(tropicalLongitude - ayanamsa);
  const sign = getSignInfo(siderealLongitude);
  const nakshatra = getNakshatraInfo(siderealLongitude);

  return {
    planet,
    longitude: siderealLongitude,
    tropicalLongitude,
    sign: sign.sign,
    signIndex: sign.signIndex,
    degree: sign.degree,
    minute: sign.minute,
    nakshatra: nakshatra.nakshatra,
    nakshatraIndex: nakshatra.nakshatraIndex,
    pada: nakshatra.pada,
    house: getHouseFromLongitude(siderealLongitude, lagnaLongitude),
    isRetrograde,
    speed,
  };
}

export function resolveLocation(location: LocationInput): ResolvedLocation {
  if (typeof location === "string") {
    const normalized = location.trim().toLowerCase();
    const known = KNOWN_LOCATIONS[normalized];

    if (!known) {
      const coordinateMatch = normalized.match(
        /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
      );
      if (coordinateMatch) {
        const [, latitude, longitude, timezone] = coordinateMatch;
        return {
          name: "Custom coordinates",
          latitude: Number(latitude),
          longitude: Number(longitude),
          timezone: Number(timezone),
          elevation: 0,
        };
      }

      throw new Error(
        "Unknown location string. Pass a supported city name, a 'lat,lon,timezone' string, or a location object with latitude, longitude, and timezone.",
      );
    }

    return known;
  }

    const timezone = location.timezone ?? location.timezoneOffset;
    if (
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number" ||
      (typeof timezone !== "number" && typeof timezone !== "string")
    ) {
      throw new Error("Location object must include latitude, longitude, and timezone.");
    }

    return {
      name: location.name ?? "Custom coordinates",
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: typeof timezone === "number" ? timezone : 0,
      timezoneName: location.timezoneName ?? (typeof timezone === "string" ? timezone : undefined),
      elevation: location.elevation ?? 0,
    };
  }

export function calculatePlanetaryPositions(utcDate: Date, ayanamsa: number, lagnaLongitude: number): PlanetPosition[] {
  const laterDate = new Date(utcDate.getTime() + 6 * 3600000);

  const planets = PLANET_BODIES.map((body) => {
    const tropicalLongitude = getTropicalLongitude(body, utcDate);
    const futureLongitude = getTropicalLongitude(body, laterDate);
    const speed = signedAngleDelta(futureLongitude, tropicalLongitude) / 6;
    return buildPlanetPosition(body, tropicalLongitude, ayanamsa, lagnaLongitude, speed < 0, speed);
  });

  const julianDay = toJulianDay(utcDate);
  const rahuLongitude = getNodeLongitude(julianDay, ayanamsa);
  const ketuLongitude = normalizeDegrees(rahuLongitude + 180);

  planets.push(buildPlanetPosition("Rahu", normalizeDegrees(rahuLongitude + ayanamsa), ayanamsa, lagnaLongitude, true, -0.053));
  planets.push(buildPlanetPosition("Ketu", normalizeDegrees(ketuLongitude + ayanamsa), ayanamsa, lagnaLongitude, true, -0.053));

  return planets;
}

function addFractionalYears(date: Date, years: number): Date {
  return new Date(date.getTime() + years * 365.2425 * 86400000);
}

function buildSubPeriods(startDate: Date, years: number, startIndex: number): DashaPeriod[] {
  const totalYears = DASHA_SEQUENCE.reduce((sum, item) => sum + item.years, 0);
  let cursor = startDate;

  return Array.from({ length: DASHA_SEQUENCE.length }, (_, offset) => {
    const dasha = DASHA_SEQUENCE[(startIndex + offset) % DASHA_SEQUENCE.length];
    const subYears = (years * dasha.years) / totalYears;
    const endDate = addFractionalYears(cursor, subYears);
    const period: DashaPeriod = {
      planet: dasha.planet,
      startDate: cursor.toISOString(),
      endDate: endDate.toISOString(),
      years: Number(subYears.toFixed(4)),
    };
    cursor = endDate;
    return period;
  });
}

export function calculateDashaPeriods(moonLongitude: number, birthDate: Date): DashaPeriod[] {
  const nakshatra = getNakshatraInfo(moonLongitude);
  const startIndex = nakshatra.nakshatraIndex % DASHA_SEQUENCE.length;
  const firstDashaYears = DASHA_SEQUENCE[startIndex].years * nakshatra.remainderFraction;
  let cursor = birthDate;

  return Array.from({ length: DASHA_SEQUENCE.length }, (_, offset) => {
    const dashaIndex = (startIndex + offset) % DASHA_SEQUENCE.length;
    const dasha = DASHA_SEQUENCE[dashaIndex];
    const years = offset === 0 ? firstDashaYears : dasha.years;
    const endDate = addFractionalYears(cursor, years);
    const period: DashaPeriod = {
      planet: dasha.planet,
      startDate: cursor.toISOString(),
      endDate: endDate.toISOString(),
      years: Number(years.toFixed(4)),
      subPeriods: buildSubPeriods(cursor, years, dashaIndex),
    };
    cursor = endDate;
    return period;
  });
}

function getKarana(phaseAngle: number): string {
  const index = Math.floor(normalizeDegrees(phaseAngle) / 6);

  if (index === 0) return "Kimstughna";
  if (index >= 57) {
    return ["Shakuni", "Chatushpada", "Naga"][index - 57] ?? "Kimstughna";
  }

  return MOVABLE_KARANAS[(index - 1) % MOVABLE_KARANAS.length];
}

export function calculatePanchang(sunLongitude: number, moonLongitude: number, localDate: Date): PanchangData {
  const phaseAngle = normalizeDegrees(moonLongitude - sunLongitude);
  const tithiIndex = Math.floor(phaseAngle / 12);
  const yogaIndex = Math.floor(normalizeDegrees(sunLongitude + moonLongitude) / (360 / 27));
  const nakshatra = getNakshatraInfo(moonLongitude);

  return {
    vara: VARAS[localDate.getUTCDay()],
    tithi: TITHIS[tithiIndex],
    tithiIndex: tithiIndex + 1,
    paksha: tithiIndex < 15 ? "Shukla" : "Krishna",
    nakshatra: nakshatra.nakshatra,
    nakshatraIndex: nakshatra.nakshatraIndex + 1,
    yoga: YOGAS[yogaIndex],
    yogaIndex: yogaIndex + 1,
    karana: getKarana(phaseAngle),
    moonPhaseAngle: Number(phaseAngle.toFixed(4)),
  };
}

function getDominantCategory(values: string[]): string {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Balanced";
}

function getThemesFromHouses(houses: Array<{ house: number; score: number }>): string[] {
  const meanings: Record<number, string> = {
    1: "identity and self-expression",
    2: "wealth and family priorities",
    3: "communication and courage",
    4: "home and emotional grounding",
    5: "creativity and romance",
    6: "work, health, and routines",
    7: "relationships and partnerships",
    8: "transformation and hidden matters",
    9: "beliefs, teachers, and luck",
    10: "career and public life",
    11: "gains and social circles",
    12: "spirituality and inner release",
  };

  return houses.slice(0, 3).map((item) => meanings[item.house]);
}

export function buildInsights(planets: PlanetPosition[], panchang: PanchangData): AstrologyInsights {
  const corePlanets = planets.filter((planet) => !["Rahu", "Ketu"].includes(planet.planet));
  const elements = corePlanets.map((planet) => SIGN_ELEMENTS[planet.signIndex]);
  const modalities = corePlanets.map((planet) => SIGN_MODALITIES[planet.signIndex]);
  const houseScores = planets.reduce<Record<number, number>>((acc, planet) => {
    acc[planet.house] = (acc[planet.house] ?? 0) + (["Sun", "Moon", "Jupiter", "Venus"].includes(planet.planet) ? 2 : 1);
    return acc;
  }, {});

  const strongestHouses = Object.entries(houseScores)
    .map(([house, score]) => ({ house: Number(house), score }))
    .sort((a, b) => b.score - a.score);

  return {
    dominantElement: getDominantCategory(elements),
    dominantModality: getDominantCategory(modalities),
    strongestHouses,
    retrogradePlanets: planets.filter((planet) => planet.isRetrograde).map((planet) => planet.planet),
    keyThemes: getThemesFromHouses(strongestHouses),
    panchangSummary: `${panchang.vara} ${panchang.paksha} ${panchang.tithi}, ${panchang.nakshatra} nakshatra, ${panchang.yoga} yoga.`,
  };
}

function getAspectName(delta: number): string | null {
  const aspects = [
    { angle: 0, name: "conjunction" },
    { angle: 60, name: "sextile" },
    { angle: 90, name: "square" },
    { angle: 120, name: "trine" },
    { angle: 180, name: "opposition" },
  ];

  for (const aspect of aspects) {
    if (Math.abs(delta - aspect.angle) <= 6) {
      return aspect.name;
    }
  }

  return null;
}

export function calculateTransitAnalysis(
  natalPlanets: PlanetPosition[],
  lagnaLongitude: number,
  ayanamsa: number,
  transitDate = new Date(),
): TransitAnalysis {
  const transits = calculatePlanetaryPositions(transitDate, ayanamsa, lagnaLongitude);
  const notableAspects: TransitAspect[] = [];

  for (const transit of transits) {
    if (["Rahu", "Ketu"].includes(transit.planet)) continue;

    for (const natal of natalPlanets) {
      if (["Rahu", "Ketu"].includes(natal.planet)) continue;
      const separation = Math.abs(signedAngleDelta(transit.longitude, natal.longitude));
      const aspect = getAspectName(separation);
      if (aspect) {
        notableAspects.push({
          transitPlanet: transit.planet,
          natalPlanet: natal.planet,
          aspect,
          orb: Number(Math.abs(separation - [0, 60, 90, 120, 180].find((angle) => Math.abs(separation - angle) <= 6)!).toFixed(2)),
        });
      }
    }
  }

  const activatedHouses = Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    planets: transits.filter((planet) => planet.house === index + 1).map((planet) => planet.planet),
  })).filter((entry) => entry.planets.length > 0);

  return {
    timestamp: transitDate.toISOString(),
    transits,
    notableAspects: notableAspects
      .sort((a, b) => a.orb - b.orb)
      .slice(0, 12),
    activatedHouses,
  };
}

export function calculateAstrologyData(input: AstrologyInput): AstrologyResult {
  const ayanamsaMode = input.ayanamsa ?? "lahiri";
  const location = resolveLocation(input.location);
  const { utcDate, localDate } = parseDateTime(input, location);
  const julianDay = toJulianDay(utcDate);
  const ayanamsa = calculateAyanamsaDegrees(julianDay, ayanamsaMode);
  const lagna = calculateLagna(julianDay, location.latitude, location.longitude, ayanamsa);
  const lagnaLongitude = lagna.longitude;
  const lagnaSign = getSignInfo(lagnaLongitude);
  const houses = calculateHouses(lagnaLongitude);
  const planetaryPositions = calculatePlanetaryPositions(utcDate, ayanamsa, lagnaLongitude);

  const sun = planetaryPositions.find((planet) => planet.planet === "Sun");
  const moon = planetaryPositions.find((planet) => planet.planet === "Moon");

  if (!sun || !moon) {
    throw new Error("Failed to calculate solar or lunar positions.");
  }

  const panchang = calculatePanchang(sun.longitude, moon.longitude, localDate);

  return {
    input: {
      date: input.date,
      time: input.time,
      utc: utcDate.toISOString(),
      ayanamsa: ayanamsaMode,
      ayanamsaDegrees: Number(ayanamsa.toFixed(6)),
      julianDay: Number(julianDay.toFixed(6)),
      location,
    },
    lagna: lagnaSign.sign,
    lagnaLongitude: Number(lagnaLongitude.toFixed(6)),
    ascendantIndex: lagnaSign.signIndex,
    houses,
    planetary_positions: planetaryPositions,
    zodiac_placements: {
      sun_sign: sun.sign,
      moon_sign: moon.sign,
      ascendant: lagnaSign.sign,
    },
    dasha_periods: calculateDashaPeriods(moon.longitude, utcDate),
    panchang,
    astrology_insights: buildInsights(planetaryPositions, panchang),
  };
}
