import { analyze } from '../lib/analyze.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { topic, lean } = req.body || {};
  try {
    const result = await analyze({ topic, lean });
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).send(err.message || 'Something went wrong.');
  }
}
