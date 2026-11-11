// projects.jsx — case studies structured as a story plus a UX record:
// Problem → Discover → Design → Solution → Testing, with the pivot called out.
// **bold** renders as <strong>. Exports window.PROJECTS + window.Rich.
(() => {
  const P = [
    {
      id: 'designquest', personal: true, phone: 'assets/case/designquest-phone.jpg', hero: 'assets/case/designquest-hero.jpg', client: 'Design Quest', tint: 'var(--violet)', year: '2026',
      title: 'A portfolio built as a playable RPG — shipped in days',
      role: 'Lead Product Designer · AI-assisted development', dates: '2026', discipline: 'Game / portfolio',
      cats: ['ai', 'zero-to-one'], demo: 'designquest',
      headline: { v: '65KB', l: 'a whole playable RPG, gzipped — 33 components, no game engine' },
      story: 'Design Quest is a browser-based, top-down RPG: you walk through a town, enter buildings and find case studies, skills and résumé history. **The game is the portfolio** — live, playable in the browser, and built from idea to launch in days.',
      pivot: { h: 'The pivot', b: 'The question was never “how do I show my case studies.” It was **“how do I make something someone will remember and talk about?”** Once the brief changed, a grid of cards stopped being an option.' },
      sections: [
        { k: 'Problem', b: ['Most portfolios follow the same pattern: a grid of cards, click in, read, click out. Visitors scan, then leave — and the format signals polish rather than thinking.'] },
        { k: 'Approach', b: ['I picked the RPG format for UX reasons, not novelty. Arrow keys, walk, enter: **controls everyone already knows**, so there’s no tutorial.', 'Buildings map to sections, so spatial memory does the work a nav would do. Entering a building is a deliberate act, which raises intent before the content appears.'] },
        { k: 'Solution', b: ['A town you walk. Case studies, skills and history live in places rather than on a page, so the visit is a route the visitor chose, not a scroll they endured. Every mechanic had a design reason.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/designquest-screens.jpg', cap: '**One game, two screens.** The title screen in a desktop browser and on a phone.' }, { type: 'img', wide: true, src: 'assets/case/designquest-start.jpg', cap: '**Pick a reviewer, then walk the town.** Each building is a section; walk up to one and press Enter.' }, { type: 'img', wide: true, src: 'assets/case/designquest-rooms.jpg', cap: '**Inside the buildings.** Skills read as character stats; the Arcade lists case studies you browse with the arrow keys.' }, { type: 'decisions', items: [
            { h: 'Character select as a hiring metaphor', b: 'Three playable characters — a systems architect, a growth strategist and a motion designer — framed as a hiring panel, each with a bio written in a recruiter’s voice.' },
            { h: 'A riddle instead of a contact card', b: 'The courier gives a riddle, not an email address: contact details stay off screen, and exploring is rewarded.' },
            { h: 'Keyboard-first, by design', b: 'Arrow keys move, Enter interacts, Esc closes, left and right page carousels. Accessibility is the primary interaction model, not a checkbox — and it went through five rebuilds.' },
            { h: 'An ending, not a modal close', b: 'Leaving rolls credits with your character cheering under confetti, so the visit ends with a moment of completion.' }] },
            { type: 'img', wide: true, src: 'assets/case/designquest-end.jpg', cap: '**The courier and the credits.** Contact is a small puzzle, and leaving ends on a finish line.' }] },
        { k: 'Building with AI', b: ['I directed product definition, visual style, UX flows, content, interaction design, QA and deployment; Claude implemented the SVG pixel art, React architecture, keyboard system, camera math and animations. **Every feature went through a real design loop** — direction, first pass, critique, revision, re-test.', 'That short cycle meant the format itself could be tested live rather than argued about in a deck.'] },
      ],
      result: ['A **live, playable** product, not a concept', 'Shows product design, game feel and AI-assisted delivery at once', 'Doubles as the portfolio it describes'],
      metrics: [{ v: '2,500+', l: 'lines of code, designed and built solo with AI' }, { v: '33', l: 'game components' }, { v: '65KB', l: 'gzipped bundle — loads in a blink' }],
    },
    {
      id: 'screener', personal: true, phone: 'assets/case/screener-phone.jpg', hero: 'assets/case/screener-hero.jpg', client: 'VC Stock Screener', tint: 'var(--violet)', year: '2026',
      title: 'A free, mobile-first market screener — designed and shipped with Claude',
      role: 'Product designer + builder (solo, with Claude)', dates: '2026 · 2 weeks + v2', discipline: 'Fintech tool',
      cats: ['ai', 'numbers', 'zero-to-one'], demo: 'screener',
      headline: { v: '4', l: 'platforms from one codebase — web app, desktop, iOS and Android' },
      story: 'Good market data costs hundreds a month; the free tools are cluttered, ad-heavy and not built for phones. I wanted to know whether a designer with no engineering background could ship a real financial product by **directing an AI through every decision — design, product and engineering**. The answer is live: a mobile-first screener with charts, analyst data and news, shipped in two weeks, then rebuilt into a version that teaches.',
      pivot: { h: 'The pivot', b: 'The first version put an AI-generated insight button on every stock card. **I swapped the AI paragraph for real analyst consensus** — rating, price-target range and how many analysts cover the stock — opened in one detail panel. More accurate, more actionable and free, with no API cost per click.' },
      sections: [
        { k: 'Design evolution', b: ['The stock card is the core unit of the product, and it went through three versions — each driven by a specific critique.'],
          blocks: [
            { type: 'timeline', items: [
              { d: 'Version 1', t: 'Prototype', b: 'An AI button and a recommendations button on every card — 20+ identical CTAs on screen — plus personal P&L that made the tool unshareable.' },
              { d: 'Version 2', t: 'Simplified', b: 'Buttons and P&L removed. Cleaner, but the badge showed % without the $ move and there was still no sense of momentum.' },
              { d: 'Version 3', t: 'Shipped', b: 'An intraday sparkline, % and $ change together, and zero buttons: **the card itself opens the detail panel** with charts and analyst data.' }] },
            { type: 'img', wide: true, src: 'assets/case/screener-evolution.jpg', cap: '**Three versions of the same card.** Each change came from a specific critique.' },
            { type: 'decisions', items: [
              { h: 'AI insight → analyst consensus', b: 'Real ratings and price targets from dozens of analysts beat one generated paragraph, and cost nothing to serve.' },
              { h: 'A button per card → one detail panel', b: 'Tap a stock and everything opens in one place. No decisions to make on the list.' },
              { h: 'Sideways news → vertical accordion', b: 'Readable on a phone without swiping, with publisher and date as credibility signals.' },
              { h: 'Ticker tape → removed', b: 'It repeated the card grid and animated constantly. Deleting it made the page calmer and faster to scan.' }] },
            { type: 'img', wide: true, src: 'assets/case/screener-tradeoffs-a.jpg', cap: '**What we tried vs. what shipped.** Analyst consensus replaced the AI paragraph; one detail panel replaced a button on every card.' },
            { type: 'img', wide: true, src: 'assets/case/screener-tradeoffs-b.jpg', cap: '**News and the ticker tape.** A vertical accordion replaced sideways scrolling, and the ticker tape was deleted.' },
            { type: 'img', wide: true, src: 'assets/case/screener-dashboard.jpg', cap: '**The shipped dashboard.** Market indices up top, tabbed watchlists, and cards that open the detail panel.' },
          ] },
        { k: 'Mobile & data', b: ['On desktop, a stock list sits beside the detail panel. On a phone that split made both columns unreadable, so **tapping a stock now swaps to a full-screen detail view** with a back button.', 'Getting live prices into a browser app took four failed attempts — direct calls blocked by CORS, public proxies rate-limited, a package that crashed on deploy, and authenticated requests still blocked because the provider bans cloud IP ranges. The fix was a developer-grade price API behind a small serverless proxy, with keys kept server-side.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/screener-mobilefix.jpg', cap: '**The split panel that broke on mobile.** On a phone, tapping a stock now swaps to a full-screen detail view.' }, { type: 'img', wide: true, src: 'assets/case/screener-dataflow.jpg', cap: '**Final data flow.** Prices from a developer-grade API and charts, news and analyst data through a serverless proxy, with keys kept server-side.' }] },
        { k: 'Version 2: a screener that teaches', b: ['After launch the problem became comprehension: a non-professional investor could see a P/E of 38 and still not know what to do with it. **Every number now explains itself, every warning says why, and nothing reads as a buy or sell instruction.**'],
          list: ['**Earnings this week, fused with your watchlist** — your tickers first, with estimates and how each moved after its last four reports', '**One tap to analysis** — tap an earnings ticker and the stock opens with its analysis already running', '**Health Check badges** — No flags, Watch or Caution from six checks, each flag explained in plain language', '**Trader Playbooks** — three ready-made scans of 50 popular stocks, every rule shown as met, close or not met', '**A glossary in the interface** — jargon is underlined; hover or tap for a definition and why pros care'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/screener-earnings.jpg', cap: '**Earnings this week and Trader Playbooks.** Your watchlist first; every playbook rule marked met, close or not met.' }, { type: 'img', wide: true, src: 'assets/case/screener-teach.jpg', cap: '**Health Check and glossary.** Each flag says why, and jargon explains itself where it appears.' }] },
        { k: 'One codebase, four apps', b: ['The same React app ships as an installable web app, a desktop app and Android and iOS builds. Data and AI stay on the server, so the apps are thin shells and a fix reaches every platform at once.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/screener-mobile.jpg', cap: '**On a phone.** Earnings and full-screen stock detail, from the same codebase as the web and desktop apps.' }, { type: 'img', wide: true, src: 'assets/case/screener-features.jpg', cap: '**Every feature and where it came from** — a design decision, a technical constraint or a product call.' }] },
      ],
      result: ['Designed and built solo in **two weeks**, **live in production**', 'Version 2 turned a data screen into a teaching tool: **six health checks**, **three playbooks**, an in-context glossary', 'One codebase packaged for **web, desktop, iOS and Android**'],
      reflection: 'The most useful reframe was treating Claude as a senior engineer with encyclopedic knowledge but no taste — my job was to supply the taste and push back on first answers. Before a public launch it still needs licensed market data, sign-in with rate limits on the paid AI endpoint, and app-store submissions.',
      metrics: [{ v: '$0', l: 'monthly data cost — real-time prices and analyst data on free APIs' }, { v: '6', l: 'checks behind every Health Check badge' }, { v: '50', l: 'popular stocks each Trader Playbook scans' }],
    },
    {
      id: 'doctronic', locked: true, client: 'Doctronic', tint: 'var(--violet)', year: '2026',
      title: 'The first AI-authorized prescription refill in the US',
      role: 'Lead Product Designer, AI Health', dates: 'Feb 2026 – Jun 2026', discipline: 'AI health',
      cats: ['ai', 'health', 'zero-to-one'],
      hero: 'assets/case/doctronic-hero.jpg', thumb: 'assets/case/doctronic-thumb.jpg',
      headline: { v: '~10×', l: 'daily Utah renewals — from about a dozen to ~100 a day' },
      story: 'Doctronic is an AI telehealth platform founded by two doctors, with more than 25 million consultations behind it. In Utah, a state program let patients renew eligible prescriptions online, approved by AI, with no in-person visit — **the first AI-authorized prescription refill in the country**, covered by the Washington Post, Politico and the Salt Lake Tribune. I led design for the refill experience, from the eligibility check to checkout.',
      pivot: { h: 'The pivot', b: 'The team kept polishing the form. **The real problem was trust and measurement:** we asked for location and ID before earning any trust, and optimized for a completed refill — an event too rare to learn from. I moved the conversion event upstream to **contact capture**, so anyone who left could be brought back.' },
      sections: [
        { k: 'Problem', b: ['The refill flow launched as a multi-step form. **96% of users dropped off before completing a refill — and left no contact information**, so every drop-off was a permanent loss.', 'The standard playbook — a new identity-verification provider, a medication-first flow, tighter copy, more trust signals — didn’t meaningfully move conversion.'],
          blocks: [{ type: 'stats', items: [{ v: '96%', l: 'left before completing a refill, with no contact info' }, { v: '72%', l: 'dropped at identity verification — the biggest leak' }] }, { type: 'img', wide: true, src: 'assets/case/doctronic-problem.jpg', cap: '**The original form-based flow.** Every highlighted screen asked for something before the product had earned it.' }] },
        { k: 'Discover', b: ['Mapping the funnel step by step named two real leaks.'],
          list: ['**Identity verification caused a 72% drop** — the single biggest leak.', '**Up to 60% of top-of-funnel users weren’t actually in Utah.** By identity verification about 90% were genuine Utah users, so the funnel looked leakier than it was.'],
          blocks: [{ type: 'stats', items: [{ v: '60%', l: 'of top-of-funnel users weren’t actually in Utah' }, { v: '~90%', l: 'were genuine Utah users by identity verification' }] }, { type: 'img', wide: true, src: 'assets/case/doctronic-insight.jpg', cap: '**The old Utah check** fired before users had any reason to trust us.' }] },
        { k: 'Key decisions', b: ['Five calls shaped the redesign.'],
          blocks: [{ type: 'decisions', items: [
            { h: 'Removed geolocation up front', b: 'GPS fired before users trusted us and often failed on mobile. The Utah check moved to pharmacy selection, where the question makes sense, with a clear exit to a video visit for out-of-state users.' },
            { h: 'Made contact capture the conversion event', b: 'A completed refill was too rare for ad platforms to learn from, and most drop-offs were interruptions, not decisions. The first CTA became phone capture — “get access to your private portal.”' },
            { h: 'Asked before pulling prescription history', b: 'Users were startled when their prescription data appeared without warning. An explicit opt-in turned a trust violation into a trust-building moment.' },
            { h: 'Reframed refills as renewals', b: '“Refill” sounds as easy as replying yes to a pharmacy text. “Renewal” is the harder job — running out and tracking down a doctor — which is what Doctronic actually solves.' },
            { h: 'Made every drop-off resumable', b: 'Every step got a URL that restores the user’s exact place, before any re-engagement message went out.' },
            { h: 'Made the AI legible, with no dead ends', b: 'Patients can’t see inside a model, so each AI step shows what it’s checking and which safety checks passed. Every path ends somewhere useful: a refill, an AI consult or a video visit with a doctor.' },
          ] },
          { type: 'img', wide: true, src: 'assets/case/doctronic-explore.jpg', cap: '**Exploration · Option B.** Four steps, each opened by a milestone screen that says what comes next and how long it takes.' },
          { type: 'img', wide: true, src: 'assets/case/doctronic-iterate.jpg', cap: '**Iterations, current → new.** Folding eligibility and the ID check into one screen with plain consent language, and a landing page that asks for a phone number first.' },
          { type: 'img', wide: true, src: 'assets/case/doctronic-flow.jpg', cap: '**The redesigned Utah flow** across logged-in, logged-out and out-of-formulary paths.' }] },
        { k: 'What shipped', b: ['Six releases in six weeks, built around four steps.'],
          blocks: [
            { type: 'flow', steps: [{ h: 'Find prescription', d: 'Phone, ID check and the medication you take' }, { h: 'AI health consult', d: 'A few questions, reviewed by the AI doctor', hl: true }, { h: 'Pick a pharmacy', d: 'Utah check happens here, with a way out' }, { h: 'Review & pay', d: '$19 renewal, sent to the pharmacy' }] },
            { type: 'img', wide: true, src: 'assets/case/doctronic-shipped.jpg', cap: '**Live today:** a private refill portal and a clear choice between a $19 renewal and a $39 new prescription.' },
            { type: 'releases', rows: [
              ['v1.13.1', 'May 28', 'New refill landing page — trust signals, FAQ, press bar, A/B test support'],
              ['v1.14.0', 'Jun 2', 'Full flow overhaul — formulary handling, error redesign, Utah-language removal'],
              ['v1.14.2', 'Jun 4', 'Mobile fix — refill chat message pinned above the keyboard'],
              ['v1.15.0', 'Jun 8', '3-state prescription status system — clearer patient visibility'],
              ['v1.15+', 'Jun 9', 'Automated renewal flow — lifecycle SMS plus async provider review at $19'],
            ] },
          ] },
      ],
      result: ['Shipped the **first AI-authorized prescription refill in the US**, covered by national press', 'Utah renewals grew **about 10×** after the flow redesign — from roughly a dozen a day to ~100', 'Hit the new north star: **6% conversion from eligibility to AI decision**, with identity verification as the main lever', '**85%** of patients who complete a first refill come back for a second'],
      reflection: 'Honestly, I spent the first couple of weeks polishing screens that weren’t the problem. We were counting the wrong thing — most of the people we were losing were never in Utah to begin with. Once we measured the right event, the design calls got a lot easier. If I did it again, I’d sit with the data on day one and push for resumable links before we spent a dollar on re-engagement.',
      metrics: [{ v: '~10×', l: 'daily Utah renewals (≈12 → 100)' }, { v: '6%', l: 'north-star conversion, hit' }, { v: '85%', l: 'return after a first refill' }],
      note: 'Renewal and conversion figures confirmed by the Doctronic design lead; early tracking was imperfect, so they are stated as approximate. Left out on purpose: the end-to-end completion rate, the small-sample ~10% drop-off improvement, ad costs, revenue and coworker names.',
    },
    {
      id: 'goodrx', locked: true, client: 'GoodRx', tint: 'var(--violet-2)', year: '2025',
      title: 'Making a sensitive purchase feel simple',
      role: 'Senior Product Designer', dates: 'Apr 2025 – Jan 2026', discipline: 'Telehealth subscription',
      cats: ['health', 'numbers', 'zero-to-one'],
      hero: 'assets/case/goodrx-hero.jpg', thumb: 'assets/case/goodrx-thumb.jpg',
      headline: { v: '26.1%', l: 'all-time-high conversion, up from 15.6%' },
      story: 'GoodRx serves about 30 million customers a year, mostly through one-off prescription discounts. In 2025 it launched its **first subscription**: online visits with licensed providers, prescriptions and discreet home delivery in one monthly plan, starting with erectile dysfunction treatment against Hims and Roman. **I led design on GoodRx’s first end-to-end subscription platform**, taking it from a 0 → 1 launch to an all-time-high 26.1% conversion.',
      pivot: { h: 'The pivot', b: 'Legal needed an emergency-screening question early in the flow, but it read as alarming and pushed people out. Instead of arguing to remove it, **I merged it into the terms screen with tappable details: same legal coverage, better placement.** It became the template for working with legal across the funnel.' },
      sections: [
        { k: 'My role', b: ['I owned the flow end to end: landing page, onboarding, health intake, plan and checkout, and the subscriber dashboard. Checkout had to handle product and dosage choice, shipping frequency, ID verification and payment — with every screen reviewed by legal and clinical.', 'With our design systems team, I built the subscription and onboarding surfaces as **reusable components**. They became the blueprint for later programs — **GLP-1s, hair loss and skin care** — so new treatment lines launch by swapping content, not rebuilding the stack. Behind the scenes, the flow connects to our telehealth partners for questionnaires, provider approval and fulfillment, ending in a condition-aware subscriber dashboard.'],
          blocks: [{ type: 'flow', steps: [{ h: 'Landing page', d: 'Value, pricing calculator, drug comparisons' }, { h: 'Onboarding', d: 'Sign-up, authentication, terms' }, { h: 'Health intake', d: 'Medical questions reviewed by a provider' }, { h: 'Plan & checkout', d: 'Dosage, price, shipping frequency, ID verification, payment', hl: true }, { h: 'Order management', d: 'Reschedule, adjust treatment, pause or cancel', hl: true }] }, { type: 'img', wide: true, src: 'assets/case/goodrx-flow.jpg', cap: '**Five steps from first click to recurring order.** Plan & checkout and order management highlighted.' }] },
        { k: 'Finding the leaks', b: ['Shortly after launch we looked at performance across the whole flow. **36% of people left before finishing three warm-up questions**, and the landing page itself lost 86.3% of visitors.', 'Our hypothesis: a brand-new service already makes people hesitant, and the health warnings, screening questions and warm-up pages bloated onboarding on top of that. Cutting screens and shortening the legal language should lift conversion by more than 3%.'],
          blocks: [
            { type: 'bars', h: 'Where buyers dropped after launch · share of landing-page visitors', rows: [{ l: 'Started onboarding', v: 64, d: '64%' }, { l: 'Reached sign-up', v: 12.5, d: '12.5%' }, { l: 'Completed purchase', v: 5.5, d: '5.5%', hl: true }], note: '**36%** left before finishing three warm-up questions.' },
            { type: 'callout', h: 'From research', b: '**67% of people who dropped off were already managing ED.** They wanted the product — the flow was in the way.' },
            { type: 'bars', h: 'What worried people who left · mid-funnel survey, n=104', rows: [{ l: 'Hard to cancel', v: 26, d: '26%', hl: true }, { l: 'Hidden fees', v: 20, d: '20%' }, { l: 'Unclear pricing', v: 20, d: '20%' }, { l: 'Didn’t know GoodRx did this', v: 16, d: '16%' }], max: 30, note: 'The most common questions: what a shipment costs in total, how often billing happens, and how refills work.' },
          ] },
        { k: 'Three fixes', b: ['Each one shipped and was measured on its own step.'],
          blocks: [
            { type: 'fixes', items: [{ h: 'Simplified notices', a: 17, b: 20 }, { h: 'Removed warm-up questions', a: 5.54, b: 7.84 }, { h: 'Personalized dosage choice', a: 20, b: 24.6 }] },
            { type: 'img', wide: true, src: 'assets/case/goodrx-fix1.jpg', cap: '**Fix 1 · Simplified notices.** Onboarding conversion **17% → 20%**.' },
            { type: 'img', wide: true, src: 'assets/case/goodrx-fix2.jpg', cap: '**Fix 2 · Removed 3 warm-up questions and 2 milestone pages.** Reach-to-sign-up **5.54% → 7.84%**.' },
            { type: 'img', wide: true, src: 'assets/case/goodrx-fix3.jpg', cap: '**Fix 3 · Personalized dosage choice** for returning patients. Sign-up from that step **20% → 24.6%**.' },
          ] },
        { k: 'A better front door', b: ['Our insights team surveyed 500 people about the landing page. **85% of visitors were on mobile, and 57% read our email as a discount rather than a treatment plan.** When we asked people to rank what was on the page, the order was upside down: the hero video we led with came seventh. A second, conjoint study of 1,500 people across five segments added the other half: shoppers already subscribed with a competitor cared more about **trust and a seamless experience than the lowest price**.', 'Testing told us people wanted medication and pricing upfront — not discreet-delivery messaging or marketing copy. I redesigned the landing page to **lead with price and value**, reorganized the content around those insights, and made it WCAG 2 compliant. In the A/B test, click-through jumped **24%**; once the new lander shipped, conversion reached an all-time high of **26.1%**, up from 15.6%.'],
          blocks: [
            { type: 'stats', items: [{ v: '85%', l: 'of landing-page visitors on mobile' }, { v: '57%', l: 'read the email as a discount, not a treatment plan' }, { v: '89%', l: 'felt confident they’d get quality treatment' }] },
            { type: 'rank', h: 'Landing page · what shoppers ranked first on mobile', rows: [['Medication options', 3, 1], ['Pricing calculator', 5, 2], ['How it works', 2, 3], ['“Find the right treatment”', 9, 4], ['Hero video', 1, 7]], note: 'So the redesign moved the calculator and medication choice up, and the video down.' },
            { type: 'img', wide: true, src: 'assets/case/goodrx-landing.jpg', cap: '**Before → after.** Price, value and products upfront.' }] },
      ],
      result: ['GoodRx’s first subscription shipped in **May 2025** — 2025 DANDA Platinum Award', 'Conversion reached an all-time high of **26.1%**, up from 15.6%', 'Components became the blueprint for **GLP-1s, hair loss and skin care**'],
      reflection: 'We launched without solid funnel tracking, so the first few weeks were mostly educated guessing — every fix here could have shipped sooner if we’d instrumented the flow before launch. The other lesson: bring legal into the room early. The best change we made, folding the emergency question into the terms, only happened because we sat down together instead of trading comments in a doc.',
      metrics: [{ v: '26.1%', l: 'conversion, all-time high' }, { v: '+24%', l: 'landing page CTR (A/B)' }, { v: '24.6%', l: 'sign-up on the plan step, from 20%' }],
      note: 'Landing page result is a controlled A/B test; the three onboarding fixes are before/after comparisons over back-to-back date ranges.',
    },
    {
      id: 'stripes', client: 'Amyris · Stripes', tint: 'var(--plum)', year: '2022',
      title: 'A store that teaches, then sells — 0-to-1 for a new beauty brand',
      role: 'Senior UI/UX Designer', dates: 'Sep 2021 – Aug 2023', discipline: 'DTC e-commerce',
      cats: ['brand', 'ecom', 'zero-to-one', 'numbers'],
      hero: 'assets/case/stripes-hero.jpg', thumb: 'assets/case/stripes-thumb.jpg',
      headline: { v: '−13%', l: 'cart abandonment, year over year' },
      story: 'Amyris ran a portfolio of clean-beauty brands — Biossance, Pipette, JVN Hair, Rose Inc and more — on one commerce platform. **Stripes**, a menopause wellness brand co-founded by Naomi Watts, was its newest launch. I designed the full shopping funnel, from homepage to checkout, on a 12-week timeline.',
      pivot: { h: 'The pivot', b: 'Mid-project, our design director and a designer left within weeks of each other. **Another designer and I split the remaining work and took over stakeholder reviews ourselves** — weekly with the VP of Product — and launched on time.' },
      sections: [
        { k: 'Research', b: ['Shoppers wanted proof before buying for a sensitive life stage. In testing, **13 of 15** wanted more product detail and **2 of 3** never found the collection pages. Two kinds of shopper emerged: **Quick Fixers**, who want a direct path from symptom to product, and **Adjusted Advocates**, who come for community and editorial.'],
          blocks: [{ type: 'stats', items: [{ v: '48%', l: 'abandon over extra costs like shipping and tax' }, { v: '27%', l: 'miss info placed only in banners' }, { v: '16%', l: 'can’t see their total upfront' }] }, { type: 'img', wide: true, src: 'assets/case/stripes-research.jpg', cap: '**Checkout research and cart testing:** everyone wanted the total and a promo field before checkout.' }] },
        { k: 'The full funnel', b: ['Education leads straight into shopping at every step: brand story and products together on home, top-level categories plus shop-by-concern in navigation, and clear PLPs.'],
          blocks: [
            { type: 'img', wide: true, src: 'assets/case/stripes-wires.jpg', cap: '**Low-fi wireframes** — home, bestsellers, PDP, PLP and menu.' }, { type: 'img', wide: true, src: 'assets/case/stripes-shipped.jpg', cap: '**Shipped** — the launched mobile home, campaign by campaign.' },
            { type: 'img', wide: true, src: 'assets/case/stripes-funnel.jpg', cap: '**Home · PLP · PDP · checkout**' },
            { type: 'img', wide: true, src: 'assets/case/stripes-mobile.jpg', cap: '**Mobile, end to end** — quiz entry, campaign home, all products, a bundle PDP and the subscriptions dashboard.' }] },
        { k: 'Ingredient-led PDP', b: ['Bite-sized science stories put key ingredients front and center, answering “is this right for me?” before add-to-bag.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/stripes-pdp.jpg', cap: '**Key ingredients**, told in plain language.' }] },
        { k: 'The cart', b: ['48% of shoppers abandon over extra costs, so the cart answers “what will I actually pay?” before checkout.'],
          list: ['**Free-gift progress meter** — offers apply automatically', '**Promo code with visible savings**', '**Shipping, delivery and tax upfront** — zip auto-fills', '**Separate remove and close controls** — no more accidental deletes'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/stripes-cart.jpg', cap: '**MVP cart → redesigned cart.**' }] },
      ],
      result: ['**−13% cart abandonment** year over year', '**+25% site conversion** after updates across the top and bottom of the funnel', 'Launched **on time** despite losing half of design leadership mid-project'],
      reflection: 'We were building a brand and a store at the same time, so plenty of decisions got made before we had real customers to learn from. The cart changes came out of testing and they worked — I wish we’d put the PDP in front of people that early too. I also underestimated how much the small things carry a new brand: showing the total upfront and explaining ingredients did more for trust than any hero banner.',
      metrics: [{ v: '−13%', l: 'cart abandonment YoY' }, { v: '+25%', l: 'site conversion' }, { v: '12 wks', l: 'kickoff to launch' }],
      note: 'Bounce rate left out: one deck says −15%, another “up to −40%”. Add it back once you confirm which.',
    },
    {
      id: 'biossance', client: 'Amyris · Biossance', tint: 'var(--plum)', year: '2022',
      title: 'An accessible system, a clearer cart and live shopping for a clean-beauty brand',
      role: 'Senior Product Designer', dates: '2022 · 3 months', discipline: 'DTC e-commerce',
      cats: ['brand', 'ecom', 'numbers'],
      hero: 'assets/case/biossance-hero.jpg', thumb: 'assets/case/biossance-thumb.jpg',
      headline: { v: '6.1%', l: 'livestream conversion — 2 points above the site average' },
      story: 'Biossance is Amyris’s flagship clean-skincare brand, built on sugarcane-derived squalane and sold at Sephora. Alongside Stripes, I worked on Biossance.com: **an accessible design system, a cart that answers “what will I pay?”, and live shopping** — watch, ask and buy without leaving the stream.',
      pivot: { h: 'The pivot', b: 'The signature colors — elemental copper and clean green — failed contrast on buttons and text. Instead of asking for a new palette, **I extended the one we had: darker steps of the same hues that pass AA at 4.5:1.** The brand still looked like itself, and every actionable element passed.' },
      sections: [
        { k: 'Design system', b: ['I ran workshops with brand and engineering to agree the rules, then built the pieces: an extended palette, semantic status colors, buttons, rating and live-feed tags, icons and illustrations.', 'Copper and green stay the brand; the darker steps carry anything a shopper can tap, and the light tints stay off text.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/biossance-homepage.mp4', cap: '**Homepage on desktop and mobile**, built from the same components.' }, { type: 'img', wide: true, src: 'assets/case/biossance-components.jpg', cap: '**Components with every state** — inputs from default to disabled, and icons for shipping, education and order status.' }, { type: 'img', wide: true, src: 'assets/case/biossance-buttons.jpg', cap: '**Buttons** in each style and state, all passing contrast.' }, { type: 'img', wide: true, src: 'assets/case/biossance-system.jpg', cap: '**Digital brand palette and UI kit.** Contrast notes live right next to the swatches, so the rules travel with the colors.' }] },
        { k: 'The cart', b: ['Biossance shares one minicart with the rest of the Amyris portfolio, themed through tokens. It shows free-gift progress, the promo savings, and shipping and tax before checkout — so the first surprise isn’t on the payment page.'],
          blocks: [{ type: 'stats', items: [{ v: '+15%', l: 'checkout transactions, year over year' }, { v: '−2%', l: 'bounce rate' }, { v: '+10s', l: 'average session time' }] }, { type: 'imgs', items: [{ src: 'assets/case/biossance-ref-a.jpg', cap: '**Benchmarks** — clean minicarts with editable quantity and shipping upfront.' }, { src: 'assets/case/biossance-ref-b.jpg', cap: '**Benchmarks** — pricing breakdowns with no surprises at checkout.' }] }, { type: 'img', wide: true, src: 'assets/case/amyris-minicart.jpg', cap: '**One minicart, two brands.** Same parts and behavior; Stripes and Biossance each bring their own look.' }] },
        { k: 'Live shopping', b: ['Biossance hosted live skincare shows. I designed the player, the shoppable product cards and the chat, plus the “remind me” and “add to calendar” prompts that bring people back for the next one.'],
          blocks: [{ type: 'stats', items: [{ v: '2.4K+', l: 'viewers — 140% over target' }, { v: '6.1%', l: 'conversion, 2 points above site average' }, { v: '~16%', l: 'of viewers added to cart' }] }, { type: 'img', wide: true, src: 'assets/case/biossance-live-before.jpg', cap: '**Before the show** — browse upcoming lives, sign up to chat, pick a display name and set a reminder.' }, { type: 'img', wide: true, src: 'assets/case/biossance-live-during.jpg', cap: '**During the show** — product details, the full product list and the bag all open over the stream.' }, { type: 'img', wide: true, src: 'assets/case/biossance-live-cart.mp4', cap: '**Shipped, in motion** — the live stream on mobile, and the cart it lands in with free-gift progress and shipping upfront.' }] },
      ],
      result: ['Cart update: **+15% checkout transactions** year over year', 'Livestream: **2.4K+ viewers** and **6.1% conversion**, 2 points above the site average', 'An extended palette and components that pass **WCAG 2.1 AA**'],
      reflection: 'This was a three-month stint, so I had to pick my battles. Accessibility landed because I framed it as extending the brand rather than correcting it. If I’d had longer, I’d have tested the live-shopping reminders — they were the part of the flow we knew least about.',
      metrics: [{ v: '+15%', l: 'checkout transactions YoY' }, { v: '6.1%', l: 'livestream conversion' }, { v: 'AA', l: 'contrast across the palette' }],
      note: 'Revenue left out on purpose.',
    },
    {
      id: 'shopex', client: 'Estée Lauder', tint: 'var(--slate)', year: '2024',
      title: 'Search Modernization for 20+ luxury brands',
      role: 'Senior Product Designer', dates: 'Oct 2023 – Apr 2025', discipline: 'Enterprise e-commerce',
      cats: ['enterprise', 'ecom', 'numbers'],
      hero: 'assets/case/estee-hero.jpg', thumb: 'assets/case/estee-thumb.jpg',
      headline: { v: '20+', l: 'luxury brands on one search standard' },
      story: 'Estée Lauder runs dozens of beauty brands on shared infrastructure, but each one searched differently. **I led UX for the enterprise search overhaul** — global search, predictive results and PLP filtering — designing search states, filter components and no-results patterns any ELC brand could implement without a custom design pass. Working with brand and engineering leads through testing, prototyping and QA, we shipped **Search 2.0**: near-instant, real-time results.',
      pivot: { h: 'The pivot', b: 'Each brand director wanted search to feel like their brand, and custom versions would have repeated the original problem. **I designed one set of search states, filters and fallbacks every brand could adopt as is**, with each brand’s look applied through tokens — so every migration got faster than the last.' },
      sections: [
        { k: 'Problem', b: ['Search and predictive search lagged behind competitors — slower, less relevant, and with no shared standard across brands. Brand teams had no clear path off legacy search without breaking their existing experience.'],
          list: ['**Performance** — results were slower and less relevant than competitors', '**Dead ends** — irrelevant results, an unfiltered PLP and generic predictions', '**Adoption** — with no standard, every brand was solving the same problem from scratch'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/estee-before.jpg', cap: '**Before:** Estée Lauder, Aveda and Clinique each searched differently.' }] },
        { k: 'Benchmarking', b: ['I ran a structured competitive audit against **Baymard Institute** best practices to show exactly where ELC search fell short. It gave brand directors evidence instead of design opinions — and it’s what got the redesign approved.'],
          blocks: [
            { type: 'bars', h: 'Mobile search features covered · 17 sites audited', rows: [{ l: 'Nordstrom', v: 82, d: '82%' }, { l: 'Walmart', v: 82, d: '82%' }, { l: 'Sephora', v: 76, d: '76%' }, { l: 'Ulta', v: 64, d: '64%' }, { l: 'Chanel', v: 58, d: '58%' }, { l: 'Lancôme', v: 53, d: '53%' }, { l: 'Estée Lauder', v: 47, d: '47%', hl: true }, { l: 'Clinique', v: 35, d: '35%', hl: true }], max: 100, note: 'Our own brands sat in the bottom half — the gap that got the redesign approved.' },
            { type: 'img', wide: true, src: 'assets/case/estee-search.jpg', cap: '**Every state specified for engineering:** annotated desktop and mobile prototypes (Tom Ford).' }] },
        { k: 'Search & filtering', b: ['A type-ahead system that surfaces brand-specific products, categories and editorial content — not just keyword matches. Each brand’s search feels distinct while sharing the same component underneath.'],
          list: ['**Predictive search** — trending terms on focus, keyword and category predictions as you type, shoppable results in the panel', '**Graceful fallbacks** — suggested alternatives, related categories and a “you might also like” row, so a failed search can still convert', '**PLP filtering** — shade, formula, finish and skin type, with real-time results and a persistent active-filter bar so shoppers never lose context'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/estee-results.jpg', cap: '**Search 2.0, live** — predictive results on desktop, best sellers in the mobile search panel.' }] },
        { k: 'Chat & interactions', b: ['The same standards push reached live chat. A Baymard self-audit showed chat was hard to find on mobile and mixed beauty advice with order help. **25 separate chat builds across 180 sites became one platform** — launched in March 2025 — with a pre-chat drawer that routes to a beauty expert or customer support, and states that used to be missing.', 'Then we tested placement and invites brand by brand.'],
          blocks: [
            { type: 'img', wide: true, src: 'assets/case/estee-chat-states.jpg', cap: '**One set of states.** Before, a shopper who blocked cookies just lost the chat button, and a connection error showed nothing.' },
            { type: 'img', wide: true, src: 'assets/case/estee-chat-brands.jpg', cap: '**Same window, every brand.** Legal copy moved into the welcome message; header art, colors, type and assistant logos come from each brand’s tokens.' },
            { type: 'fixes', la: 'Before', lb: 'After', items: [{ t: 'Aveda', h: 'Chat button moved to best-practice spot', a: 27, b: 41 }, { t: 'Clinique US', h: 'Refreshed invite copy and design', a: 22, b: 31 }, { t: 'Origins US', h: 'Proactive chat invites', a: 39, b: 50 }] },
            { type: 'callout', h: 'Not every test won', b: 'Moving the chat button on Clinique US brought **47% more conversations, but chat conversion fell.** More people chatting isn’t more people buying, so we judged tests on sales, not volume.' },
            { type: 'img', wide: true, src: 'assets/case/estee-library.jpg', cap: '**Interaction library:** progress indicator (including the cart’s free-shipping bar) and card carousel specs.' }] },
      ],
      result: ['**Search 2.0** shipped with near-instant, real-time results', '**One search standard** for 20+ luxury brands', 'First sprint to live in **6 weeks**', '**One chat platform** across 180 sites; chat conversion up as much as **14 points** in brand tests', 'Supporting work: the **EXD Interaction Library**'],
      reflection: 'The hardest part wasn’t designing search — it was getting 20+ brand teams to agree to share one. Mockups started taste debates; benchmark data ended them, so I learned to lead with the numbers. If I did it again, I’d get one pilot brand live faster and let its results do the convincing, instead of trying to get everyone aligned up front.',
      metrics: [{ v: '20+', l: 'brands on one standard' }, { v: '6 wk', l: 'first sprint to live' }, { v: '25 → 1', l: 'chat builds consolidated' }],
    },
    {
      id: 'quicken', client: 'Quicken', tint: 'var(--violet)', year: '2021',
      title: 'A retirement calculator that answers as you drag',
      role: 'Sr. UI Designer', dates: 'Aug 2021 – Nov 2021', discipline: 'Fintech',
      cats: ['numbers'],
      hero: 'assets/case/quicken-hero.jpg', thumb: 'assets/case/quicken-thumb.jpg',
      headline: { v: '<1s', l: 'real-time results — the plan updates as you drag' },
      story: 'Quicken’s retirement calculator made people submit a form and wait for a page reload to see what any change meant. Planning is a series of “what ifs,” and the tool made every one of them slow. I redesigned it end to end — UX, data visualization and motion — into a **live, real-time planning tool**.',
      pivot: { h: 'The pivot', b: 'The fix wasn’t fewer fields. **It was making the model respond while you adjust it**, so the answer arrives in the same gesture as the question.' },
      sections: [
        { k: 'Problem', b: ['Every input change required a full page reload. Users couldn’t experiment with their retirement date, savings rate or expected return without waiting, and the static chart didn’t reflect how planning actually works.'] },
        { k: 'Solution', b: ['Projections update in real time as people adjust inputs.'],
          list: ['**Live calculation** — sliders, contribution amounts and retirement age update the chart and summary instantly', '**Data visualization** — a clear visual language for on track, at risk and ahead of schedule', '**Motion as signal** — values animate between states and the chart eases rather than jumps, so changes are easy to follow'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/quicken-demo.mp4', cap: '**Prototype clip.** Change an input and the plan redraws on the spot — no submit, no reload.' }] },
        { k: 'Key decision', b: ['Simplicity over financial completeness. The calculator puts the three inputs people understand — savings rate, retirement age and expected return — up front, and keeps advanced inputs available but out of the way.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/quicken-personas.jpg', cap: '**Personas** — who the calculator had to work for.' }, { type: 'img', wide: true, src: 'assets/case/quicken-style.jpg', cap: '**Style guide** — colour, type and components for the build.' }] },
      ],
      result: ['Turned a submit-and-wait form into a **live planning tool**', 'Designed the data visualization and motion system for real-time updates'],
      reflection: 'The live calculator felt great to use, but most of what we thought was “reassuring” came from inside the team. I’d test much earlier with people who are actually close to retirement — they read a red bar very differently than we did. Keeping the advanced inputs one step away was the right call; I just wish we’d proven it with users instead of assuming it.',
      metrics: [{ v: '<1s', l: 'from “what if” to answer' }, { v: '3', l: 'core inputs up front' }, { v: 'Real-time', l: 'chart, no submit or reload' }],
      note: 'No Quicken screens are in your decks. Drop the cover GIF or screens into ~/Claude/portfolio-assets and add a result if you have one. Removed the earlier “81% → 34%”, “4.2×” and “11 tools” numbers — unverified.',
    },
    {
      id: 'sephora', client: 'Sephora', tint: 'var(--plum)', year: '2020',
      title: 'The first design system for Sephora learning',
      role: 'Interaction Designer, Education & Learning', dates: 'Nov 2017 – Jan 2021', discipline: 'Learning platform',
      cats: ['enterprise'],
      hero: 'assets/case/sephora-hero.mp4', thumb: 'assets/case/sephora-thumb.jpg',
      headline: { v: '20K+', l: 'weekly course completions at 4.5/5 satisfaction' },
      story: 'As Sephora opened stores across North America, new Beauty Advisors learned the job through **My Sephora Learning**, the company’s training platform. Courses were hard to navigate, inconsistent and passive. I led the redesign — building the platform’s first design system and the gamified learning that made training something advisors actually finished.',
      pivot: { h: 'The pivot', b: 'There was no design system: subject-matter experts reused old assets with random shapes, sizes and typefaces. **I built the system first, in parallel with production work** — slower at the start, but it’s what made every course after it faster and consistent.' },
      sections: [
        { k: 'Problem', b: ['Courses were difficult to navigate, used inconsistent branding and patterns, and ignored how little time advisors have on the floor. Advisors wanted more interactivity, and the whole platform had to migrate without interrupting active training.'] },
        { k: 'Design system', b: ['A documented system of colors, type, components, layouts, illustration and usage standards — the first one the education team had. I also worked with a copywriter to cut content that was too long to finish in store.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/sephora-system.jpg', cap: '**Colors, type, components and illustration standards** for every course.' }] },
        { k: 'Gamified learning', b: ['Storytelling, scenario-based challenges and interactive UI replaced passive slides.'],
          blocks: [
            { type: 'imgs', items: [{ src: 'assets/case/sephora-explore.mp4', cap: '**Explore each product**' }, { src: 'assets/case/sephora-quiz.mp4', cap: '**Retention quiz**' }] },
            { type: 'img', src: 'assets/case/sephora-chat.mp4', cap: '**Scenario chat** — advisors practice real customer conversations.' },
          ] },
        { k: 'Platform & migration', b: ['I organized content by role — employees, managers and admins — and supported the migration to a new learning platform with UX reviews and edge-case testing, so training never went down. Courses were made responsive for handheld devices in store.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/sephora-lms.jpg', cap: '**EDU Development portal** and terminology resources.' }] },
      ],
      result: ['**20,000+ course completions a week** at **4.5/5** satisfaction', 'Training for **30,000+** in-store hires', '**+10%** design-to-development workflow efficiency', 'Gamification and MSL 2.0 launched on schedule'],
      reflection: 'A design system sounds like a UI project, but most of the work was getting a busy education team to actually use it. My first components were too rigid for how fast they produced courses, and a few got quietly ignored. Next time I’d spend a week watching course creators work before designing anything — and I’d measure what people learned, not just how many finished.',
      metrics: [{ v: '20K+', l: 'weekly completions' }, { v: '4.5/5', l: 'satisfaction' }, { v: '30K+', l: 'in-store hires trained' }],
      note: 'Removed the earlier “94% weekly-active pilot”, “5–7 minutes between customers” and “200+ SKUs” claims — not in your materials. Add them back only if they’re real.',
    },
    {
      id: 'homebase', hackathon: true, badge: 'Hackathon', client: 'HomeBase', tint: 'var(--slate)', year: '2021',
      title: 'A community platform for mutual aid, built in a weekend',
      role: 'UX/Product Designer — research, project management, end-to-end UI/UX',
      dates: '2021 · SacHacks III', discipline: 'Civic / social impact',
      link: { label: 'Read the Devpost writeup ↗', url: 'https://devpost.com/software/homebase-dcbwt5' },
      cats: ['zero-to-one'],
      hero: 'assets/case/homebase-hero.jpg', phone: 'assets/case/homebase-phone.jpg',
      headline: { v: '1st', l: 'place — Best Entertaining Hack, SacHacks III' },
      story: 'A year into the pandemic, neighbors were organizing mask drives and food donations faster than any institution — but finding where to help was scattered across posts, group texts and org websites. **HomeBase** is a mobile app where people find local causes, donate, volunteer and stay connected.',
      pivot: { h: 'The reframe', b: 'We started from a charity-directory idea. Research turned it into a neighborhood exchange: **“How might we make essential resources available for communities that are under-represented?”** — which put local discovery, not org listings, at the center.' },
      sections: [
        { k: 'Problem', b: ['People wanted to help locally and didn’t know where to start. Giving was spiking, but discovery was fragmented — and the communities most in need were the least visible.'] },
        { k: 'Discover', b: ['A survey of 8 people and a review of 4 competing apps fed a persona (Ezra), a journey map and How-Might-We statements. The finding that shaped everything: **people didn’t feel connected** to the causes around them, even while wanting to contribute.'],
          blocks: [{ type: 'img', wide: true, src: 'assets/case/homebase-survey.jpg', cap: '**Survey results** — most people didn’t feel connected to their neighborhood.' }, { type: 'img', wide: true, src: 'assets/case/homebase-process.jpg', cap: '**Process** — empathize, define, ideate, prototype, test.' }, { type: 'img', wide: true, src: 'assets/case/homebase-research.jpg', cap: '**Persona and journey map.**' }] },
        { k: 'Design', b: ['Search and filtering across causes, volunteer sign-up, direct donations, maps of nearby events, and messaging to keep supporters engaged after the first action.'],
          blocks: [
            { type: 'img', wide: true, src: 'assets/case/homebase-flow.jpg', cap: '**User flow** from sign-up to giving, volunteering and chat.' },
            { type: 'img', wide: true, src: 'assets/case/homebase-wireframes.jpg', cap: '**Wireframes** for the core flows.' }, { type: 'img', wide: true, src: 'assets/case/homebase-onboarding.jpg', cap: '**Onboarding** that asks what you care about.' },
            { type: 'img', wide: true, src: 'assets/case/homebase-screens.jpg', cap: '**Donate or volunteer** in a few taps.' },
            { type: 'img', wide: true, src: 'assets/case/homebase-map.jpg', cap: '**Map** of nearby events, with filters.' }, { type: 'img', wide: true, src: 'assets/case/homebase-chat.jpg', cap: '**Chat and friends** to keep people connected.' },
            { type: 'embed', src: 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FGoJBKn6GoNniW7K9SuUWy3%2FHomeBase-SacHack-2021%3Fnode-id%3D153%253A8582%26scaling%3Dscale-down', href: 'https://www.figma.com/proto/GoJBKn6GoNniW7K9SuUWy3/HomeBase-SacHack-2021?node-id=153%3A8582&scaling=scale-down', poster: 'assets/case/homebase-hero.jpg', title: 'HomeBase prototype', label: 'Try the prototype', cap: '**Clickable prototype** from the hackathon — browse causes, donate and sign up to volunteer.' },
            { type: 'embed', src: 'https://www.youtube-nocookie.com/embed/rqQdX3R5jY4?rel=0', href: 'https://www.youtube.com/watch?v=rqQdX3R5jY4', ratio: '16/9', inline: true, poster: 'assets/case/homebase-video.jpg', title: 'HomeBase video', label: 'Watch the video', cap: '**The HomeBase video** from SacHack 2021.' },
          ] },
        { k: 'Testing', b: ['We tested the prototype with real users inside the hackathon window, which validated the core flow and surfaced issues we fixed before the final pass. The honest limit: research was a survey and a handful of sessions, not the depth the problem deserves.'] },
      ],
      result: ['**Winner — Best Entertaining Hack**, SacHacks III', 'Validated end-to-end flow: discover → give or volunteer → stay connected', 'Led discovery, project management and end-to-end UI/UX on a three-person team'],
      reflection: 'It was a weekend hackathon, so research was thin — a survey of 8 people and a quick look at 4 competing apps. The core flow tested well, but I’d want to talk with real nonprofit organizers before calling the problem solved; they’re the ones who keep a community app alive after launch.',
      metrics: [{ v: 'Winner', l: 'Best Entertaining Hack' }, { v: '1', l: 'weekend, concept to prototype' }, { v: '8', l: 'survey participants' }],
    },
  ];

  // Strings may be legacy **markdown** or HTML from the Content studio's editor.
  const BLOCK = /<(p|h[1-6]|ul|ol|blockquote|figure|img|hr|pre)\b/i;
  const cache = new Map();
  const clean = html => {
    if (cache.has(html)) return cache.get(html);
    const d = new DOMParser().parseFromString(html, 'text/html');
    d.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(n => n.remove());
    d.body.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(a => { if (/^on/i.test(a.name) || (/^(href|src)$/i.test(a.name) && /^\s*javascript:/i.test(a.value))) el.removeAttribute(a.name); });
      if (el.tagName === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noreferrer'); }
    });
    const out = d.body.innerHTML; cache.set(html, out); return out;
  };
  function Rich({ t, as = 'span', className, ...rest }) {
    const str = String(t == null ? '' : t);
    if (/<[a-z][\s\S]*>/i.test(str)) {
      const block = BLOCK.test(str);
      const As = block ? 'div' : as;
      const cls = [className, block && 'rt'].filter(Boolean).join(' ') || undefined;
      return <As {...rest} className={cls} dangerouslySetInnerHTML={{ __html: clean(str) }} />;
    }
    const As = as; rest.className = className;
    return <As {...rest}>{String(t).split(/(\*\*[^*]+\*\*)/g).map((s, i) =>
      s.startsWith('**') && s.endsWith('**')
        ? <strong key={i} style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.slice(2, -2)}</strong>
        : <React.Fragment key={i}>{s}</React.Fragment>)}</As>;
  }

  Object.assign(window, { PROJECTS: window.dvContent.bind('projects', P), Rich });
})();
