// Prints the estimated number of API calls for an eval tier before it runs.
// Usage: node evals/estimate.js <smoke|full|symmetry>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as loadYaml } from 'js-yaml';
import config from './config.js';
import { PRESET_TOPICS } from './topics.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const tier = process.argv[2] || 'full';

function estimateCases(file) {
  const cases = loadYaml(fs.readFileSync(path.join(dir, file), 'utf8'));
  let app = 0;
  let grader = 0;
  for (const c of cases) {
    const combos = Object.values(c.vars || {}).reduce((n, v) => n * (Array.isArray(v) ? v.length : 1), 1);
    const graded = (c.assert || []).filter((a) => String(a.value).includes('rubric.js')).length;
    app += combos;
    grader += combos * graded;
  }
  return { cases: app, app, grader };
}

let est;
if (tier === 'symmetry') {
  const { leans, repetitions } = config.symmetry;
  const app = PRESET_TOPICS.length * leans.length * repetitions;
  est = { cases: PRESET_TOPICS.length, app, grader: PRESET_TOPICS.length };
} else {
  est = estimateCases(`cases.${tier}.yaml`);
}

console.log(
  `\n[${tier}] estimated API calls: ${est.app + est.grader} ` +
    `(${est.app} to ${config.appModel} + ${est.grader} to grader ${config.graderModel}` +
    `${tier === 'symmetry' ? '' : '; cached responses are not re-sent'})\n`
);
