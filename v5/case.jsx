// v5/case.jsx — case-study overlay. Same content model as v3 (PROJECTS), same
// media-slot ids (r-<id>-hero, r-<id>-shotN) so existing uploads carry over.
(() => {
  const { useEffect, useRef, useState } = React;
  const num = s => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0;


  // ---- live charts: animate when scrolled into view (the .in class + count-up are added by the case overlay) ----
  const pct = (v, max) => Math.max(1.5, (v / max) * 100) + '%';
  function FlowChart({ b }) {
    return <div className="x-anim x-flow">{b.steps.map((st, i) => (
      <div key={i} className={'x-fst' + (st.hl ? ' hl' : '')} style={{ '--k': i }}>
        <span className="x-fdot" /><span className="x-mono">{String(i + 1).padStart(2, '0')}</span><b>{st.h}</b><span>{st.d}</span>
      </div>))}</div>;
  }
  function Bars({ b }) {
    const max = b.max || Math.max(...b.rows.map(r => r.v));
    return <div className="x-anim x-bars">{b.h && <span className="x-mono">{b.h}</span>}{b.rows.map((r, i) => (
      <div key={i} className={'x-brow' + (r.hl ? ' hl' : '')} style={{ '--k': i }}>
        <span className="x-bl">{r.l}</span>
        <span className="x-bt"><i style={{ '--w': pct(r.v, max) }} /></span>
        <b data-count={r.d || r.v}>{r.d || r.v}</b>
      </div>))}{b.note && <p className="x-bnote"><Rich t={b.note} /></p>}</div>;
  }
  function Fixes({ b }) {
    return <div className="x-anim x-fixes">{b.items.map((it, i) => {
      const max = Math.max(it.a, it.b) * 1.15;
      return <div key={i} className="x-fix" style={{ '--k': i }}>
        <span className="x-mono">{it.t || ((b.tag || 'Fix') + ' ' + (i + 1))}</span><b className="x-fh">{it.h}</b>
        <div className="x-ba"><span>{b.la || 'Before'}</span><span className="x-bt"><i style={{ '--w': pct(it.a, max) }} /></span><b data-count={it.a + '%'}>{it.a}%</b></div>
        <div className="x-ba hl"><span>{b.lb || 'After'}</span><span className="x-bt"><i style={{ '--w': pct(it.b, max) }} /></span><b data-count={it.b + '%'}>{it.b}%</b></div>
      </div>; })}</div>;
  }
  function Rank({ b }) {
    const c = b.cols || ['Page element', 'Order on page', 'Ranked by shoppers'];
    return <div className="x-anim x-rank">{b.h && <span className="x-mono">{b.h}</span>}
      <div className="x-rk x-rk-hd"><span>{c[0]}</span><span>{c[1]}</span><span>{c[2]}</span></div>
      {b.rows.map((r, i) => { const d = r[1] - r[2]; return (
        <div key={i} className={'x-rk' + (d > 0 ? ' up' : d < 0 ? ' dn' : '')} style={{ '--k': i }}>
          <span>{r[0]}</span><b>#{r[1]}</b><b>#{r[2]}<i>{d > 0 ? '↑' + d : d < 0 ? '↓' + (-d) : '='}</i></b>
        </div>); })}
      {b.note && <p className="x-bnote"><Rich t={b.note} /></p>}</div>;
  }
  // click-to-load embed (Figma prototype, video). Inside a framed preview it opens in a new tab instead.
  function Embed({ b }) {
    const top = (() => { try { return window.self === window.top; } catch (e) { return false; } })();
    const [on, setOn] = useState(false);
    return <figure className="x-img w x-embed">
      {top && (on || b.inline)
        ? <div className="x-embed-f" style={{ aspectRatio: b.ratio || '16/10' }}><iframe src={b.src} title={b.title || 'Prototype'} allow="fullscreen; autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
        : <a className="x-livecard" href={b.href || b.src} target="_blank" rel="noopener" onClick={e => { if (top) { e.preventDefault(); setOn(true); } }}>
            <img src={b.poster} alt={b.title || ''} loading="lazy" /><span className="x-play">{(b.label || 'Play the prototype') + (top ? ' ▶' : ' ↗')}</span></a>}
      {b.cap && <figcaption><Rich t={b.cap} /></figcaption>}</figure>;
  }
  function StatRow({ b }) {
    return <div className="x-anim x-bstats">{b.items.map((it, i) => (
      <div key={i} style={{ '--k': i }}><b data-count={it.v}>{it.v}</b><span>{it.l}</span></div>))}</div>;
  }

  function Funnel({ b }) {
    const ref = useRef(null);
    const max = Math.max(...b.rows.map(r => num(r[1])));
    useEffect(() => {
      const el = ref.current; if (!el) return;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; io.disconnect();
        el.querySelectorAll('i').forEach((i, k) => setTimeout(() => { i.style.width = i.dataset.w + '%'; }, k * 80));
      }, { threshold: .2 });
      io.observe(el); return () => io.disconnect();
    }, []);
    return (
      <div className="x-fun" ref={ref}>
        {b.rows.map((r, i) => (
          <div key={i} className={'x-fr' + (r[3] === 'warn' ? ' w' : '')}>
            <span>{r[0]}</span>
            <span className="x-tr"><i data-w={Math.max(1.2, Math.sqrt(num(r[1]) / max) * 100)} /></span>
            <span className="x-n">{r[1]}{r[2] && r[2] !== '—' ? ' · ' + r[2] : ''}</span>
          </div>
        ))}
      </div>
    );
  }

  function Block({ b }) {
    if (b.type === 'callout') return <div className="x-callout">{b.h && <span className="x-mono">{b.h}</span>}<Rich as="p" t={b.b} /></div>;
    if (b.type === 'funnel') return <Funnel b={b} />;
    if (b.type === 'flow') return <FlowChart b={b} />;
    if (b.type === 'bars') return <Bars b={b} />;
    if (b.type === 'fixes') return <Fixes b={b} />;
    if (b.type === 'stats') return <StatRow b={b} />;
    if (b.type === 'rank') return <Rank b={b} />;
    if (b.type === 'embed') return <Embed b={b} />;
    const med = (src, alt) => /\.(mp4|webm)$/i.test(src)
      ? <video src={src} autoPlay muted loop playsInline aria-label={alt || ''} />
      : <img src={src} alt={alt || ''} loading="lazy" />;
    if (b.type === 'img') return (
      <figure className={'x-img' + (b.wide ? ' w' : '')}>{med(b.src, b.alt || b.cap)}
        {b.cap && <figcaption><Rich t={b.cap} /></figcaption>}</figure>
    );
    if (b.type === 'imgs') return (
      <div className={'x-imgs' + (b.wide ? ' w' : '')}>{b.items.map((it, k) => (
        <figure key={k} className="x-img">{med(it.src, it.cap)}{it.cap && <figcaption><Rich t={it.cap} /></figcaption>}</figure>))}</div>
    );
    if (b.type === 'releases') return (
      <table className="x-tbl"><thead><tr><th>Release</th><th>Date</th><th>What shipped</th></tr></thead>
        <tbody>{b.rows.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td><Rich t={r[2]} /></td></tr>)}</tbody></table>
    );
    if (b.type === 'timeline') return (
      <ol className="x-tl">{b.items.map((it, i) => <li key={i}><span className="x-mono" style={{ color: 'var(--xi3)' }}>{it.d}</span><h4>{it.t}</h4><Rich as="p" t={it.b} /></li>)}</ol>
    );
    if (b.type === 'decisions') return (
      <ol className="x-kd">{b.items.map((it, i) => <li key={i}><span className="n">{String(i + 1).padStart(2, '0')}</span><div><h4>{it.h}</h4><Rich as="p" t={it.b} /></div></li>)}</ol>
    );
    if (b.type === 'outcomes') return (
      <div className="x-outs">{b.items.map((it, i) => <div key={i}><span className="x-mono">{it.f}</span><h4>{it.h}</h4><Rich as="p" t={it.b} /></div>)}</div>
    );
    return null;
  }

  // password gate for locked case studies (owner skips it). Client-side only — keeps casual visitors out.
  const LOCK_HASH = 'c6e5550e946b7f336ebef9453c2068b4d454912af23e8a379f0efe2cd0fcb1d3';
  let lockOpen = false;
  try { lockOpen = sessionStorage.getItem('dv-lock') === LOCK_HASH; } catch (e) {}
  async function sha(t) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  // shared with the concierge, so one unlock opens both
  window.DV_LOCK = {
    isOpen: () => lockOpen,
    ids: () => PROJECTS.filter(p => p.locked).map(p => p.id),
    mentions: q => /doctronic|good ?rx|telehealth|refill|prescription|ai doctor|\behr\b|medical record|hipaa/i.test(q)
      || PROJECTS.some(p => p.locked && q.toLowerCase().includes(p.client.toLowerCase())),
    unlock: async pw => {
      const h = await sha(String(pw).trim().toLowerCase());
      if (h !== LOCK_HASH) return false;
      lockOpen = true; try { sessionStorage.setItem('dv-lock', h); } catch (x) {}
      dispatchEvent(new Event('dv-unlock')); return true;
    },
  };
  function LockGate({ p, onOpen }) {
    const [v, setV] = useState(''); const [err, setErr] = useState(false); const [busy, setBusy] = useState(false);
    const go = async e => {
      e.preventDefault(); if (!v || busy) return; setBusy(true);
      const ok = await window.DV_LOCK.unlock(v); setBusy(false);
      if (ok) onOpen(); else { setErr(true); setV(''); }
    };
    return (
      <div className="x-lock x-wrap">
        <div className="x-lock-card">
          <span className="x-lock-ic" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg></span>
          <span className="x-mono">{p.client} · {p.year}</span>
          <h2>{p.title}</h2>
          <p>This case study is password protected because it includes confidential work. Enter the password to continue, or reach out and I'll share it.</p>
          <form onSubmit={go}>
            <input type="password" value={v} autoFocus aria-label="Password" placeholder="Password" onChange={e => { setV(e.target.value); setErr(false); }} />
            <button className="x-btn k" type="submit" disabled={busy}>Unlock</button>
          </form>
          {err && <span className="x-lock-err" role="alert">That password didn't work. Try again.</span>}
        </div>
      </div>
    );
  }

  function CaseOverlay({ id, onClose, onOpen, owner }) {
    const list = [...PROJECTS.filter(p => !p.personal), ...PROJECTS.filter(p => p.personal)];
    const idx = Math.max(0, list.findIndex(p => p.id === id));
    const p = list[idx]; const next = list[(idx + 1) % list.length];
    const box = useRef(null); const prog = useRef(null); const tbar = useRef(null);
    const [act, setAct] = useState(0);
    const [, bump] = useState(0);
    const gated = !!p.locked && !owner && !lockOpen;
    // rail: Story (with the pivot) + each section + Result — data keeps sections to 4 or fewer
    const secs = ['Story', ...p.sections.map(s => s.k), 'Result'];

    useEffect(() => {
      const esc = e => e.key === 'Escape' && onClose();
      addEventListener('keydown', esc);
      document.documentElement.style.overflow = 'hidden';
      return () => { removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; };
    }, [onClose]);
    useEffect(() => { if (box.current) box.current.scrollTop = 0; setAct(0); }, [id]);
    useEffect(() => {
      const el = box.current; if (!el) return;
      const on = () => {
        const max = el.scrollHeight - el.clientHeight;
        if (prog.current) prog.current.style.width = (max > 0 ? el.scrollTop / max * 100 : 0) + '%';
        const ss = [...el.querySelectorAll('[data-sec]')];
        let a = 0; ss.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) a = i; });
        setAct(a);
        const cs = el.querySelector('.x-cs');
        if (cs && tbar.current) { const r = cs.getBoundingClientRect(); tbar.current.style.width = Math.min(100, Math.max(0, (innerHeight * .4 - r.top) / r.height * 100)) + '%'; }
      };
      el.addEventListener('scroll', on, { passive: true }); on();
      return () => el.removeEventListener('scroll', on);
    }, [id, gated]);
    useEffect(() => {
      const el = box.current; if (!el) return;
      const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const count = n => {
        const raw = n.dataset.count || ''; const m = raw.match(/^([^\d]*)([\d.,]+)([^\d]*)$/);
        if (!m || rm) return;
        const end = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, t0 = performance.now(), D = 1600;
        const step = t => { const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3); n.textContent = m[1] + (end * e).toFixed(dec) + m[3]; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        e.target.classList.add('in'); e.target.querySelectorAll('[data-count]').forEach(count);
        if (e.target.dataset.count) count(e.target);
      }), { root: el, threshold: .35 });
      const t = setTimeout(() => el.querySelectorAll('.x-anim, .x-met b, .x-mets').forEach(n => io.observe(n)), 60);
      return () => { clearTimeout(t); io.disconnect(); };
    }, [id, gated]);
    const jump = i => { const el = box.current, s = el.querySelectorAll('[data-sec]')[i]; if (s) el.scrollTo({ top: s.offsetTop - 70, behavior: 'smooth' }); };
    const demo = p.demo && window.DEMOS && DEMOS.find(d => d.id === p.demo);
    const n = String(idx + 1).padStart(2, '0');

    return (
      <div className="x-case" ref={box} role="dialog" aria-label={p.client + ' case study'}>
        <div className="x-case-bar x-wrap">
          <button className="x-btn" onClick={onClose} autoFocus>← Back</button>
          <span className="x-mono">{n} / {String(list.length).padStart(2, '0')} · {p.client}</span>
          <span className="x-sp" />
          {owner && <button className="x-btn" onClick={() => window.__studio && window.__studio()}>Edit content</button>}
          <button className="x-btn k" onClick={() => onOpen(next.id)}>Next →</button>
          <button className="x-x" onClick={onClose} aria-label="Close case study">×</button>
          <i className="x-prog" ref={prog} />
        </div>

        {gated ? <LockGate p={p} onOpen={() => bump(x => x + 1)} /> : <>
        <header className="x-band x-wrap">
          <span className="x-mono">Case study {n} — {p.client} · {p.year} · {p.discipline}</span>
          <h2>{p.title}</h2>
          <div className="x-met"><b data-count={p.headline.v}>{p.headline.v}</b><span>{p.headline.l}</span></div>
          <div className="x-meta"><div><b>Role</b>{p.role}</div><div><b>Dates</b>{p.dates}</div><div><b>Discipline</b>{p.discipline}</div></div>
        </header>
        <div className="x-hero-media x-wrap">
          {demo && (() => { try { return window.self === window.top; } catch (e) { return false; } })() ? <LiveEmbed key={'live-' + p.id} demo={demo} />
            : demo ? <a className="x-livecard" href={demo.url} target="_blank" rel="noopener"><img src={p.hero} alt={`${p.client} — live app preview`} /><span className="x-play">Open live app ↗</span></a>
            : <media-slot key={'hero-' + p.id} id={`r-${p.id}-hero`} ratio="16/9" cover src={p.hero || undefined} label={`${p.client} — hero image or video`}></media-slot>}
        </div>

        <div className="x-cbody x-wrap" key={'body-' + p.id}>
          <aside className="x-toc">
            <div className="x-bar"><i ref={tbar} /></div>
            {secs.map((s, i) => <button key={s + i} className={act === i ? 'on' : ''} onClick={() => jump(i)}>{s}</button>)}
          </aside>
          <div className="x-cs">
            <section data-sec>
              <span className="x-mono x-lab">01 — Story</span>
              <Rich as="p" className="x-lede" t={p.story} />
              {p.metrics && <div className="x-mets" style={{ marginTop: 32 }}>{p.metrics.map((m, i) => <div key={i} style={{ '--k': i }}><b data-count={m.v}>{m.v}</b><span>{m.l}</span></div>)}</div>}
            </section>
            <section>
              <span className="x-mono x-lab">{p.pivot.h}</span>
              <div className="x-pull"><Rich as="p" className="x-pq" t={p.pivot.b} /></div>
            </section>
            {p.sections.map((s, i) => (
              <React.Fragment key={s.k + i}>
                <section data-sec>
                  <span className="x-mono x-lab">{String(i + 2).padStart(2, '0')} — {s.k}</span>
                  {s.b.map((t, k) => <Rich key={k} as="p" className={k === 0 ? 'x-big' : ''} t={t} />)}
                  {s.list && <ul className="x-list">{s.list.map((x, k) => <li key={k}><Rich t={x} /></li>)}</ul>}
                  {s.after && <Rich as="p" t={s.after} />}
                  {(s.blocks || []).map((b, k) => <Block key={k} b={b} />)}
                </section>
                {i === 2 && p.shots && (
                  <div className="x-shots">
                    {p.shots.map((c, k) => (
                      <figure key={k}><media-slot id={`r-${p.id}-shot${k + 1}`} ratio="4/3" cover label={c}></media-slot>
                        <figcaption className="x-mono">{c}</figcaption></figure>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
            <section data-sec>
              <span className="x-mono x-lab">{String(p.sections.length + 2).padStart(2, '0')} — Result</span>
              <ul className="x-list">{p.result.map((r, k) => <li key={k}><Rich t={r} /></li>)}</ul>
              {p.reflection && <div className="x-pull" style={{ marginTop: 28 }}><span className="x-mono x-lab">Reflection</span><Rich as="p" className="x-pq" t={p.reflection} /></div>}
              <dl className="x-dl">{[['Role', p.role], ['Dates', p.dates], ['Discipline', p.discipline]].map(([k, v]) => <div key={k}><dt className="x-mono">{k}</dt><dd>{v}</dd></div>)}</dl>
              {owner && p.note && <div className="x-note">Note to self (only you see this) · {p.note}</div>}
            </section>
          </div>
        </div>

        <button className="x-next" onClick={() => onOpen(next.id)}>
          <span className="x-mono">Next case study — {next.client} · {next.year}</span>
          <b>{next.headline.v} →</b>
          <span className="t">{next.title}</span>
        </button>
        </>}
      </div>
    );
  }

  // simplified native view for visual design work — hero + write-up + gallery
  function VisualOverlay({ id, onClose, onOpen, owner }) {
    const list = window.PLAY || [];
    const idx = Math.max(0, list.findIndex(v => v.id === id));
    const v = list[idx]; const next = list[(idx + 1) % list.length];
    const box = useRef(null); const prog = useRef(null);
    useEffect(() => {
      const esc = e => e.key === 'Escape' && onClose();
      addEventListener('keydown', esc); document.documentElement.style.overflow = 'hidden';
      return () => { removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; };
    }, [onClose]);
    useEffect(() => {
      const el = box.current; if (!el) return; el.scrollTop = 0;
      const on = () => { const max = el.scrollHeight - el.clientHeight; if (prog.current) prog.current.style.width = (max > 0 ? el.scrollTop / max * 100 : 0) + '%'; };
      el.addEventListener('scroll', on, { passive: true }); return () => el.removeEventListener('scroll', on);
    }, [id]);
    if (!v) return null;
    const shots = (v.shots && v.shots.length ? v.shots : ['Key visual', 'Detail', 'In context']);
    const n = String(idx + 1).padStart(2, '0');
    return (
      <div className="x-case" ref={box} role="dialog" aria-label={v.co + ' visual design'}>
        <div className="x-case-bar x-wrap">
          <button className="x-btn" onClick={onClose} autoFocus>← Back</button>
          <span className="x-mono">Visual design · {n} / {String(list.length).padStart(2, '0')}</span>
          <span className="x-sp" />
          {owner && <button className="x-btn" onClick={() => window.__studio && window.__studio()}>Edit content</button>}
          {list.length > 1 && <button className="x-btn k" onClick={() => onOpen(next.id)}>Next →</button>}
          <button className="x-x" onClick={onClose} aria-label="Close">×</button>
          <i className="x-prog" ref={prog} />
        </div>
        <header className="x-band lt x-wrap">
          <span className="x-mono">{v.role}{v.year ? ' · ' + v.year : ''}</span>
          <h2>{v.co}</h2>
          {v.d && <p className="x-intro">{v.d}</p>}
        </header>
        <div className="x-vbody x-wrap">
          <div className="x-vgal">
            <figure className="w">{v.hero
              ? <video className="x-vhero" key={'vh-' + v.id} src={v.hero} controls autoPlay muted loop playsInline aria-label={`${v.co} — video`} />
              : <media-slot key={'vh-' + v.id} id={`play-${v.id}`} ratio="16/10" cover src={`assets/play/${v.id}.jpg`} label={`${v.co} — ${shots[0]}`}></media-slot>}</figure>
          </div>
          {v.body && <div className="x-cs"><p>{v.body}</p></div>}
          {(v.gal || []).length > 0 && <div className={'x-vgal' + (v.gal.length === 1 ? ' one' : '')}>
            {v.gal.map(([c, n, sz], k) => c.startsWith('## ')
              ? <div key={'h' + k} className="x-vgh"><h3>{c.slice(3)}</h3>{n && <p>{n}</p>}</div>
              : (
              <figure key={v.id + n} className={[typeof n === 'string' && /\.(jpe?g|png)$/.test(n) ? 'tallbox' : '', sz === 'w' ? 'w' : ''].join(' ').trim() || undefined}>{typeof n === 'string' && /\.(mp4|webm)$/.test(n)
                ? <video src={n} autoPlay muted loop playsInline aria-label={`${v.co} — ${c}`} />
                : <div className="x-vimg"><img src={typeof n === 'string' ? n : `assets/play/${v.id}-${n}.jpg`} alt={`${v.co} — ${c}`} loading="lazy"
                    onLoad={e => { const i = e.currentTarget; if (i.naturalHeight / i.naturalWidth > 1.9) i.closest('figure').classList.add('tall'); }} /></div>}
                <figcaption className="x-mono">{c}</figcaption></figure>
            ))}
          </div>}
          {v.url && <p style={{ fontSize: 14 }}><a href={v.url} target="_blank" rel="noreferrer">Full archive on danielvisual.com ↗<span className="x-sr"> (opens in new tab)</span></a></p>}
        </div>
        {list.length > 1 && <button className="x-next" onClick={() => onOpen(next.id)}>
          <span className="x-mono">Next — visual design</span><b>{next.co} →</b><span className="t">{next.role}</span>
        </button>}
      </div>
    );
  }

  // full-screen reader for large concierge answers (résumé, bio, summary, Crit Club)
  const PANEL_T = { resume: ['Résumé', 'Experience'], summary: ['Summary', 'In short'], bio: ['About', 'Who is Dan'], quest: ['Crit Club', 'Your call'], hiring: ['Hiring', 'Is he a fit?'], talk: ['Contact', 'Get in touch'] };
  function PanelOverlay({ panel, onClose }) {
    const box = useRef(null); const prog = useRef(null);
    useEffect(() => {
      const esc = e => e.key === 'Escape' && onClose();
      addEventListener('keydown', esc); document.documentElement.style.overflow = 'hidden';
      return () => { removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; };
    }, [onClose]);
    useEffect(() => {
      const el = box.current; if (!el) return; el.scrollTop = 0;
      const on = () => { const max = el.scrollHeight - el.clientHeight; if (prog.current) prog.current.style.width = (max > 0 ? el.scrollTop / max * 100 : 0) + '%'; };
      el.addEventListener('scroll', on, { passive: true }); return () => el.removeEventListener('scroll', on);
    }, [panel]);
    const C = window.PANELS && PANELS[panel]; const t = PANEL_T[panel] || [panel, ''];
    return (
      <div className="x-case" ref={box} role="dialog" aria-label={t[0]}>
        <div className="x-case-bar x-wrap">
          <button className="x-btn" onClick={onClose} autoFocus>← Back</button>
          <span className="x-mono">{t[0]}</span><span className="x-sp" />
          {panel === 'resume' && <a className="x-btn k" href="assets/Daniel_Tieu_Resume.pdf" download="Daniel_Tieu_Resume.pdf">Download PDF ↓</a>}
          <button className="x-x" onClick={onClose} aria-label="Close">×</button>
          <i className="x-prog" ref={prog} />
        </div>
        <div className="x-pbody x-wrap">{C ? React.createElement(C) : null}</div>
      </div>
    );
  }

  Object.assign(window, { CaseOverlay, VisualOverlay, PanelOverlay });
})();
