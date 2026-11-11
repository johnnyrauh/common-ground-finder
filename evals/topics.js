// The 12 preset topics shown in the app (src/App.jsx TOPICS). Keep in sync.
export const PRESET_TOPICS = [
  'Immigration',
  'Gun Control',
  'Healthcare',
  'Climate Change',
  'Abortion Rights',
  'Economy & Taxes',
  'Criminal Justice',
  'Education',
  'Social Media & Free Speech',
  'Drug Policy',
  'Voting Rights',
  'Foreign Policy',
];

// "none" means the user picked no party.
export const LEANS = ['Democrat', 'Independent', 'Republican', 'none'];

export const leanOrNull = (lean) => (!lean || lean === 'none' ? null : lean);
