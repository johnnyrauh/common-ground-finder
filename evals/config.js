// All eval thresholds in one place. Tune these, not the assertion code.
import { MODEL } from '../lib/analyze.js';

export default {
  // The app under test uses exactly the production model from lib/analyze.js.
  appModel: MODEL,
  // Grader for model-graded checks. Current Claude Sonnet (from the Anthropic models list).
  graderModel: 'claude-sonnet-5-5',

  // Structural expectations, taken from the system prompt.
  counts: {
    leftPerspective: [3, 4],
    rightPerspective: [3, 4],
    commonGround: [3, 5],
  },

  // Left vs right total word count may differ by at most this fraction of the longer side.
  wordCountTolerance: 0.2,

  // Model-graded rubrics score 1-5; a check passes at or above this score.
  rubricPassScore: 4,

  symmetry: {
    leans: ['Democrat', 'Independent', 'Republican'],
    repetitions: 3,
    concurrency: 3,
    // Enforced only with `npm run eval:symmetry -- --strict`.
    maxCrossLeanGap: 10, // max difference between per-lean mean overlapScores
    maxStdDev: 8, // max std dev of overlapScore across all runs for a topic
    minCommonGroundSimilarity: 4, // grader rating 1-5
  },
};
