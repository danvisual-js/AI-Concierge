// demos.jsx — the two live apps. Both auto-load borderless in place, and either
// one can be thrown fullscreen from anywhere (hero preview, thread card, case
// study) via window.__stage. Exports DemoCard, LiveEmbed, AppStage, HeroApps, DEMOS.
(() => {
  const { useState, useEffect, useRef } = React;

  const DEMOS = [
    {
      id: 'screener', name: 'AI Stock Market Screener', kind: 'Fintech tool',
      tag: 'A screener that answers “is this worth my afternoon?” before it shows you a single chart.',
      url: 'https://vc-stockscreen-ivory.vercel.app/', caseId: 'screener',
      note: 'Designed and built solo with AI-assisted development.',
      hint: 'Live app · pick a ticker',
      lede: 'Screeners assume you already know what you are looking for. This one starts from a question instead of a filter — type a thesis, get a ranked shortlist with the reasoning attached, then drill into charts only if the shortlist earns it. Built solo, design through deploy, in about three weeks.',
    },
    {
      id: 'designquest', name: 'Design Quest', kind: 'Playable RPG portfolio',
      tag: 'A portfolio you walk through. Top-down RPG: enter a building, find a case study. Arrow keys, no tutorial.',
      url: 'https://danvisual-flame.vercel.app/', caseId: 'designquest',
      note: 'Concept to shipped in days with AI-assisted development.',
      hint: 'Live game · arrow keys to move',
      lede: 'A portfolio nobody scrolls. Each case study is a building on a map — walk in and the work is on the walls, so the browsing itself is the proof of craft. Tile art, movement, collision and dialogue built from scratch; concept to playable in four days.',
    },
  ];

  const byId = id => DEMOS.find(d => d.id === id);

  function DemoCard({ d, onCase }) {
    return (
      <div className="demo">
        <div className="demo-media">
          <div className="live-screen bare">
            <iframe src={d.url} title={d.name} allow="clipboard-write; fullscreen" referrerPolicy="no-referrer" />
          </div>
        </div>
        <div className="demo-side">
          <div className="mono" style={{ color: 'var(--accent)' }}>Built with AI · {d.kind}</div>
          <h4>{d.name}</h4>
          <p>{d.tag}</p>
          <p className="note">{d.note}</p>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 6 }}>
            <button className="btn solid" onClick={() => window.__stage && window.__stage(d.id)}>
              <span>Play full screen ⤢</span></button>
            {d.caseId && <button className="btn" onClick={() => onCase(d.caseId)}><span>Read the case study</span></button>}
          </div>
        </div>
      </div>
    );
  }

  // in-page embed inside a case study: runs immediately
  function LiveEmbed({ demo }) {
    return (
      <div className="live">
        <div className="live-screen bare">
          <iframe src={demo.url} title={demo.name} allow="clipboard-write; fullscreen" referrerPolicy="no-referrer" />
          <button className="fs-btn" onClick={() => window.__stage && window.__stage(demo.id)}
            aria-label="Full screen">⤢ Full screen</button>
        </div>
        <div className="mono live-cap">
          <span>{demo.hint}</span>
        </div>
      </div>
    );
  }

  // shared fullscreen stage — Esc or the exit control returns you to the page
  function AppStage({ id, onClose }) {
    const d = byId(id);
    useEffect(() => {
      const k = e => { if (e.key === 'Escape') onClose(); };
      addEventListener('keydown', k);
      const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
      return () => { removeEventListener('keydown', k); document.body.style.overflow = prev; };
    }, [onClose]);
    if (!d) return null;
    return (
      <div className="stage">
        <iframe src={d.url} title={d.name} allow="clipboard-write; fullscreen" referrerPolicy="no-referrer" />
        <div className="stage-bar">
          <span className="mono">{d.name} · {d.hint}</span>
          <button className="stage-exit" onClick={onClose}>Exit full screen ✕</button>
        </div>
      </div>
    );
  }

  // Cards stay dormant until the section is reached, then flip up one at a time
  // and only then boot their iframe — so the visitor sees the transition.
  function HeroApps() {
    const [hot, setHot] = useState(null);
    const [live, setLive] = useState(false);
    const wrap = useRef(null);
    useEffect(() => {
      const el = wrap.current; if (!el) return;
      const io = new IntersectionObserver(es => {
        if (es.some(e => e.isIntersecting)) { setLive(true); io.disconnect(); }
      }, { root: document.querySelector('main'), rootMargin: '0px 0px -12% 0px', threshold: .12 });
      io.observe(el);
      return () => io.disconnect();
    }, []);
    return (
      <div className={'heroapps' + (live ? ' live' : '')} ref={wrap}>
        {DEMOS.map((d, k) => (
          <div key={d.id} className="hero-app" style={{ '--d': k * 160 + 'ms' }}
            onMouseEnter={() => setHot(d.id)} onMouseLeave={() => setHot(null)}>
            <div className="hero-app-head">
              <span className="mono hero-app-kind">{d.kind} · live</span>
              <b>{d.name}</b>
              <p className="hero-app-lede">{d.lede}</p>
              <div className="hero-app-acts">
                <button className="btn solid" onClick={() => window.__read && window.__read(d.caseId)}>
                  <span>Read the case study →</span></button>
                <span className="mono hero-app-hint">{d.hint}</span>
              </div>
            </div>
            <div className="hero-app-screen">
              {live && <iframe src={d.url} title={d.name} allow="clipboard-write; fullscreen" referrerPolicy="no-referrer" />}
              <div className="hero-app-bar">
                <button className="fs-btn" onClick={() => window.__stage && window.__stage(d.id)}>⤢ Full screen</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  Object.assign(window, { DemoCard, LiveEmbed, AppStage, HeroApps, DEMOS });
})();
