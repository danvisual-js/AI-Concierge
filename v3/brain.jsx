// brain.jsx — the concierge's conversational layer.
//
// Three outcomes for anything typed:
//   route   → the question clearly maps to content; answer + show it
//   confirm → close but ambiguous; answer conversationally, then ask before
//             opening anything (quick replies carry the decision)
//   talk    → off-topic or general; reply like a person, offer a way back
//
// Uses the live model when window.claude is available (this preview, and any
// host that provides it); otherwise falls back to the rule set below, so a
// deployed static copy still answers sensibly.
(() => {
  const FACTS = `You are the portfolio concierge for Dan Tieu, a product designer in the Bay Area (danielvisual.com).
Speak as "I" for the concierge, refer to Dan in the third person. Warm, plain, brief — 1-3 sentences, no bullet lists, no emoji.
Facts you may use: 12+ years across consumer health, wellness and AI-first orgs. Shipped the first AI-authorized prescription
refill with an AI doctor in the US (Doctronic, 2026). Built GoodRx's first telehealth subscription product (2025) and drove
funnel conversion to an all-time-high 26.1% from 15.6%. Led Estée Lauder's ShopEx search across 7+ luxury brands (lookup 47s→11s).
Founding designer on Stripes Beauty, Naomi Watts' menopause brand, at Amyris (+25% conversion, -13% cart abandonment YoY).
Also Quicken retirement calculator (abandon 81%→34%) and Sephora training for 30,000 advisors (94% weekly active).
Open to senior and principal roles, remote or Bay Area. Never invent numbers, employers, or dates beyond these.`;

  const TOPICS = ['all', 'ai', 'numbers', 'zto', 'health', 'enterprise', 'ecom', 'resume', 'bio', 'quest', 'hiring', 'talk'];

  // ---------- rule-based fallback ----------
  const SMALL = [
    [/^(hi|hey|hello|yo|sup|howdy|hola)\b/i, 'Hey — good to see you. I’m Dan’s concierge; I can pull up his work, his résumé, or set up a conversation with him. What are you after?'],
    [/how are you|how'?s it going|what'?s up/i, 'Doing well, thanks for asking. I’ve got twelve years of Dan’s work loaded and nothing better to do — where should we start?'],
    [/who are you|what are you|are you (a )?(bot|ai|real|human)/i, 'I’m an AI concierge Dan built into his portfolio, so you don’t have to dig through a nav to find the relevant work. Ask me anything about it.'],
    [/thank|thanks|thx|appreciate/i, 'Anytime. Anything else you want to see while you’re here?'],
    [/^(bye|goodbye|later|cheers)\b/i, 'Take care. If something comes up, the contact form is one tap away in the rail on the left.'],
    [/joke|funny|bored|entertain/i, 'Not my strong suit — but Design Quest is genuinely fun: three real decisions from Dan’s shipped work, and you find out what actually happened. Want to play?'],
    [/weather|sports|stock|news|recipe|movie|politics/i, 'That one’s outside my job description — I only know Dan’s work. Happy to point you at a case study though.'],
    [/salary|rate|comp|how much|pricing|cost/i, 'Compensation is a conversation for Dan directly, not something I’d guess at. If you send the role through the hiring form, he replies within 48 hours.'],
    [/remote|relocat|where.*(based|live)|location|onsite|hybrid/i, 'Dan’s based in the Bay Area and open to remote or Bay Area roles, senior through principal.'],
    [/available|open to|looking for (work|a job)|freelance|contract/i, 'Yes — he’s open to senior and principal roles right now. If you have something specific, the hiring form gets to him directly.'],
    [/what tools|figma|software|stack/i, 'Figma for design, and he prototypes in code often enough that standards end up in the build rather than a library — that’s literally how the Doctronic work shipped.'],
    [/how.*(work|process|approach)|methodolog/i, 'Short version: he works in the open — real user calls, messy files, prototypes in front of engineers early — and treats constraints like legal review as a design problem rather than a blocker. The case studies show it step by step.'],
    [/why (design|product)|passion|motivat/i, 'He tends to take the parts of a product people dread — intake forms, compliance screens, shift scheduling — and make them feel obvious. Most of his work sits where the stakes are real: health and money.'],
    [/reference|recommend|linkedin/i, 'LinkedIn is linked from the résumé panel, and Dan can put you in touch with references directly through the contact form.'],
  ];

  // "close but not certain" — answer, then confirm before opening content
  const NEAR = [
    [/goodrx|telehealth|subscription/i, 'goodrx', 'GoodRx is probably what you want — Dan owned that subscription product end to end and took the funnel to an all-time-high 26.1%.', 'Open the GoodRx case study?'],
    [/doctronic|refill|ai doctor/i, 'doctronic', 'That’s the Doctronic work — the first AI-authorized prescription refill flow in the US.', 'Open the Doctronic case study?'],
    [/stripes|naomi|menopause|amyris|beauty/i, 'stripes', 'Sounds like Stripes Beauty — Naomi Watts’ menopause brand, launched on schedule after half of design leadership left mid-project.', 'Open the Stripes case study?'],
    [/est[ée]e|shopex|lauder|search/i, 'shopex', 'That’s the Estée Lauder ShopEx work — enterprise search for 5,000 associates, lookup time cut from 47 seconds to 11.', 'Open the ShopEx case study?'],
    [/quicken|retirement|calculator|fintech/i, 'quicken', 'That’s Quicken — the retirement calculator he made interactive instead of submittable. Abandon rate went 81% to 34%.', 'Open the Quicken case study?'],
    [/sephora|training|learning|advisor/i, 'sephora', 'That’s the Sephora work — five-minute training drops for 30,000 beauty advisors.', 'Open the Sephora case study?'],
    [/homebase|scheduling|sms|shift/i, 'homebase', 'That’s HomeBase — shift swaps over SMS so hourly staff never had to install an app.', 'Open the HomeBase case study?'],
  ];

  function rules(q) {
    for (const [re, say] of SMALL) if (re.test(q)) return { type: 'talk', say };
    for (const [re, caseId, say, ask] of NEAR) if (re.test(q)) return { type: 'confirm', caseId, say, ask };
    return null;
  }

  // ---------- live model ----------
  async function live(q, history) {
    const sys = `${FACTS}

The visitor typed a message. Decide what to do and reply with ONE JSON object, nothing else:
{"reply": "...", "action": "route"|"confirm"|"talk", "topic": null|one of ${TOPICS.join('|')}, "caseId": null|"doctronic"|"goodrx"|"stripes"|"shopex"|"quicken"|"sephora"|"homebase", "ask": null|"short yes/no question"}

- "route": they clearly want a section of the portfolio. Set topic. reply = one short sentence introducing it.
- "confirm": you can tell roughly what they want but should check first, or they named one project. Set caseId (or topic) AND ask — a short yes/no question. Do not assume.
- "talk": small talk, off-topic, or a question you can answer from the facts. topic and caseId null. Answer it genuinely, then offer one relevant next step in the same breath.
Never invent facts. If asked something about Dan you do not know, say so plainly and suggest the contact form.`;
    const msgs = [...history.slice(-6).map(m => ({ role: m.role === 'me' ? 'user' : 'assistant', content: m.text })),
      { role: 'user', content: q }];
    const out = await window.claude.complete({ system: sys, messages: msgs, max_tokens: 400 });
    const j = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1));
    return { type: j.action || 'talk', say: j.reply, topic: j.topic || null, caseId: j.caseId || null, ask: j.ask || null };
  }

  // ---------- public ----------
  async function think(q, history, matchIntent) {
    // an unmistakable match still short-circuits — no need to ask the model
    const direct = matchIntent(q);
    if (direct && direct.strong) return { type: 'route', topic: direct.id, say: direct.say };
    if (window.claude && window.claude.complete) {
      try { return await live(q, history); } catch (e) { /* fall through to rules */ }
    }
    const r = rules(q);
    if (r) return r;
    if (direct) return { type: 'route', topic: direct.id, say: direct.say };
    return { type: 'talk',
      say: 'I’m not sure I have that one — I only know Dan’s work and how he works. Want the case studies, the résumé, or a line straight to him?' };
  }

  Object.assign(window, { think });
})();
