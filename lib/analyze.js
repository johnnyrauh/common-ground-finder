// Server-side analysis: the system prompt and the Anthropic call live here so the
// Vercel function (api/analyze.js) and the evals (evals/provider.js) share them.

// Single source of truth for the Claude model. Override with ANTHROPIC_MODEL.
export const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
export const MAX_TOKENS = 16000;

export const SYSTEM_PROMPT = `You are a rigorous, non-partisan political analyst. Your goal is to help Americans find common ground by presenting balanced, steelmanned perspectives on political issues.

When given a political topic and optionally a user's political party, provide a structured analysis. Return ONLY valid JSON with these exact keys:

- leftPerspective: array of 3-4 strings (strongest progressive arguments)
- rightPerspective: array of 3-4 strings (strongest conservative arguments)
- commonGround: array of 3-5 strings (specific areas of genuine agreement)
- sharedValues: array of 4-6 strings (deeper human values motivating both sides)
- keyDataPoints: array of 3-4 strings (verifiable statistics both sides should acknowledge)
- personalizedInsight: string or null (only if party provided — what the other side genuinely believes and why, written for someone of this party)
- policySupport: array of 5-6 objects { "policy": string, "democratPct": integer 0-100, "republicanPct": integer 0-100 }. These are the specific policies most central to the national debate on this topic, both the contested ones and the ones with bipartisan support, so the list reflects the real state of the debate rather than only the common ground. democratPct and republicanPct are the approximate share of Democrats and Republicans who support each policy, based on recent national polling (Pew, Gallup, AP-NORC and similar).

Be analytical, data-driven, and scrupulously fair. Never strawman either side.`;

export function buildUserMessage(topic, lean) {
  let userMsg = `Analyze this political topic: '${topic}'`;
  if (lean) userMsg += `. The user identifies as: ${lean}`;
  userMsg += '. Return ONLY valid JSON, no markdown, no preamble.';
  return userMsg;
}

export class AnalyzeError extends Error {
  constructor(message, status = 500, raw = undefined) {
    super(message);
    this.name = 'AnalyzeError';
    this.status = status;
    // Unparseable model text, kept for evals/logging. Never sent to the client.
    this.raw = raw;
  }
}

// Calls Claude with the production prompt and returns the parsed JSON analysis.
export async function analyze({ topic, lean = null } = {}) {
  if (typeof topic !== 'string' || !topic.trim()) {
    throw new AnalyzeError('A topic is required.', 400);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage(topic.trim(), lean || null) }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new AnalyzeError(`API ${response.status}: ${errBody.slice(0, 200)}`, response.status);
  }

  const data = await response.json();
  const raw = data.content?.find((b) => b.type === 'text')?.text || '';
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AnalyzeError('Unexpected response shape from API', 502, raw);
  }
  return parsed;
}
