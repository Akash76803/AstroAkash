import type {
  ChartSnapshot,
  CompatibilitySnapshot,
  DetailedReportData,
  PermissionResponse,
  PlanetPosition,
  SectionContent,
  SupportedLanguage
} from "../types.js";
import { getPermissionMessage } from "./languageService.js";

type LocalizedText = Record<SupportedLanguage, string>;

const PLANET_NAMES: Record<string, LocalizedText> = {
  Sun: { hi: "सूर्य", mr: "सूर्य", en: "Sun", hinglish: "Surya" },
  Moon: { hi: "चंद्र", mr: "चंद्र", en: "Moon", hinglish: "Chandra" },
  Mars: { hi: "मंगल", mr: "मंगळ", en: "Mars", hinglish: "Mangal" },
  Mercury: { hi: "बुध", mr: "बुध", en: "Mercury", hinglish: "Budh" },
  Jupiter: { hi: "गुरु", mr: "गुरु", en: "Jupiter", hinglish: "Guru" },
  Venus: { hi: "शुक्र", mr: "शुक्र", en: "Venus", hinglish: "Shukra" },
  Saturn: { hi: "शनि", mr: "शनि", en: "Saturn", hinglish: "Shani" },
  Rahu: { hi: "राहु", mr: "राहू", en: "Rahu", hinglish: "Rahu" },
  Ketu: { hi: "केतु", mr: "केतू", en: "Ketu", hinglish: "Ketu" }
};

const SIGN_NAMES: Record<string, LocalizedText> = {
  Aries: { hi: "मेष", mr: "मेष", en: "Aries", hinglish: "Mesh" },
  Taurus: { hi: "वृषभ", mr: "वृषभ", en: "Taurus", hinglish: "Vrishabh" },
  Gemini: { hi: "मिथुन", mr: "मिथुन", en: "Gemini", hinglish: "Mithun" },
  Cancer: { hi: "कर्क", mr: "कर्क", en: "Cancer", hinglish: "Kark" },
  Leo: { hi: "सिंह", mr: "सिंह", en: "Leo", hinglish: "Singh" },
  Virgo: { hi: "कन्या", mr: "कन्या", en: "Virgo", hinglish: "Kanya" },
  Libra: { hi: "तुला", mr: "तुला", en: "Libra", hinglish: "Tula" },
  Scorpio: { hi: "वृश्चिक", mr: "वृश्चिक", en: "Scorpio", hinglish: "Vrishchik" },
  Sagittarius: { hi: "धनु", mr: "धनु", en: "Sagittarius", hinglish: "Dhanu" },
  Capricorn: { hi: "मकर", mr: "मकर", en: "Capricorn", hinglish: "Makar" },
  Aquarius: { hi: "कुंभ", mr: "कुंभ", en: "Aquarius", hinglish: "Kumbh" },
  Pisces: { hi: "मीन", mr: "मीन", en: "Pisces", hinglish: "Meen" }
};

const SIGN_QUALITIES: Record<string, LocalizedText> = {
  Aries: { hi: "साहस, पहल और तेज निर्णय", mr: "धाडस, पुढाकार आणि जलद निर्णय", en: "courage, initiative, and quick action", hinglish: "himmat, initiative, aur quick action" },
  Taurus: { hi: "स्थिरता, धैर्य और भौतिक सुरक्षा", mr: "स्थिरता, संयम आणि भौतिक सुरक्षितता", en: "stability, patience, and material security", hinglish: "stability, patience, aur material security" },
  Gemini: { hi: "बातचीत, जिज्ञासा और मानसिक चंचलता", mr: "संवाद, जिज्ञासा आणि मानसिक चपळता", en: "communication, curiosity, and mental agility", hinglish: "communication, curiosity, aur mental agility" },
  Cancer: { hi: "भावना, सुरक्षा और परिवार की भावना", mr: "भावना, सुरक्षिततेची गरज आणि कुटुंबकेंद्री वृत्ती", en: "emotion, security, and family-mindedness", hinglish: "emotion, security, aur family focus" },
  Leo: { hi: "आत्मविश्वास, पहचान और अभिव्यक्ति", mr: "आत्मविश्वास, ओळख आणि अभिव्यक्ती", en: "confidence, identity, and expression", hinglish: "confidence, identity, aur expression" },
  Virgo: { hi: "विश्लेषण, व्यवस्था और सुधार की प्रवृत्ति", mr: "विश्लेषण, शिस्त आणि सुधारणा करण्याची वृत्ती", en: "analysis, order, and the urge to improve", hinglish: "analysis, order, aur improvement mindset" },
  Libra: { hi: "संतुलन, संबंध और न्याय की समझ", mr: "समतोल, संबंध आणि न्यायबुद्धी", en: "balance, relationships, and fairness", hinglish: "balance, relationships, aur fairness" },
  Scorpio: { hi: "गहराई, गोपनीयता और परिवर्तन", mr: "गूढता, अंतर्मुखता आणि परिवर्तन", en: "depth, secrecy, and transformation", hinglish: "depth, secrecy, aur transformation" },
  Sagittarius: { hi: "विस्तार, विश्वास और सीखने की इच्छा", mr: "विस्तार, श्रद्धा आणि शिकण्याची ओढ", en: "expansion, belief, and a love of learning", hinglish: "expansion, belief, aur learning" },
  Capricorn: { hi: "अनुशासन, जिम्मेदारी और दीर्घकालिक सोच", mr: "शिस्त, जबाबदारी आणि दीर्घकालीन विचार", en: "discipline, responsibility, and long-term thinking", hinglish: "discipline, responsibility, aur long-term thinking" },
  Aquarius: { hi: "स्वतंत्र सोच, व्यवस्था और अलग दृष्टिकोण", mr: "स्वतंत्र विचार, रचना आणि वेगळा दृष्टिकोन", en: "independent thought, systems, and unconventional perspective", hinglish: "independent soch, systems, aur alag nazariya" },
  Pisces: { hi: "संवेदनशीलता, अंतर्ज्ञान और करुणा", mr: "संवेदनशीलता, अंतर्ज्ञान आणि करुणा", en: "sensitivity, intuition, and compassion", hinglish: "sensitivity, intuition, aur compassion" }
};

const OWN_SIGNS: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"]
};

const EXALTED_SIGNS: Record<string, string> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra"
};

const DEBILITATED_SIGNS: Record<string, string> = {
  Sun: "Libra",
  Moon: "Scorpio",
  Mars: "Cancer",
  Mercury: "Pisces",
  Jupiter: "Capricorn",
  Venus: "Virgo",
  Saturn: "Aries"
};

function t(language: SupportedLanguage, text: LocalizedText) {
  return text[language];
}

function localPlanetName(name: string, language: SupportedLanguage) {
  return PLANET_NAMES[name]?.[language] ?? name;
}

function localSignName(name: string, language: SupportedLanguage) {
  return SIGN_NAMES[name]?.[language] ?? name;
}

function localSignQuality(name: string, language: SupportedLanguage) {
  return SIGN_QUALITIES[name]?.[language] ?? name;
}

function section(language: SupportedLanguage, title: LocalizedText, body: string): SectionContent {
  return { title: t(language, title), body };
}

function planet(chart: ChartSnapshot, name: string) {
  return chart.planetaryPositions.find((item) => item.planet === name);
}

function houseSign(chart: ChartSnapshot, house: number) {
  return chart.houses.find((item) => item.house === house)?.sign ?? "Unknown";
}

function signDistance(a: string, b: string) {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const first = signs.indexOf(a);
  const second = signs.indexOf(b);
  if (first < 0 || second < 0) return 6;
  const diff = Math.abs(first - second);
  return Math.min(diff, 12 - diff);
}

function isManglik(chart: ChartSnapshot) {
  const mars = planet(chart, "Mars");
  return mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
}

function strengthLabel(score: number, maxScore: number) {
  const ratio = score / maxScore;
  if (ratio >= 0.7) return "Strong";
  if (ratio >= 0.5) return "Moderate";
  return "Needs Attention";
}

function planetCondition(item: PlanetPosition | undefined) {
  if (!item) return "neutral";
  if (EXALTED_SIGNS[item.planet] === item.sign) return "exalted";
  if (DEBILITATED_SIGNS[item.planet] === item.sign) return "debilitated";
  if (OWN_SIGNS[item.planet]?.includes(item.sign)) return "own";
  return "neutral";
}

