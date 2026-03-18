import type { BirthInput, ChartSnapshot, CompatibilitySnapshot } from "../types.js";
import { swissEphemerisService } from "./swissEphemerisService.js";

function planet(chart: ChartSnapshot, name: string) {
  return chart.planetaryPositions.find((item) => item.planet === name);
}

function signDistance(a: string, b: string) {
  const signs = [
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
  ];

  const indexA = signs.indexOf(a);
  const indexB = signs.indexOf(b);
  if (indexA === -1 || indexB === -1) return 6;
  const diff = Math.abs(indexA - indexB);
  return Math.min(diff, 12 - diff);
}

function scoreByDistance(distance: number, maxScore: number) {
  const ratio = Math.max(0, 1 - distance / 6);
  return Number((ratio * maxScore).toFixed(1));
}

function manglik(chart: ChartSnapshot) {
  const mars = planet(chart, "Mars");
  return mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
}

function gunaItems(partnerA: ChartSnapshot, partnerB: ChartSnapshot) {
  const moonDistance = signDistance(partnerA.zodiacPlacements.moonSign, partnerB.zodiacPlacements.moonSign);
  const ascDistance = signDistance(partnerA.lagna, partnerB.lagna);
  const venusDistance = signDistance(planet(partnerA, "Venus")?.sign ?? "", planet(partnerB, "Venus")?.sign ?? "");
  const marsDistance = signDistance(planet(partnerA, "Mars")?.sign ?? "", planet(partnerB, "Mars")?.sign ?? "");
  const jupiterDistance = signDistance(planet(partnerA, "Jupiter")?.sign ?? "", planet(partnerB, "Jupiter")?.sign ?? "");
  const manglikA = manglik(partnerA);
  const manglikB = manglik(partnerB);

  return [
    {
      name: "Moon Harmony",
      maxScore: 8,
      obtainedScore: scoreByDistance(moonDistance, 8),
      description: `Moon sign alignment between ${partnerA.zodiacPlacements.moonSign} and ${partnerB.zodiacPlacements.moonSign}`
    },
    {
      name: "Ascendant Harmony",
      maxScore: 6,
      obtainedScore: scoreByDistance(ascDistance, 6),
      description: `Lagna balance between ${partnerA.lagna} and ${partnerB.lagna}`
    },
    {
      name: "Venus Support",
      maxScore: 7,
      obtainedScore: scoreByDistance(venusDistance, 7),
      description: "Love expression and attraction pattern"
    },
    {
      name: "Mars Chemistry",
      maxScore: 5,
      obtainedScore: scoreByDistance(marsDistance, 5),
      description: "Chemistry, drive, and conflict style"
    },
    {
      name: "Jupiter Values",
      maxScore: 5,
      obtainedScore: scoreByDistance(jupiterDistance, 5),
      description: "Values, wisdom, and family growth outlook"
    },
    {
      name: "Manglik Balance",
      maxScore: 5,
      obtainedScore: manglikA === manglikB ? 5 : 2.5,
      description: manglikA === manglikB ? "Manglik balance looks manageable" : "Manglik pattern needs added maturity"
    }
  ];
}

export async function buildCompatibilitySnapshot(partnerA: BirthInput, partnerB: BirthInput): Promise<CompatibilitySnapshot> {
  const [chartA, chartB] = await Promise.all([
    swissEphemerisService.generateKundli(partnerA),
    swissEphemerisService.generateKundli(partnerB)
  ]);

  const gunaMilan = gunaItems(chartA, chartB);
  const score = Number(gunaMilan.reduce((sum, item) => sum + item.obtainedScore, 0).toFixed(1));
  const maxScore = gunaMilan.reduce((sum, item) => sum + item.maxScore, 0);

  return {
    score,
    maxScore,
    strengthLevel: score >= 25 ? "Strong" : score >= 18 ? "Moderate" : "Needs Attention",
    partnerA: chartA,
    partnerB: chartB,
    gunaMilan
  };
}
