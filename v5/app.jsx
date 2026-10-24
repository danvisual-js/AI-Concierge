// statement, stat stage, 2-up case studies, AI-built labs, visual gallery.
(() => {
  const { useState, useEffect, useRef } = React;
  const I = (d) => <svg viewBox="0 0 24 24" aria-hidden="true">{d}</svg>;
  const ICONS = {
    home: I(<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />),
    work: I(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
    labs: I(<><path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" /><path d="M7.5 15h9" /></>),
    visual: I(<><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="9" cy="11" r="1.6" /><path d="M21 16l-5-4-7 6" /></>),
    about: I(<><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16.2c.7-1.6 1.8-2.4 3.2-2.4s2.5.8 3.2 2.4M14.5 10h3.5M14.5 13.5h2.5" /></>),
    talk: I(<path d="M4 5h16v11H8l-4 4z" />),
    spark: I(<path d="M12 3l1.8 5.6L19.5 10l-5.7 1.6L12 17l-1.8-5.4L4.5 10l5.7-1.4z" />),
    dock: I(<><circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" /></>),
    user: I(<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>),
  };
  const NAV = [['home', 'Home'], ['work', 'Case studies'], ['labs', 'After hours'], ['visual', 'Visual design'], ['talk', 'Contact']];
  const EMAIL = 'danvisual.uxd@gmail.com';
  const RESUME = 'assets/Daniel_Tieu_Resume.pdf';
    const STATS = [
    { v: '1st', l: 'AI-authorized prescription refill in the US.', s: 'Doctronic · 2026', id: 'doctronic' },
    { v: '26.1%', n: 26.1, suf: '%', l: 'signup CTR — an all-time high, up from 15.6%.', s: 'GoodRx · 2025', id: 'goodrx' },
    { v: '+25%', n: 25, pre: '+', suf: '%', l: 'conversion across a health & wellness portfolio.', s: 'Amyris · bounce down up to 40%', id: 'stripes' },
  ];
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const go = id => { const el = document.getElementById(id); if (el) window.scrollTo({ top: id === 'home' ? 0 : el.getBoundingClientRect().top + scrollY - 56, behavior: reduce() ? 'auto' : 'smooth' }); };
  const prog = el => { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); };
  const seek = (el, p) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + p * (el.offsetHeight - innerHeight) + 2, behavior: reduce() ? 'auto' : 'smooth' });

  // owner-editable inline text (saved to the v5 content collection)
  function Ed({ k, d, className, as: T = 'span' }) {
    const own = document.body.dataset.owner === '1';
    const v = (v5().text || {})[k] ?? d;
    if (!own) return <T className={className}>{v}</T>;
    return <T className={(className || '') + ' x-edt'} contentEditable suppressContentEditableWarning spellCheck={false} title="Click to edit"
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
      onBlur={e => { const t = e.currentTarget.textContent.trim(); if (t !== v) saveV5({ text: { ...(v5().text || {}), [k]: t || d } }); }}>{v}</T>;
  }

  function Name() {
    let d = 0;
    const ch = (s, cls) => [...s].map((c, k) => <span key={cls + k} className={'x-ch' + (cls ? ' ' + cls : '')} aria-hidden="true"><i style={{ animationDelay: (d += .05) + 's' }}>{c === ' ' ? '\u00a0' : c}</i></span>);
    return <h1 className="x-name"><span className="x-sr">Daniel Tieu</span>{ch('Daniel Tieu', '')}{ch('.', 'x-dot')}</h1>;
  }

  function Rotator({ i }) {
    const L = window.LINES || [];
    const l = L[i]; if (!l) return null;
    return <p className="x-rot" aria-live="off"><span key={i}>{l.a ? l.a + ' ' : ''}<em>{l.em}</em>{l.b ? ' ' + l.b : ''}</span></p>;
  }

  function HeroBg({ i }) {
    const L = window.LINES || [];
    const ms = L.map((_, k) => useMedia('hero-bg-' + k));
    return <div className="x-hbg" aria-hidden="true">{ms.map((m, k) => { const f = getFx('hero-bg-' + k, { op: .22 }); return <MediaFill key={k} m={m} style={{ ...fxStyle(f), opacity: k === i ? f.op : 0 }} />; })}</div>;
  }
  const editHero = (start, setPause, setLine) => {
    const L = window.LINES || [];
    setPause(true);
    __editMedia({ title: 'Hero background', opacity: true, start, ctx: 'mock', render: k => <div className="x-ed-mock"><HeroBg i={k} /><div className="x-ed-mt"><span className="x-mono">Product design · Healthcare × AI</span><b>Daniel Tieu.</b><em>{(L[k].a ? L[k].a + ' ' : '') + L[k].em + (L[k].b ? ' ' + L[k].b : '')}</em></div></div>, onTab: k => setLine(k), onClose: () => setPause(false),
      items: L.map((l, k) => ({ id: 'hero-bg-' + k, key: 'hero-bg-' + k, ratio: '16/9', def: { op: .22 }, label: `Line ${k + 1}: ${(l.a ? l.a + ' ' : '') + l.em}` })) });
  };

  function Logos({ onRead }) {
    const logos = window.useLogos ? useLogos() : {};
    return (
      <div className={'x-logos' + (v5().logoGray === false ? ' color' : '')} style={{ '--ls': v5().logoSize || 1 }}>
        <span className="x-mono">Shipped at</span>
        <div className="x-tick">
          <div className="x-tickt">{[0, 1].map(dup => (
            <ul className="x-row" key={dup} aria-hidden={dup ? 'true' : undefined}>{(window.CO || []).map(c => {
              const src = logos[logoKey(c)];
              const sc = (v5().logo || {})[logoKey(c)] || 1;
              const inner = src ? <img src={src} alt={dup ? '' : c.n} style={{ height: `calc(var(--lh) * ${sc})` }} /> : c.n;
              return <li key={c.n}>{c.id ? <button className="x-co" tabIndex={dup ? -1 : 0} onClick={() => onRead(c.id)} aria-label={dup ? undefined : `${c.n} — open case study`}>{inner}</button> : <span className="x-co na">{inner}</span>}</li>;
            })}</ul>
          ))}</div>
        </div>
      </div>
    );
  }

  function StatViz({ i }) {
    if (i === 0) {
      const N = ['Intake', 'Eligibility', 'AI consult', 'Clinician review', 'Refill sent'];
      return (
        <svg className="x-viz" viewBox="0 0 640 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <line className="x-vline" pathLength="1" x1="80" y1="60" x2="80" y2="500" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
          {N.map((n, k) => { const y = 60 + k * 110, last = k === N.length - 1;
            return <g key={n} className="x-vnode" style={{ transitionDelay: (300 + k * 220) + 'ms' }}>
              {last && <circle className="x-vring" cx="80" cy={y} r="22" />}
              <circle cx="80" cy={y} r={last ? 16 : 9} fill={last ? 'var(--ac)' : 'currentColor'} fillOpacity={last ? .9 : .35} />
              {last && <path d={`M72 ${y} l6 6 l10 -12`} fill="none" stroke="#15131a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
              <text x="122" y={y + 9} fill="currentColor" fillOpacity={last ? .95 : .4} style={{ font: `${last ? 600 : 500} 28px Instrument Sans` }}>{n}</text>
              {k === 2 && <text x="122" y={y + 40} fill="var(--ac)" fillOpacity=".8" style={{ font: '500 16px DM Mono', letterSpacing: '.08em' }}>AI-AUTHORIZED · FIRST IN THE US</text>}
            </g>; })}
        </svg>);
    }
    if (i === 1) return (
      <svg className="x-viz" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
        {[150, 270, 390, 510].map(y => <line key={y} x1="0" x2="1200" y1={y} y2={y} stroke="currentColor" strokeOpacity=".1" />)}
        <path className="x-varea" d="M0 470 L150 455 L300 462 L450 430 L600 410 L750 330 L900 250 L1050 190 L1200 150 L1200 600 L0 600 Z" fill="currentColor" fillOpacity=".07" />
        <path className="x-vline" pathLength="1" d="M0 470 L150 455 L300 462 L450 430 L600 410 L750 330 L900 250 L1050 190 L1200 150" fill="none" stroke="var(--ac)" strokeOpacity=".7" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>);
    return (
      <svg className="x-viz" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {[180, 205, 196, 232, 248, 262, 290, 318, 352, 395].map((h, k) => (
          <rect key={k} className="x-vbar" x={40 + k * 114} y={600 - h} width="72" height={h} fill={k === 9 ? 'var(--ac)' : 'currentColor'} opacity={k === 9 ? .55 : .1} style={{ transitionDelay: (k * 60) + 'ms' }} />))}
      </svg>);
  }

  function StatMock({ k }) {
    const m = useMedia('stat-bg-' + k), f = getFx('stat-bg-' + k, { op: .2 }), c = SBG[k], s = STATS[k];
    return <div className="x-ed-mock x-srow in" style={{ background: c[0], color: c[1], '--ac': c[2], minHeight: 0 }}>
      {m && m.src && <div className="x-sbg"><MediaFill m={m} style={fxStyle(f)} /></div>}
      <StatViz i={k} /><div className="x-stxt"><span className="x-mono">{String(k + 1).padStart(2, '0')}</span><b>{s.v}</b><p>{s.l}</p></div></div>;
  }
  function StatBg({ i, owner }) {
    const m = useMedia('stat-bg-' + i);
    const f = getFx('stat-bg-' + i, { op: .2 });
    return <>
      {m && m.src && <div className="x-sbg" aria-hidden="true"><MediaFill m={m} style={fxStyle(f)} /></div>}
      {owner && <button className="x-edbtn x-edbtn-stat" onClick={() => __editMedia({ title: 'Stat backgrounds', opacity: true, dark: true, start: i, ctx: 'mock', render: k => <StatMock k={k} />,
        items: STATS.map((s, k) => ({ id: 'stat-bg-' + k, key: 'stat-bg-' + k, ratio: '16/9', def: { op: .2 }, label: `Stat ${k + 1} · ${s.v}` })) })}>Edit background</button>}
    </>;
  }

  const SBG = [['#15131a', '#fff', '#a99bff'], ['#4b32c9', '#fff', '#ffffff'], ['#dde8e2', '#15131a', '#2f6f5e']];
  function Stats({ onRead, owner }) {
    const ref = useRef(null);
    const [on, setOn] = useState(-1);
    useEffect(() => {
      const root = ref.current; if (!root) return;
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        const b = e.target.querySelector('b'), s = STATS[+e.target.dataset.i];
        e.target.classList.add('in');
        if (s.n == null || reduce()) return;
        const dec = String(s.n).includes('.') ? 1 : 0, t0 = performance.now();
        const step = now => { const k = Math.min(1, (now - t0) / 1300), v = s.n * (1 - Math.pow(1 - k, 3));
          b.textContent = (s.pre || '') + v.toFixed(dec) + (s.suf || ''); if (k < 1) requestAnimationFrame(step); };
        b.textContent = (s.pre || '') + (0).toFixed(dec) + (s.suf || ''); requestAnimationFrame(step);
      }), { threshold: .55 });
      const rows = root.querySelectorAll('.x-srow'); rows.forEach(r => io.observe(r));
      let raf = 0;
      const run = () => { raf = 0; let a = -1; rows.forEach((r, i) => { const rc = r.getBoundingClientRect(); if (rc.top < innerHeight * .6 && rc.bottom > innerHeight * .4) a = i; }); setOn(a); };
      const sc = () => { if (!raf) raf = requestAnimationFrame(run); };
      addEventListener('scroll', sc, { passive: true }); run();
      return () => { io.disconnect(); removeEventListener('scroll', sc); };
    }, []);
    const c = SBG[on] || ['#fff', 'var(--xi)', 'var(--xv)'];
    return (
      <section id="stats" className="x-stats" ref={ref} aria-label="Results in numbers" style={{ background: c[0], color: c[1], '--ac': c[2] }}>
        {STATS.map((s, i) => (
          <div className="x-srow x-wrap" key={s.v} data-i={i}>
            <StatViz i={i} />
            <StatBg i={i} owner={owner} />
            <div className="x-stxt">
            <span className="x-mono">{String(i + 1).padStart(2, '0')} / {String(STATS.length).padStart(2, '0')}</span>
            <b aria-label={s.v}>{s.v}</b>
            <p>{s.l}</p>
            <span className="x-mono x-sm">{s.s}</span>
            {s.id && <button onClick={() => onRead(s.id)}>See the work →</button>}
            </div>
          </div>
        ))}
      </section>
    );
  }

  function Visual({ onOpen }) {
    const PLAY = window.PLAY || [];
    const track = useRef(null);
    const [i, setI] = useState(0);
    useEffect(() => {
      const t = track.current; if (!t) return;
      const on = () => { const w = t.firstChild ? t.firstChild.offsetWidth + 16 : 1; setI(Math.min(PLAY.length - 1, Math.round(t.scrollLeft / w))); };
      t.addEventListener('scroll', on, { passive: true }); return () => t.removeEventListener('scroll', on);
    }, [PLAY.length]);
    const to = k => { const t = track.current; if (!t) return; const kk = Math.max(0, Math.min(PLAY.length - 1, k)); const el = t.children[kk];
      t.scrollTo({ left: el.offsetLeft - t.offsetLeft - parseFloat(getComputedStyle(t).paddingLeft), behavior: reduce() ? 'auto' : 'smooth' }); };
    if (!PLAY.length) return null;
    return (
      <section id="visual" className="x-vis" style={{ '--vs': v5().visSize ?? 1.3 }} data-screen-label="Visual design" aria-roledescription="carousel" aria-label="Visual design work">
        <div className="x-sh x-wrap x-rv">
          <div><Ed k="visEyebrow" className="x-mono" d="Before product" /><h2>Visual design<sup>({String(PLAY.length).padStart(2, '0')})</sup></h2></div>
          <div className="x-arrows">
            {document.body.dataset.owner === '1' && <label className="x-stg"><span className="x-mono">Card size {Math.round((v5().visSize ?? 1.3) * 100)}%</span>
              <input type="range" min=".7" max="1.8" step=".05" value={v5().visSize ?? 1.3} onChange={e => saveV5({ visSize: +e.target.value })} /></label>}
            <span className="x-mono" aria-live="polite">{String(i + 1).padStart(2, '0')} / {String(PLAY.length).padStart(2, '0')}</span>
            <button className="x-arr" onClick={() => to(i - 1)} disabled={i === 0} aria-label="Previous visual design project">←</button>
            <button className="x-arr" onClick={() => to(i + 1)} disabled={i === PLAY.length - 1} aria-label="Next visual design project">→</button>
          </div>
        </div>
        <div className="x-track" ref={track} tabIndex={0} aria-label="Visual design projects, scroll horizontally"
          onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); to(i + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); to(i - 1); } }}>
          {PLAY.map((v, k) => (
            <button className="x-card x-vt" key={v.id} onClick={() => onOpen(v.id)} aria-label={`${v.co}, ${v.role}. Open`} onFocus={() => k !== i && to(k)}>
              <span className="x-thumb"><media-slot id={`play-${v.id}`} ratio="16/10" cover lock size="full" frame="none" fit="cover" label={`${v.co} — ${v.role}`}></media-slot></span>
              <span className="x-cb"><span className="x-mono">{String(k + 1).padStart(2, '0')}{v.year ? ' · ' + v.year : ''}</span><h3>{v.co}</h3><span className="x-tag">{v.role}</span></span>
            </button>
          ))}
        </div>
        <div className="x-pdots" role="tablist" aria-label="Choose visual design project">{PLAY.map((v, k) => <button key={v.id} role="tab" aria-selected={k === i} aria-label={v.co} className={k === i ? 'on' : ''} onClick={() => to(k)} />)}</div>
      </section>
    );
  }

  const Bars = () => <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>;
  const Wifi = () => <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true"><path d="M7.5 2.2c2.1 0 4 .8 5.5 2.1l1.2-1.3A9.7 9.7 0 007.5.4 9.7 9.7 0 00.8 3l1.2 1.3a8 8 0 015.5-2.1zm0 3.3c1.2 0 2.3.4 3.2 1.2l1.2-1.3a6.4 6.4 0 00-8.8 0l1.2 1.3a4.7 4.7 0 013.2-1.2zm0 3.2c.4 0 .7.1 1 .3L7.5 10.4 6.5 9c.3-.2.6-.3 1-.3z" /></svg>;
  const Batt = () => <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true"><rect x=".5" y=".5" width="21" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="18" height="8" rx="2" /><path d="M23 4v4a2 2 0 000-4z" opacity=".45" /></svg>;
  function LiveFrame({ url }) {
    const ref = useRef(null); const [s, setS] = useState({ k: .6, h: 800 });
    const fig = isFigma(url);
    useEffect(() => { const el = ref.current; if (!el || fig) return; const ro = new ResizeObserver(() => { const k = el.clientWidth / 390; setS({ k, h: el.clientHeight / k + 16 }); }); ro.observe(el); return () => ro.disconnect(); }, [fig]);
    return <span className="x-live" ref={ref}>{fig
      ? <iframe src={embedUrl(url)} title="Figma prototype" loading="lazy" allowFullScreen style={{ width: '100%', height: '100%' }} />
      : <iframe src={url} title="Live app" loading="lazy" style={{ width: 406, height: s.h, transform: `translate(${-8 * s.k}px, ${-8 * s.k}px) scale(${s.k})` }} />}</span>;
  }
  const canEmbed = (id, link) => { const e = getFx(id).embed; return e === true || (e == null && (isFigma(link) || /vercel\.app|netlify\.app|github\.io|danielvisual/.test(link))); };
  function PhoneLinkMode({ id }) {
    const [, setR] = useState(0);
    useEffect(() => { const r = () => setR(x => x + 1); addEventListener('content-change', r); return () => removeEventListener('content-change', r); }, []);
    const e = getFx(id).embed;
    return <div className="x-ed-g"><span className="x-mono">Live link behaviour</span><div className="x-ed-row">
      {[[null, 'Auto'], [true, 'Embed in phone'], [false, 'Poster only']].map(([v, l]) => <button key={l} className={'x-chip' + (e === v || (v === null && e == null) ? ' on' : '')} onClick={() => setFx(id, { embed: v })}>{l}</button>)}</div>
      <p className="x-ed-note">Figma prototype links and your own Vercel / Netlify apps embed. Big sites (apple.com, google.com…) refuse to be shown inside other pages — for those the phone shows your screen image and “Full screen” opens the link.</p></div>;
  }
  function Phone({ p, owner, focus, preview }) {
    const id = 'phone-' + p.id;
    const m = useMedia(id), hero = useMedia('r-' + p.id + '-hero');
    const f = getFx(id, { shape: '9/19.5' });
    const link = m && m.link;
    const live = !!(link && (focus || preview) && canEmbed(id, link));
    const dark = !link;
    let host = ''; try { host = link ? new URL(link).host.replace(/^www\./, '') : ''; } catch (e) {}
    const edit = e => { e.stopPropagation(); __editMedia({ title: p.client + ' — phone screen', link: true, ctx: 'phone', render: () => <Phone p={p} focus preview />,
      items: [{ id, key: id, ratio: '9/19.5', label: 'Screen' }], extra: <PhoneLinkMode id={id} /> }); };
    return (
      <span className={'x-phone' + (focus ? ' on' : '')}>
        <span className="x-btn-side a" aria-hidden="true" /><span className="x-btn-side b" aria-hidden="true" /><span className="x-btn-side c" aria-hidden="true" />
        <span className="x-screen">
          <span className="x-sbar" aria-hidden="true"><b>9:41</b><span className="x-island" /><i><Bars /><Wifi /><Batt /></i></span>
          <span className="x-scr">
            {live ? <LiveFrame url={link} />
              : m && m.src ? <MediaFill m={m} style={fxStyle(f)} />
              : !link && hero && hero.src ? <MediaFill m={hero} style={{ objectFit: 'cover' }} />
              : <span className="x-pblank">{p.client}</span>}
            {host && !isFigma(link) && !live && <span className="x-safari" aria-hidden="true"><b>{host}</b></span>}
          </span>
          <span className="x-hbar" aria-hidden="true"><i /></span>
        </span>
        {owner && <button className="x-edbtn x-edbtn-ph" onClick={edit}>Edit screen</button>}
      </span>
    );
  }

  function FullView({ v, onClose }) {
    useEffect(() => { const esc = e => e.key === 'Escape' && onClose(); addEventListener('keydown', esc); document.documentElement.style.overflow = 'hidden';
      return () => { removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; }; }, [onClose]);
    return (
      <div className="x-full" role="dialog" aria-label={v.title}>
        <div className="x-case-bar x-wrap"><button className="x-btn" onClick={onClose} autoFocus>← Back</button><span className="x-mono">{v.title}</span><span className="x-sp" />
          <a className="x-btn" href={v.url} target="_blank" rel="noreferrer">Open in new tab ↗</a><button className="x-x" onClick={onClose} aria-label="Close">×</button></div>
        <iframe src={embedUrl(v.url)} title={v.title} allowFullScreen />
      </div>
    );
  }

  const LI = {
    deck: <svg viewBox="0 0 48 48" aria-hidden="true"><g className="i-l"><rect x="7" y="13" width="15" height="25" rx="4" transform="rotate(-14 14.5 25.5)" opacity=".35" /></g><g className="i-r"><rect x="26" y="13" width="15" height="25" rx="4" transform="rotate(14 33.5 25.5)" opacity=".35" /></g><rect className="i-c" x="15" y="9" width="18" height="30" rx="4.5" /></svg>,
    shuffle: <svg viewBox="0 0 48 48" aria-hidden="true"><g className="i-sp"><path fillRule="evenodd" d="M17 9h14a8 8 0 018 8v14a8 8 0 01-8 8H17a8 8 0 01-8-8V17a8 8 0 018-8zm0 5.5a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zm14 0a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM24 21.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM17 28a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zm14 0a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6z" transform="rotate(-12 24 24)" /></g></svg>,
    focus: <svg viewBox="0 0 48 48" aria-hidden="true"><g className="i-mg"><path fillRule="evenodd" d="M21 7a14 14 0 0111.2 22.4l8.2 8.2a2.6 2.6 0 01-3.7 3.7l-8.2-8.2A14 14 0 1121 7zm0 5a9 9 0 100 18 9 9 0 000-18z" /></g></svg>,
  };
  const MODES = [['deck', 'Stack'], ['focus', 'Focus + details'], ['shuffle', 'Shuffle order']];
  const rnd = (seed, k) => { let t = (seed * 9301 + k * 49297 + 233280) % 233280; const r = () => (t = (t * 9301 + 49297) % 233280) / 233280; return { x: (r() - .5) * 300, y: (r() - .5) * 70, r: (r() - .5) * 26, z: 1 + Math.floor(r() * 8) }; };
  const plain = t => String(t || '').replace(/<[^>]+>|\*\*/g, '');

  function LabInfo({ p, mode, onRead, onStage, onFull }) {
    const m = useMedia('phone-' + p.id);
    const demo = p.demo && (window.DEMOS || []).find(d => d.id === p.demo);
    const link = m && m.link;
    const desc = plain(p.story).split(/(?<=[.!?])\s/).slice(0, mode === 'focus' ? 2 : 1).join(' ');
    return (
      <div className={'x-dinfo ' + mode} aria-live="polite">
        <span className="x-mono">{demo || link ? '● Live' : (p.year || 'Archive')} · {p.extra ? <Ed k={'lab-' + p.id + '-c'} d={p.client} /> : p.client}</span>
        <h3>{p.extra ? <Ed k={'lab-' + p.id + '-t'} d={p.title} /> : p.title}</h3>
        {p.extra && <p><Ed k={'lab-' + p.id + '-d'} d="Add a one-line description" /></p>}
        {mode === 'focus' && desc && <p>{desc}</p>}
        <div className="x-btns">
          {(demo || link) && <button className="x-btn k" onClick={() => demo ? onStage(demo.id) : onFull({ url: link, title: p.client })}>Full screen ⤢</button>}
          {!p.extra && <button className="x-btn" onClick={() => onRead(p.id)}>The story</button>}
        </div>
      </div>
    );
  }

  function Labs({ onRead, onStage, onFull, owner }) {
    const [, bump] = useState(0);
    useEffect(() => { const r = () => bump(x => x + 1); addEventListener('content-change', r); return () => removeEventListener('content-change', r); }, []);
    const hidden = v5().labsHidden || [], extra = v5().labsExtra || [];
    const list = [...PROJECTS.filter(p => (p.personal || p.hackathon) && !hidden.includes(p.id)), ...extra].slice(0, 6);
    const [i, setI0] = useState(0);
    const setI = k => setI0(k);
    useEffect(() => { if (i >= list.length) setI0(0); setPerm(null); }, [list.length]);
    const addMock = () => { if (list.length >= 6) return; const id = 'lab' + Date.now().toString(36); saveV5({ labsExtra: [...extra, { id, client: 'New project', title: 'Untitled build', story: '', year: String(new Date().getFullYear()), personal: true, extra: true }] }); setTimeout(() => setI0(list.length), 50); };
    const removeMock = p => { if (!confirm('Remove "' + p.client + '" from After hours?')) return; if (p.extra) saveV5({ labsExtra: extra.filter(x => x.id !== p.id) }); else saveV5({ labsHidden: [...hidden, p.id] }); setI0(0); };
    const restore = () => saveV5({ labsHidden: [] });
    const [mode, setModeS] = useState(() => { const v = localStorage.getItem('dv5.ahmode'); return v === 'focus' ? 'focus' : 'deck'; });
    const [perm, setPerm] = useState(null);
    const sx = useRef(null);
    if (!list.length) return null;
    const n = list.length;
    const order = perm && perm.length === n ? perm : list.map((_, x) => x);
    const to = k => setI(order[((order.indexOf(k) % n) + n) % n]);
    const step = d => setI(order[(order.indexOf(i) + d + n) % n]);
    const setMode = md => {
      if (md === 'shuffle') { const cur = perm || list.map((_, k) => k); let nx; do { nx = [...cur].sort(() => Math.random() - .5); } while (n > 1 && nx.join() === cur.join()); setPerm(nx); setI(nx[0]); md = mode === 'focus' ? 'focus' : 'deck'; }
      localStorage.setItem('dv5.ahmode', md); setModeS(md);
    };
    const pos = (k, o) => {
      if (mode === 'shuffle') { const order = perm || list.map((_, x) => x); const c = order.indexOf(k) - (n - 1) / 2; return { t: `translateX(calc(-50% + ${c * 82}%)) scale(.7)`, z: k === i ? 10 : 5, op: 1, f: k === i ? 'none' : 'grayscale(.7)', pe: true }; }
      if (mode === 'focus') return { t: `translateX(calc(-50% - 62%)) scale(${k === i ? 1 : .82})`, z: k === i ? 10 : 1, op: k === i ? 1 : 0, f: 'none', pe: k === i };
      const a = Math.abs(o), sg = Math.sign(o);
      const x = a === 0 ? 0 : a === 1 ? 55 : a === 2 ? 92 : 118;
      return { t: `translateX(calc(-50% + ${sg * x}%)) scale(${[1, .8, .66, .56][Math.min(a, 3)]})`, z: 10 - a, op: [1, .315, .14, 0][Math.min(a, 3)], f: o === 0 ? 'none' : 'grayscale(1) contrast(.85)', pe: a <= 2 };
    };
    return (
      <section id="labs" className="x-wrap x-ahs" data-screen-label="After hours" aria-roledescription="carousel" aria-label="After hours projects">
        <div className="x-sh x-rv">
          <h2 className="x-ah-t">After hours. <Ed k="labsEyebrow" className="x-ah-s" d="Designed, built & shipped solo — with AI" /></h2>
        </div>
        <div className="x-tind" role="toolbar" aria-label="Layout">{MODES.map(([k, l]) =>
          <button key={k} className={'t-' + k + (mode === k ? ' on' : '')} aria-pressed={k === 'shuffle' ? undefined : mode === k} onClick={() => setMode(k)} aria-label={l} title={l}>{LI[k]}<span>{l}</span></button>)}</div>
        <div className={'x-deck x-rv m-' + mode} tabIndex={0} aria-label="Use left and right arrow keys to browse"
          onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); } }}
          onPointerDown={e => { sx.current = e.clientX; }} onPointerUp={e => { if (sx.current == null) return; const d = e.clientX - sx.current; sx.current = null; if (Math.abs(d) > 40) step(d < 0 ? 1 : -1); }}>
          {list.map((p, k) => {
            let o = order.indexOf(k) - order.indexOf(i); if (o > n / 2) o -= n; if (o < -n / 2) o += n;
            const q = pos(k, o);
            return (
              <article key={p.id} className={'x-dk' + (k === i ? ' on' : '')} aria-hidden={k !== i} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}: ${p.client}`}
                style={{ transform: q.t, zIndex: q.z, opacity: q.op, filter: q.f, pointerEvents: q.pe ? 'auto' : 'none' }}
                onClick={() => k !== i && to(k)}>
                <Phone p={p} owner={owner && k === i} focus={k === i} />
              </article>
            );
          })}
          <LabInfo p={list[i]} mode={mode} onRead={onRead} onStage={onStage} onFull={onFull} />
        </div>
        <div className="x-pdots" role="tablist" aria-label="Choose project">{order.map(k => list[k] && <button key={list[k].id} role="tab" aria-selected={k === i} aria-label={list[k].client} className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>
        {owner && <div className="x-labed">
          <span className="x-mono">{n} of 6 mocks</span>
          <button className="x-btn" onClick={addMock} disabled={n >= 6}>+ Add mock</button>
          {list[i] && n > 1 && <button className="x-btn" onClick={() => removeMock(list[i])}>Remove “{list[i].client}”</button>}
          {hidden.length > 0 && <button className="x-btn" onClick={restore}>Restore hidden ({hidden.length})</button>}
        </div>}
      </section>
    );
  }

  function Talk({ onHiring }) {
    const ref = useRef(null);
    const [on, setOn] = useState(false), [seen, setSeen] = useState(false), [sent, setSent] = useState(false);
    const [f, setF] = useState({ name: '', email: '', role: '', msg: '' });
    useEffect(() => {
      const el = ref.current; if (!el) return;
      const io = new IntersectionObserver(([e]) => { setOn(e.intersectionRatio > .3); if (e.intersectionRatio > .3) setSeen(true); }, { threshold: [0, .3, .6] });
      io.observe(el); return () => io.disconnect();
    }, []);
    const up = k => e => setF(x => ({ ...x, [k]: e.target.value }));
    const submit = e => {
      e.preventDefault();
      const body = `${f.msg}\n\n— ${f.name}${f.role ? ' · ' + f.role : ''}\n${f.email}`;
      location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Hello from ' + (f.name || 'your portfolio'))}&body=${encodeURIComponent(body)}`;
      setSent(true);
    };
    return (
      <section id="talk" ref={ref} className={'x-talk x-wrap' + (on ? ' on' : '') + (seen ? ' seen' : '')} data-screen-label="Contact">
        <div className="x-talk-in">
          <div className="x-talk-l">
            <Ed k="talkEyebrow" className="x-mono" d="Contact" />
            <h2>Let's talk<span className="x-tdot">.</span></h2>
            <p>What it is, who it's for, and what's stuck — that's plenty. I read these myself and reply within 48 hours.</p>
            <div className="x-btns">
              <button className="x-btn lg" onClick={onHiring}>I'm hiring — is he a fit?</button>
              <a className="x-btn lg" href={'mailto:' + EMAIL}>{EMAIL}</a>
            </div>
          </div>
          {sent ? <div className="x-tform x-sent" role="status"><h3>Thanks — your email app should be open.</h3><p>If nothing opened, write to <a href={'mailto:' + EMAIL}>{EMAIL}</a>.</p><button className="x-btn" onClick={() => setSent(false)}>Edit message</button></div> : (
          <form className="x-tform" onSubmit={submit} aria-label="Contact form">
            <label><span>Name</span><input required value={f.name} onChange={up('name')} autoComplete="name" /></label>
            <label><span>Email</span><input required type="email" value={f.email} onChange={up('email')} autoComplete="email" /></label>
            <label className="w"><span>Company &amp; role <i>(optional)</i></span><input value={f.role} onChange={up('role')} autoComplete="organization" /></label>
            <label className="w"><span>Message</span><textarea required rows="4" value={f.msg} onChange={up('msg')} placeholder="The role, the product, or the problem." /></label>
            <div className="w x-tsend"><button className="x-btn lg k">Send message →</button><span className="x-mono">Replies within 48 hours</span></div>
          </form>)}
        </div>
        <div className="x-foot"><span>© 2026 Dan Tieu · San Francisco Bay Area</span><span><a href="https://www.linkedin.com/in/danieltieu/" target="_blank" rel="noreferrer">LinkedIn ↗</a> · <a href={RESUME} download="Daniel_Tieu_Resume.pdf">Résumé PDF ↓</a></span></div>
      </section>
    );
  }

  function SaveState() {
    const [t, setT] = useState(null);
    useEffect(() => { const on = () => setT(new Date()); addEventListener('content-change', on); addEventListener('media-change', on);
      return () => { removeEventListener('content-change', on); removeEventListener('media-change', on); }; }, []);
    const cloud = window.dvCloud && dvCloud.enabled && dvCloud.canWrite && dvCloud.canWrite();
    return <span className={'x-save' + (cloud ? ' ok' : ' warn')} role="status">{cloud ? '● Auto-saving to cloud' : '● Saving to this browser only'}{t ? ' · ' + t.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}</span>;
  }

  function App() {
    const [cgOpen, setCgOpen] = useState(false), [cgMin, setCgMin] = useState(false), [ask, setAsk] = useState(null);
    const [caseId, setCase] = useState(null), [visId, setVis] = useState(null), [panel, setPanel] = useState(null), [full, setFull] = useState(null), [ghost, setGhost] = useState(null);
    const [dock, setDockS] = useState(() => localStorage.getItem('dv5.dock') || 'left');
    const [dockMenu, setDockMenu] = useState(false);
    const setDock = d => { localStorage.setItem('dv5.dock', d); setDockS(d); setDockMenu(false); };
    useEffect(() => { document.body.dataset.dock = dock; }, [dock]);
    const dockDown = e => {
      if (e.button !== 0) return;
      const grip = e.target.closest('.x-grip-btn');
      if (!grip && e.target.closest('button,a')) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY; let moved = false;
      const edge = (x, y) => { const d = { left: x, right: innerWidth - x, top: y, bottom: innerHeight - y }; return Object.keys(d).sort((p, q) => d[p] - d[q])[0]; };
      const mv = ev => { if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return; moved = true; document.body.classList.add('x-dragging'); setGhost(edge(ev.clientX, ev.clientY)); };
      const upf = ev => { removeEventListener('pointermove', mv); removeEventListener('pointerup', upf); document.body.classList.remove('x-dragging');
        if (moved) { setDock(edge(ev.clientX, ev.clientY)); setGhost(null); } else if (grip) setDockMenu(m => !m); };
      addEventListener('pointermove', mv); addEventListener('pointerup', upf);
    };
    const [acct, setAcct] = useState(false), [studio, setStudio] = useState(false), [logosOpen, setLogos] = useState(false), [stage, setStage] = useState(null);
    const [owner, setOwner] = useState(document.body.dataset.owner === '1');
    const [more, setMore] = useState(false);
    const [line, setLine] = useState(0), [pause, setPause] = useState(false), [ed, setEd] = useState(null);
    useEffect(() => { window.__editMedia = cfg => setEd(cfg); }, []);
    useEffect(() => { const n = (window.LINES || []).length; if (n < 2 || reduce() || pause) return; const t = setInterval(() => setLine(x => (x + 1) % n), 3800); return () => clearInterval(t); }, [pause]);
    const [active, setActive] = useState('home');
    const [floatOn, setFloat] = useState(false);
    const [, setRev] = useState(0);

    const doAsk = a => { setAsk({ ...a, n: Date.now() }); setCgOpen(true); setCgMin(false); };
    const read = id => { setCgMin(m => cgOpenRef.current ? true : m); setVis(null); setCase(id); };
    const openPanel = id => { setCgMin(m => cgOpenRef.current ? true : m); setPanel(id); };
    const openVis = id => { setCgMin(m => cgOpenRef.current ? true : m); setVis(id); };
    const openStage = id => { setCgMin(m => cgOpenRef.current ? true : m); setStage(id); };
    const cgOpenRef = useRef(false); cgOpenRef.current = cgOpen;

    useEffect(() => {
      window.__read = read; window.__studio = () => setStudio(true); window.__stage = openStage;
      window.__ask = q => doAsk({ q });
      const r = () => setRev(x => x + 1); addEventListener('content-change', r);
      const o = () => setOwner(document.body.dataset.owner === '1'); addEventListener('owner-change', o);
      const k = e => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (cgOpenRef.current) { setCgMin(false); setTimeout(() => { const x = document.getElementById('x-cg-in'); x && x.focus(); }, 60); return; }
          const hero = document.getElementById('home').getBoundingClientRect().bottom > 120;
          const x = document.getElementById(hero ? 'ask-hero' : 'ask-float'); x && x.focus({ preventScroll: true });
        }
      };
      addEventListener('keydown', k);
      return () => { removeEventListener('content-change', r); removeEventListener('owner-change', o); removeEventListener('keydown', k); };
    }, []);

    useEffect(() => {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
      document.querySelectorAll('.x-rv:not(.in)').forEach(el => io.observe(el));
      const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('sin'); io2.unobserve(e.target); } }), { rootMargin: '0px 0px -18% 0px', threshold: 0 });
      document.querySelectorAll('#work>.x-sh,#visual>.x-sh,#labs>.x-sh,#labs>.x-tind,.x-talk>*:first-child,.x-foot').forEach(el => el.classList.add('x-sec-in'));
      document.querySelectorAll('.x-sec-in:not(.sin)').forEach(el => io2.observe(el));
      return () => { io.disconnect(); io2.disconnect(); };
    });

    useEffect(() => {
      let raf = 0;
      const run = () => {
        raf = 0; const vh = innerHeight;
        const hero = document.getElementById('home'); if (hero) setFloat(hero.getBoundingClientRect().bottom < 120);
        let cur = 'home'; NAV.forEach(([id]) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < vh * .4) cur = id; }); setActive(cur);
        const m = document.getElementById('mani');
        if (m) { const p = Math.min(1, prog(m) * 1.15), w = m.querySelectorAll('.x-w'); w.forEach((s, i) => s.classList.toggle('on', i < p * w.length)); }
        document.querySelectorAll('[data-par]').forEach(el => { const r = el.getBoundingClientRect(); el.style.transform = reduce() ? '' : `translateY(${((r.top + r.height / 2) - vh / 2) * -parseFloat(el.dataset.par)}px)`; });
      };
      const on = () => { if (!raf) raf = requestAnimationFrame(run); };
      addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); run();
      return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
    }, []);

    const cases = PROJECTS.filter(p => !p.personal && !p.hackathon);
    const shown = more ? cases : cases.slice(0, 4);
    const primary = (window.INTENTS || []).filter(i => i.primary);

    return (
      <div>
        <a className="x-skip" href="#work">Skip to case studies</a>
        <nav className="x-rail" aria-label="Sections" onPointerDown={dockDown}>
          <button className="x-d" onClick={() => go('home')} aria-label="Back to top">d<i>.</i></button>
          {NAV.map(([id, label]) => <button key={id} className={'x-ri' + (active === id ? ' on' : '')} onClick={() => go(id)} aria-label={label} aria-current={active === id ? 'true' : undefined}>{ICONS[id]}<span className="x-tip" aria-hidden="true">{label}</span></button>)}
          <button className="x-ri" onClick={() => openPanel('bio')} aria-label="About Dan">{ICONS.about}<span className="x-tip" aria-hidden="true">About</span></button>
          <button className="x-ri" onClick={() => cgOpen ? setCgMin(false) : document.getElementById(floatOn ? 'ask-float' : 'ask-hero').focus()} aria-label="Ask the concierge">{ICONS.spark}<span className="x-tip" aria-hidden="true">Ask the concierge · ⌘K</span></button>
          <i className="x-sp" />
          <div className="x-dockw">
            <button className={'x-ri x-grip-btn' + (dockMenu ? ' on' : '')} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDockMenu(m => !m); } }} aria-label="Move toolbar — drag to any edge, or press Enter for options" aria-expanded={dockMenu}>{ICONS.dock}<span className="x-tip" aria-hidden="true">Drag to move toolbar</span></button>
            {dockMenu && <div className="x-dockm" role="menu">{['left', 'top', 'right', 'bottom'].map(d => <button key={d} role="menuitemradio" aria-checked={dock === d} className={dock === d ? 'on' : ''} onClick={() => setDock(d)}>{d[0].toUpperCase() + d.slice(1)}</button>)}</div>}
          </div>
          <button className={'x-ri' + (owner ? ' x-own' : '')} onClick={() => setAcct(true)} aria-label={owner ? 'Account (signed in)' : 'Owner sign-in'}>{ICONS.user}<span className="x-tip" aria-hidden="true">{owner ? 'Signed in — account' : 'Owner sign-in'}</span></button>
        </nav>
        <div className="x-ownbar">
          <SaveState />
          <div className="x-ownrow">
          <button className="x-btn k" onClick={() => setStudio(true)}>Edit content</button>
          <button className="x-btn" onClick={() => setLogos(true)}>Logos</button>
          <button className="x-btn" onClick={() => setAcct(true)}>Account</button>
          </div>
        </div>

        <div className="x-main" role="main" id="main">
          <header className="x-top x-wrap">
            <Ed k="topline" className="x-st" d="Dan Tieu · Senior Product Designer · open to work" />
            <div className="x-btns">
              <button className="x-btn" onClick={() => openPanel('resume')}>Résumé</button>
              <button className="x-btn k" onClick={() => go('talk')}>Get in touch</button>
            </div>
          </header>

          <section id="home" className="x-hero x-wrap" data-screen-label="Home">
            <HeroBg i={line} />
            {owner && <button className="x-edbtn x-edbtn-hero" onClick={() => editHero(line, setPause, setLine)}>Edit background</button>}
            <div className="x-eyebrow x-mono"><Ed k="heroEyebrow" d="Product design · Healthcare × AI · 12+ years" /></div>
            <Name />
            <Rotator i={line} />
            <Logos onRead={read} />
            <div className="x-fold">
              <div className="x-dock">
                <AskBar id="ask-hero" onAsk={doAsk} />
                <div className="x-qs">{primary.map(it => <button key={it.id} className="x-chip" onClick={() => doAsk({ intent: it.id })}>{it.q}</button>)}</div>
              </div>
              <button className="x-hint" style={{ opacity: floatOn ? 0 : 1 }} onClick={() => go('stats')} aria-label="Scroll to results"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></button>
            </div>
          </section>

          <Stats onRead={read} owner={owner} />

          <section id="work" className="x-wrap" data-screen-label="Case studies">
            <div className="x-sh x-rv"><div><Ed k="workEyebrow" className="x-mono" d="Selected work" /><h2>Case studies<sup>({String(cases.length).padStart(2, '0')})</sup></h2></div>{owner ? <div className="x-stg">
              <label><span className="x-mono">Stagger {Math.round((v5().stagger ?? .5) * 100)}%</span>
                <input type="range" min="0" max="1" step=".05" value={v5().stagger ?? .5} onChange={e => saveV5({ stagger: +e.target.value })} /></label>
              <label><span className="x-mono">Spacing {Math.round((v5().gapY ?? 1) * 100)}%</span>
                <input type="range" min="0" max="2.5" step=".05" value={v5().gapY ?? 1} onChange={e => saveV5({ gapY: +e.target.value })} /></label></div>
              : <p className="x-shp">Hover for the headline number. Each opens as a full case study.</p>}</div>
            <div className="x-grid" style={{ paddingBottom: `calc(${v5().stagger ?? .5} * clamp(120px, 20vw, 320px) * .6 + 48px)` }}>
              {[0, 1].map(col => (
                <div className={'x-col c' + col} key={col} data-par={col ? String(.12 * (v5().stagger ?? .5)) : '0'} style={{ gap: `calc(28px + ${v5().gapY ?? 1} * clamp(40px, 5vw, 80px))`, paddingTop: col ? `calc(${v5().stagger ?? .5} * clamp(120px, 20vw, 320px))` : 0 }}>
                  {shown.map((p, i) => i % 2 !== col ? null : (
                    <div key={p.id} className="x-rv x-rvc" style={{ order: i }}><WorkCard p={p} i={i} owner={owner} onOpen={read} /></div>
                  ))}
                </div>
              ))}
            </div>
            {cases.length > 4 && <div className="x-more"><button className="x-btn lg" onClick={() => setMore(m => !m)} aria-expanded={more}>{more ? 'Show fewer' : `Show all ${cases.length} case studies`}</button></div>}
          </section>

          <Labs onRead={read} onStage={openStage} onFull={setFull} owner={owner} />
          <Visual onOpen={openVis} />

          <Talk onHiring={() => doAsk({ intent: 'hiring' })} />
        </div>

        <div className={'x-float' + (floatOn && (!cgOpen || cgMin) && !caseId && !visId && !panel ? ' on' : '')} aria-hidden={!floatOn}><AskBar id="ask-float" small onAsk={doAsk} placeholder="Ask the concierge…" /></div>
        {cgOpen && cgMin && <button className="x-wintab" onClick={() => setCgMin(false)}><Spark />concierge <span>— restore chat</span></button>}

        {cgOpen && <Concierge ask={ask} min={cgMin} setMin={setCgMin} owner={owner} onClose={() => { setCgOpen(false); setCgMin(false); }} onRead={read} onPanel={openPanel} onGo={id => { setCgMin(true); setTimeout(() => go(id), 50); }} />}
        {panel && <PanelOverlay panel={panel} onClose={() => setPanel(null)} />}
        {visId && <VisualOverlay id={visId} owner={owner} onClose={() => setVis(null)} onOpen={setVis} />}
        {caseId && <CaseOverlay id={caseId} owner={owner} onClose={() => setCase(null)} onOpen={setCase} />}
        {acct && <AccountSheet owner={owner} onClose={() => setAcct(false)} onLogos={() => { setAcct(false); setLogos(true); }} onContent={() => { setAcct(false); setStudio(true); }} />}
        {studio && <Studio onClose={() => setStudio(false)} />}
        {logosOpen && <LogoSheet5 onClose={() => setLogos(false)} />}
        {ed && <MediaEditor cfg={ed} onClose={() => { ed.onClose && ed.onClose(); setEd(null); }} />}
        {full && <FullView v={full} onClose={() => setFull(null)} />}
        {ghost && <div className={'x-dockghost ' + ghost} aria-hidden="true"><span>Dock {ghost}</span></div>}
        {stage && <AppStage id={stage} onClose={() => setStage(null)} />}
      </div>
    );
  }

  window.App5 = App;
})();