function conditionSentence(item: PlanetPosition | undefined, language: SupportedLanguage) {
  if (!item) return "";
  const condition = planetCondition(item);
  const name = localPlanetName(item.planet, language);

  if (condition === "exalted") {
    return t(language, {
      hi: `${name} यहाँ मज़बूत अवस्था में माना जाता है, इसलिए इसके परिणाम अधिक स्पष्ट, प्रभावी और रचनात्मक रूप में दिखाई देते हैं।`,
      mr: `${name} येथे बलवान स्थितीत मानला जातो, त्यामुळे याचे परिणाम अधिक स्पष्ट, प्रभावी आणि रचनात्मक पद्धतीने दिसतात।`,
      en: `${name} is considered strong here, so its results usually appear in a clearer, more effective, and more constructive way.`,
      hinglish: `${name} yahan strong maana jata hai, isliye iske results zyada clear, effective, aur constructive tareeke se dikhte hain.`
    });
  }

  if (condition === "own") {
    return t(language, {
      hi: `${name} अपनी ही राशि में होने के कारण स्वाभाविक रूप से संतुलित ढंग से काम करता है और अपनी शक्ति को सहज रूप में प्रकट करता है।`,
      mr: `${name} स्वतःच्या राशीत असल्यामुळे तो स्वाभाविकपणे संतुलित पद्धतीने कार्य करतो आणि स्वतःची शक्ती सहजपणे व्यक्त करतो।`,
      en: `${name} is in its own sign, so it works in a more natural and balanced way and expresses its strength with less friction.`,
      hinglish: `${name} apni hi sign me hai, isliye yeh natural aur balanced tareeke se kaam karta hai aur apni strength ko aasani se express karta hai.`
    });
  }

  if (condition === "debilitated") {
    return t(language, {
      hi: `${name} यहाँ कमजोर अवस्था में माना जाता है, इसलिए इससे जुड़े विषयों में परिपक्वता, धैर्य और सचेत प्रयास की आवश्यकता बढ़ जाती है।`,
      mr: `${name} येथे दुर्बल अवस्थेत मानला जातो, त्यामुळे याच्याशी संबंधित विषयांमध्ये परिपक्वता, संयम आणि जाणीवपूर्वक प्रयत्नांची गरज वाढते।`,
      en: `${name} is considered weak here, so the areas ruled by it usually demand more maturity, patience, and conscious effort.`,
      hinglish: `${name} yahan weak maana jata hai, isliye isse jude areas me maturity, patience, aur conscious effort ki zarurat badh jaati hai.`
    });
  }

  return t(language, {
    hi: `${name} यहाँ मिश्रित परिणाम देता है, इसलिए इसके प्रभाव को समझने के लिए राशि के साथ-साथ भाव-स्थिति को भी ध्यान से देखना पड़ता है।`,
    mr: `${name} येथे मिश्र परिणाम देतो, त्यामुळे त्याचा प्रभाव समजण्यासाठी राशीसोबत भावस्थितीही लक्षपूर्वक पाहावी लागते।`,
    en: `${name} gives mixed results here, so its effect must be judged through both sign and house placement together.`,
    hinglish: `${name} yahan mixed result deta hai, isliye iska effect samajhne ke liye sign aur house dono ko saath me dekhna zaroori hai.`
  });
}

function ordinal(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return "th";
  if (n % 10 === 1) return "st";
  if (n % 10 === 2) return "nd";
  if (n % 10 === 3) return "rd";
  return "th";
}

function placementSentence(item: PlanetPosition | undefined, language: SupportedLanguage) {
  if (!item) return "";
  const name = localPlanetName(item.planet, language);
  const sign = localSignName(item.sign, language);

  return t(language, {
    hi: `आपकी कुंडली में ${name} ${sign} राशि में ${item.house}वें भाव में स्थित है। ${conditionSentence(item, language)}`,
    mr: `तुमच्या कुंडलीत ${name} ${sign} राशीत ${item.house}व्या भावात स्थित आहे। ${conditionSentence(item, language)}`,
    en: `In your chart, ${name} is placed in ${sign} in the ${item.house}${ordinal(item.house)} house. ${conditionSentence(item, language)}`,
    hinglish: `Aapki kundli me ${name} ${sign} sign me house ${item.house} me baitha hai. ${conditionSentence(item, language)}`
  });
}

function paragraph(lines: string[]) {
  return lines.filter(Boolean).join(" ");
}

function summaryLine(chart: ChartSnapshot, language: SupportedLanguage) {
  const dasha = chart.dasha && !Array.isArray(chart.dasha) ? chart.dasha.currentMahadasha : null;
  const lagna = localSignName(chart.lagna, language);
  const moonSign = localSignName(chart.zodiacPlacements.moonSign, language);
  const sunSign = localSignName(chart.zodiacPlacements.sunSign, language);

  return paragraph([
    t(language, {
      hi: `आपकी कुंडली का मूल स्वर ${lagna} लग्न, ${moonSign} चंद्र राशि और ${sunSign} सूर्य राशि से बनता है।`,
      mr: `तुमच्या कुंडलीचा मूलस्वर ${lagna} लग्न, ${moonSign} चंद्रराशी आणि ${sunSign} सूर्यराशी यांच्यामुळे तयार होतो।`,
      en: `The core tone of your chart is shaped by ${lagna} ascendant, ${moonSign} Moon sign, and ${sunSign} Sun sign.`,
      hinglish: `Aapki kundli ka core tone ${lagna} lagna, ${moonSign} Moon sign, aur ${sunSign} Sun sign se banta hai.`
    }),
    t(language, {
      hi: `इस संयोजन के कारण आपके स्वभाव में ${localSignQuality(chart.lagna, language)} जैसी प्रवृत्तियाँ स्पष्ट दिखाई देती हैं।`,
      mr: `या संयोगामुळे तुमच्या स्वभावात ${localSignQuality(chart.lagna, language)} अशा प्रवृत्ती स्पष्ट दिसतात।`,
      en: `Because of this combination, your temperament naturally reflects ${localSignQuality(chart.lagna, language)}.`,
      hinglish: `Is combination ki wajah se aapke swabhav me ${localSignQuality(chart.lagna, language)} jaisi qualities naturally dikhti hain.`
    }),
    t(language, {
      hi: `चंद्र राशि आपके मन और भावनात्मक प्रतिक्रिया को दिशा देती है, जबकि सूर्य आपकी पहचान, आत्मविश्वास और जीवन की मुख्य दिशा को मज़बूत करता है।`,
      mr: `चंद्रराशी तुमच्या मनाला आणि भावनिक प्रतिसादाला दिशा देते, तर सूर्य तुमची ओळख, आत्मविश्वास आणि जीवनाची मुख्य दिशा दृढ करतो।`,
      en: `The Moon sign governs your inner emotional response, while the Sun strengthens identity, confidence, and life direction.`,
      hinglish: `Moon sign aapki emotional response ko guide karta hai, jabki Sun aapki identity, confidence, aur life direction ko strong banata hai.`
    }),
    dasha
      ? t(language, {
          hi: `वर्तमान में ${localPlanetName(dasha, language)} महादशा चल रही है, इसलिए इसी ग्रह से जुड़े विषय इस समय आपके जीवन में अधिक सक्रिय और प्रभावशाली बने रहते हैं।`,
          mr: `सध्या ${localPlanetName(dasha, language)} महादशा चालू आहे, त्यामुळे याच ग्रहाशी संबंधित विषय सध्या तुमच्या जीवनात अधिक सक्रिय आणि प्रभावी राहतात।`,
          en: `You are currently under ${localPlanetName(dasha, language)} Mahadasha, so themes ruled by that planet are especially active in this phase of life.`,
          hinglish: `Filhaal ${localPlanetName(dasha, language)} Mahadasha chal rahi hai, isliye us planet se jude topics abhi life me zyada active hain.`
        })
      : ""
  ]);
}

export function buildPermissionResponse(language: SupportedLanguage, summary: string): PermissionResponse {
  return {
    permission_required: true,
    message: getPermissionMessage(language),
    language,
    data: { summary }
  };
}

