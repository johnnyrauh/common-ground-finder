// Single source of truth for the Claude model. Override with ANTHROPIC_MODEL.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ ...req.body, model: MODEL }),
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
