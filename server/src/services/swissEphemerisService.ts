import type { BirthInput, ChartSnapshot, PlanetPosition } from "../types.js";
import { config } from "../config.js";
import type swissephDefault from "swisseph-v2";

type SwissEphemerisModule = typeof swissephDefault;

interface CoreCoordinates {
  latitude: number;
  longitude: number;
}

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

interface PlanetCalculationResult {
  name: string;
  longitude: number;
  sign: string;
  degree: number;
  house: number;
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  nodeType?: "Rahu" | "Ketu";
}

interface SwissPolarResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
  rflag: number;
}

interface PanchangDetails {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
}

const ZODIAC_SIGNS = [
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
  "Pisces"
] as const;

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
  "Revati"
] as const;

const TITHIS = [
  "Shukla Pratipada",
  "Shukla Dwitiya",
  "Shukla Tritiya",
  "Shukla Chaturthi",
  "Shukla Panchami",
  "Shukla Shashthi",
  "Shukla Saptami",
  "Shukla Ashtami",
  "Shukla Navami",
  "Shukla Dashami",
  "Shukla Ekadashi",
  "Shukla Dwadashi",
  "Shukla Trayodashi",
  "Shukla Chaturdashi",
  "Purnima",
  "Krishna Pratipada",
  "Krishna Dwitiya",
  "Krishna Tritiya",
  "Krishna Chaturthi",
  "Krishna Panchami",
  "Krishna Shashthi",
  "Krishna Saptami",
  "Krishna Ashtami",
  "Krishna Navami",
  "Krishna Dashami",
  "Krishna Ekadashi",
  "Krishna Dwadashi",
  "Krishna Trayodashi",
  "Krishna Chaturdashi",
  "Amavasya"
] as const;

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
  "Vaidhriti"
] as const;

const MOVABLE_KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"] as const;
const VIMSHOTTARI_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"] as const;

const PLANETS = [
  { id: "Sun", code: "SE_SUN" },
  { id: "Moon", code: "SE_MOON" },
  { id: "Mars", code: "SE_MARS" },
  { id: "Mercury", code: "SE_MERCURY" },
  { id: "Jupiter", code: "SE_JUPITER" },
  { id: "Venus", code: "SE_VENUS" },
  { id: "Saturn", code: "SE_SATURN" },
  { id: "Rahu", code: "SE_TRUE_NODE" }
] as const satisfies ReadonlyArray<{ id: string; code: keyof SwissEphemerisModule }>;

/**
 * Yeh service Swiss Ephemeris ke raw astronomical data ko Vedic astrology
 * format me convert karti hai. Main kaam hai:
 * 1. local birth time ko UTC me badalna
 * 2. Lahiri ayanamsa apply karke sidereal zodiac nikalna
 * 3. houses, lagna, nakshatra, panchang aur dasha base banana
 */
