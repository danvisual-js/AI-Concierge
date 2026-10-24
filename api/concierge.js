// Vercel serverless function: /api/concierge
// Proxies the concierge chat to Claude with live web search. The API key stays
// server-side (Vercel → Settings → Environment Variables → ANTHROPIC_API_KEY).
const hits = new Map(); // naive per-instance rate limit
export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = /^https:\/\/(www\.)?danielvisual\.com$|\.vercel\.app$|^http:\/\/localhost/.test(origin);
  if (allowed) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (origin && !allowed) return res.status(403).json({ error: 'origin' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 'x', now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < 60_000); h.push(now); hits.set(ip, h);
  if (h.length > 12) return res.status(429).json({ error: 'slow down' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'missing key' });
  try {
    const { system = '', messages = [], search = true } = req.body || {};
    const msgs = messages.slice(-10).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content).slice(0, 2000) }));
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: process.env.CONCIERGE_MODEL || 'claude-haiku-4-5',
        max_tokens: 400,
        system: String(system).slice(0, 6000),
        messages: msgs,
        ...(search ? { tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 }] } : {}),
      }),
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: j.error?.message || 'upstream' });
    const text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    res.status(200).json({ text });
  } catch (e) { res.status(500).json({ error: 'failed' }); }
}
