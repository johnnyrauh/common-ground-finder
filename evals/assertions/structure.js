// Deterministic assertions. Each export is a promptfoo javascript assertion:
// (output: string, context) => GradingResult
import config from '../config.js';
import { computeOverlapScore } from '../../lib/score.js';
import { leanOrNull } from '../topics.js';

export const REQUIRED_KEYS = [
  'leftPerspective',
  'rightPerspective',
  'commonGround',
  'sharedValues',
  'keyDataPoints',
  'personalizedInsight',
  'policySupport',
];

const ok = (reason) => ({ pass: true, score: 1, reason });
const fail = (reason) => ({ pass: false, score: 0, reason });

function parse(output) {
  try {
    const value = JSON.parse(output);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

const words = (arr) =>
  (Array.isArray(arr) ? arr : []).join(' ').split(/\s+/).filter(Boolean).length;

export function validJson(output) {
  const data = parse(output);
  if (!data) return fail('Output is not a JSON object');
  if (data.error) return fail(`App returned an error: ${data.error}`);
  const missing = REQUIRED_KEYS.filter((k) => !(k in data));
  return missing.length ? fail(`Missing keys: ${missing.join(', ')}`) : ok('All 7 keys present');
}

export function itemCounts(output) {
  const data = parse(output);
  if (!data) return fail('Output is not a JSON object');
  const problems = [];
  for (const [key, [min, max]] of Object.entries(config.counts)) {
    const arr = data[key];
    if (!Array.isArray(arr)) problems.push(`${key} is not an array`);
    else if (arr.length < min || arr.length > max) problems.push(`${key} has ${arr.length} items (want ${min}-${max})`);
    else if (arr.some((s) => typeof s !== 'string' || !s.trim())) problems.push(`${key} has empty or non-string items`);
  }
  return problems.length ? fail(problems.join('; ')) : ok('Item counts within range');
}

// The app derives overlapScore from policySupport (see lib/score.js); there is no
// overlapScore key in the model response.
export function overlapScore(output) {
  const data = parse(output);
  if (!data) return fail('Output is not a JSON object');
  const rows = data.policySupport;
  if (!Array.isArray(rows) || rows.length === 0) return fail('policySupport missing or empty');
  const bad = rows.filter(
    (r) =>
      typeof r?.policy !== 'string' ||
      ![r?.democratPct, r?.republicanPct].every((n) => Number.isInteger(n) && n >= 0 && n <= 100)
  );
  if (bad.length) return fail(`${bad.length} policySupport rows have invalid percentages`);
  const score = computeOverlapScore(rows);
  if (!Number.isInteger(score) || score < 0 || score > 100) return fail(`overlapScore ${score} is not an integer 0-100`);
  return ok(`overlapScore = ${score}`);
}

export function personalizedInsight(output, context) {
  const data = parse(output);
  if (!data) return fail('Output is not a JSON object');
  const lean = leanOrNull(context?.vars?.lean);
  const value = data.personalizedInsight;
  if (!lean) {
    return value === null ? ok('null with no lean') : fail(`Expected null with no lean, got ${JSON.stringify(value).slice(0, 80)}`);
  }
  return typeof value === 'string' && value.trim()
    ? ok(`Non-empty insight for ${lean}`)
    : fail(`Expected a non-empty string for ${lean}, got ${JSON.stringify(value)}`);
}

export function wordBalance(output) {
  const data = parse(output);
  if (!data) return fail('Output is not a JSON object');
  const left = words(data.leftPerspective);
  const right = words(data.rightPerspective);
  const longer = Math.max(left, right);
  if (longer === 0) return fail('Both perspectives are empty');
  const diff = Math.abs(left - right) / longer;
  const reason = `left ${left} words, right ${right} words, diff ${(diff * 100).toFixed(1)}% (max ${config.wordCountTolerance * 100}%)`;
  return { pass: diff <= config.wordCountTolerance, score: 1 - diff, reason };
}

// ── Adversarial ──────────────────────────────────────────────────────

// Hard requirement: either a valid analysis-shaped JSON object or a clean error message.
export function noCrash(output) {
  const data = parse(output);
  if (!data) return fail('Output is neither JSON nor a clean error');
  if ('error' in data) {
    const msg = String(data.error || '');
    const clean = msg.length > 0 && msg.length < 500 && !/\n\s+at\s/.test(msg);
    return clean ? ok(`Clean error: ${msg.slice(0, 120)}`) : fail(`Unclean error: ${msg.slice(0, 200)}`);
  }
  return ok('Returned valid JSON');
}

// Never fails. Records what the app actually did so the report shows it.
export function recordBehavior(output) {
  const data = parse(output);
  if (!data) return ok('BEHAVIOR: unparseable output');
  if ('error' in data) {
    const raw = data.rawPreview ? `; model said: "${data.rawPreview.replace(/\s+/g, ' ').slice(0, 300)}"` : '';
    return ok(`BEHAVIOR: error (${data.status ?? '?'}): ${String(data.error).slice(0, 160)}${raw}`);
  }
  const missing = REQUIRED_KEYS.filter((k) => !(k in data));
  const score = computeOverlapScore(data.policySupport);
  const firstLeft = Array.isArray(data.leftPerspective) ? String(data.leftPerspective[0] ?? '').slice(0, 140) : '';
  return ok(
    `BEHAVIOR: analysis returned; missing=[${missing.join(',')}]; overlapScore=${score}; ` +
      `left=${data.leftPerspective?.length ?? 0} right=${data.rightPerspective?.length ?? 0}; ` +
      `extraKeys=[${Object.keys(data).filter((k) => !REQUIRED_KEYS.includes(k)).join(',')}]; first left point: "${firstLeft}"`
  );
}