export class SwissEphemerisService {
  private swisseph: SwissEphemerisModule | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const module = await import("swisseph-v2");
      this.swisseph = module.default;
      this.swisseph.swe_set_ephe_path(config.SWISSEPH_EPHE_PATH);
      this.swisseph.swe_set_sid_mode(this.swisseph.SE_SIDM_LAHIRI, 0, 0);
      this.initialized = true;
    } catch (error) {
      throw new Error(
        `Swiss Ephemeris load failure. Check package installation and SWISSEPH_EPHE_PATH. ${error instanceof Error ? error.message : ""}`.trim()
      );
    }
  }

  private parseDateTime(date: string, time: string): DateParts {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute, second = 0] = time.split(":").map(Number);

    if ([year, month, day, hour, minute, second].some((value) => Number.isNaN(value))) {
      throw new Error("Invalid date/time format. Use YYYY-MM-DD and HH:mm or HH:mm:ss.");
    }

    return { year, month, day, hour, minute, second };
  }

  private validateCoordinates({ latitude, longitude }: CoreCoordinates) {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error("Missing coordinates. Latitude and longitude are required.");
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude. It must be between -90 and 90.");
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude. It must be between -180 and 180.");
    }
  }

  /**
   * Birth time usually local timezone me hota hai.
   * Swiss Ephemeris ko UTC chahiye hota hai, isliye pehle local -> UTC conversion karte hain.
   */
  private getUtcDate(date: string, time: string, timezone: string): Date {
    const parts = this.parseDateTime(date, time);

    let formatter: Intl.DateTimeFormat;
    try {
      formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      });
    } catch {
      throw new Error(`Invalid timezone "${timezone}".`);
    }

    const utcGuess = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
    const tzParts = formatter.formatToParts(utcGuess).reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

    const asUtcMillis = Date.UTC(
      Number(tzParts.year),
      Number(tzParts.month) - 1,
      Number(tzParts.day),
      Number(tzParts.hour),
      Number(tzParts.minute),
      Number(tzParts.second)
    );

    const offsetMillis = asUtcMillis - utcGuess.getTime();
    return new Date(utcGuess.getTime() - offsetMillis);
  }

  private getJulianDayUT(date: string, time: string, timezone: string): number {
    if (!this.swisseph) {
      throw new Error("Swiss Ephemeris is not initialized.");
    }

    const utcDate = this.getUtcDate(date, time, timezone);
    const utcResult = this.swisseph.swe_utc_to_jd(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth() + 1,
      utcDate.getUTCDate(),
      utcDate.getUTCHours(),
      utcDate.getUTCMinutes(),
      utcDate.getUTCSeconds(),
      this.swisseph.SE_GREG_CAL
    );

    if ("error" in utcResult) {
      throw new Error(`Swiss Ephemeris UTC conversion failed: ${utcResult.error}`);
    }

    return utcResult.julianDayUT;
  }

  private normalizeLongitude(value: number): number {
    return ((value % 360) + 360) % 360;
  }

  private isPolarResult(result: unknown): result is SwissPolarResult {
    return (
      typeof result === "object" &&
      result !== null &&
      "longitude" in result &&
      "longitudeSpeed" in result
    );
  }

  private getSignInfo(longitude: number) {
    const normalized = this.normalizeLongitude(longitude);
    const signIndex = Math.floor(normalized / 30);
    return {
      sign: ZODIAC_SIGNS[signIndex],
      signIndex,
      degree: Number((normalized % 30).toFixed(4))
    };
  }

  /**
   * Nakshatra span = 13°20' = 13.333333...
   * Har nakshatra ko 4 padas me divide karte hain.
   */
  private getNakshatraInfo(longitude: number) {
    const normalized = this.normalizeLongitude(longitude);
    const nakshatraSpan = 360 / 27;
    const padaSpan = nakshatraSpan / 4;
    const nakshatraIndex = Math.floor(normalized / nakshatraSpan);
    const pada = Math.floor((normalized % nakshatraSpan) / padaSpan) + 1;

    return {
      nakshatra: NAKSHATRAS[nakshatraIndex],
      nakshatraIndex,
      pada
    };
  }

  private determineHouse(longitude: number, houses: number[]): number {
    const normalized = this.normalizeLongitude(longitude);
    const cusps = houses.slice(0, 12).map((value) => this.normalizeLongitude(value));

    for (let index = 0; index < 12; index += 1) {
      const start = cusps[index];
      const end = cusps[(index + 1) % 12];

      if (start <= end) {
        if (normalized >= start && normalized < end) return index + 1;
      } else {
        if (normalized >= start || normalized < end) return index + 1;
      }
    }

    return 1;
  }

  private getSiderealHouseData(julianDayUT: number, lat: number, lon: number) {
    if (!this.swisseph) {
      throw new Error("Swiss Ephemeris is not initialized.");
    }

    const housesResult = this.swisseph.swe_houses_ex(
      julianDayUT,
      this.swisseph.SEFLG_SIDEREAL,
      lat,
      lon,
      "P"
    );

    if ("error" in housesResult) {
      throw new Error(`Swiss Ephemeris sidereal house calculation failed: ${housesResult.error}`);
    }

    return housesResult;
  }

  /**
   * Sidereal planet position nikalne ke liye:
   * - Lahiri mode set karte hain
   * - SEFLG_SIDEREAL ke saath swe_calc_ut call karte hain
   * Isse tropical se sidereal conversion Swiss level par hi ho jata hai.
   */
  async getPlanetPositions(date: string, time: string, lat: number, lon: number, timezone = "UTC"): Promise<PlanetCalculationResult[]> {
    await this.initialize();
    this.validateCoordinates({ latitude: lat, longitude: lon });

    if (!this.swisseph) {
      throw new Error("Swiss Ephemeris is not initialized.");
    }

    const julianDayUT = this.getJulianDayUT(date, time, timezone);
    const housesResult = this.getSiderealHouseData(julianDayUT, lat, lon);
    const flags = this.swisseph.SEFLG_SWIEPH | this.swisseph.SEFLG_SPEED | this.swisseph.SEFLG_SIDEREAL;

    const computed: PlanetCalculationResult[] = PLANETS.map((planet) => {
      const result = this.swisseph!.swe_calc_ut(julianDayUT, this.swisseph![planet.code], flags);

      if ("error" in result) {
        throw new Error(`Failed to calculate ${planet.id}: ${result.error}`);
      }

      if (!this.isPolarResult(result)) {
        throw new Error(`Swiss Ephemeris returned unexpected coordinate format for ${planet.id}.`);
      }

      const longitude = this.normalizeLongitude(result.longitude);
      const signInfo = this.getSignInfo(longitude);
      const nakshatraInfo = this.getNakshatraInfo(longitude);

      return {
        name: planet.id,
        longitude: Number(longitude.toFixed(6)),
        sign: signInfo.sign,
        degree: signInfo.degree,
        house: this.determineHouse(longitude, housesResult.house),
        nakshatra: nakshatraInfo.nakshatra,
        pada: nakshatraInfo.pada,
        isRetrograde: result.longitudeSpeed < 0,
        nodeType: planet.id === "Rahu" ? "Rahu" : undefined
      };
    });

    const rahu = computed.find((planet) => planet.name === "Rahu");
    if (!rahu) {
      throw new Error("Failed to calculate Rahu.");
    }

    const ketuLongitude = this.normalizeLongitude(rahu.longitude + 180);
    const ketuSign = this.getSignInfo(ketuLongitude);
    const ketuNakshatra = this.getNakshatraInfo(ketuLongitude);

    computed.push({
      name: "Ketu",
      longitude: Number(ketuLongitude.toFixed(6)),
      sign: ketuSign.sign,
      degree: ketuSign.degree,
      house: this.determineHouse(ketuLongitude, housesResult.house),
      nakshatra: ketuNakshatra.nakshatra,
      pada: ketuNakshatra.pada,
      isRetrograde: true,
      nodeType: "Ketu"
    });

    return computed;
  }

  async calculateAscendant(date: string, time: string, lat: number, lon: number, timezone = "UTC") {
    await this.initialize();
    this.validateCoordinates({ latitude: lat, longitude: lon });

    const julianDayUT = this.getJulianDayUT(date, time, timezone);
    const housesResult = this.getSiderealHouseData(julianDayUT, lat, lon);
    const ascendantLongitude = this.normalizeLongitude(housesResult.ascendant);
    const signInfo = this.getSignInfo(ascendantLongitude);

    return {
      sign: signInfo.sign,
      longitude: Number(ascendantLongitude.toFixed(6)),
      degree: signInfo.degree
    };
  }

  async calculateHouses(date: string, time: string, lat: number, lon: number, timezone = "UTC") {
    await this.initialize();
    this.validateCoordinates({ latitude: lat, longitude: lon });

    const julianDayUT = this.getJulianDayUT(date, time, timezone);
    const housesResult = this.getSiderealHouseData(julianDayUT, lat, lon);

    return housesResult.house.slice(0, 12).map((cuspLongitude, index) => {
      const normalized = this.normalizeLongitude(cuspLongitude);
      const signInfo = this.getSignInfo(normalized);

      return {
        house: index + 1,
        sign: signInfo.sign,
        cuspLongitude: Number(normalized.toFixed(6))
      };
    });
  }

  /**
   * Panchang basics:
   * - Tithi = Moon - Sun angle / 12°
   * - Nakshatra = Moon longitude / 13°20'
   * - Yoga = (Sun + Moon) / 13°20'
   * - Karana = half tithi = 6° blocks
   */
  private calculatePanchang(sunLongitude: number, moonLongitude: number): PanchangDetails {
    const moonPhaseAngle = this.normalizeLongitude(moonLongitude - sunLongitude);
    const tithiIndex = Math.floor(moonPhaseAngle / 12);
    const yogaIndex = Math.floor(this.normalizeLongitude(sunLongitude + moonLongitude) / (360 / 27));
    const moonNakshatra = this.getNakshatraInfo(moonLongitude);
    const karanaIndex = Math.floor(moonPhaseAngle / 6);

    let karana = "Kimstughna";
    if (karanaIndex >= 1 && karanaIndex <= 56) {
      karana = MOVABLE_KARANAS[(karanaIndex - 1) % MOVABLE_KARANAS.length];
    } else if (karanaIndex === 57) {
      karana = "Shakuni";
    } else if (karanaIndex === 58) {
      karana = "Chatushpada";
    } else if (karanaIndex >= 59) {
      karana = "Naga";
    }

    return {
      tithi: TITHIS[tithiIndex],
      nakshatra: moonNakshatra.nakshatra,
      yoga: YOGAS[yogaIndex],
      karana
    };
  }

  /**
   * Vimshottari Dasha ka starting Mahadasha Moon Nakshatra ke lord se aata hai.
   * 27 nakshatra 9 lords me repeat hote hain, isliye index % 9 use karte hain.
   */
  private calculateDashaFoundation(moonLongitude: number) {
    const moonNakshatra = this.getNakshatraInfo(moonLongitude);
    const currentMahadasha = VIMSHOTTARI_SEQUENCE[moonNakshatra.nakshatraIndex % VIMSHOTTARI_SEQUENCE.length];

    return {
      currentMahadasha,
      moonNakshatra: moonNakshatra.nakshatra
    };
  }

  async generateBirthChart(input: BirthInput): Promise<ChartSnapshot> {
    await this.initialize();
    this.validateCoordinates({
      latitude: input.location.latitude,
      longitude: input.location.longitude
    });

    const { date, time, location } = input;
    const timezone = location.timezone;

    const [planetResults, ascendant, houseResults] = await Promise.all([
      this.getPlanetPositions(date, time, location.latitude, location.longitude, timezone),
      this.calculateAscendant(date, time, location.latitude, location.longitude, timezone),
      this.calculateHouses(date, time, location.latitude, location.longitude, timezone)
    ]);

    const planetaryPositions: PlanetPosition[] = planetResults.map((planet) => ({
      planet: planet.name,
      longitude: planet.longitude,
      sign: planet.sign,
      degree: planet.degree,
      house: planet.house,
      nakshatra: planet.nakshatra,
      pada: planet.pada,
      isRetrograde: planet.isRetrograde,
      nodeType: planet.nodeType
    }));

    const sun = planetResults.find((planet) => planet.name === "Sun");
    const moon = planetResults.find((planet) => planet.name === "Moon");

    if (!sun || !moon) {
      throw new Error("Birth chart generation failed. Sun or Moon position is missing.");
    }

    const panchang = this.calculatePanchang(sun.longitude, moon.longitude);
    const dasha = this.calculateDashaFoundation(moon.longitude);

    return {
      lagna: ascendant.sign,
      ascendantLongitude: ascendant.longitude,
      houses: houseResults,
      planets: planetaryPositions,
      planetaryPositions,
      nakshatras: planetResults.map((planet) => ({
        planet: planet.name,
        nakshatra: planet.nakshatra,
        pada: planet.pada
      })),
      zodiacPlacements: {
        sunSign: sun.sign,
        moonSign: moon.sign,
        ascendant: ascendant.sign
      },
      panchang,
      dasha
    };
  }

  async generateKundli(input: BirthInput): Promise<ChartSnapshot> {
    return this.generateBirthChart(input);
  }
}

export const swissEphemerisService = new SwissEphemerisService();
