import { NextRequest, NextResponse } from "next/server";
import en from "../../../../messages/en.json";
import es from "../../../../messages/es.json";

export type ConciergeAction = "start_assessment" | "check_eligibility" | null;

export type ConciergeResponse = {
  reply: string;
  action: ConciergeAction;
};

const MESSAGES = { es, en } as const;
type Locale = keyof typeof MESSAGES;

/**
 * VORSHEIN AI — Digital Training Concierge.
 *
 * Two modes, chosen automatically:
 *  - GEMINI_API_KEY set (server-only env var, never sent to the client) →
 *    every message goes to Google Gemini with a system prompt describing
 *    Vorshein, so it can actually reason about arbitrary questions.
 *  - No key, or the Gemini call fails for any reason (network, rate limit,
 *    bad response) → falls back to the rule-based demo engine below, so the
 *    concierge never breaks, it just gets less flexible.
 * The frontend (components/Concierge.tsx) only ever talks to this route —
 * nothing there needs to change based on which mode is active.
 */

const SYSTEM_PROMPT = `Eres "Vorshein AI", el concierge digital de VORSHEIN — un sistema de preparación acuática de alto rendimiento (NO una escuela de natación tradicional). Fundado por Pedro Salazar.

Hechos sobre Vorshein que debes usar para responder con precisión:
- Concepto central: CONTROL. ENDURANCE. PERFORMANCE.
- Tres niveles de progresión, cada uno construido sobre el dominio real del anterior:
  1. FOUNDATION (Básico) — adaptación acuática, técnica básica, respiración, flotación, seguridad.
  2. PERFORMANCE (Intermedio) — técnica avanzada, resistencia, velocidad, virajes, pruebas de rendimiento.
  3. TACTICAL (Avanzado) — alto rendimiento, apnea, tolerancia al esfuerzo, protocolos especializados.
- El nivel de cada persona NO se elige, se determina con "Vorshein Assessment": una evaluación interactiva de 9 preguntas (~2 minutos) que calcula un score de 0-100 y clasifica en Basic/Intermediate/Advanced.
- Manual de 10 módulos: Técnica de Nado, Resistencia, Control Respiratorio, Confianza en el Agua, Velocidad, Rendimiento Subacuático, Recuperación, Control Mental, Apnea, Preparación para Competencia.
- Las competencias (incluyendo apnea) requieren clasificación ADVANCED/Tactical. Con un nivel menor, el estatus de competencia aparece como "LOCKED" (bloqueado).
- Existe una página "Reservar" donde la persona deja su nombre/email para que el equipo la contacte y agende una evaluación con un entrenador.
- Todavía no hay eventos activos ("Coming").

Instrucciones de estilo:
- Responde en el MISMO idioma en que te escriben (español o inglés).
- Sé breve: 1 a 3 frases como máximo. Directo, profesional, sin emojis, sin relleno.
- Si tiene sentido, sugiere una acción concreta relacionada con lo que preguntaron.
- No inventes programas, precios, entrenadores, ubicaciones ni datos que no están arriba. Si no sabes algo, dilo brevemente y ofrece la evaluación o el contacto como siguiente paso.

Formato de salida — responde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown, con esta forma exacta:
{"reply": "tu respuesta aquí", "action": "start_assessment" | "check_eligibility" | null}
Usa "start_assessment" cuando lo lógico es invitar a hacer la evaluación de nivel. Usa "check_eligibility" cuando la pregunta es específicamente sobre poder competir. Usa null si no aplica ninguna acción.`;

async function askGemini(
  message: string,
  apiKey: string,
): Promise<ConciergeResponse | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(25_000),
      },
    );

    if (!res.ok) {
      console.error("[concierge] Gemini HTTP error", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("[concierge] Gemini response had no text", JSON.stringify(data));
      return null;
    }

    const parsed = JSON.parse(text);
    if (typeof parsed.reply !== "string") return null;

    const action: ConciergeAction =
      parsed.action === "start_assessment" || parsed.action === "check_eligibility"
        ? parsed.action
        : null;

    return { reply: parsed.reply, action };
  } catch (err) {
    console.error("[concierge] Gemini call threw", err);
    return null;
  }
}

type Rule = {
  id: string;
  test: (msg: string) => boolean;
  action: ConciergeAction;
};

const RULES: Rule[] = [
  {
    id: "greeting",
    test: (m) => /^(hola|hi|hello|hey|buenas|qu[eé] tal)\b/.test(m.trim()),
    action: null,
  },
  {
    id: "whatIsThisPage",
    test: (m) =>
      /para qu[eé] sirve|qu[eé] es esto|qu[eé] hace esta p[aá]gina|de qu[eé] trata|c[oó]mo funciona (esto|esta p[aá]gina|el sitio)|what is this (page|site)|what does this (page|site) do|how does this work/.test(
        m,
      ),
    action: "start_assessment",
  },
  {
    id: "apneaCompete",
    test: (m) => m.includes("apnea") && /compet|eleg|particip/.test(m),
    action: "check_eligibility",
  },
  {
    id: "compete",
    test: (m) => /compet|particip.*(evento|event)|clasificar|qualif/.test(m),
    action: "start_assessment",
  },
  {
    id: "apnea",
    test: (m) => /apnea|breath.?hold/.test(m),
    action: "start_assessment",
  },
  {
    id: "experienceHint",
    test: (m) =>
      /militar|military|cansa|tired|me canso|i get tired|\d{2,4}\s?(m|metros|meters)|nado pero|i can swim but/.test(
        m,
      ),
    action: "start_assessment",
  },
  {
    id: "level",
    test: (m) =>
      /nivel|evaluaci|assessment|donde empiezo|por donde|where do i start|my level/.test(
        m,
      ),
    action: "start_assessment",
  },
  {
    id: "programs",
    test: (m) =>
      /programa|program|entrenamiento|training|basic|foundation|performance|tactical|avanzado|advanced/.test(
        m,
      ),
    action: "start_assessment",
  },
  {
    id: "philosophy",
    test: (m) =>
      /metodolog|methodolog|filosof|philosoph|que es vorshein|qué es vorshein|what is vorshein/.test(
        m,
      ),
    action: null,
  },
  {
    id: "events",
    test: (m) => /evento|event|competencia|calendar/.test(m),
    action: null,
  },
];

function buildDemoReply(message: string, locale: Locale): ConciergeResponse {
  const normalized = message.toLowerCase();
  const rules = MESSAGES[locale].concierge.rules as Record<string, string>;
  const match = RULES.find((rule) => rule.test(normalized));

  if (!match) {
    return { reply: rules.fallback, action: "start_assessment" };
  }

  return { reply: rules[match.id], action: match.action };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const locale: Locale = body?.locale === "en" ? "en" : "es";

  if (!message) {
    return NextResponse.json(
      { error: "message is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const geminiResponse = await askGemini(message, apiKey);
    if (geminiResponse) {
      return NextResponse.json(geminiResponse);
    }
    // Falls through to the rule-based engine on any Gemini failure.
  }

  const response = buildDemoReply(message, locale);
  return NextResponse.json(response);
}
