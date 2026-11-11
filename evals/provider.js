// Custom promptfoo provider: calls the exact production code path (lib/analyze.js).
// The promptfoo "prompt" is ignored; the test vars `topic` and `lean` drive the call.
import 'dotenv/config';
import crypto from 'node:crypto';
import { cache } from 'promptfoo';
import { analyze, MODEL, SYSTEM_PROMPT, buildUserMessage } from '../lib/analyze.js';
import { leanOrNull } from './topics.js';

export default class CommonGroundProvider {
  constructor(options = {}) {
    this.label = options.label;
  }

  id() {
    return `common-ground:${MODEL}`;
  }

  async callApi(_prompt, context) {
    const topic = String(context?.vars?.topic ?? '');
    const lean = leanOrNull(context?.vars?.lean);

    // Cache key covers everything that affects the request, so a prompt edit busts the cache.
    const key = `common-ground:${crypto
      .createHash('sha256')
      .update(JSON.stringify([MODEL, SYSTEM_PROMPT, buildUserMessage(topic, lean)]))
      .digest('hex')}`;
    const store = cache.isCacheEnabled() ? await cache.getCache() : null;
    if (store) {
      const hit = await store.get(key);
      if (hit) return { output: hit, cached: true };
    }

    const start = Date.now();
    try {
      const result = await analyze({ topic, lean });
      const output = JSON.stringify(result);
      if (store) await store.set(key, output);
      return { output, metadata: { latencyMs: Date.now() - start } };
    } catch (err) {
      // Surface failures as output so adversarial assertions can check for a clean error.
      // Normal-case assertions fail on this shape. Errors are never cached.
      return {
        output: JSON.stringify({
          error: err.message || String(err),
          status: err.status ?? null,
          ...(err.raw ? { rawPreview: String(err.raw).slice(0, 600) } : {}),
        }),
        metadata: { latencyMs: Date.now() - start, failed: true },
      };
    }
  }
}