function remedyText(chart: ChartSnapshot, language: SupportedLanguage) {
  const dasha = chart.dasha && !Array.isArray(chart.dasha) ? chart.dasha.currentMahadasha : null;
  const manglik = isManglik(chart);

  return paragraph([
    t(language, {
      hi: `इस कुंडली के अनुसार सबसे उपयोगी उपाय डर पैदा करने वाले नहीं, बल्कि व्यवहार में सुधार लाने वाले हैं।`,
      mr: `या कुंडलीनुसार सर्वात उपयुक्त उपाय भय निर्माण करणारे नसून वर्तनात सुधारणा घडवणारे आहेत।`,
      en: `According to this chart, the most useful remedies are not fear-based rituals but practical changes in behaviour.`,
      hinglish: `Is kundli ke hisaab se sabse useful remedies fear-based nahi, balki behaviour improve karne wale hain.`
    }),
    t(language, {
      hi: `नियमित दिनचर्या, भावनात्मक असंतुलन के समय शांत और स्पष्ट संवाद, तथा बड़े निर्णयों से पहले ठहरकर विचार करना आपके लिए विशेष रूप से लाभकारी रहेगा।`,
      mr: `नियमित दिनचर्या, भावनिक असंतुलनाच्या वेळी शांत आणि स्पष्ट संवाद, तसेच मोठ्या निर्णयांपूर्वी थांबून विचार करणे तुमच्यासाठी विशेष लाभदायक ठरेल।`,
      en: `A steady routine, calm and clear communication during emotional imbalance, and reflective pauses before major decisions will benefit you greatly.`,
      hinglish: `Regular routine, emotional imbalance ke waqt calm aur clear communication, aur bade decisions se pehle ruk kar sochna aapke liye bahut beneficial rahega.`
    }),
    manglik
      ? t(language, {
          hi: `मंगल की संवेदनशील स्थिति होने के कारण क्रोध, प्रतिक्रिया की गति और अहंकारजन्य टकराव पर विशेष नियंत्रण रखना ज़रूरी है।`,
          mr: `मंगळाची संवेदनशील स्थिती असल्यामुळे राग, प्रतिक्रियेचा वेग आणि अहंकारातून निर्माण होणाऱ्या संघर्षावर विशेष नियंत्रण ठेवणं आवश्यक आहे।`,
          en: `Because Mars is sensitive in this chart, it is important to consciously regulate anger, reaction speed, and ego-driven conflict.`,
          hinglish: `Mars sensitive hone ki wajah se anger, reaction speed, aur ego-based conflict ko consciously control karna zaroori hai.`
        })
      : t(language, {
          hi: `मंगल का तीखा दोष स्पष्ट नहीं है, इसलिए संतुलित व्यवहार और धैर्य ही सबसे प्रभावी सुरक्षा बनते हैं।`,
          mr: `मंगळाचा तीव्र दोष स्पष्ट नाही, त्यामुळे संतुलित वर्तन आणि संयम हीच सर्वात प्रभावी सुरक्षा ठरते।`,
          en: `A sharp Mars-related dosha is not strongly visible, so balanced behaviour and patience themselves become the most effective remedy.`,
          hinglish: `Tez Mars dosha strongly visible nahi hai, isliye balanced behaviour aur patience hi sabse effective remedy bante hain.`
        }),
    dasha
      ? t(language, {
          hi: `चूँकि ${localPlanetName(dasha, language)} महादशा सक्रिय है, इसलिए इस ग्रह के विषयों से जुड़े निर्णयों में जल्दबाज़ी के बजाय विवेकपूर्ण दृष्टि रखना अधिक शुभ रहेगा।`,
          mr: `कारण ${localPlanetName(dasha, language)} महादशा सक्रिय आहे, त्यामुळे या ग्रहाशी संबंधित निर्णयांमध्ये घाई करण्यापेक्षा विचारपूर्वक दृष्टिकोन ठेवणं अधिक शुभ ठरेल।`,
          en: `Since ${localPlanetName(dasha, language)} Mahadasha is active, decisions related to that planet's themes will benefit more from discretion than haste.`,
          hinglish: `Kyuki ${localPlanetName(dasha, language)} Mahadasha active hai, isliye us planet ke topics me jaldi karne ke bajay soch-samajh kar decision lena better rahega.`
        })
      : ""
  ]);
}

