import type { SupportedLanguage } from "../types.js";

const PERMISSION_MESSAGES: Record<SupportedLanguage, string> = {
  hi: "क्या आप अपनी पूरी कुंडली का विस्तृत विश्लेषण देखना चाहते हैं?",
  hinglish: "Kya aap apni detailed kundli analysis dekhna chahte ho?",
  en: "Would you like to see your full detailed Kundli analysis?",
  mr: "तुम्हाला तुमच्या संपूर्ण कुंडलीचे सविस्तर विश्लेषण पाहायचे आहे का?"
};

export function getPermissionMessage(language: SupportedLanguage) {
  return PERMISSION_MESSAGES[language];
}

export function getAstrologerToneHint(language: SupportedLanguage) {
  if (language === "hi") {
    return "सरल हिंदी में समझाइए। भारी संस्कृत से बचिए। जरूरत हो तो शब्द का अर्थ भी बताइए।";
  }
  if (language === "hinglish") {
    return "Hinglish mein astrologer jaise samjhao. Friendly, practical, easy tone use karo.";
  }
  if (language === "mr") {
    return "सोप्या मराठीत समजवा. जड संस्कृत टाळा. गरज असेल तर शब्दाचा अर्थही समजवा.";
  }
  return "Explain in plain English with a warm astrologer-like tone.";
}
