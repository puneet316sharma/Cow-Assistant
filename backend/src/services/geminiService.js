import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `You are a livestock health assistant helping a farmer understand a possible issue with their cow. You are NOT a veterinarian and must never provide a definitive diagnosis or prescribe medication/dosages. Always frame your answer as general guidance and recommend contacting a veterinarian for anything serious, uncertain, or worsening. Respond ONLY with valid JSON matching this schema:
{
  "possibleCauses": ["string"],
  "warningSigns": ["string"],
  "recommendedNextSteps": ["string"],
  "urgencyLevel": "low" | "medium" | "high" | "emergency",
  "disclaimer": "string"
}`;

const DEFAULT_DISCLAIMER = "This is AI-generated general guidance for livestock management support, not a veterinary diagnosis or prescription. Always consult a qualified veterinarian for diagnosis, treatment, and medication.";

// Clean JSON response string from Markdown code fences if present
const cleanJsonResponseStr = (rawText) => {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

const parseAndValidateAIResponse = (text) => {
  try {
    const cleaned = cleanJsonResponseStr(text);
    const parsed = JSON.parse(cleaned);

    const validLevels = ['low', 'medium', 'high', 'emergency'];
    const urgency = validLevels.includes(parsed.urgencyLevel?.toLowerCase())
      ? parsed.urgencyLevel.toLowerCase()
      : 'medium';

    return {
      possibleCauses: Array.isArray(parsed.possibleCauses) && parsed.possibleCauses.length > 0 
        ? parsed.possibleCauses 
        : ['General stress or environmental factor', 'Early onset metabolic or digestive change'],
      warningSigns: Array.isArray(parsed.warningSigns) && parsed.warningSigns.length > 0 
        ? parsed.warningSigns 
        : ['Complete loss of appetite', 'High fever (>103°F / 39.5°C)', 'Severe weakness or recumbency'],
      recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps) && parsed.recommendedNextSteps.length > 0 
        ? parsed.recommendedNextSteps 
        : ['Isolate the cow in a clean, shaded area', 'Monitor temperature and water intake', 'Contact a veterinarian if symptoms persist'],
      urgencyLevel: urgency,
      disclaimer: parsed.disclaimer || DEFAULT_DISCLAIMER
    };
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', err.message);
    return null;
  }
};

export const analyzeSymptomsWithGemini = async ({ cowProfile, vaccinationHistory, pastHealthEvents, symptomsText }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const promptUserContent = `
Cow profile: ${JSON.stringify(cowProfile)}
Vaccination history: ${JSON.stringify(vaccinationHistory)}
Past health events: ${JSON.stringify(pastHealthEvents)}
Current symptoms reported by farmer: "${symptomsText}"
`;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[Gemini Service] GEMINI_API_KEY missing or placeholder. Returning safe simulated AI guidance.');
    
    // Determine simulated urgency level based on keywords for offline / keyless testing
    let urgency = 'low';
    const lowerText = symptomsText.toLowerCase();
    if (lowerText.includes('bleeding') || lowerText.includes('downer') || lowerText.includes('collapsed') || lowerText.includes('severe')) {
      urgency = 'emergency';
    } else if (lowerText.includes('fever') || lowerText.includes('discharge') || lowerText.includes('lame') || lowerText.includes('mastitis')) {
      urgency = 'high';
    } else if (lowerText.includes('lethargic') || lowerText.includes('cough') || lowerText.includes('reduced milk')) {
      urgency = 'medium';
    }

    return {
      aiResponse: {
        possibleCauses: [
          `Potential respiratory or digestive disturbance related to: "${symptomsText.slice(0, 40)}..."`,
          "Environmental heat stress or feed variation",
          "Mild subclinical infection requiring observation"
        ],
        warningSigns: [
          "Sustained elevation in body temperature",
          "Complete refusal of feed and water",
          "Rapid or labored breathing",
          "Nasal or ocular discharge becoming purulent"
        ],
        recommendedNextSteps: [
          "Separate cow into a dedicated quiet shelter with fresh water",
          "Take rectal temperature and record vitals",
          "Check recent herd feed changes or water supply",
          "Consult a licensed veterinarian for formal examination"
        ],
        urgencyLevel: urgency,
        disclaimer: DEFAULT_DISCLAIMER
      },
      rawGeminiResponse: "[SIMULATED_GEMINI_RESPONSE] API key not configured."
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try gemini-1.5-flash or gemini-2.0-flash
    let model;
    try {
      model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION
      });
    } catch (e) {
      model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_INSTRUCTION
      });
    }

    const result = await model.generateContent(promptUserContent);
    const rawText = result.response.text();

    let structuredResponse = parseAndValidateAIResponse(rawText);

    // If initial parse failed, attempt 1 retry with stricter instructions
    if (!structuredResponse) {
      console.log('[Gemini Service] Retrying once with strict JSON prompt...');
      const retryResult = await model.generateContent(`Strict instruction: Output ONLY raw JSON matching this schema: {"possibleCauses": string[], "warningSigns": string[], "recommendedNextSteps": string[], "urgencyLevel": "low"|"medium"|"high"|"emergency", "disclaimer": string}.\n\nContext:\n${promptUserContent}`);
      const retryText = retryResult.response.text();
      structuredResponse = parseAndValidateAIResponse(retryText);
    }

    // Fallback if parsing fails again
    if (!structuredResponse) {
      structuredResponse = {
        possibleCauses: ["Symptom pattern requires direct physical veterinary evaluation"],
        warningSigns: ["Worsening weakness or refusal to stand", "Fever or rapid breathing"],
        recommendedNextSteps: ["Contact a licensed veterinarian immediately"],
        urgencyLevel: "medium",
        disclaimer: DEFAULT_DISCLAIMER
      };
    }

    return {
      aiResponse: structuredResponse,
      rawGeminiResponse: rawText
    };
  } catch (err) {
    console.error('[Gemini API Call Error]:', err);
    return {
      aiResponse: {
        possibleCauses: ["Unable to complete AI analysis due to service connection error"],
        warningSigns: ["Monitor vital signs closely"],
        recommendedNextSteps: ["Contact a veterinarian directly for immediate advice"],
        urgencyLevel: "medium",
        disclaimer: DEFAULT_DISCLAIMER
      },
      rawGeminiResponse: `Error: ${err.message}`
    };
  }
};