export function composeKundliReport(chart: ChartSnapshot, language: SupportedLanguage): DetailedReportData {
  const moon = planet(chart, "Moon");
  const venus = planet(chart, "Venus");
  const mars = planet(chart, "Mars");
  const mercury = planet(chart, "Mercury");
  const jupiter = planet(chart, "Jupiter");
  const saturn = planet(chart, "Saturn");
  const rahu = planet(chart, "Rahu");
  const ketu = planet(chart, "Ketu");
  const dasha = chart.dasha && !Array.isArray(chart.dasha) ? chart.dasha : null;
  const seventh = houseSign(chart, 7);
  const second = houseSign(chart, 2);
  const third = houseSign(chart, 3);
  const fifth = houseSign(chart, 5);
  const sixth = houseSign(chart, 6);
  const tenth = houseSign(chart, 10);

  const sections = [
    section(language, { hi: "समग्र सार", mr: "एकूण सारांश", en: "Overall Summary", hinglish: "Overall Summary" }, summaryLine(chart, language)),
    section(language, { hi: "रिश्ता और भावनात्मक जुड़ाव", mr: "नातेसंबंध आणि भावनिक जुळवण", en: "Relationship & Emotional Bonding", hinglish: "Relationship & Emotional Bonding" }, paragraph([
      placementSentence(venus, language),
      placementSentence(moon, language),
      t(language, {
        hi: `शुक्र प्रेम, आकर्षण और संबंधों की मिठास का कारक है, इसलिए इसकी राशि और भाव स्थिति सीधे बताती है कि आप प्रेम को किस रूप में जीते हैं।`,
        mr: `शुक्र हा प्रेम, आकर्षण आणि नात्यातील गोडवा यांचा कारक असल्यामुळे त्याची रास आणि भावस्थिती तुम्ही प्रेम कसं जगता हे थेट दाखवते।`,
        en: `Venus governs affection, attraction, and relational sweetness, so its sign and house directly show how you experience love.`,
        hinglish: `Shukra love, attraction, aur relationship sweetness ka karak hai, isliye uski sign aur house placement batati hai ki aap pyaar ko kaise jeete ho.`
      }),
      t(language, {
        hi: `चंद्र की स्थिति यह स्पष्ट करती है कि आपको केवल प्रेम का प्रदर्शन नहीं, बल्कि भावनात्मक आश्वासन और मन की सुरक्षा भी उतनी ही आवश्यक है।`,
        mr: `चंद्राची स्थिती स्पष्ट सांगते की तुम्हाला फक्त प्रेमाचं प्रदर्शन पुरेसं नसून भावनिक खात्री आणि मनाची सुरक्षितता तितकीच आवश्यक आहे।`,
        en: `The Moon shows that visible affection alone is not enough for you; emotional assurance and inner safety are equally necessary.`,
        hinglish: `Chandra ki placement dikhati hai ki sirf pyaar ka display kaafi nahi hota; emotional assurance aur inner safety bhi utni hi zaroori hoti hai.`
      }),
      t(language, {
        hi: `सप्तम भाव ${localSignName(seventh, language)} राशि में होने से आप संबंधों में ${localSignQuality(seventh, language)} जैसी प्रवृत्ति लेकर आते हैं, इसलिए रिश्ते में संतुलन और साझेदारी का विषय बहुत प्रमुख रहता है।`,
        mr: `सप्तम भाव ${localSignName(seventh, language)} राशीत असल्यामुळे तुम्ही नात्यात ${localSignQuality(seventh, language)} अशा गुणांसह प्रवेश करता, त्यामुळे नात्यात समतोल आणि भागीदारीचा विषय खूप महत्त्वाचा ठरतो।`,
        en: `Because the 7th house falls in ${localSignName(seventh, language)}, you bring ${localSignQuality(seventh, language)} into partnership, making that quality central in committed relationships.`,
        hinglish: `7th house ${localSignName(seventh, language)} me hone ki wajah se aap relationship me ${localSignQuality(seventh, language)} wali quality lekar aate ho, isliye partnership me wahi theme bahut important ho jati hai.`
      }),
      t(language, {
        hi: `व्यवहारिक जीवन में इसका अर्थ है कि आपका रिश्ता तभी गहरा और स्थिर बनता है जब प्रेम के साथ भावनात्मक विश्वसनीयता भी बनी रहे।`,
        mr: `व्यवहारात याचा अर्थ असा की तुमचं नातं तेव्हाच अधिक खोल आणि स्थिर होतं जेव्हा प्रेमासोबत भावनिक विश्वासार्हताही टिकून राहते।`,
        en: `In practical life, this means your relationships deepen and stabilise only when affection is matched by emotional reliability.`,
        hinglish: `Practical life me iska matlab hai ki relationship tabhi gehra aur stable banta hai jab pyaar ke saath emotional reliability bhi bani rahe.`
      })
    ])),
    section(language, { hi: "संवाद और आपसी समझ", mr: "संवाद आणि परस्पर समज", en: "Communication & Understanding", hinglish: "Communication & Understanding" }, paragraph([
      placementSentence(mercury, language),
      t(language, {
        hi: `बुध आपकी सोच, बोलने का ढंग, निर्णय की शैली और तर्कशक्ति का प्रतिनिधित्व करता है, इसलिए इसकी स्थिति यह बताती है कि आप बातों को किस तरह ग्रहण और व्यक्त करते हैं।`,
        mr: `बुध तुमची विचारपद्धती, बोलण्याची शैली, निर्णय घेण्याची पद्धत आणि तर्कशक्ती दाखवतो, त्यामुळे त्याची स्थिती तुम्ही गोष्टी कशा समजता आणि व्यक्त करता हे सांगते।`,
        en: `Mercury represents thinking style, speech, reasoning, and interpretation, so its placement reveals how you process and express ideas.`,
        hinglish: `Budh thinking style, speech, aur logic ko represent karta hai, isliye uski placement batati hai ki aap baaton ko kaise samajhte aur express karte ho.`
      }),
      t(language, {
        hi: `तृतीय भाव ${localSignName(third, language)} राशि में होने से बातचीत में ${localSignQuality(third, language)} का प्रभाव आता है, इसलिए आपकी वाणी और समझने की शैली इसी गुण से प्रभावित होती है।`,
        mr: `तृतीय भाव ${localSignName(third, language)} राशीत असल्यामुळे संवादात ${localSignQuality(third, language)} यांचा प्रभाव येतो, त्यामुळे तुमची वाणी आणि समजण्याची शैली या गुणांनी प्रभावित होते।`,
        en: `The 3rd house in ${localSignName(third, language)} colours communication with ${localSignQuality(third, language)}, influencing your speech and understanding style.`,
        hinglish: `3rd house ${localSignName(third, language)} me hone se communication par ${localSignQuality(third, language)} ka effect aata hai, isliye aapki speech aur understanding style isi se shape hoti hai.`
      }),
      t(language, {
        hi: `वास्तविक जीवन में इसका परिणाम यह होता है कि यदि संवाद शांत, स्पष्ट और समय पर रहे तो रिश्तों में बहुत सी उलझनें अपने आप कम हो जाती हैं।`,
        mr: `प्रत्यक्ष जीवनात याचा परिणाम असा होतो की संवाद शांत, स्पष्ट आणि योग्य वेळी झाला तर नात्यातील अनेक गुंतागुंती आपोआप कमी होतात।`,
        en: `In practical life, this means many relational complications reduce on their own when communication remains calm, clear, and timely.`,
        hinglish: `Real life me iska matlab hai ki agar communication calm, clear, aur time par ho, to relationship ki kai complications apne aap kam ho jaati hain.`
      })
    ])),
    section(language, { hi: "विवाह की स्थिरता", mr: "विवाहातील स्थैर्य", en: "Marriage Stability", hinglish: "Marriage Stability" }, paragraph([
      placementSentence(venus, language),
      placementSentence(saturn, language),
      t(language, {
        hi: `विवाह के विश्लेषण में सप्तम भाव, शुक्र और शनि तीनों को साथ देखना आवश्यक होता है, क्योंकि यही तीन बिंदु साथ मिलकर आकर्षण, प्रतिबद्धता और दीर्घकालिक स्थिरता को स्पष्ट करते हैं।`,
        mr: `विवाहाच्या विश्लेषणात सप्तम भाव, शुक्र आणि शनि या तिन्ही गोष्टी एकत्र पाहणं आवश्यक असतं, कारण आकर्षण, बांधिलकी आणि दीर्घकालीन स्थैर्य याच तिन्हींच्या साहाय्याने समजतं।`,
        en: `For marriage, the 7th house, Venus, and Saturn must be judged together because attraction, commitment, and long-term stability all emerge through this combination.`,
        hinglish: `Marriage ko samajhne ke liye 7th house, Shukra, aur Shani ko saath me dekhna zaroori hota hai, kyunki attraction, commitment, aur long-term stability isi combination se samajh aati hai.`
      }),
      t(language, {
        hi: `शनि की स्थिति बताती है कि विवाह केवल भावना पर नहीं, बल्कि जिम्मेदारी, धैर्य और समय के साथ निभाने की क्षमता पर भी खड़ा रहता है।`,
        mr: `शनीची स्थिती दाखवते की विवाह फक्त भावनेवर उभा राहत नाही, तर जबाबदारी, संयम आणि काळाबरोबर निभावून नेण्याच्या क्षमतेवरही टिकतो।`,
        en: `Saturn shows that marriage does not stand on emotion alone; it rests equally on responsibility, patience, and the ability to sustain effort over time.`,
        hinglish: `Shani dikhata hai ki marriage sirf emotion par nahi tikti; usme responsibility, patience, aur time ke saath nibhane ki capacity bhi chahiye hoti hai.`
      }),
      t(language, {
        hi: `व्यावहारिक तौर पर यह कुंडली बताती है कि विवाह को सफल बनाने के लिए भावनात्मक जुड़ाव के साथ रोज़मर्रा की जिम्मेदारियों में भी समान भागीदारी ज़रूरी रहेगी।`,
        mr: `व्यवहारात ही कुंडली सांगते की विवाह यशस्वी ठेवण्यासाठी भावनिक जुळवणुकीसोबत दैनंदिन जबाबदाऱ्यांमध्येही समतोल सहभाग आवश्यक आहे।`,
        en: `Practically, this chart suggests that marriage succeeds not only through emotional bonding but also through fair participation in everyday responsibilities.`,
        hinglish: `Practical level par yeh chart dikhata hai ki marriage sirf emotional bonding se nahi, balki daily responsibilities me fair participation se bhi successful banti hai.`
      })
    ]))
  ];

  sections.push(
    section(language, { hi: "शारीरिक और दांपत्य निकटता", mr: "शारीरिक आणि दांपत्य जवळीक", en: "Physical & Sexual Compatibility", hinglish: "Physical & Sexual Compatibility" }, paragraph([
      placementSentence(mars, language),
      placementSentence(venus, language),
      t(language, {
        hi: `शारीरिक आकर्षण और दांपत्य निकटता के लिए मंगल और शुक्र दोनों का अध्ययन आवश्यक होता है, क्योंकि मंगल इच्छा और शारीरिक ऊर्जा देता है, जबकि शुक्र उसमें कोमलता, आकर्षण और भावनात्मक आनंद जोड़ता है।`,
        mr: `शारीरिक आकर्षण आणि दांपत्य जवळीक समजण्यासाठी मंगळ आणि शुक्र दोघांचाही अभ्यास महत्त्वाचा असतो, कारण मंगळ इच्छा आणि शारीरिक ऊर्जा देतो, तर शुक्र त्यात कोमलता, आकर्षण आणि भावनिक आनंद भरतो।`,
        en: `Physical and intimate compatibility depends heavily on Mars and Venus together, because Mars brings desire and physical energy, while Venus adds tenderness, attraction, and emotional pleasure.`,
        hinglish: `Physical aur intimate compatibility ko samajhne ke liye Mangal aur Shukra dono important hote hain, kyunki Mangal desire aur physical energy deta hai aur Shukra usme tenderness aur attraction jodta hai.`
      }),
      t(language, {
        hi: `इस कुंडली में दांपत्य निकटता का सुख केवल शारीरिक स्तर पर नहीं, बल्कि भावनात्मक विश्वास और पारस्परिक सम्मान पर भी बहुत निर्भर करेगा।`,
        mr: `या कुंडलीत दांपत्य जवळिकीचं सुख फक्त शारीरिक पातळीवर नाही, तर भावनिक विश्वास आणि परस्पर आदरावरही खूप अवलंबून असेल।`,
        en: `In this chart, intimate satisfaction will not depend on the physical layer alone; it will also depend strongly on trust and mutual respect.`,
        hinglish: `Is kundli me intimate satisfaction sirf physical level par depend nahi karegi; trust aur mutual respect bhi utne hi important rahenge.`
      })
    ])),
    section(language, { hi: "धन और करियर का सामंजस्य", mr: "आर्थिक आणि करिअरमधील सुसंगती", en: "Finance & Career Alignment", hinglish: "Finance & Career Alignment" }, paragraph([
      placementSentence(jupiter, language),
      placementSentence(mercury, language),
      t(language, {
        hi: `धन, निर्णय क्षमता और पेशेवर दिशा को समझने के लिए बुध, गुरु, सूर्य और दशम भाव को साथ देखना चाहिए।`,
        mr: `आर्थिक स्थिती, निर्णयक्षमता आणि व्यावसायिक दिशा समजण्यासाठी बुध, गुरु, सूर्य आणि दशम भाव एकत्र पाहणे आवश्यक आहे।`,
        en: `To understand finance, professional direction, and decision-making, Mercury, Jupiter, the Sun, and the 10th house should be studied together.`,
        hinglish: `Finance, career direction, aur decision-making ko samajhne ke liye Budh, Guru, Surya, aur 10th house ko saath me dekhna chahiye.`
      }),
      t(language, {
        hi: `दशम भाव ${localSignName(tenth, language)} राशि में होने के कारण करियर में ${localSignQuality(tenth, language)} जैसे गुण काम करते हैं, इसलिए आपकी पेशेवर प्रगति इसी स्वभाव से प्रभावित होती है।`,
        mr: `दशम भाव ${localSignName(tenth, language)} राशीत असल्यामुळे करिअरमध्ये ${localSignQuality(tenth, language)} हे गुण कार्यरत राहतात, त्यामुळे तुमची व्यावसायिक प्रगती या स्वभावाने प्रभावित होते।`,
        en: `Because the 10th house falls in ${localSignName(tenth, language)}, career expresses itself through ${localSignQuality(tenth, language)}, and professional progress is shaped by that quality.`,
        hinglish: `10th house ${localSignName(tenth, language)} me hone ki wajah se career me ${localSignQuality(tenth, language)} wali quality kaam karti hai, aur professional progress usi se shape hoti hai.`
      }),
      t(language, {
        hi: `व्यावहारिक जीवन में इसका अर्थ यह है कि सही योजना, धैर्य और साफ़ आर्थिक दृष्टि आपको करियर और धन दोनों में स्थिर वृद्धि दिला सकती है।`,
        mr: `व्यवहारात याचा अर्थ असा की योग्य नियोजन, संयम आणि स्पष्ट आर्थिक दृष्टी तुम्हाला करिअर आणि धन या दोन्हीमध्ये स्थिर वाढ देऊ शकते।`,
        en: `In practical life, this means thoughtful planning, patience, and financial clarity can bring steady growth in both career and wealth.`,
        hinglish: `Practical life me iska matlab hai ki thoughtful planning, patience, aur financial clarity aapko career aur paisa dono me steady growth de sakte hain.`
      })
    ])),
    section(language, { hi: "परिवार और सामाजिक जीवन", mr: "कुटुंब आणि सामाजिक जीवन", en: "Family & Social Life", hinglish: "Family & Social Life" }, paragraph([
      t(language, {
        hi: `कुंडली में परिवार को समझने के लिए द्वितीय भाव, चतुर्थ भाव, चंद्र और लग्न का विशेष महत्व होता है।`,
        mr: `कुंडलीत कुटुंबजीवन समजण्यासाठी द्वितीय भाव, चतुर्थ भाव, चंद्र आणि लग्न यांना विशेष महत्त्व असतं।`,
        en: `To understand family and social life, the 2nd house, 4th house, Moon, and ascendant are especially important.`,
        hinglish: `Family aur social life ko samajhne ke liye 2nd house, 4th house, Chandra, aur lagna ka special importance hota hai.`
      }),
      t(language, {
        hi: `द्वितीय भाव ${localSignName(second, language)} राशि में होने से परिवार, वाणी और आर्थिक संस्कारों में ${localSignQuality(second, language)} का प्रभाव दिखाई देता है।`,
        mr: `द्वितीय भाव ${localSignName(second, language)} राशीत असल्यामुळे कुटुंब, वाणी आणि आर्थिक संस्कारांमध्ये ${localSignQuality(second, language)} यांचा प्रभाव दिसतो।`,
        en: `With the 2nd house in ${localSignName(second, language)}, family values, speech, and inherited financial habits are coloured by ${localSignQuality(second, language)}.`,
        hinglish: `2nd house ${localSignName(second, language)} me hone se family values, speech, aur financial habits par ${localSignQuality(second, language)} ka effect aata hai.`
      }),
      t(language, {
        hi: `इस कुंडली के अनुसार परिवार में सम्मान तभी बढ़ेगा जब आप जिम्मेदारी के साथ अपनी व्यक्तिगत सीमाओं को भी स्वस्थ रूप से बनाए रखेंगे।`,
        mr: `या कुंडलीनुसार कुटुंबात मान आणि सन्मान तेव्हाच वाढेल जेव्हा तुम्ही जबाबदारीसोबत स्वतःच्या मर्यादाही आरोग्यदायी पद्धतीने टिकवून ठेवाल।`,
        en: `According to this chart, respect within family grows best when responsibility is balanced with healthy personal boundaries.`,
        hinglish: `Is chart ke mutabik family me respect tabhi badhega jab aap responsibility ke saath healthy personal boundaries bhi maintain karoge.`
      })
    ])),
    section(language, { hi: "मानसिक सामंजस्य", mr: "मानसिक सुसंगती", en: "Mental Compatibility", hinglish: "Mental Compatibility" }, paragraph([
      placementSentence(moon, language),
      placementSentence(mercury, language),
      t(language, {
        hi: `मानसिक सामंजस्य का आधार केवल चंद्र नहीं, बल्कि चंद्र और बुध के पारस्परिक संकेतों में छिपा होता है।`,
        mr: `मानसिक सुसंगतीचा आधार फक्त चंद्रात नसून चंद्र आणि बुध यांच्या परस्पर संकेतांत दडलेला असतो।`,
        en: `Mental compatibility is not judged by the Moon alone; it emerges from the combined signals of the Moon and Mercury.`,
        hinglish: `Mental compatibility sirf Chandra se nahi samajhi jaati; yeh Chandra aur Budh ke combined signals se samajh aati hai.`
      }),
      t(language, {
        hi: `यही कारण है कि इस कुंडली में मानसिक शांति के लिए केवल तर्क नहीं, बल्कि समझदारी भरा भावनात्मक संवाद भी आवश्यक रहेगा।`,
        mr: `म्हणूनच या कुंडलीत मानसिक शांततेसाठी फक्त तर्क पुरेसा नाही; समजूतदार भावनिक संवादही तितकाच आवश्यक राहील।`,
        en: `That is why this chart needs not only logic but also emotionally intelligent communication in order to maintain mental peace.`,
        hinglish: `Isi wajah se is chart me mental peace ke liye sirf logic kaafi nahi hoga; emotionally intelligent communication bhi zaroori rahega.`
      })
    ]))
  );

  sections.push(
    section(language, { hi: "स्वास्थ्य और संतति", mr: "आरोग्य आणि संतती", en: "Health & Children", hinglish: "Health & Children" }, paragraph([
      t(language, {
        hi: `स्वास्थ्य से जुड़े संकेतों के लिए षष्ठ भाव, चंद्र, मंगल और शनि को देखना उपयोगी माना जाता है।`,
        mr: `आरोग्याशी संबंधित संकेतांसाठी षष्ठ भाव, चंद्र, मंगळ आणि शनि पाहणं उपयुक्त मानलं जातं।`,
        en: `For health-related tendencies, the 6th house, Moon, Mars, and Saturn are especially useful to examine.`,
        hinglish: `Health-related tendencies ko samajhne ke liye 6th house, Chandra, Mangal, aur Shani ko dekhna useful hota hai.`
      }),
      t(language, {
        hi: `षष्ठ भाव ${localSignName(sixth, language)} राशि में होने से दिनचर्या, पाचन, मानसिक दबाव या दैनिक संतुलन जैसे विषयों पर विशेष ध्यान देने की आवश्यकता रहती है।`,
        mr: `षष्ठ भाव ${localSignName(sixth, language)} राशीत असल्यामुळे दिनचर्या, पचन, मानसिक ताण किंवा दैनंदिन समतोल या विषयांवर विशेष लक्ष देण्याची गरज असते।`,
        en: `Because the 6th house falls in ${localSignName(sixth, language)}, issues of routine, digestion, stress management, and daily balance become especially important.`,
        hinglish: `6th house ${localSignName(sixth, language)} me hone se routine, digestion, stress, aur daily balance ke matters par special dhyan dena padta hai.`
      }),
      t(language, {
        hi: `पंचम भाव ${localSignName(fifth, language)} राशि में होने से संतति, सृजनशीलता और भावनात्मक विस्तार के विषय इसी राशि की प्रकृति से प्रभावित होते हैं।`,
        mr: `पंचम भाव ${localSignName(fifth, language)} राशीत असल्यामुळे संतती, सर्जनशीलता आणि भावनिक विस्ताराचे विषय या राशीच्या स्वभावाने प्रभावित होतात।`,
        en: `With the 5th house in ${localSignName(fifth, language)}, children, creativity, and emotional expansion are influenced by the nature of that sign.`,
        hinglish: `5th house ${localSignName(fifth, language)} me hone se children, creativity, aur emotional expansion ke topics us sign ki nature se influence hote hain.`
      }),
      t(language, {
        hi: `फिर भी यह याद रखना आवश्यक है कि स्वास्थ्य और संतति के विषयों में ज्योतिष मार्गदर्शन देता है, अंतिम निर्णय और देखभाल चिकित्सा और वास्तविक परिस्थिति के अनुसार ही होनी चाहिए।`,
        mr: `तरीही हे लक्षात ठेवणं आवश्यक आहे की आरोग्य आणि संततीच्या बाबतीत ज्योतिष मार्गदर्शन देतं; अंतिम निर्णय आणि काळजी वैद्यकीय सल्ला व वास्तव परिस्थितीनुसारच घ्यावी लागते।`,
        en: `Even so, it must be remembered that astrology offers guidance here; final judgement and care should always follow medical advice and real circumstances.`,
        hinglish: `Phir bhi yaad rakhna zaroori hai ki health aur children ke matters me astrology guidance deti hai; final judgement aur care medical advice aur real situation ke hisaab se hi honi chahiye.`
      })
    ])),
    section(language, { hi: "गहन ग्रह-विश्लेषण", mr: "सखोल ग्रहविश्लेषण", en: "Planetary Influence", hinglish: "Planetary Influence" }, paragraph([
      placementSentence(venus, language),
      placementSentence(mars, language),
      placementSentence(saturn, language),
      placementSentence(rahu, language),
      placementSentence(ketu, language),
      t(language, {
        hi: `शुक्र संबंधों की कोमलता, मंगल इच्छाशक्ति और प्रतिक्रिया, शनि धैर्य और कर्म, राहु भौतिक लालसा तथा केतु आंतरिक विरक्ति को दर्शाते हैं।`,
        mr: `शुक्र नात्यांतील कोमलता, मंगळ इच्छाशक्ती आणि प्रतिक्रिया, शनि संयम आणि कर्म, राहू भौतिक ओढ, तर केतू अंतर्मुख विरक्ती दर्शवतो।`,
        en: `Venus governs relational softness, Mars governs desire and reaction, Saturn governs patience and karma, Rahu governs worldly craving, and Ketu governs detachment and inner withdrawal.`,
        hinglish: `Shukra relationship softness ko, Mangal desire aur reaction ko, Shani patience aur karma ko, Rahu worldly craving ko, aur Ketu detachment ko represent karta hai.`
      }),
      chart.panchang
        ? t(language, {
            hi: `जन्म के समय ${chart.panchang.tithi}, ${chart.panchang.nakshatra}, ${chart.panchang.yoga} और ${chart.panchang.karana} का संयोग था, जो आपकी आंतरिक मनोदशा और जीवन की सूक्ष्म लय पर अपना प्रभाव डालता है।`,
            mr: `जन्माच्या वेळी ${chart.panchang.tithi}, ${chart.panchang.nakshatra}, ${chart.panchang.yoga} आणि ${chart.panchang.karana} यांचा संयोग होता, जो तुमच्या अंतर्मनाच्या लयीत आणि जीवनाच्या सूक्ष्म प्रवाहात आपला प्रभाव टाकतो।`,
            en: `At birth, the combination of ${chart.panchang.tithi}, ${chart.panchang.nakshatra}, ${chart.panchang.yoga}, and ${chart.panchang.karana} added a subtle tone to your inner rhythm and lived experience.`,
            hinglish: `Birth ke samay ${chart.panchang.tithi}, ${chart.panchang.nakshatra}, ${chart.panchang.yoga}, aur ${chart.panchang.karana} ka combination tha, jo aapki inner rhythm aur life experience ko subtle tone deta hai.`
          })
        : "",
      t(language, {
        hi: `इसीलिए ग्रह-विश्लेषण को केवल शुभ-अशुभ के रूप में नहीं, बल्कि जीवन के विभिन्न क्षेत्रों में काम कर रही शक्तियों के रूप में समझना अधिक सही रहता है।`,
        mr: `म्हणूनच ग्रहविश्लेषण फक्त शुभ-अशुभ म्हणून पाहण्यापेक्षा जीवनाच्या विविध क्षेत्रांत कार्यरत असलेल्या शक्तींच्या रूपात समजणं अधिक योग्य ठरतं।`,
        en: `That is why planetary analysis is more accurate when read not as simple good or bad fortune, but as different forces shaping different areas of life.`,
        hinglish: `Isi liye planetary analysis ko sirf good ya bad luck ke roop me nahi, balki life ke alag-alag areas ko shape karne wali forces ke roop me samajhna zyada sahi hota hai.`
      })
    ])),
    section(language, { hi: "महादशा का वर्तमान प्रभाव", mr: "सद्य महादशेचा प्रभाव", en: "Current Mahadasha Impact", hinglish: "Current Mahadasha Impact" }, paragraph([
      dasha
        ? t(language, {
            hi: `वर्तमान में ${localPlanetName(dasha.currentMahadasha, language)} महादशा सक्रिय है और इसकी शुरुआत चंद्र के ${dasha.moonNakshatra} नक्षत्र से जुड़ी हुई है।`,
            mr: `सध्या ${localPlanetName(dasha.currentMahadasha, language)} महादशा सक्रिय आहे आणि तिची सुरुवात चंद्राच्या ${dasha.moonNakshatra} नक्षत्राशी जोडलेली आहे।`,
            en: `At present, ${localPlanetName(dasha.currentMahadasha, language)} Mahadasha is active, and its starting point is linked to the Moon's ${dasha.moonNakshatra} nakshatra.`,
            hinglish: `Filhaal ${localPlanetName(dasha.currentMahadasha, language)} Mahadasha active hai, aur iska starting point Chandra ke ${dasha.moonNakshatra} nakshatra se juda hua hai.`
          })
        : "",
      t(language, {
        hi: `महादशा यह बताती है कि जीवन के किस क्षेत्र पर इस समय सबसे अधिक प्रकाश पड़ रहा है और कौन-से विषय अनुभव, परीक्षा या अवसर के रूप में सामने आते हैं।`,
        mr: `महादशा सांगते की या काळात जीवनाच्या कोणत्या क्षेत्रावर सर्वाधिक प्रकाश पडत आहे आणि कोणते विषय अनुभव, परीक्षा किंवा संधी म्हणून पुढे येत आहेत।`,
        en: `Mahadasha shows which area of life is currently receiving the strongest emphasis and which themes are arriving as experience, challenge, or opportunity.`,
        hinglish: `Mahadasha batati hai ki is waqt life ka kaunsa area sabse zyada highlighted hai aur kaunse themes experience, challenge, ya opportunity ke roop me saamne aa rahe hain.`
      }),
      t(language, {
        hi: `इसलिए वर्तमान जीवन-चरण को समझने के लिए महादशा का अध्ययन बहुत महत्वपूर्ण है, क्योंकि यह केवल भविष्य नहीं बताती बल्कि वर्तमान की दिशा भी स्पष्ट करती है।`,
        mr: `म्हणूनच सध्याच्या जीवनचक्राला समजण्यासाठी महादशेचा अभ्यास फार महत्त्वाचा आहे, कारण ती फक्त भविष्य सांगत नाही तर वर्तमानाची दिशाही स्पष्ट करते।`,
        en: `That is why Mahadasha is so important: it does not merely hint at the future, it explains the direction and weight of the present phase as well.`,
        hinglish: `Isi liye Mahadasha itni important hoti hai: yeh sirf future ka signal nahi deti, balki present phase ki direction bhi clear karti hai.`
      })
    ])),
    section(language, { hi: "दोष और उसके वास्तविक अर्थ", mr: "दोष आणि त्याचा खरा अर्थ", en: "Dosha Analysis", hinglish: "Dosha Analysis" }, paragraph([
      isManglik(chart)
        ? t(language, {
            hi: `इस कुंडली में मंगल विवाह-संवेदनशील भावों में से एक में स्थित होने के कारण मंगली प्रभाव दिखाई देता है।`,
            mr: `या कुंडलीत मंगळ विवाहसंवेदनशील भावांपैकी एका भावात असल्यामुळे मंगळदोषाचा प्रभाव दिसून येतो।`,
            en: `In this chart, Mars falls in one of the houses traditionally treated as marriage-sensitive, so a Manglik influence is visible.`,
            hinglish: `Is kundli me Mangal marriage-sensitive houses me se ek me hone ki wajah se Manglik influence dikh raha hai.`
          })
        : t(language, {
            hi: `इस कुंडली में तीव्र मंगली प्रभाव स्पष्ट रूप से नहीं दिखाई देता, इसलिए संबंधों पर उसका भयकारी दबाव नहीं माना जाता।`,
            mr: `या कुंडलीत तीव्र मंगळदोष स्पष्ट दिसत नाही, त्यामुळे नात्यांवर त्याचा भय निर्माण करणारा दबाव मानला जात नाही।`,
            en: `A strong Manglik influence is not clearly visible here, so it should not be treated as a fear-driven burden on relationships.`,
            hinglish: `Is kundli me strong Manglik influence clearly visible nahi hai, isliye relationship par ise fear-based burden ki tarah nahi dekhna chahiye.`
          }),
      t(language, {
        hi: `इसलिए दोष को भय की दृष्टि से नहीं, बल्कि आत्म-जागरूकता और सही आचरण की दिशा देने वाले संकेत के रूप में देखना अधिक उचित है।`,
        mr: `म्हणून दोषाला भीतीच्या नजरेने न पाहता आत्मजागरूकता आणि योग्य वर्तनाची दिशा देणारा संकेत म्हणून पाहणं अधिक योग्य ठरतं।`,
        en: `That is why dosha is better viewed not as fear, but as a signal pointing toward self-awareness and wiser conduct.`,
        hinglish: `Isi liye dosha ko fear se dekhne ke bajay self-awareness aur wiser conduct ka signal samajhna zyada sahi hota hai.`
      })
    ])),
    section(language, { hi: "उपाय और व्यावहारिक मार्गदर्शन", mr: "उपाय आणि व्यवहार्य मार्गदर्शन", en: "Remedies & Suggestions", hinglish: "Remedies & Suggestions" }, remedyText(chart, language))
  );

  return {
    summary: sections[0].body,
    relationship: sections[1].body,
    marriage: sections[3].body,
    emotional: sections[7].body,
    career: sections[5].body,
    family: sections[6].body,
    health: sections[8].body,
    planetary: sections[9].body,
    timing: sections[10].body,
    dosha: sections[11].body,
    remedies: sections[12].body,
    sections,
    chart
  };
}

