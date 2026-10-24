// v5/case.jsx — case-study overlay. Same content model as v3 (PROJECTS), same
// media-slot ids (r-<id>-hero, r-<id>-shotN) so existing uploads carry over.
(() => {
  const { useEffect, useRef, useState } = React;
  const num = s => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0;

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

  function CaseOverlay({ id, onClose, onOpen, owner }) {
    const list = [...PROJECTS.filter(p => !p.personal), ...PROJECTS.filter(p => p.personal)];
    const idx = Math.max(0, list.findIndex(p => p.id === id));
    const p = list[idx]; const next = list[(idx + 1) % list.length];
    const box = useRef(null); const prog = useRef(null); const tbar = useRef(null);
    const [act, setAct] = useState(0);
    const secs = ['Story', 'The pivot', ...p.sections.map(s => s.k), 'Result'];

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
    }, [id]);
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

        <header className="x-band x-wrap">
          <span className="x-mono">Case study {n} — {p.client} · {p.year} · {p.discipline}</span>
          <h2>{p.title}</h2>
          <div className="x-met"><b>{p.headline.v}</b><span>{p.headline.l}</span></div>
          <div className="x-meta"><div><b>Role</b>{p.role}</div><div><b>Dates</b>{p.dates}</div><div><b>Discipline</b>{p.discipline}</div></div>
        </header>
        <div className="x-hero-media x-wrap">
          {demo ? <LiveEmbed demo={demo} />
            : <media-slot id={`r-${p.id}-hero`} ratio="16/9" cover label={`${p.client} — hero image or video`}></media-slot>}
        </div>

        <div className="x-cbody x-wrap">
          <aside className="x-toc">
            <div className="x-bar"><i ref={tbar} /></div>
            {secs.map((s, i) => <button key={s + i} className={act === i ? 'on' : ''} onClick={() => jump(i)}>{s}</button>)}
          </aside>
          <div className="x-cs">
            <section data-sec>
              <span className="x-mono x-lab">01 — Story</span>
              <Rich as="p" className="x-lede" t={p.story} />
              {p.metrics && <div className="x-mets" style={{ marginTop: 32 }}>{p.metrics.map((m, i) => <div key={i}><b>{m.v}</b><span>{m.l}</span></div>)}</div>}
            </section>
            <section data-sec>
              <span className="x-mono x-lab">02 — {p.pivot.h}</span>
              <div className="x-pull"><Rich as="p" className="x-pq" t={p.pivot.b} /></div>
            </section>
            {p.sections.map((s, i) => (
              <React.Fragment key={s.k + i}>
                <section data-sec>
                  <span className="x-mono x-lab">{String(i + 3).padStart(2, '0')} — {s.k}</span>
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
              <span className="x-mono x-lab">{String(p.sections.length + 3).padStart(2, '0')} — Result</span>
              <ul className="x-list">{p.result.map((r, k) => <li key={k}><Rich t={r} /></li>)}</ul>
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
            <figure className="w"><media-slot id={`play-${v.id}`} ratio="16/9" cover label={`${v.co} — ${shots[0]}`}></media-slot></figure>
          </div>
          {v.body && <div className="x-cs"><Rich as="div" t={v.body} /></div>}
          {shots.length > 1 && <div className="x-vgal">
            {shots.slice(1).map((c, k) => (
              <figure key={k}><media-slot id={`play-${v.id}-shot${k + 1}`} ratio="4/3" cover label={`${v.co} — ${c}`}></media-slot>
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
