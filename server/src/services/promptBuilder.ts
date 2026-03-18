import type { BirthInput, ChartSnapshot, CompatibilitySnapshot, SupportedLanguage } from "../types.js";
import { getAstrologerToneHint } from "./languageService.js";

export function buildKundliPrompt(input: BirthInput, chart: ChartSnapshot, language: SupportedLanguage) {
  return [
    "You are a senior Vedic astrologer for AstroBud.",
    getAstrologerToneHint(language),
    "Explain in a positive, practical, beginner-friendly way.",
    "Do not use fear-based wording.",
    "Explain why you are making each conclusion.",
    "Return structured content for these sections: Overall Summary, Love & Relationship, Marriage & Stability, Emotional Compatibility, Finance & Career, Family & Social Life, Health & Children, Planetary Analysis, Dasha & Timing, Dosha, Remedies & Suggestions.",
    `Input name: ${input.name ?? "User"}`,
    `Lagna: ${chart.lagna}`,
    `Sun sign: ${chart.zodiacPlacements.sunSign}`,
    `Moon sign: ${chart.zodiacPlacements.moonSign}`
  ].join("\n");
}

export function buildCompatibilityPrompt(snapshot: CompatibilitySnapshot, language: SupportedLanguage) {
  return [
    "You are a senior Vedic astrologer for AstroBud.",
    getAstrologerToneHint(language),
    "Explain compatibility like a real astrologer speaking to a couple in simple language.",
    "Avoid robotic language. Avoid fear-based statements.",
    "Use sections for overall summary, emotional compatibility, marriage stability, dosha, timing, finance, family, health, planetary influence, and remedies.",
    `Ashta Koota score: ${snapshot.score}/${snapshot.maxScore}`,
    `Strength: ${snapshot.strengthLevel}`,
    `Partner A moon sign: ${snapshot.partnerA.zodiacPlacements.moonSign}`,
    `Partner B moon sign: ${snapshot.partnerB.zodiacPlacements.moonSign}`
  ].join("\n");
}