export function composeCompatibilityReport(snapshot: CompatibilitySnapshot, language: SupportedLanguage): DetailedReportData {
  const label = strengthLabel(snapshot.score, snapshot.maxScore);
  const strongestArea = [...snapshot.gunaMilan].sort((a, b) => b.obtainedScore / b.maxScore - a.obtainedScore / a.maxScore)[0];
  const weakestArea = [...snapshot.gunaMilan].sort((a, b) => a.obtainedScore / a.maxScore - b.obtainedScore / b.maxScore)[0];
  const moonDistance = signDistance(snapshot.partnerA.zodiacPlacements.moonSign, snapshot.partnerB.zodiacPlacements.moonSign);
  const dashaA = snapshot.partnerA.dasha && !Array.isArray(snapshot.partnerA.dasha) ? snapshot.partnerA.dasha.currentMahadasha : null;
  const dashaB = snapshot.partnerB.dasha && !Array.isArray(snapshot.partnerB.dasha) ? snapshot.partnerB.dasha.currentMahadasha : null;

  const sections = [
    section(language, { hi: "समग्र मिलान सार", mr: "एकूण जुळणीचा सार", en: "Overall Matching Summary", hinglish: "Overall Matching Summary" }, paragraph([
      t(language, {
        hi: `इस मिलान में कुल अंक ${snapshot.score}/${snapshot.maxScore} हैं, जो ${label === "Strong" ? "मज़बूत" : label === "Moderate" ? "मध्यम" : "अधिक ध्यान माँगने वाली"} श्रेणी में आते हैं।`,
        mr: `या जुळणीत एकूण गुण ${snapshot.score}/${snapshot.maxScore} आहेत, जे ${label === "Strong" ? "मजबूत" : label === "Moderate" ? "मध्यम" : "अधिक लक्ष मागणाऱ्या"} श्रेणीत येतात।`,
        en: `This match carries a score of ${snapshot.score}/${snapshot.maxScore}, placing it in the ${label.toLowerCase()} range.`,
        hinglish: `Is matching ka score ${snapshot.score}/${snapshot.maxScore} hai, jo ${label.toLowerCase()} range me aata hai.`
      }),
      t(language, {
        hi: `सबसे सहायक पक्ष ${strongestArea?.name ?? "मिलान का मुख्य बल"} में दिखाई देता है, जबकि सबसे अधिक सजगता ${weakestArea?.name ?? "समायोजन के क्षेत्र"} में रखनी होगी।`,
        mr: `सर्वात सहाय्यक बाजू ${strongestArea?.name ?? "जुळणीचा मुख्य बल"} मध्ये दिसते, तर सर्वाधिक सजगता ${weakestArea?.name ?? "समायोजनाच्या क्षेत्रात"} ठेवावी लागेल।`,
        en: `The strongest support appears in ${strongestArea?.name ?? "the main matching strength"}, while the greatest care will be required in ${weakestArea?.name ?? "the main adjustment area"}.`,
        hinglish: `Sabse strong support ${strongestArea?.name ?? "main matching strength"} me dikh raha hai, jabki sabse zyada care ${weakestArea?.name ?? "main adjustment area"} me rakhni hogi.`
      }),
      t(language, {
        hi: `इसका अर्थ यह नहीं है कि संबंध केवल अंक से तय होगा; बल्कि ग्रहों और भावों की वास्तविक स्थिति यह बताती है कि यह रिश्ता कहाँ सहज चलेगा और कहाँ परिपक्वता माँगेगा।`,
        mr: `याचा अर्थ असा नाही की नातं फक्त गुणांवर ठरेल; ग्रह आणि भावांची वास्तविक स्थिती सांगते की हे नातं कुठे सहज जाईल आणि कुठे परिपक्वता मागेल।`,
        en: `This does not mean the relationship is decided by score alone; the real planetary and house positions show where the bond flows naturally and where it demands maturity.`,
        hinglish: `Iska matlab yeh nahi ki relationship sirf score se decide hoga; real planetary aur house positions dikhati hain ki rishta kahan smooth chalega aur kahan maturity maangega.`
      })
    ])),
    section(language, { hi: "रिश्ता और भावनात्मक जुड़ाव", mr: "नातेसंबंध आणि भावनिक जुळवण", en: "Relationship & Emotional Bonding", hinglish: "Relationship & Emotional Bonding" }, paragraph([
      t(language, {
        hi: `दोनों कुंडलियों में शुक्र के संकेत यह बताते हैं कि आकर्षण का आधार वास्तविक है, लेकिन उसका अनुभव और अभिव्यक्ति दोनों व्यक्तियों में अलग हो सकते हैं।`,
        mr: `दोन्ही कुंडल्यांतील शुक्राचे संकेत आकर्षणाचा पाया वास्तविक असल्याचं दर्शवतात, पण त्याचा अनुभव आणि अभिव्यक्ती दोन्ही व्यक्तींमध्ये वेगळी असू शकते।`,
        en: `The Venus patterns in both charts show that the basis of attraction is real, though the way it is felt and expressed may differ between the two people.`,
        hinglish: `Dono kundliyon me Shukra ke signals dikhate hain ki attraction ka base real hai, lekin use feel aur express karne ka tareeka alag ho sakta hai.`
      }),
      t(language, {
        hi: `इसी वजह से इस संबंध में केवल प्रेम होना काफ़ी नहीं, बल्कि प्रेम को किस प्रकार व्यक्त किया जाए यह समझना भी उतना ही आवश्यक है।`,
        mr: `म्हणूनच या नात्यात फक्त प्रेम असणं पुरेसं नाही; ते प्रेम कशा प्रकारे व्यक्त करायचं हे समजणंही तितकंच महत्त्वाचं आहे।`,
        en: `That is why love alone is not enough in this match; understanding how love must be expressed is equally important.`,
        hinglish: `Isi wajah se is relationship me sirf pyaar hona kaafi nahi; pyaar ko kaise express karna hai yeh samajhna bhi utna hi zaroori hai.`
      })
    ])),
    section(language, { hi: "संवाद और समझ", mr: "संवाद आणि समज", en: "Communication & Understanding", hinglish: "Communication & Understanding" }, paragraph([
      t(language, {
        hi: `दोनों व्यक्तियों की चंद्र राशियों के बीच दूरी ${moonDistance} है, इसलिए मानसिक प्रतिक्रिया और भावनात्मक ग्रहणशीलता में समानता या अंतर का स्तर स्पष्ट रूप से बनता है।`,
        mr: `दोन्ही व्यक्तींच्या चंद्रराशींमधील अंतर ${moonDistance} आहे, त्यामुळे मानसिक प्रतिसाद आणि भावनिक ग्रहणशीलतेतील साम्य किंवा फरक स्पष्ट होतो।`,
        en: `The Moon signs of both individuals are ${moonDistance} signs apart, so the degree of emotional similarity or difference is clearly marked.`,
        hinglish: `Dono ke Moon signs ke beech distance ${moonDistance} hai, isliye emotional similarity ya difference ka level clearly samne aata hai.`
      }),
      t(language, {
        hi: `यदि चंद्र संकेत निकट हों तो मन जल्दी जुड़ता है, लेकिन दूरी अधिक हो तो एक-दूसरे की भावनात्मक भाषा समझने में समय लगता है।`,
        mr: `जर चंद्रसंकेत जवळ असतील तर मन लवकर जुळतं; पण अंतर जास्त असेल तर एकमेकांची भावनिक भाषा समजायला वेळ लागतो।`,
        en: `When the Moon signals are close, emotional rapport builds quickly; when they are farther apart, it takes more time to understand each other's emotional language.`,
        hinglish: `Agar Moon signals close hon to emotional rapport jaldi banta hai, lekin distance zyada ho to ek dusre ki emotional language samajhne me time lagta hai.`
      }),
      t(language, {
        hi: `ऐसे में संवाद का समय, शब्दों का चयन और सुनने की क्षमता इस मिलान को बेहतर बनाने में बहुत बड़ी भूमिका निभाती है।`,
        mr: `अशा वेळी संवादाची वेळ, शब्दांची निवड आणि ऐकून घेण्याची क्षमता या जुळणीला अधिक चांगलं बनवण्यात मोठी भूमिका बजावतात।`,
        en: `In such cases, timing, word choice, and the ability to listen play a major role in improving compatibility.`,
        hinglish: `Aise situation me timing, word choice, aur listening ability compatibility ko improve karne me bahut bada role play karte hain.`
      })
    ])),
    section(language, { hi: "विवाह की स्थिरता", mr: "विवाहातील स्थैर्य", en: "Marriage Stability", hinglish: "Marriage Stability" }, paragraph([
      t(language, {
        hi: `विवाह की स्थिरता केवल आकर्षण पर नहीं, बल्कि दोनों व्यक्तियों की जिम्मेदारी निभाने की क्षमता पर भी टिकी होती है।`,
        mr: `विवाहातील स्थैर्य केवळ आकर्षणावर टिकत नाही, तर दोन्ही व्यक्ती जबाबदाऱ्या कशा निभावतात यावरही अवलंबून असतं।`,
        en: `Marriage stability depends not only on attraction, but also on how both individuals carry responsibility over time.`,
        hinglish: `Marriage stability sirf attraction par depend nahi karti, balki dono log responsibility ko kaise handle karte hain is par bhi tikti hai.`
      }),
      t(language, {
        hi: `यदि शनि का प्रभाव संतुलित हो तो रिश्ता समय के साथ परिपक्व होता है; यदि वह कठोर हो तो देरी, दूरी या भावनात्मक कसौटी का अनुभव कराया जा सकता है।`,
        mr: `जर शनीचा प्रभाव संतुलित असेल तर नातं काळाबरोबर परिपक्व होतं; आणि तो कठोर असेल तर विलंब, अंतर किंवा भावनिक कसोटी जाणवू शकते।`,
        en: `If Saturn works in a balanced way, the bond matures with time; if it is harsher, it can create delay, distance, or emotional testing.`,
        hinglish: `Agar Shani balanced ho to rishta time ke saath mature hota hai; agar harsh ho to delay, distance, ya emotional testing la sakta hai.`
      })
    ]))
  ];

  return {
    summary: sections[0].body,
    relationship: sections[1].body,
    marriage: sections[3].body,
    emotional: sections[2].body,
    career: sections[3].body,
    family: sections[1].body,
    health: sections[3].body,
    planetary: sections[1].body,
    timing: paragraph([
      t(language, {
        hi: `वर्तमान में एक पक्ष ${dashaA ? localPlanetName(dashaA, language) : "अपनी"} महादशा और दूसरा पक्ष ${dashaB ? localPlanetName(dashaB, language) : "अपनी"} महादशा से प्रभावित है, इसलिए समय के साथ संबंध की अनुभूति बदल सकती है।`,
        mr: `सध्या एक बाजू ${dashaA ? localPlanetName(dashaA, language) : "आपल्या"} महादशेच्या आणि दुसरी बाजू ${dashaB ? localPlanetName(dashaB, language) : "आपल्या"} महादशेच्या प्रभावाखाली आहे, त्यामुळे काळानुसार नात्याची अनुभूती बदलू शकते।`,
        en: `At present, one side is under ${dashaA ? localPlanetName(dashaA, language) : "their current"} Mahadasha and the other under ${dashaB ? localPlanetName(dashaB, language) : "their current"} Mahadasha, so the felt quality of the relationship may change with time.`,
        hinglish: `Filhaal ek partner ${dashaA ? localPlanetName(dashaA, language) : "apni current"} Mahadasha me hai aur doosra ${dashaB ? localPlanetName(dashaB, language) : "apni current"} Mahadasha me, isliye waqt ke saath relationship ki feeling bhi badal sakti hai.`
      })
    ]),
    dosha: t(language, {
      hi: isManglik(snapshot.partnerA) || isManglik(snapshot.partnerB) ? "इस मिलान में मंगली संवेदनशीलता दिखाई देती है, इसलिए क्रोध, गति और प्रतिक्रिया पर विशेष ध्यान देना होगा।" : "इस मिलान में तीव्र मंगली असंतुलन स्पष्ट नहीं है, इसलिए भय की दृष्टि आवश्यक नहीं है।",
      mr: isManglik(snapshot.partnerA) || isManglik(snapshot.partnerB) ? "या जुळणीत मंगळाशी संबंधित संवेदनशीलता दिसते, त्यामुळे राग, गती आणि प्रतिक्रिया यावर विशेष लक्ष द्यावं लागेल।" : "या जुळणीत तीव्र मंगळदोषजन्य असमतोल स्पष्ट नाही, त्यामुळे भीतीची दृष्टी आवश्यक नाही।",
      en: isManglik(snapshot.partnerA) || isManglik(snapshot.partnerB) ? "This match does show Manglik sensitivity, so pace, anger, and reaction style require attention." : "A severe Manglik imbalance is not clearly visible here, so fear is not the right lens.",
      hinglish: isManglik(snapshot.partnerA) || isManglik(snapshot.partnerB) ? "Is matching me Manglik sensitivity dikh rahi hai, isliye pace, anger, aur reaction style par special dhyan dena hoga." : "Is matching me severe Manglik imbalance clearly nahi dikh raha, isliye fear wali approach sahi nahi hogi."
    }),
    remedies: t(language, {
      hi: "इस मिलान के लिए सबसे उपयोगी उपाय ईमानदार संवाद, आर्थिक स्पष्टता, विवाद के समय विराम और संबंध की गरिमा की रक्षा करना है।",
      mr: "या जुळणीसाठी सर्वात उपयुक्त उपाय म्हणजे प्रामाणिक संवाद, आर्थिक स्पष्टता, वादाच्या वेळी विराम आणि नात्याच्या सन्मानाची जपणूक होय।",
      en: "The most useful remedies for this match are honest communication, financial clarity, pausing during conflict, and protecting the dignity of the relationship.",
      hinglish: "Is matching ke liye sabse useful remedies honest communication, financial clarity, conflict ke waqt pause, aur relationship ki dignity ko protect karna hain."
    }),
    sections
  };
}
