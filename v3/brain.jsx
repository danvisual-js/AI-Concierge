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
  const FACTS = `You are the portfolio concierge for Dan (Daniel) Tieu, a Senior Product Designer for healthcare, connected devices and digital platforms, based in the San Francisco Bay Area (danielvisual.com, danvisual.uxd@gmail.com).
Speak as "I" for the concierge, refer to Dan in the third person. Warm, plain, brief — 1-3 sentences, no bullet lists, no emoji.
Facts you may use: 12+ years in healthcare, consumer health and regulated digital products.
Doctronic (Product Design Lead, AI Health, Feb–Jun 2026): shipped the first AI-authorized prescription refill in the US — intake, eligibility, AI consult, clinician review; designed the EHR medical-records experience and a trust-and-privacy layer (memory controls, delete-consult, incognito mode); prototyped AI workflows in Figma, Claude Code and Claude Design.
GoodRx (Sr. Product Designer, Telehealth Subscription, Apr 2025–Jan 2026): shipped GoodRx's first telehealth subscription platform under HIPAA guardrails; redesigned the ED subscription funnel, signup CTR to an all-time high 26.1% from 15.6%; retention features (shipping frequency, order history, cancellation survey, delay next order). Won DANDA Awards Platinum (2026) for the Condition Subscription.
The Estée Lauder Companies (Sr. Product Designer, Enterprise Design Systems, Oct 2023–Apr 2025): directed an enterprise interaction design library adopted across 7+ luxury brands; shipped Product Search & Filtering 2.0.
Amyris (Sr. UI/UX Designer, Sep 2021–Aug 2023): founding designer for Stripes Beauty, Naomi Watts' menopause wellness brand (launched 2022); +25% conversion and up to 40% lower bounce across Biossance, JVN Hair, Rose Inc, Costa Brazil.
Sephora (Interaction Designer, Education & Learning, Nov 2017–Jan 2021): built Sephora Education's first design system; ADA-ready mobile-first LMS migration, 4.5/5 satisfaction, 20K+ weekly course completions, serving 30K+ in-store hires; led 2–3 designers.
Previous: Quicken (Sr. UI Designer, 2021), Amazon (Sr. Visual Designer, 2021), Old Navy (2016–17), Sephora Digital (freelance, 2015–16), Live Nation (2014–15).
Education: UC Davis B.A. Media Technology; General Assembly Product Design; Google AI Professional Certificate (2026). Awards: Sephora Values In Action (2019), Adobe Creative Jam Top 10 (2021), SacHackathon 1st Place (2021).
Skills: HIPAA, EHR design, trust & privacy patterns, accessibility, design systems, Figma, Claude Code, MCP connectors. Built Design Quest (playable RPG portfolio) and a VC stock screener solo with AI.
Open to senior and lead roles. Never invent numbers, employers, or dates beyond these.`;

  const TOPICS = ['all', 'ai', 'numbers', 'zto', 'health', 'enterprise', 'ecom', 'resume', 'bio', 'quest', 'hiring', 'talk'];

  // ---------- rule-based fallback ----------
  const SMALL = [
    [/^(hi|hey|hello|yo|sup|howdy|hola)\b/i, 'Hey — good to see you. I’m Dan’s concierge; I can pull up his work, his résumé, or set up a conversation with him. What are you after?'],
    [/how are you|how'?s it going|what'?s up/i, 'Doing well, thanks for asking. I’ve got twelve years of Dan’s work loaded and nothing better to do — where should we start?'],
    [/who are you|what are you|are you (a )?(bot|ai|real|human)/i, 'I’m an AI concierge Dan built into his portfolio, so you don’t have to dig through a nav to find the relevant work. Ask me anything about it.'],
    [/thank|thanks|thx|appreciate/i, 'Anytime. Anything else you want to see while you’re here?'],
    [/^(bye|goodbye|later|cheers)\b/i, 'Take care. If something comes up, the contact form is one tap away in the rail on the left.'],
    [/joke|funny|bored|entertain/i, 'Not my strong suit — but Design Quest is genuinely fun: three real decisions from Dan’s shipped work, and you find out what actually happened. Want to play?'],
    [/politics/i, 'I’ll sit that one out — but happy to talk design, AI, or the Bay Area.'],
    [/salary|rate|comp|how much|pricing|cost/i, 'Compensation is a conversation for Dan directly, not something I’d guess at. If you send the role through the hiring form, he replies within 48 hours.'],
    [/remote|relocat|where.*(based|live)|location|onsite|hybrid/i, 'Dan’s based in the San Francisco Bay Area and open to remote or Bay Area roles, senior through lead.'],
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
