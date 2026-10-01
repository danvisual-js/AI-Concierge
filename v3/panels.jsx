// panels.jsx — résumé, bio, Judgment Calls, contact, hiring. Every surface uses
// theme tokens so light/dark both hold contrast. Contact is a single column.
(() => {
  const { useState } = React;

  const ROLES = [
    { co: 'Doctronic', role: 'Product Design Lead, AI Health', when: 'Feb 2026 – Jun 2026',
      note: 'Shipped the first AI-authorized prescription refill flow in the US. Designed the trust-and-privacy layer as a conversion surface, and codified standards with founding engineering during the React rebuild.' },
    { co: 'GoodRx', role: 'Sr. Product Designer', when: 'Apr 2025 – Jan 2026',
      note: 'Owned design end-to-end for GoodRx’s first subscription product. Built it as a reusable Conditions Platform; drove funnel conversion to an all-time-high 26.1% from 15.6%.' },
    { co: 'Amyris — Stripes Beauty, Biossance, JVN, Rose Inc', role: 'Founding Designer / Product Design', when: 'Sep 2021 – Aug 2023',
      note: 'Founding design for Naomi Watts’ menopause wellness brand; launched on schedule through a leadership gap. Portfolio funnel strategy: +25% conversion, −13% cart abandonment YoY.' },
    { co: 'Estée Lauder Companies', role: 'Lead Product Designer, ShopEx', when: '2022',
      note: 'Keyboard-first enterprise search in the in-store POS. Lookup 47s → 11s, rolled out across 30 brands and 5,000+ associates.' },
    { co: 'Quicken', role: 'Product + Motion Designer', when: '2021',
      note: 'Turned a 14-field retirement form into a live, scrubbable model. Abandon rate 81% → 34%; the slider became a Premier-wide primitive in 11 tools.' },
    { co: 'Sephora', role: 'Product Designer, Learning & Development', when: '2020',
      note: 'Five-minute mobile training drops for 30,000 beauty advisors, with a manager dashboard that turned completion into compliance proof. 94% weekly active in pilot.' },
  ];

  const SIDE = [
    { co: 'Design Quest', role: 'Playable RPG portfolio', when: '2026', note: 'Built solo with AI-assisted development. Live and playable in the browser.' },
    { co: 'VC Stock Screener', role: 'Fintech tool, design + build', when: '2026', note: 'Verdict-first screener. Designed and shipped solo with AI-assisted development.' },
    { co: 'HomeBase', role: 'UX/Product Designer — SacHacks III', when: '2021', note: 'Community platform for exchanging donations, services and volunteer time. Led discovery, PM and end-to-end UI/UX. Winner, Best Entertaining Hack.' },
  ];

  const SKILLS = [
    ['Design leadership', 'Owning design end-to-end, operating without a director in the room, stakeholder management up to VP and founder level'],
    ['AI & emerging patterns', 'Multi-agent LLM flows, trust and memory controls, interaction patterns with no prior art'],
    ['Regulated product', 'Designing with legal and clinical review in the loop — reframing constraints instead of fighting them'],
    ['Conversion & measurement', 'Funnel diagnosis, shipped interventions, before/after numbers on every claim'],
    ['Visual & brand', 'Editorial systems, campaign work, motion — the visual craft underneath the product work'],
    ['0-to-1 and systems', 'Platform architecture that lets the next launch reconfigure instead of rebuild'],
  ];

  function Sheet({ title, kicker, children }) {
    return (
      <div style={{ animation: 'up .7s cubic-bezier(.16,1,.3,1) both' }}>
        <div className="mono" style={{ color: 'var(--accent)' }}>{kicker}</div>
        <h2 style={{ marginTop: 13, fontSize: 'clamp(26px,3.2vw,42px)', fontWeight: 500, letterSpacing: '-.04em',
          lineHeight: 1.05, color: 'var(--ink)' }}>{title}</h2>
        <div style={{ marginTop: 'clamp(24px,3vw,36px)' }}>{children}</div>
      </div>
    );
  }

  function RoleList({ items }) {
    return (
      <div style={{ borderTop: '1px solid var(--line-2)' }}>
        {items.map((r, i) => (
          <div key={i} className="rrow" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr) 140px',
            gap: 'clamp(12px,2.2vw,30px)', padding: 'clamp(16px,2vw,24px) 0', borderBottom: '1px solid var(--line-2)', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 'clamp(16px,1.7vw,19px)', fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>{r.co}</div>
              <div style={{ marginTop: 5, fontSize: 14, color: 'var(--dim)' }}>{r.role}</div>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-2)', margin: 0, textWrap: 'pretty' }}>{r.note}</p>
            <div className="mono" style={{ textAlign: 'right' }}>{r.when}</div>
          </div>
        ))}
      </div>
    );
  }

  function Resume() {
    return (
      <Sheet kicker="Résumé" title="Twelve years, consumer health to retail to AI.">
        <RoleList items={ROLES} />
        <div style={{ marginTop: 34 }}>
          <div className="mono" style={{ marginBottom: 12 }}>Labs — built with AI, and at hackathons</div>
          <RoleList items={SIDE} />
        </div>
        <div style={{ marginTop: 34, display: 'grid', gap: 16 }}>
          <div className="mono">What he’s known for</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
            {SKILLS.map(([h, b]) => (
              <div key={h} className="tile">
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>{h}</div>
                <p style={{ marginTop: 7, fontSize: 13.5, lineHeight: 1.55, color: 'var(--dim)' }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a className="btn solid" href="mailto:hello@danielvisual.com?subject=Résumé request"><span>Request the PDF</span></a>
          <a className="btn" href="https://www.linkedin.com/in/danieltieu/" target="_blank" rel="noreferrer"><span>LinkedIn ↗</span></a>
        </div>
        <style>{`@media(max-width:760px){.rrow{grid-template-columns:minmax(0,1fr)!important}.rrow>div:last-child{text-align:left!important}}`}</style>
      </Sheet>
    );
  }

  function Bio() {
    return (
      <Sheet kicker="About" title="Short version, then the longer one.">
        <div className="biog" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,290px) minmax(0,1fr)', gap: 'clamp(20px,3vw,44px)' }}>
          <media-slot id="bio-portrait" ratio="4/5" label="Portrait of Dan"></media-slot>
          <div style={{ display: 'grid', gap: 18, maxWidth: '60ch' }}>
            <p style={{ fontSize: 'clamp(18px,1.9vw,24px)', lineHeight: 1.42, letterSpacing: '-.02em', color: 'var(--ink)' }}>
              I’m Dan — a product designer who takes the parts of a product people dread, and makes them feel obvious.
            </p>
            {[
              'Most of my work happens where the stakes are real: health, money, and the systems people rely on at work. That means designing with legal and clinical teams in the room, and treating their constraints as a design problem rather than a blocker — the emergency-screening screen at GoodRx didn’t get removed, it got reframed, and conversion went up because of it.',
              'I came up through visual design, and it still shows: I care about type, rhythm, and the craft of a page as much as the flow through it. That’s the work in the Play section — campaigns, editorial systems, motion.',
              'I work in the open. Messy Figma files, real user calls, prototypes in front of engineers early. At Doctronic I paired directly with founding engineering so the standards lived in the build instead of a library nobody opens.',
            ].map((t, i) => <p key={i} style={{ fontSize: 15, lineHeight: 1.68, color: 'var(--ink-2)', margin: 0 }}>{t}</p>)}
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              {['Bay Area, California', 'Product design lead', 'Open to senior / principal'].map(t => (
                <span key={t} className="mono tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){.biog{grid-template-columns:minmax(0,1fr)!important}}`}</style>
      </Sheet>
    );
  }

  const QUEST = [
    { tag: 'GoodRx · onboarding',
      q: 'Legal wants a standalone emergency-screening question early in your telehealth onboarding. It’s scaring users off before intake. You have one funnel and a compliance requirement.',
      a: [
        { t: 'Argue to remove it — the data shows it’s costing conversion', r: 'Reasonable, and usually a loss. Legal isn’t optimising your funnel; they’re managing liability, and “remove it” gives them nothing to say yes to.' },
        { t: 'Keep it, and optimise around it', r: 'Safe, but you’ve accepted a 36% drop-off as fixed. The constraint was placement, not existence.' },
        { t: 'Reframe: merge the disclaimers into T&Cs with tappable detail', r: 'This is what shipped. Same legal coverage, different placement — onboarding-start conversion went 17% → 20%, and it became the template for the rest of the funnel.', win: true },
      ] },
    { tag: 'GoodRx · architecture',
      q: 'You have months to ship a first subscription product against competitors who already proved the model. Build the one flow you were asked for, or the platform nobody asked for?',
      a: [
        { t: 'Ship the single purpose-built flow — hit the date', r: 'You hit the date and rebuild the screens three more times. Speed now, tax later.' },
        { t: 'Build a reusable Conditions Platform', r: 'What shipped. More upfront complexity on a tight deadline — and it launched on time in May 2025, then GLP-1, hair loss and skincare launched on the same structure.', win: true },
        { t: 'Ship the flow, propose the platform next quarter', r: 'The most common answer, and the one that never gets funded once the flow is live.' },
      ] },
    { tag: 'Doctronic · AI health',
      q: 'You’re designing an AI system making medical judgment calls. Where does the trust and privacy work belong?',
      a: [
        { t: 'A settings page — it’s a compliance requirement', r: 'How most teams treat it, and it leaves the hardest conversion moment unaddressed.' },
        { t: 'In the funnel itself — trust is a conversion surface', r: 'The thesis behind the work: memory controls, delete-consult and incognito designed alongside lander, eligibility and intake, not as a separate workstream.', win: true },
        { t: 'Post-launch, once you have usage data', r: 'By then the skeptical first-time user has already bounced. Trust is the first screen, not the fifth.' },
      ] },
  ];

  function Confetti({ burst = 0, n = 46 }) {
    const COLORS = ['#6d4aff', '#5b3fd6', '#a07cff', '#3f2f7a', '#16121d', '#c9b8ff', '#8f6cff'];
    const pieces = React.useMemo(() => Array.from({ length: n }, (_, i) => ({
      l: Math.random() * 100, d: Math.random() * (burst ? 0.35 : 0.9), dur: 2.4 + Math.random() * 1.9,
      c: COLORS[i % COLORS.length], w: 6 + Math.random() * 7, h: 9 + Math.random() * 11,
      r: Math.random() > 0.5 ? '50%' : '2px', x: (Math.random() - 0.5) * 130,
    })), [burst]);
    return (
      <span className="confs" aria-hidden="true">
        {pieces.map((p, i) => (
          <i key={burst + '-' + i} className="conf" style={{ left: p.l + '%', background: p.c, width: p.w, height: p.h,
            borderRadius: p.r, animationDelay: p.d + 's', animationDuration: p.dur + 's', '--x': p.x + 'px' }} />
        ))}
      </span>
    );
  }

  const WIN_COPY = {
    3: { h: 'Flawless run. You’d have shipped it too.', s: 'Three for three — same calls, same reasons. That’s the whole job.' },
    2: { h: 'Two dead-on. Sharp instincts.', s: 'The one you missed is the most interesting decision of the three.' },
    1: { h: 'One landed — and the misses are the good part.', s: 'Every wrong answer here was somebody’s real plan at some point.' },
    0: { h: 'Zero for three. Honestly? Respect.', s: 'These were contested calls in the room. The reasoning is the point, not the score.' },
  };

  function CritResult({ score, total, onAgain }) {
    const [burst, setBurst] = useState(0);
    const [popped, setPopped] = useState([]);
    const copy = WIN_COPY[score] || WIN_COPY[0];
    const pop = (i, e) => {
      setPopped(p => p.includes(i) ? p : [...p, i]);
      setBurst(b => b + 1);
      window.waveBurst && window.waveBurst(e.clientX, e.clientY);
    };
    return (
      <div className="party" style={{ animation: 'up .7s cubic-bezier(.16,1,.3,1) both' }}>
        <Confetti burst={burst} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="mono" style={{ color: 'var(--accent)' }}>Crit Club · that’s a wrap</div>

          <div className="scoreline">
            <span className="scorebig">{score}</span>
            <span className="scoreof">/ {total}</span>
            <span className="scoredots">
              {Array.from({ length: total }, (_, i) => (
                <i key={i} className={i < score ? 'on' : ''} style={{ animationDelay: (i * 120 + 200) + 'ms' }} />
              ))}
            </span>
          </div>

          <h2 style={{ marginTop: 14, fontSize: 'clamp(26px,3.4vw,44px)', fontWeight: 500, letterSpacing: '-.04em',
            lineHeight: 1.04, color: 'var(--ink)', maxWidth: '30ch' }}>{copy.h}</h2>
          <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: '52ch' }}>{copy.s}</p>

          <div className="poppers">
            {[['✦', 'pull it'], ['◉', 'pop it'], ['✦', 'again']].map(([g, l], i) => (
              <button key={i} className={'popper' + (popped.includes(i) ? ' spent' : '')} onClick={e => pop(i, e)}
                aria-label="Celebrate">
                <span className="pg" key={burst}>{g}</span>
                <span className="mono">{popped.includes(i) ? 'nice' : l}</span>
              </button>
            ))}
          </div>

          <p className="note" style={{ marginTop: 22, maxWidth: '54ch' }}>
            Every scenario here is a real decision from a shipped project — the full reasoning, and the numbers that
            followed, live in the case studies.
          </p>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn solid" onClick={() => window.__ask && window.__ask('Walk me through Dan’s best work')}>
              <span>Read the case studies →</span></button>
            <button className="btn" onClick={onAgain}><span>Play again</span></button>
            <button className="btn" onClick={() => window.__ask && window.__ask('I’m hiring — is he a fit?')}>
              <span>I’m hiring</span></button>
          </div>
        </div>
      </div>
    );
  }

  function JudgmentCalls() {
    const [i, setI] = useState(0), [picked, setPicked] = useState(null), [score, setScore] = useState(0);
    if (i >= QUEST.length) {
      return <CritResult score={score} total={QUEST.length}
        onAgain={() => { setI(0); setScore(0); setPicked(null); }} />;
    }
    const step = QUEST[i];
    return (
      <Sheet kicker={`Crit Club · ${i + 1} of ${QUEST.length}`} title="What would you have done?">
        <div className="mono" style={{ marginBottom: 12 }}>{step.tag}</div>
        <p style={{ fontSize: 'clamp(18px,2vw,25px)', lineHeight: 1.4, letterSpacing: '-.02em', maxWidth: '48ch', color: 'var(--ink)' }}>{step.q}</p>
        <div style={{ marginTop: 24, display: 'grid', gap: 10, maxWidth: '68ch' }}>
          {step.a.map((a, k) => {
            const reveal = picked !== null;
            return (
              <button key={k} className={'qopt' + (reveal && a.win ? ' win' : '') + (picked === k ? ' on' : '')}
                onClick={() => { if (picked !== null) return; setPicked(k); if (a.win) setScore(s => s + 1); window.waveBurst && window.waveBurst(); }}>
                <div style={{ display: 'flex', gap: 11, alignItems: 'baseline' }}>
                  <span className="mono" style={{ color: reveal && a.win ? 'var(--accent)' : 'var(--faint)' }}>{String.fromCharCode(65 + k)}</span>
                  <span style={{ fontSize: 15.5, lineHeight: 1.45, color: 'var(--ink)' }}>{a.t}</span>
                </div>
                {reveal && <p style={{ marginTop: 10, marginLeft: 28, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)', animation: 'up .4s ease both' }}>
                  {a.win ? '✦ ' : ''}{a.r}</p>}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <button className="btn solid" style={{ marginTop: 20 }} onClick={() => { setPicked(null); setI(i + 1); }}>
            <span>{i === QUEST.length - 1 ? 'See the result' : 'Next scenario'}</span></button>
        )}
      </Sheet>
    );
  }

  function Field({ label, area, v, set }) {
    const T = area ? 'textarea' : 'input';
    return (
      <div className={'field' + (v ? ' on' : '')}>
        <label>{label}</label>
        <T rows={area ? 5 : undefined} value={v} onChange={e => set(e.target.value)} />
      </div>
    );
  }

  const REASONS = [
    { id: 'role', l: 'Hiring for a role', ask: 'Role title, level, and the first problem this person owns' },
    { id: 'project', l: 'Project or contract work', ask: 'What it is, who it’s for, and what’s stuck' },
    { id: 'network', l: 'Networking / just saying hi', ask: 'What connected you here — no agenda needed' },
    { id: 'advice', l: 'Portfolio or career advice', ask: 'Where you are, and what you’re trying to decide' },
    { id: 'speaking', l: 'Speaking or mentoring', ask: 'The event or programme, the audience, and the date' },
    { id: 'bug', l: 'Bug or issue on this site', ask: 'What broke, what you were doing, and your browser' },
    { id: 'other', l: 'Something else', ask: 'Whatever it is' },
  ];

  function Talk({ hiring }) {
    const [f, setF] = useState({}); const [sent, setSent] = useState(false);
    const [why, setWhy] = useState(hiring ? 'role' : null);
    const on = k => v => setF(p => ({ ...p, [k]: v }));
    const r = REASONS.find(x => x.id === why);
    const isRole = why === 'role', isBug = why === 'bug';
    return (
      <Sheet kicker={hiring ? 'You have a role' : 'Contact'} title={hiring ? 'Tell me about the role.' : 'What brings you here?'}>
        <div style={{ display: 'grid', gap: 26, maxWidth: '62ch' }}>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
            {hiring
              ? 'Dan reads every one of these himself and replies within 48 hours. If it’s a fit he’ll come back with questions about the team and the first problem, not a deck.'
              : 'Pick a reason so this lands in the right place — Dan reads all of them himself and replies within 48 hours.'}
          </p>

          <div style={{ display: 'grid', gap: 11 }}>
            <div className="mono" style={{ color: 'var(--faint)' }}>Reason for reaching out</div>
            <div className="askbar">
              {REASONS.map(x => (
                <button key={x.id} type="button" className={'chip' + (why === x.id ? ' on' : '')}
                  onClick={() => setWhy(x.id)}>{x.l}</button>
              ))}
            </div>
          </div>

          {hiring && (
            <div className="tile" style={{ display: 'grid', gap: 10 }}>
              <div className="mono">What he’s looking for</div>
              {['Senior / Lead / Principal product design', 'Ambiguous 0-to-1 or AI-mediated products', 'Teams that measure, and let design own the number', 'Remote or the Bay Area'].map(t => (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 10, fontSize: 14.5, color: 'var(--ink-2)' }}>
                  <span style={{ color: 'var(--accent)' }}>✦</span><span>{t}</span></div>
              ))}
            </div>
          )}

          {why && (
            <form onSubmit={e => { e.preventDefault(); setSent(true); window.waveBurst && window.waveBurst(); }}
              style={{ display: 'grid', gap: 22, animation: 'up .5s cubic-bezier(.16,1,.3,1) both' }}>
              <Field label="Name" v={f.n || ''} set={on('n')} />
              <Field label={isRole ? 'Company' : 'Company (optional)'} v={f.c || ''} set={on('c')} />
              <Field label="Email" v={f.e || ''} set={on('e')} />
              {isRole && <Field label="Role title" v={f.r || ''} set={on('r')} />}
              {isRole && <Field label="Level / band" v={f.b || ''} set={on('b')} />}
              {isBug && <Field label="Page or screen" v={f.p || ''} set={on('p')} />}
              <Field area label={r.ask} v={f.d || ''} set={on('d')} />
              <div>
                <button className="btn solid" type="submit">
                  <span>{sent ? 'Thanks — talk soon' : isRole ? 'Send the role' : isBug ? 'Report it' : 'Send it over'}</span></button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid var(--line-2)' }}>
            <a className="chip" href="https://www.linkedin.com/in/danieltieu/" target="_blank" rel="noreferrer" style={{ marginTop: 18 }}>LinkedIn ↗</a>
            <a className="chip" href="https://www.danielvisual.com/" target="_blank" rel="noreferrer" style={{ marginTop: 18 }}>danielvisual.com ↗</a>
          </div>
        </div>
      </Sheet>
    );
  }

  function ResumeSummary() {
    const PILLARS = [
      { n: '01', h: 'He ships the thing nobody has shipped yet',
        b: 'The first AI-authorized prescription refill in the US at Doctronic. GoodRx’s first telehealth subscription. A beauty brand in a category with no precedent. Three separate 0-to-1 launches, each one under real legal or clinical review.' },
      { n: '02', h: 'He designs where the constraint is the problem',
        b: 'Legal, clinical and compliance in the room daily — not as a gate at the end. That is why the trust layer at Doctronic became a conversion surface instead of a disclaimer, and why the GoodRx subscription got through review at all.' },
      { n: '03', h: 'He measures, then says the number out loud',
        b: '26.1% funnel conversion. An 81% → 34% abandon rate. +25% portfolio conversion YoY. Search across 7+ Estée Lauder brands, and a POS used by 5,000 associates. He can tell you what moved and what did not.' },
    ];
    return (
      <Sheet kicker="Twelve years · the short version" title="Three things that repeat in every role">
        <ol className="kd" style={{ marginTop: 4 }}>
          {PILLARS.map(p => (
            <li key={p.n}>
              <span className="mono n">{p.n}</span>
              <div>
                <h4>{p.h}</h4>
                <p>{p.b}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="tile" style={{ marginTop: 22 }}>
          <p className="note" style={{ marginBottom: 8 }}>Where he sits now</p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', margin: 0 }}>
            Lead-level product designer across consumer health, wellness and AI-first teams — most useful on ambiguous,
            heavily-constrained problems where the first version has to both ship and survive review.
          </p>
        </div>
      </Sheet>
    );
  }

  Object.assign(window, { PANELS: { resume: Resume, summary: ResumeSummary, bio: Bio, quest: JudgmentCalls, talk: () => <Talk />, hiring: () => <Talk hiring /> } });
})();
