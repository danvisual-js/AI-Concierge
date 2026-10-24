// v5/concierge.jsx — work cards + the concierge. Visitors type into an inline
// bar; the conversation only opens (as a movable, resizable window) after the
// first submit. Brain, intents, panels and case data are shared with v3.
(() => {
  const { useState, useEffect, useRef } = React;

  // card thumbnail: mirrors the case-study hero, or its own upload. Shape,
  // fit and focal point come from the owner's media editor (default landscape).
  function Thumb({ p, owner, children, noShape }) {
    const TK = 'dv3.thumb.' + p.id;
    const [mode, setMode] = useState(() => localStorage.getItem(TK) || 'hero');
    const hero = useMedia('r-' + p.id + '-hero'), own = useMedia('case-' + p.id);
    const m = mode === 'hero' ? (hero && hero.src ? hero : own) : (own && own.src ? own : hero);
    const key = 'thumb-' + p.id, f = getFx(key);
    const fig = [mode === 'hero' ? hero : own, mode === 'hero' ? own : hero].find(x => x && !x.src && x.link && isFigma(x.link));
    const edit = e => { e.stopPropagation(); e.preventDefault(); openEd(mode); };
    const openEd = mode => {
      const src = mode === 'hero' ? 'r-' + p.id + '-hero' : 'case-' + p.id;
      window.__editMedia && __editMedia({ title: p.client + ' — thumbnail', shapes: true, link: true, ctx: 'thumb', render: () => <span className="x-ed-card"><Thumb p={p} /></span>,
        items: [{ id: src, key, label: mode === 'hero' ? 'Using case-study hero' : 'Using own upload' }],
        extra: <div className="x-ed-g"><span className="x-mono">Image source</span><div className="x-ed-row">{[['hero', 'Case-study hero'], ['own', 'Own thumbnail upload']].map(([v, l]) =>
          <button key={v} className={'x-chip' + (mode === v ? ' on' : '')} onClick={() => { localStorage.setItem(TK, v); setMode(v); openEd(v); }}>{l}</button>)}</div>
          <p className="x-ed-note">Switching source reopens the editor on that image.</p></div> });
    };
    return (
      <span className="x-thumb" style={noShape ? undefined : { aspectRatio: f.shape }}>
        {m && m.src ? <MediaFill m={m} style={fxStyle(f)} />
          : fig ? <iframe className="x-fig" src={embedUrl(fig.link)} title={p.client + ' Figma'} loading="lazy" tabIndex={-1} />
          : owner ? <media-slot id={`case-${p.id}`} ratio={f.shape} cover lock size="full" frame="none" fit="cover" label={`${p.client} — cover image`}></media-slot>
          : <span className="x-tblank">{p.client}</span>}
        {children}
        {owner && <span className="x-own" role="button" tabIndex={0} onClick={edit} onKeyDown={e => e.key === 'Enter' && edit(e)}>Edit image</span>}
      </span>
    );
  }

  // hover / focus reveals the work's headline stat over the image
  function WorkCard({ p, i, onOpen, owner, sm, tall }) {
        return (
      <button className={'x-card' + (sm ? ' sm' : '') + (tall ? ' tall' : '')} onClick={() => onOpen(p.id)} aria-label={`${p.client}: ${p.title}. ${p.headline.v} ${p.headline.l}. Open case study`}>
        <Thumb p={p} owner={owner}>
          <span className="x-hov" aria-hidden="true">
            <b>{p.headline.v}</b><span className="l">{p.headline.l}</span>
          </span>
        </Thumb>
        <span className="x-cb">
          <span className="x-mono">{i != null ? String(i + 1).padStart(2, '0') + ' · ' : ''}{p.client} · {p.year}</span>
          <h3>{p.title}</h3>
          <span className="x-tag">{p.discipline}</span>
        </span>
      </button>
    );
  }

  const Spark = () => <svg className="x-spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" opacity=".7" /></svg>;
  const Arrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

  // the inline bar — a real input; nothing opens until they submit
  function AskBar({ onAsk, placeholder = 'Ask my concierge anything about my work…', id, small }) {
    const [v, setV] = useState('');
    const submit = e => { e.preventDefault(); const q = v.trim(); if (!q) return; setV(''); onAsk({ q }); };
    return (
      <form className={'x-pill' + (small ? ' sm' : '')} onSubmit={submit} role="search">
        <Spark />
        <label htmlFor={id} className="x-sr">Ask the concierge</label>
        <input id={id} className="x-askin" value={v} onChange={e => setV(e.target.value)} placeholder={placeholder} autoComplete="off" />
        {!small && <kbd aria-hidden="true">⌘K</kbd>}
        <button className="x-go" aria-label="Send question"><Arrow /></button>
      </form>
    );
  }

  const WK = 'dv5.win';
  const defBox = () => {
    const w = Math.min(560, innerWidth - 32), h = Math.min(640, innerHeight - 96);
    return { x: innerWidth - w - 24, y: innerHeight - h - 24, w, h };
  };
  const clampBox = b => {
    const w = Math.max(320, Math.min(b.w, innerWidth - 16)), h = Math.max(260, Math.min(b.h, innerHeight - 16));
    return { w, h, x: Math.max(8, Math.min(b.x, innerWidth - w - 8)), y: Math.max(8, Math.min(b.y, innerHeight - h - 8)) };
  };

  const BIG = ['resume', 'summary', 'bio', 'quest'];
  function Concierge({ ask, min, setMin, onClose, onRead, onGo, onPanel, owner }) {
    const [msgs, setMsgs] = useState([]);
    const [busy, setBusy] = useState(false);
    const [v, setV] = useState('');
    const [max, setMax] = useState(false);
    const [box, setBox] = useState(() => { try { return clampBox(JSON.parse(localStorage.getItem(WK)) || defBox()); } catch (e) { return clampBox(defBox()); } });
    const body = useRef(null); const inp = useRef(null); const msgsRef = useRef(msgs); const winRef = useRef(null);
    msgsRef.current = msgs;
    const I = () => window.INTENTS || [];
    const byId = id => I().find(x => x.id === id);

    useEffect(() => { localStorage.setItem(WK, JSON.stringify(box)); }, [box]);
    useEffect(() => { const r = () => setBox(b => clampBox(b)); addEventListener('resize', r); return () => removeEventListener('resize', r); }, []);
    useEffect(() => { const b = body.current; if (b) b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }); }, [msgs, busy]);
    useEffect(() => {
      if (!ask) return;
      if (ask.intent) { const it = byId(ask.intent); if (it) answer(it, it.q); }
      else if (ask.q) send(ask.q);
      setTimeout(() => inp.current && inp.current.focus({ preventScroll: true }), 60);
    }, [ask && ask.n]);
    useEffect(() => { if (!min) setTimeout(() => inp.current && inp.current.focus({ preventScroll: true }), 60); }, [min]);

    // drag (title bar) + resize (corner) with pointer events
    const drag = (e, kind) => {
      if (max || e.button !== 0 || e.target.closest('button')) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY, b0 = box;
      const mv = ev => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (kind === 'move') { setBox(clampBox({ ...b0, x: b0.x + dx, y: b0.y + dy })); return; }
        let { x, y, w, h } = b0;
        if (kind.includes('e')) w = b0.w + dx;
        if (kind.includes('s')) h = b0.h + dy;
        if (kind.includes('w')) { w = Math.max(320, b0.w - dx); x = b0.x + b0.w - w; }
        if (kind.includes('n')) { h = Math.max(260, b0.h - dy); y = b0.y + b0.h - h; }
        setBox(clampBox({ x, y, w, h }));
      };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); document.body.classList.remove('x-dragging'); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up); document.body.classList.add('x-dragging');
    };
    // keyboard: arrows move, shift+arrows resize
    const keys = e => {
      const d = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
      if (!d || max) return; e.preventDefault();
      setBox(b => clampBox(e.shiftKey ? { ...b, w: b.w + d[0], h: b.h + d[1] } : { ...b, x: b.x + d[0], y: b.y + d[1] }));
    };

    const push = m => setMsgs(x => [...x, m]);
    const big = it => it && it.kind === 'panel' && BIG.includes(it.panel);
    const reply = it => { push({ say: it.say, intent: it }); if (big(it)) setTimeout(() => onPanel(it.panel), 350); };
    const answer = (it, q) => { push({ me: q }); setBusy(true); setTimeout(() => { setBusy(false); reply(it); }, 650); };
    const send = async q => {
      push({ me: q }); setBusy(true);
      const low = q.toLowerCase();
      const named = PROJECTS.find(p => low.includes(p.client.toLowerCase()) || low.includes(p.id));
      if (named && /\b(show|open|read|see|launch|view|walk|tell|case|play)\b/i.test(q)) {
        await new Promise(res => setTimeout(res, 500)); setBusy(false);
        push({ say: `Opening ${named.client} — ${named.headline.v}, ${named.headline.l}.`, intent: { kind: 'cases', only: [named.id] } });
        setTimeout(() => onRead(named.id), 900); return;
      }
      const matchIntent = s => {
        const own = I().find(i => typeof i.keys === 'string' && i.keys.split(',').some(k => k.trim() && s.toLowerCase().includes(k.trim().toLowerCase())));
        const hit = own ? [null, own.id] : (window.MATCH || []).find(([re]) => re.test(s));
        if (!hit) return null;
        const it = byId(hit[1]);
        return it ? { ...it, strong: /^(show|see|open|view|give|read|play)\b/i.test(s.trim()) || s.trim().split(/\s+/).length <= 4 } : null;
      };
      let r;
      try { r = await window.think(q, msgsRef.current.filter(m => m.me || m.say).map(m => ({ role: m.me ? 'me' : 'ai', text: m.me || m.say })), matchIntent); }
      catch (e) { r = { type: 'talk', say: 'Something went sideways on my end — try again, or tap a shortcut.' }; }
      await new Promise(res => setTimeout(res, 400));
      setBusy(false);
      if (r.type === 'route' && r.topic) { const it = byId(r.topic) || I()[0]; push({ say: r.say || it.say, intent: it }); if (big(it)) setTimeout(() => onPanel(it.panel), 350); }
      else if (r.type === 'confirm') push({ say: r.say, confirm: { caseId: r.caseId, topic: r.topic, ask: r.ask } });
      else push({ say: r.say, chat: true });
    };
    const submit = e => { e.preventDefault(); const q = v.trim(); if (!q || busy) return; setV(''); send(q); };
    const accept = c => {
      if (c.caseId) { const p = PROJECTS.find(x => x.id === c.caseId); push({ me: 'Yes, open it' }); if (p) { push({ say: `Opening ${p.client}.`, intent: { kind: 'cases', only: [p.id] } }); setTimeout(() => onRead(p.id), 450); } }
      else { const it = byId(c.topic || 'all') || I()[0]; answer(it, 'Yes — ' + it.q.toLowerCase()); }
    };
    const work = p => !p.personal && !p.hackathon;
    const casesFor = it => it.only ? PROJECTS.filter(p => it.only.includes(p.id))
      : it.cat ? PROJECTS.filter(p => (p.cats || []).includes(it.cat)) : PROJECTS.filter(work);
    const chips = ids => ids.map(id => byId(id)).filter(Boolean).map(it => <button key={it.id} className="x-chip" onClick={() => answer(it, it.q)}>{it.q}</button>);
    const primary = I().filter(i => i.primary).map(i => i.id);

    const result = (m, last) => {
      const it = m.intent; if (!it) return null;
      if (it.kind === 'cases') {
        const list = casesFor(it);
        return <>
          <div className="x-cg-grid">{list.map(p => <WorkCard key={p.id} p={p} sm owner={owner} onOpen={onRead} />)}</div>
          {last && !it.only && <div className="x-acts"><button className="x-chip v" onClick={() => onGo('work')}>See them on the page ↓</button></div>}
        </>;
      }
      if (it.kind === 'panel' && BIG.includes(it.panel)) return <div className="x-acts"><button className="x-chip v" onClick={() => onPanel(it.panel)}>Open {({ resume: 'the résumé', summary: 'the summary', bio: 'the bio', quest: 'Crit Club' })[it.panel]} ⤢</button></div>;
      if (it.kind === 'panel' && window.PANELS && PANELS[it.panel]) return <div className="x-cg-panel">{React.createElement(PANELS[it.panel])}</div>;
      if (it.kind === 'play') return <>
        <div className="x-cg-grid">{(window.PLAY || []).map(p => (
          <a key={p.id} className="x-card sm" href={p.url} target="_blank" rel="noreferrer">
            <span className="x-thumb"><media-slot id={`play-${p.id}`} ratio="16/10" cover lock size="full" frame="none" fit="cover" label={`${p.co} — ${p.role}`}></media-slot></span>
            <span className="x-cb"><span className="x-mono">{p.role}</span><h3>{p.co}</h3></span>
          </a>))}</div>
        {last && <div className="x-acts"><button className="x-chip v" onClick={() => onGo('visual')}>Open the gallery ↓</button></div>}
      </>;
      if (it.kind === 'demos') return <>
        <div className="x-cg-grid">{PROJECTS.filter(p => p.personal || p.hackathon).map(p => <WorkCard key={p.id} p={p} sm owner={owner} onOpen={onRead} />)}</div>
        {last && <div className="x-acts"><button className="x-chip v" onClick={() => onGo('labs')}>Launch them on the page ↓</button></div>}
      </>;
      return null;
    };

    const style = max ? { left: 'calc(var(--xr) + 12px)', top: 12, width: 'calc(100vw - var(--xr) - 24px)', height: 'calc(100vh - 24px)' }
      : { left: box.x, top: box.y, width: box.w, height: box.h };

    return (
      <div ref={winRef} className={'x-win' + (min ? ' min' : '') + (max ? ' max' : '')} style={style} role="dialog" aria-label="Concierge chat" aria-modal="false">
        <div className="x-win-h" onPointerDown={e => drag(e, 'move')} onDoubleClick={() => setMax(m => !m)} tabIndex={0} onKeyDown={keys}
          aria-label="Concierge window. Drag, or use arrow keys to move and shift plus arrow keys to resize." >
          <Spark /><b>concierge</b><span className="x-mono">~/dan-tieu</span><span className="x-sp" />
          {msgs.length > 0 && <button onClick={() => setMsgs([])} aria-label="Start a new chat">New</button>}
          <button onClick={() => setMin(true)} aria-label="Minimise concierge">–</button>
          <button onClick={() => setMax(m => !m)} aria-label={max ? 'Restore window size' : 'Maximise window'}>{max ? '❐' : '□'}</button>
          <button onClick={onClose} aria-label="Close concierge">✕</button>
        </div>
        <div className="x-cg-b" ref={body} role="log" aria-live="polite">
          {msgs.map((m, i) => m.me ? <div key={i} className="x-m me"><span className="x-sr">You: </span>{m.me}</div> : (
            <div key={i} className="x-m ai">
              <p><span className="x-sr">Concierge: </span>{m.say}</p>
              {m.confirm && <>
                {m.confirm.ask && <p>{m.confirm.ask}</p>}
                <div className="x-acts">
                  <button className="x-chip v" onClick={() => accept(m.confirm)}>{m.confirm.caseId ? 'Yes, open the case study' : 'Yes, show me'}</button>
                  <button className="x-chip" onClick={() => answer(I()[0], 'Show me everything instead')}>Show everything instead</button>
                </div>
              </>}
              {result(m, i === msgs.length - 1)}
              {i === msgs.length - 1 && !busy && (m.chat || m.intent) && (() => {
                const k = m.intent ? (m.intent.kind === 'panel' ? m.intent.panel : m.intent.kind) : null;
                const nx = k && window.NEXT && NEXT[k];
                return <div className="x-acts">{chips(nx ? nx.ids : (m.chat ? ['all', 'resume', 'hiring'] : primary))}</div>;
              })()}
            </div>
          ))}
          {busy && <span className="x-dots" aria-label="Concierge is typing"><i /><i /><i /></span>}
        </div>
        <div className="x-cg-f">
          <form onSubmit={submit}>
            <label htmlFor="x-cg-in" className="x-sr">Message the concierge</label>
            <input id="x-cg-in" ref={inp} value={v} onChange={e => setV(e.target.value)} placeholder="Ask a follow-up…" autoComplete="off" />
            <button className="x-send" aria-label="Send"><Arrow /></button>
          </form>
        </div>
        {!max && ['nw', 'ne', 'sw', 'se'].map(d => <span key={d} className={'x-grip ' + d} onPointerDown={e => drag(e, d)} aria-hidden="true" />)}
      </div>
    );
  }

  Object.assign(window, { Thumb, WorkCard, AskBar, Concierge, Spark });
})();
