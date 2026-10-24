// brain5 — a more personable concierge. Wraps v3 think(): adds live context
// (Bay Area weather via Open-Meteo, quick facts via Wikipedia — both keyless,
// CORS-friendly, so they work on the static site too) and a looser persona.
(() => {
  const base = window.think;
  const CITIES = { 'san francisco': [37.77, -122.42], sf: [37.77, -122.42], oakland: [37.8, -122.27], 'san jose': [37.34, -121.89], berkeley: [37.87, -122.27], 'palo alto': [37.44, -122.14], 'mountain view': [37.39, -122.08], 'walnut creek': [37.91, -122.07], sausalito: [37.86, -122.49], 'half moon bay': [37.46, -122.43] };
  const WMO = c => c === 0 ? 'clear' : c <= 2 ? 'partly cloudy' : c === 3 ? 'overcast' : c <= 48 ? 'foggy (classic Karl)' : c <= 57 ? 'drizzly' : c <= 67 ? 'rainy' : c <= 77 ? 'snowy' : c <= 82 ? 'showery' : 'stormy';
  const BAY = [
    'Golden Gate Park’s Botanical Garden is free for SF residents and quiet on weekday mornings.',
    'The Lands End trail has the best Golden Gate views with none of the bridge traffic.',
    'Dan’s take: the Ferry Building on a Saturday morning is the most Bay Area thing you can do in two hours.',
    'Karl the Fog has his own following — summer in SF is famously colder than September.',
    'Mission burritos vs. everything else is a debate nobody in the Bay ever actually settles.',
    'A Bay Area design fact: a lot of the interaction patterns you use daily were prototyped within 40 miles of here.',
  ];
  async function weather(q) {
    const low = q.toLowerCase();
    const name = Object.keys(CITIES).find(k => low.includes(k)) || 'san francisco';
    const [la, lo] = CITIES[name];
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FLos_Angeles&forecast_days=1`);
    const j = await r.json(); const c = j.current, d = j.daily;
    const city = name === 'sf' ? 'San Francisco' : name.replace(/\b\w/g, m => m.toUpperCase());
    return { city, text: `${city} right now: ${Math.round(c.temperature_2m)}°F and ${WMO(c.weather_code)}, wind ${Math.round(c.wind_speed_10m)} mph. Today ${Math.round(d.temperature_2m_min[0])}–${Math.round(d.temperature_2m_max[0])}°F.` };
  }
  async function wiki(term) {
    const s = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=1&format=json&origin=*`).then(r => r.json());
    const t = s.query && s.query.search[0] && s.query.search[0].title; if (!t) return null;
    const p = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`).then(r => r.json());
    return p.extract ? { title: t, text: p.extract.split(/(?<=\.)\s/).slice(0, 2).join(' ') } : null;
  }
  const isWeather = q => /\b(weather|temperature|forecast|rain|raining|fog|foggy|sunny|cold|hot|warm)\b/i.test(q);
  const isBay = q => /\b(bay area|sf|san francisco|oakland|berkeley|things to do|what to do|recommend|eat|food|coffee|weekend)\b/i.test(q) && !/\b(dan|design|work|case|resume|hire)\b/i.test(q);
  const factTerm = q => { const m = q.match(/^(?:what(?:'s| is| are)|who(?:'s| is| was)|tell me about|explain|define|search(?: for)?|look up|google)\s+(?:an?\s+|the\s+)?(.+?)\??$/i); return m && !/\b(dan|daniel|you|your|this|his|portfolio|resume|work)\b/i.test(m[1]) ? m[1] : null; };
  const isTrend = q => /\b(trend|trending|latest|news|what'?s new|state of)\b/i.test(q);

  const PERSONA = `You are also allowed to be a genuinely good conversationalist: chat about random topics, design and AI trends, Bay Area life, weather, food, tech — like a friendly, well-read person in San Francisco. Keep it warm, witty, 1–3 sentences. When it fits naturally (not every time), tie back to Dan's work with one light suggestion. If LIVE CONTEXT is provided, use it as ground truth and mention where it's from (e.g. "per Open-Meteo", "per Wikipedia"). If a web_search tool is available, use it for news, trends or anything time-sensitive and keep the answer short; otherwise never claim to have browsed the web, and say your knowledge may be dated. Today is ${new Date().toDateString()}.`;

  const ENDPOINT = (window.DV_CONFIG && window.DV_CONFIG.AI_ENDPOINT) || '/api/concierge';
  let serverOK = location.protocol.startsWith('http') && !/claude|omelette|localhost:\d+\/projects/.test(location.href) ? null : false;
  async function complete(p) {
    if (window.claude && window.claude.complete) return window.claude.complete(p);
    const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...p, search: true }) });
    if (!r.ok) { serverOK = false; throw new Error('ai ' + r.status); }
    serverOK = true; return (await r.json()).text;
  }
  async function liveChat(q, history, ctx) {
    const sys = `You are the portfolio concierge for Dan (Daniel) Tieu, a Senior Product Designer in the SF Bay Area (healthcare, AI, design systems; Doctronic, GoodRx, Estée Lauder, Sephora). ${PERSONA}
${ctx ? 'LIVE CONTEXT:\n' + ctx : ''}
Reply with plain text only.`;
    const msgs = [...history.slice(-8).map(m => ({ role: m.role === 'me' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: q }];
    return String(await complete({ system: sys, messages: msgs, max_tokens: 300 })).trim();
  }

  window.think = async (q, history, matchIntent) => {
    const direct = matchIntent(q);
    if (direct && direct.strong) return base(q, history, matchIntent);
    const ai = (window.claude && window.claude.complete) || serverOK !== false;
    let ctx = null, fallback = null;
    try {
      if (isWeather(q)) { const w = await weather(q); ctx = w.text + ' (source: Open-Meteo)'; fallback = w.text + (/fog/.test(w.text) ? ' Good day to stay in and read a case study.' : ' Want to see some work while you’re here?'); }
      else if (factTerm(q)) { const w = await wiki(factTerm(q)); if (w) { ctx = `${w.title}: ${w.text} (source: Wikipedia)`; fallback = `${w.text} — via Wikipedia.`; } }
      else if (isBay(q)) { const tip = BAY[Math.floor(Math.random() * BAY.length)]; ctx = 'A local tip you can use: ' + tip; fallback = tip; }
      else if (isTrend(q) && !ai) fallback = 'The big design shift right now is AI moving from chat boxes into real workflows — trust, memory controls and human review are the new hard problems. That’s exactly what Dan designed at Doctronic; want to see it?';
    } catch (e) { /* network blocked — fall through */ }
    if (ai) {
      if (ctx || isTrend(q) || !direct) {
        try {
          const r = await base(q, history, matchIntent);
          if (r && r.type !== 'talk' && !ctx) return r;
          return { type: 'talk', say: await liveChat(q, history, ctx) };
        } catch (e) { if (fallback) return { type: 'talk', say: fallback }; }
      }
      return base(q, history, matchIntent);
    }
    if (fallback) return { type: 'talk', say: fallback };
    const r = await base(q, history, matchIntent);
    if (r && r.type === 'talk' && /not sure I have that one/.test(r.say)) {
      const w = await wiki(q).catch(() => null);
      if (w) return { type: 'talk', say: `Not my usual beat, but here’s the short version: ${w.text} — via Wikipedia. Anything about Dan’s work I can pull up?` };
    }
    return r;
  };
})();
