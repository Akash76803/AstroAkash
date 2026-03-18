import { Router } from "express";
import { compatibilityReportRequestSchema, kundliReportRequestSchema } from "../schemas.js";
import {
  buildPermissionResponse,
  composeCompatibilityReport,
  composeKundliReport
} from "../services/reportComposer.js";
import { swissEphemerisService } from "../services/swissEphemerisService.js";
import { buildCompatibilitySnapshot } from "../services/compatibilityService.js";

export const reportsRouter = Router();

function kundliSummaryMessage(language: "hi" | "en" | "hinglish" | "mr") {
  if (language === "hi") {
    return "आपकी कुंडली का सारांश तैयार है। विस्तृत विश्लेषण देखने के लिए अनुमति दीजिए।";
  }
  if (language === "mr") {
    return "तुमच्या कुंडलीचा सारांश तयार आहे. सविस्तर विश्लेषण पाहण्यासाठी परवानगी द्या.";
  }
  if (language === "hinglish") {
    return "Aapki kundli ka summary ready hai. Detailed analysis dekhne ke liye permission dijiye.";
  }
  return "Your Kundli summary is ready. Please confirm if you want the detailed analysis.";
}

function compatibilitySummaryMessage(language: "hi" | "en" | "hinglish" | "mr") {
  if (language === "hi") {
    return "दोनों पक्षों का मिलान सारांश तैयार है।";
  }
  if (language === "mr") {
    return "दोन्ही पक्षांचा जुळणीचा सारांश तयार आहे.";
  }
  if (language === "hinglish") {
    return "Dono partners ka compatibility summary ready hai.";
  }
  return "Compatibility summary for both partners is ready.";
}

reportsRouter.post("/kundli/report", async (req, res, next) => {
  try {
    const payload = kundliReportRequestSchema.parse(req.body);
    const chart = await swissEphemerisService.generateKundli({
      date: payload.date,
      time: payload.time,
      location: payload.location
    });

    if (!payload.request_full_report || payload.mode === "summary") {
      return res.json(buildPermissionResponse(payload.language, kundliSummaryMessage(payload.language)));
    }

    return res.json({
      permission_required: false,
      message: null,
      language: payload.language,
      data: composeKundliReport(chart, payload.language)
    });
  } catch (error) {
    next(error);
  }
});

reportsRouter.post("/compatibility/report", async (req, res, next) => {
  try {
    const payload = compatibilityReportRequestSchema.parse(req.body);
    const snapshot = await buildCompatibilitySnapshot(payload.partner_a, payload.partner_b);

    if (!payload.request_full_report || payload.mode === "summary") {
      return res.json(buildPermissionResponse(payload.language, compatibilitySummaryMessage(payload.language)));
    }

    return res.json({
      permission_required: false,
      message: null,
      language: payload.language,
      data: composeCompatibilityReport(snapshot, payload.language),
      meta: {
        score: snapshot.score,
        max_score: snapshot.maxScore,
        strength_level: snapshot.strengthLevel,
        guna_milan: snapshot.gunaMilan
      }
    });
  } catch (error) {
    next(error);
  }
});
