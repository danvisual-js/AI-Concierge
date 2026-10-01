// chat.jsx — the concierge shell: ambient field, left icon rail, hero greeting
// that becomes a chat thread, thinking + streamed answers, and result cards that
// open the case-study reader. Exports window.App.
(() => {
  const { useState, useEffect, useRef, useCallback } = React;

  // violet / ink / paper only — no secondary hues
  const THEMES = {
    base: ['#6d4aff', '#a07cff', '#5b3fd6', '#3f2f7a'],
    ai: ['#6d4aff', '#8f6cff', '#b28bff', '#5b3fd6'],
    health: ['#5b3fd6', '#6d4aff', '#a07cff', '#3f2f7a'],
    numbers: ['#6d4aff', '#5b3fd6', '#a07cff', '#3f2f7a'],
    ecom: ['#a07cff', '#6d4aff', '#5b3fd6', '#3f2f7a'],
    enterprise: ['#5b3fd6', '#6d4aff', '#a07cff', '#9d95ab'],
    zto: ['#6d4aff', '#b28bff', '#5b3fd6', '#3f2f7a'],
  };
  const ACCENT = { base: '#6d4aff', ai: '#6d4aff', health: '#5b3fd6', numbers: '#5b3fd6',
    ecom: '#6d4aff', enterprise: '#5b3fd6', zto: '#6d4aff' };
  const OWNER_CODE = 'dan';

  const INTENTS = [
    { id: 'all', q: 'Walk me through Dan’s best work', primary: true, kind: 'cases', cat: null, theme: 'base',
      say: 'Six client case studies plus a hackathon build, newest first. Each leads with the story, then the UX record — problem, discovery, design, solution, testing. Tap any card to read it.' },
    { id: 'personal', q: 'What has he built with AI?', primary: true, kind: 'demos', theme: 'ai',
      say: 'Two things built outside client work — a verdict-first stock screener and a portfolio you walk through as an RPG. Both designed and shipped solo with AI-assisted development, and both are live and playable right now.' },
    { id: 'play', q: 'Show me his visual design work', more: true, kind: 'play', theme: 'base',
      say: 'Five separate visual design roles — Sephora, Old Navy, Amazon WFS, Live Nation and Vax Smart. Each one its own client and its own design language, and deliberately kept apart from the UX case studies.' },
    { id: 'resume', q: 'Show me his résumé and experience', more: true, kind: 'panel', panel: 'resume', theme: 'enterprise',
      say: 'Twelve years, newest first — with what actually moved in each role.' },
    { id: 'summary', q: 'Summarize his experience for me', kind: 'panel', panel: 'summary', theme: 'enterprise',
      say: 'Twelve years, compressed into the three things that actually repeat.' },
    { id: 'hiring', q: 'I’m hiring — is he a fit?', primary: true, kind: 'panel', panel: 'hiring', theme: 'numbers', alt: true,
      say: 'Tell me about the role and the first problem this person owns. Dan reads these himself and replies within 48 hours.' },
    { id: 'ai', q: 'Show me the AI product work', more: true, kind: 'cases', cat: 'ai', theme: 'ai',
      say: 'Doctronic — the first AI-authorized prescription refill flow in the US. Dan treated the trust layer as a conversion surface rather than a compliance checkbox.' },
    { id: 'numbers', q: 'Which work moved real numbers?', more: true, kind: 'cases', cat: 'numbers', theme: 'numbers',
      say: 'The work where measurement was the point: 26.1% funnel conversion, 81% → 34% abandon rate, +25% portfolio conversion YoY.' },
    { id: 'zto', q: 'What has he shipped 0-to-1?', kind: 'cases', cat: 'zero-to-one', theme: 'zto',
      say: 'Three built from nothing: a new AI interaction pattern, a subscription platform under compliance review, and a brand in a category with no precedent.' },
    { id: 'health', q: 'How does he work under legal review?', more: true, kind: 'cases', cat: 'health', theme: 'health',
      say: 'Two shipped with legal and clinical in the room daily — where the constraint itself was the design problem.' },
    { id: 'enterprise', q: 'Show me enterprise and internal tools', kind: 'cases', cat: 'enterprise', theme: 'enterprise',
      say: 'Tools for people mid-shift: search inside a POS used by 5,000 associates, five-minute training for 30,000, scheduling that needs no app.' },
    { id: 'ecom', q: 'What about brand and eCommerce?', kind: 'cases', cat: 'ecom', theme: 'ecom',
      say: 'Stripes Beauty and the wider Amyris portfolio — +25% conversion, −13% cart abandonment YoY.' },
    { id: 'bio', q: 'Who is Dan, in 60 seconds?', kind: 'panel', panel: 'bio', theme: 'base', say: 'The short version, then the longer one.' },
    { id: 'quest', q: 'Put me in the hot seat — Crit Club', more: true, kind: 'panel', panel: 'quest', theme: 'ai',
      say: 'Crit Club — three real decisions from shipped work. Pick what you would have done and I’ll tell you what actually happened.' },
    { id: 'talk', q: 'How do I get in touch?', kind: 'panel', panel: 'talk', theme: 'health', say: 'What it is, who it’s for, and what’s stuck — that’s plenty.' },
  ];

  const MATCH = [
    [/summar|tl;?dr|in short|highlight|gist|recap/i, 'summary'],
    [/resum|cv|experience|background/i, 'resume'], [/who is|about (dan|you)|bio/i, 'bio'],
    [/game|quest|crit club|crit|play the|quiz|hot seat/i, 'quest'], [/hir|role|job|offer|opening|position|recruit/i, 'hiring'],
    [/contact|talk|email|reach|call/i, 'talk'],
    [/demo|live|try it|playable|prototype|screener|stock|rpg|\bgame\b|play it|side project|own time|personal|built with ai|hackathon|labs/i, 'personal'],
    [/visual|graphic|brand|campaign|editorial|motion|illustrat|photo|packag|\bplay\b/i, 'play'],
    [/\bai\b|llm|agent|doctronic|trust/i, 'ai'],
    [/health|telehealth|medical|goodrx|pharma|legal|complian|regulat/i, 'health'],
    [/0-?to-?1|zero to one|founding|from scratch|greenfield/i, 'zto'],
    [/number|metric|conversion|result|impact|funnel|roi|proof|data/i, 'numbers'],
    [/brand|ecom|commerce|stripes|dtc|shop/i, 'ecom'],
    [/enterprise|internal|pos|admin|b2b|schedul|train|sephora|est[ée]e|quicken/i, 'enterprise'],
  ];

  const STATUS = ['reading the brief', 'pulling the relevant work', 'checking the numbers', 'laying it out'];

  const ICONS = {
    snd: 'M5 10v4h3l4 3V7l-4 3zM16 9.5a3.6 3.6 0 0 1 0 5M18.4 7a7 7 0 0 1 0 10',
    sndoff: 'M5 10v4h3l4 3V7l-4 3zM16.5 10l4 4m0-4-4 4',
    home: 'M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
    work: 'M4 8h16v11H4zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 13h16',
    doc: 'M7 3h7l4 4v14H7zM14 3v5h4M10 13h6M10 17h6',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0',
    play: 'M9 6.5 17 12l-8 5.5zM3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    device: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM11 18h2',
    dice: 'M4 8.5 12 4l8 4.5v7L12 20l-8-4.5zM12 12v8M4 8.5 12 12l8-3.5',
    sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m11.4 0 1.4 1.4M4.9 4.9l1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
    acct: 'M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM5.5 20a6.5 6.5 0 0 1 13 0M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  };

  function Ambient({ thinking }) {
    return (
      <div id="amb" className={thinking ? 'think' : ''}>
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
        <div className="rings"><i /><i /><i /><i /></div>
        <div className="scan" />
      </div>
    );
  }

  function ripple(x, y) {
    const el = document.createElement('div');
    el.className = 'ripple';
    el.style.left = (x || innerWidth / 2) + 'px'; el.style.top = (y || innerHeight / 2) + 'px';
    el.style.transform = 'translate(-50%,-50%)';
    document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
  }
  window.waveBurst = (x, y) => ripple(x, y);
  window.wavePulse = (x, y) => ripple(x, y);

  function SoundBtn() {
    const [on, setOn] = useState(() => !window.dvFx || window.dvFx.on);
    return (
      <button onClick={() => { const v = !on; setOn(v); window.dvFx && window.dvFx.set(v); }}
        aria-pressed={on} aria-label={on ? 'Mute interface sound' : 'Unmute interface sound'}>
        <svg viewBox="0 0 24 24"><path d={ICONS[on ? 'snd' : 'sndoff']} /></svg>
        <span className="tip">{on ? 'Sound on' : 'Sound off'}</span>
      </button>
    );
  }

  function Rail({ active, go, dark, setDark, showPlay, owner, onAccount }) {
    const items = [['home', 'Home', 'home'], ['all', 'Case studies', 'work'], ['personal', 'Labs · built with AI', 'device'],
      ...(showPlay ? [['play', 'Visual design', 'play']] : []),
      ['resume', 'Résumé', 'doc'], ['bio', 'About', 'user'],
      ['quest', 'Crit Club', 'dice'], ['talk', 'Contact', 'mail']];
    return (
      <nav className="rail">
        {items.map(([id, label, icon]) => (
          <button key={id} className={active === id ? 'on' : ''} onClick={e => go(id, e)} aria-label={label}>
            <svg viewBox="0 0 24 24"><path d={ICONS[icon]} /></svg>
            <span className="tip">{label}</span>
          </button>
        ))}
        <button onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} style={{ marginTop: 'auto' }}>
          <svg viewBox="0 0 24 24"><path d={ICONS[dark ? 'sun' : 'moon']} /></svg>
          <span className="tip">{dark ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <SoundBtn />
        <button className={'acct-btn' + (owner ? ' live' : '')} onClick={onAccount}
          aria-label={owner ? 'Signed in — editing enabled' : 'Sign in'}>
          <svg viewBox="0 0 24 24"><path d={ICONS.acct} /></svg>
          {owner && <i className="acct-dot" />}
          <span className="tip">{owner ? 'Signed in · editing' : 'Sign in'}</span>
        </button>
      </nav>
    );
  }

  // light owner gate: keeps the edit affordance out of the visitor's way and off
  // the chat input. Not real auth — it guards a local-only editing mode.
  function AccountSheet({ owner, onClose, onLogos }) {
    const cloud = window.dvCloud && window.dvCloud.enabled;
    const [pw, setPw] = useState('');
    const [err, setErr] = useState(false);
    const [sent, setSent] = useState(false);
    const [mig, setMig] = useState('');
    const submit = async (e) => {
      e.preventDefault();
      if (cloud) {
        try {
          const r = await window.dvCloud.signIn(pw.trim());
          setErr(false);
          if (r === 'already') { window.dvOwner.set(true); onClose(); } else setSent(true);
        } catch (x) { setErr(x.message || 'Couldn’t send the link.'); }
        return;
      }
      if (pw.trim().toLowerCase() === OWNER_CODE) { window.dvOwner.set(true); setPw(''); onClose(); }
      else { setErr(true); setPw(''); }
    };
    const migrate = async () => {
      setMig('Uploading…');
      try { const n = await window.dvCloud.migrate((i, t) => setMig(`Uploading ${i} / ${t}…`)); setMig(`✓ ${n} items now live`); }
      catch (x) { setMig('Failed: ' + x.message); }
    };
    useEffect(() => {
      const k = e => e.key === 'Escape' && onClose();
      addEventListener('keydown', k); return () => removeEventListener('keydown', k);
    }, [onClose]);
    return (
      <div className="acct-scrim" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="acct" role="dialog" aria-label="Account">
          <span className="av acct-av"><AiMark /></span>
          {owner ? (
            <>
              <h3>You’re signed in</h3>
              <p>{cloud
                ? <>Editing is on as {window.dvCloud.email}. Uploads and changes publish live for every visitor.</>
                : <>Editing is on — image slots accept drops and text is editable across the site. Changes save to this browser.</>}</p>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 4 }}>
                <button className="btn solid" onClick={onLogos}><span>Manage logos</span></button>
                {cloud && <button className="btn" onClick={migrate} title="Push anything made in this browser before going live"><span>Publish local edits</span></button>}
                <button className="btn" onClick={() => { cloud ? window.dvCloud.signOut() : window.dvOwner.set(false); onClose(); }}><span>Sign out</span></button>
                <button className="btn" onClick={onClose}><span>Keep editing</span></button>
              </div>
              {mig && <p className="mono" style={{ fontSize: 11 }}>{mig}</p>}
            </>
          ) : (
            <>
              <h3>Owner sign-in</h3>
              <p>{cloud
                ? 'Visitors don’t need this. Enter your email and we’ll send a one-tap sign-in link.'
                : 'Visitors don’t need this. Signing in turns on image drops and inline text editing for this browser.'}</p>
              {sent ? <p className="mono" style={{ fontSize: 11 }}>Link sent to {pw}. Open it on this device.</p> : (
              <form onSubmit={submit} style={{ display: 'grid', gap: 14, marginTop: 4 }}>
                <div className={'field' + (pw ? ' on' : '')}>
                  <label htmlFor="ownerpw">{cloud ? 'Email' : 'Passcode'}</label>
                  <input id="ownerpw" type={cloud ? 'email' : 'password'} value={pw} autoFocus autoComplete={cloud ? 'email' : 'current-password'}
                    onChange={e => { setPw(e.target.value); setErr(false); }} />
                </div>
                {err && <p className="mono" style={{ color: 'var(--ink)', fontSize: 11 }}>{cloud ? err : 'That’s not it — try again.'}</p>}
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  <button className="btn solid" type="submit"><span>{cloud ? 'Send link' : 'Sign in'}</span></button>
                  <button className="btn" type="button" onClick={onClose}><span>Cancel</span></button>
                </div>
              </form>)}
            </>
          )}
          <p className="note" style={{ marginTop: 6 }}>Shortcut: ⌥⇧E toggles editing once signed in.</p>
        </div>
      </div>
    );
  }

  function Composer({ onSend, autoFocus, compact }) {
    const [v, setV] = useState('');
    const [i, setI] = useState(0);
    const PH = ['Ask me anything about Dan’s work…', 'What did he do at Doctronic?', 'Where did conversion actually move?', 'Is he open to a role?'];
    useEffect(() => { const t = setInterval(() => setI(k => (k + 1) % PH.length), 3600); return () => clearInterval(t); }, []);
    return (
      <form className="composer" onSubmit={e => { e.preventDefault(); if (!v.trim()) return; onSend(v.trim(), e); setV(''); }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', flex: '0 0 auto',
          boxShadow: '0 0 0 4px color-mix(in oklab,var(--accent) 18%,transparent)' }} />
        <input value={v} autoFocus={autoFocus} onChange={e => setV(e.target.value)} placeholder={PH[i]} aria-label="Ask the concierge" />
        <button className="send" type="submit" aria-label="Send">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 5l7 7-7 7" /></svg>
        </button>
      </form>
    );
  }

  function Suggestions({ onPick, open, setOpen }) {
    // deliberately short — three lines max; broader prompts live in the rail
    const primary = INTENTS.filter(i => i.primary);
    const rest = INTENTS.filter(i => i.more);
    return (
      <div className="askbar center">
        {primary.map((it, i) => (
          <button key={it.id} className="chip" onClick={e => onPick(it, e)}
            style={{ animation: `up .6s cubic-bezier(.16,1,.3,1) ${240 + i * 60}ms both` }}>{it.q}</button>
        ))}
        {open && rest.map((it, i) => (
          <button key={it.id} className="chip" onClick={e => onPick(it, e)}
            style={{ animation: `up .45s cubic-bezier(.16,1,.3,1) ${i * 40}ms both` }}>{it.q}</button>
        ))}
        <button className={'expand' + (open ? ' on' : '')} onClick={() => setOpen(!open)} aria-expanded={open}
          style={{ animation: 'up .6s cubic-bezier(.16,1,.3,1) 480ms both' }}>
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          {open ? 'Close' : rest.length + ' more'}
        </button>
      </div>
    );
  }

  // where the concierge points you next, per result type — keeps people in the
  // conversation instead of dead-ending on a panel
  const NEXT = {
    cases: { ask: 'That’s the client work — but it isn’t all of it. Want to see what he builds when nobody’s briefing him?',
      ids: ['personal', 'play'], primary: 'personal' },
    demos: { ask: 'Want to see the same thinking applied to work at scale — or put him on the spot?',
      ids: ['all', 'quest', 'hiring'], primary: 'all' },
    play: { ask: 'Want to see how that visual craft shows up in shipped product work?',
      ids: ['all', 'personal', 'hiring'], primary: 'all' },
    resume: { ask: 'Want me to summarize twelve years into the parts that actually matter?',
      ids: ['summary', 'all', 'hiring'], primary: 'summary' },
    summary: { ask: 'Want to see the work those years produced?',
      ids: ['all', 'numbers', 'hiring'], primary: 'all' },
    bio: { ask: 'Where do you want to go next?',
      ids: ['all', 'personal', 'quest'], primary: 'all' },
    quest: null,
    talk: { ask: 'While that’s with you — want a quick tour of the work?',
      ids: ['all', 'resume'], primary: 'all' },
    hiring: { ask: 'Want the receipts while you’re deciding?',
      ids: ['numbers', 'resume', 'all'], primary: 'numbers' },
  };
  const nextKey = it => (it.kind === 'panel' ? it.panel : it.kind);

  function Nudge({ ask, ids, onPick, open, setOpen, all }) {
    return (
      <div className="nudge">
        {ask && <p className="nudge-ask">{ask}</p>}
        <div className="askbar">
          {(open ? all : ids).map((id, i) => {
            const it = INTENTS.find(x => x.id === id); if (!it) return null;
            return <button key={id} className="chip" onClick={e => onPick(it, e)}
              style={open ? { animation: `up .4s cubic-bezier(.16,1,.3,1) ${i * 30}ms both` } : null}>{it.q}</button>;
          })}
          <button className={'expand' + (open ? ' on' : '')} onClick={() => setOpen(!open)} aria-expanded={open}>
            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            {open ? 'Fewer' : 'More ways'}
          </button>
        </div>
      </div>
    );
  }

  // compact end-of-thread shortcut row: pills and the expander share one container
  function TailSuggest({ onPick, open, setOpen }) {
    return (
      <div className="askbar">
        {open && INTENTS.map((it, i) => (
          <button key={it.id} className="chip" onClick={e => onPick(it, e)}
            style={{ animation: `up .4s cubic-bezier(.16,1,.3,1) ${i * 30}ms both` }}>{it.q}</button>
        ))}
        <button className={'expand' + (open ? ' on' : '')} onClick={() => setOpen(!open)} aria-expanded={open}>
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          {open ? 'Close' : 'More ways'}
        </button>
      </div>
    );
  }

  // staged reveal: blocks arrive one at a time with a visible “pulling …” line,
  // so an answer reads as assembled rather than pasted in
  function Stages({ items, className, step = 340 }) {
    const [n, setN] = useState(0);
    useEffect(() => { setN(0); }, [items.length]);
    useEffect(() => {
      if (n >= items.length) return;
      const t = setTimeout(() => setN(k => k + 1), n === 0 ? 160 : step);
      return () => clearTimeout(t);
    }, [n, items.length, step]);
    const done = n >= items.length;
    return (
      <div style={{ display: 'grid', gap: 14 }}>
        {n > 0 && <div className={className}>{items.slice(0, n).map(it => it.node)}</div>}
        {!done && (
          <div className="stageline">
            <span className="wave" aria-hidden="true">
              {[0, 1, 2, 3, 4].map(k => <i key={k} style={{ animationDelay: k * 0.09 + 's' }} />)}
            </span>
            <span>pulling {items[n].label}</span>
          </div>
        )}
      </div>
    );
  }

  function Typed({ text, onDone }) {
    const [n, setN] = useState(0);
    useEffect(() => {
      let raf, i = 0;
      const step = () => { i += 3; setN(i); if (i < text.length) raf = requestAnimationFrame(step); else onDone && onDone(); };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [text]);
    const done = n >= text.length;
    return <p className="say">{text.slice(0, n)}{!done && <span className="caret" />}</p>;
  }

  // four-point spark — stands in for the concierge without a gradient blob
  function AiMark() {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5v17M3.5 12h17M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7" opacity=".95" />
      </svg>
    );
  }

  function Wave({ n = 5 }) {
    return (
      <span className="wave" aria-hidden="true">
        {Array.from({ length: n }, (_, k) => <i key={k} style={{ animationDelay: k * 0.09 + 's' }} />)}
      </span>
    );
  }

  function Thinking() {
    const [i, setI] = useState(0);
    useEffect(() => { const t = setInterval(() => setI(k => (k + 1) % STATUS.length), 900); return () => clearInterval(t); }, []);
    return <div className="think"><span>{STATUS[i]}</span></div>;
  }

  // Card thumbnail: either mirrors the case study's hero, or has its own upload.
  // Mode is a site-wide setting (dv3.thumb.<id>) so it syncs with the content.
  function CaseCard({ p, onOpen, owner }) {
    const TK = 'dv3.thumb.' + p.id;
    const [m, setM] = useState(null);
    const [mode, setMode] = useState(() => localStorage.getItem(TK) || 'hero');
    useEffect(() => {
      let live = true;
      const read = () => window.dvMedia.resolve('r-' + p.id + '-hero').then(v => live && setM(v));
      read(); addEventListener('media-change', read);
      return () => { live = false; removeEventListener('media-change', read); };
    }, [p.id]);
    const flip = e => {
      e.stopPropagation(); e.preventDefault();
      const n = mode === 'hero' ? 'own' : 'hero';
      localStorage.setItem(TK, n); setMode(n);
    };
    const useHero = mode === 'hero' && m;
    return (
      <button className="ccard" style={{ '--tint': p.tint }} onClick={onOpen}>
        <span className="thumb">
          {owner && (
            <span role="button" tabIndex={0} className="mono thumb-src" onClick={flip}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && flip(e)}
              title="Choose what this card shows">
              {mode === 'hero' ? 'Thumb: case-study hero ⇄' : 'Thumb: own upload ⇄'}
            </span>
          )}
          {useHero ? (m.type.startsWith('video')
            ? <video src={m.src} autoPlay muted loop playsInline preload="metadata" />
            : <img src={m.src} alt="" />)
            : <media-slot id={`case-${p.id}`} ratio="16/10" cover lock size="full" frame="none" fit="cover" style={{ '--ms-tint': p.tint }}
                label={`${p.client} — cover image`}></media-slot>}
          <span className="ccard-go" aria-hidden="true">Read →</span>
        </span>
        <span className="ccard-body">
          <span className="mono ccard-kick">{p.badge ? p.badge + ' · ' : ''}{p.year} · {p.discipline || p.role}</span>
          <span className="ccard-co">{p.client}</span>
          <span className="ccard-t">{p.title}</span>
          <span className="ccard-stat">
            <b style={{ color: p.tint }}>{p.headline.v}</b>
            <span className="mono">{p.headline.l}</span>
          </span>
        </span>
      </button>
    );
  }

  function App() {
    const [msgs, setMsgs] = useState([]);
    const [thinking, setThinking] = useState(false);
    const [theme, setTheme] = useState('base');
    const [openMore, setOpenMore] = useState(false);
    const [reading, setReading] = useState(null);
    const [active, setActive] = useState('home');
    const [showPlay, setShowPlay] = useState(false);
    const [dark, setDark] = useState(() => localStorage.getItem('dv-theme') === 'dark');
    useEffect(() => {
      document.body.classList.toggle('dark', dark);
      localStorage.setItem('dv-theme', dark ? 'dark' : 'light');
    }, [dark]);
    const [owner, setOwner] = useState(false);
    const [acct, setAcct] = useState(false);
    const [logos, setLogos] = useState(false);
    const [stage, setStage] = useState(null);
    useEffect(() => { window.__stage = (id) => setStage(id); window.__read = (id) => setReading(id); }, []);
    useEffect(() => {
      const sync = () => setOwner(document.body.dataset.owner === '1');
      sync(); addEventListener('owner-change', sync); return () => removeEventListener('owner-change', sync);
    }, []);
    const endRef = useRef(null); const mainRef = useRef(null);
    const started = msgs.length > 0;

    const scrollEnd = useCallback(() => {
      const m = mainRef.current; if (m) m.scrollTo({ top: m.scrollHeight, behavior: 'smooth' });
    }, []);
    useEffect(() => { if (msgs.length) scrollEnd(); }, [msgs, thinking]);
    // returning home re-renders the hero — reset after that paint, not before
    useEffect(() => {
      if (!started && mainRef.current) mainRef.current.scrollTo({ top: 0 });
    }, [started]);

    const answer = (intent, q, e) => {
      if (e && e.clientX) ripple(e.clientX, e.clientY); else ripple();
      setActive(intent.id); setTheme(intent.theme);
      if (intent.id === 'play') setShowPlay(true);
      setMsgs(m => [...m, { role: 'me', text: q }]);
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setMsgs(m => [...m, { role: 'ai', text: intent.say, intent }]);
      }, 1250);
    };

    const send = async (q, e) => {
      if (e && e.clientX) ripple(e.clientX, e.clientY); else ripple();
      setMsgs(m => [...m, { role: 'me', text: q }]);
      setThinking(true);
      const history = msgs;
      const matchIntent = (s) => {
        const hit = MATCH.find(([re]) => re.test(s));
        if (!hit) return null;
        const it = INTENTS.find(i => i.id === hit[1]);
        // "strong" = they named the section outright rather than brushing past it
        return it ? { ...it, strong: /^(show|see|open|view|give|read|play)\b/i.test(s.trim()) || s.trim().split(/\s+/).length <= 4 } : null;
      };
      let r;
      try { r = await window.think(q, history, matchIntent); }
      catch (err) { r = { type: 'talk', say: 'Something went sideways on my end — try that again, or tap one of the shortcuts.' }; }
      await new Promise(res => setTimeout(res, 800));
      setThinking(false);
      if (r.type === 'route' && r.topic) {
        const it = INTENTS.find(i => i.id === r.topic) || INTENTS[0];
        setActive(it.id); setTheme(it.theme);
        if (it.id === 'play') setShowPlay(true);
        setMsgs(m => [...m, { role: 'ai', text: r.say || it.say, intent: it }]);
      } else if (r.type === 'confirm') {
        setMsgs(m => [...m, { role: 'ai', text: r.say, confirm: { caseId: r.caseId, topic: r.topic, ask: r.ask } }]);
      } else {
        setMsgs(m => [...m, { role: 'ai', text: r.say, chat: true }]);
      }
    };

    // visitor said yes to a confirm prompt
    const accept = (c) => {
      if (c.caseId) {
        const p = PROJECTS.find(x => x.id === c.caseId);
        setMsgs(m => [...m, { role: 'me', text: 'Yes, open it' },
          { role: 'ai', text: `Here it is — ${p.client}, ${p.title.toLowerCase()}.`, intent: { kind: 'cases', only: [c.caseId] } }]);
        setTimeout(() => setReading(c.caseId), 600);
      } else {
        const it = INTENTS.find(i => i.id === (c.topic || 'all')) || INTENTS[0];
        answer(it, 'Yes — ' + it.q.toLowerCase());
      }
    };

    const go = (id, e) => {
      if (id === 'home') {
        setMsgs([]); setTheme('base'); setActive('home');
        if (mainRef.current) mainRef.current.scrollTo({ top: 0 });
        return;
      }
      const it = INTENTS.find(i => i.id === id); if (it) answer(it, it.q, e);
    };

    const { hIdx, showComposer, showPills, moved } = useHeroStage();
    useEffect(() => { window.__ask = (q) => send(q); }, []);
    const jumpApps = () => {
      const el = document.getElementById('heroapps'); const m = mainRef.current;
      if (el && m) m.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
    };

    const accent = ACCENT[theme] || ACCENT.base;
    const casesFor = it => it.only ? PROJECTS.filter(p => it.only.includes(p.id))
      : it.cat ? PROJECTS.filter(p => (p.cats || []).includes(it.cat))
      : PROJECTS.filter(p => !p.personal);

    return (
      <div style={{ '--accent': accent, height: '100%' }}>
        <Ambient thinking={thinking} />
        <HeroTexture />
        <WaterTrail />
        <RevealEngine />
        <div id="grain" />
        <div id="app">
          <Rail active={active} go={go} dark={dark} setDark={setDark} showPlay={showPlay}
            owner={owner} onAccount={() => setAcct(true)} />
          <main ref={mainRef}>
            {!started ? (
              <>
              <div className="pinwrap">
                <div className="herostage">
                <div className="col hero-in hero-top" style={{ textAlign: 'center' }}>
                  <div className="mono eyebrow hero-eyebrow">
                    <span className="pip" />
                    Lead Product Designer &middot; Open to work
                  </div>
                  <h1 className="hero-h1">
                    <Words text="Hello, I’m Dan." delay={120} />
                    <span className="rotwrap"><RotatingLine i={hIdx} /></span>
                  </h1>
                  <Companies />
                </div>
                <div className="col hero-in hero-bot" style={{ textAlign: 'center' }}>
                  <div className={'hero-composer' + (showComposer ? ' on' : '')}>
                    <Composer onSend={send} autoFocus={showComposer} />
                  </div>
                  <div className={'hero-sugg' + (showPills ? ' on' : '')}>
                    <Suggestions onPick={(it, e) => answer(it, it.q, e)} open={openMore} setOpen={setOpenMore} />
                  </div>
                  <div className={'scrollhint' + (moved ? ' gone' : '')} aria-hidden="true">
                    <span className="mono">Scroll</span>
                    <span className="scrollhint-rail"><i /></span>
                  </div>
                </div>
                </div>
              </div>
              <div className="col heroapps-wrap" id="heroapps">
                <Magnetic className="mag">
                  <button className="fold-cue" onClick={jumpApps}>
                    <span className="mono">Play with something he built</span>
                    <span className="fold-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M12 5v13M6 12.5 12 19l6-6.5" /></svg>
                    </span>
                  </button>
                </Magnetic>
                <HeroApps />
              </div>
              </>
            ) : (
              <>
                <div className="threadwrap">
                <div className="col thread" style={{ padding: 'clamp(26px,5vh,54px) var(--pad) 60px', display: 'grid', gap: 30, alignContent: 'start' }}>
                  {msgs.map((m, i) => m.role === 'me' ? (
                    <div className="msg me" key={i}><div className="bub">{m.text}</div></div>
                  ) : (
                    <div className="msg" key={i}>
                      <span className="av"><AiMark /></span>
                      <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
                        {i === msgs.length - 1 ? <Typed text={m.text} onDone={scrollEnd} /> : <p className="say">{m.text}</p>}
                        {m.confirm && (
                          <div style={{ display: 'grid', gap: 12 }}>
                            {m.confirm.ask && <p className="say" style={{ color: 'var(--ink)' }}>{m.confirm.ask}</p>}
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <button className="chip" onClick={() => accept(m.confirm)}>Yes, open it</button>
                              <button className="chip" onClick={e => answer(INTENTS[0], 'Show me everything instead', e)}>Show everything instead</button>
                              <button className="chip" onClick={() => setMsgs(x => [...x, { role: 'ai', text: 'No problem — ask me something else, or tap a shortcut below.', chat: true }])}>Not quite</button>
                            </div>
                          </div>
                        )}
                        {m.chat && i === msgs.length - 1 && (
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['all', 'resume', 'hiring'].map(id => {
                              const it = INTENTS.find(x => x.id === id);
                              return <button key={id} className="chip"
                                onClick={e => answer(it, it.q, e)}>{it.q}</button>;
                            })}
                          </div>
                        )}
                        {m.intent && m.intent.kind === 'cases' && (() => {
                          const list = casesFor(m.intent);
                          return <Stages className={'cgrid' + (list.length === 1 ? ' one' : '')}
                            items={list.map(p => ({ label: p.client, node: <CaseCard key={p.id} p={p} owner={owner} onOpen={() => setReading(p.id)} /> }))} />;
                        })()}
                        {m.intent && m.intent.kind === 'demos' && (
                          <Stages items={[
                            ...DEMOS.map(d => ({ label: d.name, node: <DemoCard key={d.id} d={d} onCase={id => setReading(id)} /> })),
                            ...PROJECTS.filter(p => p.personal && !DEMOS.some(d => d.caseId === p.id))
                              .map(p => ({ label: p.client, node: (
                                <div className="demo demo-case" key={p.id}>
                                  <div className="demo-media">
                                    <media-slot id={`demo-${p.id}`} ratio="16/10" label={`${p.client} — image or clip`}></media-slot>
                                  </div>
                                  <div className="demo-side">
                                    <div className="mono" style={{ color: 'var(--accent)' }}>{p.badge || 'Personal'} · {p.discipline}</div>
                                    <h4>{p.client}</h4>
                                    <p>{p.title}</p>
                                    <button className="btn solid" style={{ justifySelf: 'start', marginTop: 4 }}
                                      onClick={() => setReading(p.id)}><span>Read the case study →</span></button>
                                  </div>
                                </div>
                              ) })),
                          ]} className="demostack" step={420} />
                        )}
                        {m.intent && m.intent.kind === 'panel' && (
                          <div className="panelbox">
                            {React.createElement(PANELS[m.intent.panel])}
                          </div>
                        )}
                        {m.intent && m.intent.kind === 'play' && (
                          <div className="panelbox"><PlayGallery /></div>
                        )}
                        {m.intent && i === msgs.length - 1 && !thinking && (() => {
                          const nx = NEXT[nextKey(m.intent)];
                          return <Nudge ask={nx && nx.ask} ids={nx ? nx.ids : ['all', 'personal', 'hiring']}
                            all={INTENTS.map(x => x.id)} open={openMore} setOpen={setOpenMore}
                            onPick={(it, e) => answer(it, it.q, e)} />;
                        })()}
                      </div>
                    </div>
                  ))}
                  {thinking && <div className="msg"><span className="av thinking"><Wave /></span><Thinking /></div>}
                  <div ref={endRef} />
                </div>
                </div>
                <div className="dock" style={{ position: 'sticky', bottom: 0, padding: '6px var(--pad) 16px' }}>
                  <div className="dock-in">
                    <Composer onSend={send} compact />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
        {reading && (() => {
          const idx = PROJECTS.findIndex(p => p.id === reading);
          const next = PROJECTS[(idx + 1) % PROJECTS.length];
          return <Reader p={PROJECTS[idx]} onClose={() => setReading(null)} onNext={() => setReading(next.id)} />;
        })()}
        {acct && <AccountSheet owner={owner} onClose={() => setAcct(false)}
          onLogos={() => { setAcct(false); setLogos(true); }} />}
        {logos && <LogoSheet onClose={() => setLogos(false)} />}
        {stage && <AppStage id={stage} onClose={() => setStage(null)} />}
      </div>
    );
  }

  Object.assign(window, { App, Stages });
})();
