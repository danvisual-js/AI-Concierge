// hero.jsx — the home screen: abstract cursor-reactive texture, staggered
// word reveal, animated proof counters, magnetic controls.
// Exports HeroTexture, Words, Counter, Magnetic.
(() => {
  const { useState, useEffect, useRef } = React;

  const spring = 'cubic-bezier(.16,1,.3,1)';

  // Abstract field: three drifting mesh blobs + a dot grid, all lerped toward
  // the pointer at different depths. rAF-driven so motion eases rather than snaps.
  function HeroTexture() {
    const ref = useRef(null);
    useEffect(() => {
      const el = ref.current; if (!el) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
      const tick = () => {
        x += (tx - x) * 0.06; y += (ty - y) * 0.06;
        el.style.setProperty('--mx', x.toFixed(3));
        el.style.setProperty('--my', y.toFixed(3));
        // idle out once settled, so the compositor is free when nothing moves
        if (Math.abs(tx - x) < 0.002 && Math.abs(ty - y) < 0.002) { raf = 0; return; }
        raf = requestAnimationFrame(tick);
      };
      const onMove = e => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(tick);
      };
      addEventListener('pointermove', onMove, { passive: true });
      return () => { removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
    }, []);
    return (
      <div className="htex" ref={ref} aria-hidden="true">
        <span className="htex-b b1" /><span className="htex-b b2" /><span className="htex-b b3" />
        <span className="htex-dots" />
      </div>
    );
  }

  // Word-by-word rise out of a clipping mask — reads as typeset, not typed.
  function Words({ text, delay = 0, step = 46, className, style, serif }) {
    return (
      <span className={className} style={style}>
        {text.split(' ').map((w, i, arr) => (
          <React.Fragment key={i}>
            <span className="wmask">
              <span className={'wrise' + (serif ? ' wserif' : '')}
                style={{ animationDelay: delay + i * step + 'ms' }}>{w}</span>
            </span>
            {i < arr.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
    );
  }

  // Counts up once, on mount, with an ease-out so the last digits settle slowly.
  function Counter({ to, suffix = '', prefix = '', dur = 1100, delay = 0 }) {
    const [n, setN] = useState(0);
    useEffect(() => {
      let raf, t0;
      const go = () => {
        t0 = performance.now();
        const tick = now => {
          const p = Math.min(1, (now - t0) / dur);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };
      const t = setTimeout(go, delay);
      return () => { clearTimeout(t); cancelAnimationFrame(raf); };
    }, [to]);
    return <b>{prefix}{n}{suffix}</b>;
  }

  // Pulls gently toward the cursor, then springs home on leave.
  function Magnetic({ children, strength = 0.28, className, ...rest }) {
    const ref = useRef(null);
    const onMove = e => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${(e.clientY - r.top - r.height / 2) * strength}px)`;
      el.style.transition = 'transform .08s linear';
    };
    const onLeave = () => {
      const el = ref.current; if (!el) return;
      el.style.transform = 'translate(0,0)';
      el.style.transition = `transform .7s ${spring}`;
    };
    return <span ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>{children}</span>;
  }

  // Scroll plumbing: <main> can be re-created by React, which would strand a
  // listener on a detached node. So subscribe on window in CAPTURE mode (scroll
  // does not bubble, but it does capture) and re-query the scroller each frame.
  function onMainScroll(cb) {
    let raf = 0;
    const run = () => {
      raf = 0;
      const m = document.querySelector('main');
      if (m) cb(m);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    addEventListener('scroll', on, { passive: true, capture: true });
    addEventListener('resize', on, { passive: true });
    run();
    const t = setTimeout(run, 500);
    return () => {
      removeEventListener('scroll', on, { capture: true });
      removeEventListener('resize', on);
      clearTimeout(t); if (raf) cancelAnimationFrame(raf);
    };
  }

  // Derives the pinned-intro stage from scroll and commits state ONLY when the
  // stage changes — so a scroll frame does not re-render the whole app.
  function useHeroStage() {
    const [s, setS] = useState({ hIdx: 0, showComposer: false, showPills: false, moved: false });
    useEffect(() => {
      let last = '';
      return onMainScroll(m => {
        const vh = innerHeight || document.documentElement.clientHeight || m.clientHeight || 1;
        const p = Math.max(0, Math.min(1, m.scrollTop / (vh * 2)));
        const st = document.querySelector('.herostage');
        if (st) st.style.setProperty('--hp', p.toFixed(4));
        const next = {
          hIdx: p < .22 ? 0 : p < .4 ? 1 : p < .58 ? 2 : 3,
          showComposer: p > .64, showPills: p > .86, moved: p > .04,
        };
        const k = [next.hIdx, next.showComposer, next.showPills, next.moved].join('|');
        if (k !== last) { last = k; setS(next); }
      });
    }, []);
    return s;
  }

  function useMainScroll() {
    const [y, setY] = useState(0);
    useEffect(() => onMainScroll(m => setY(m.scrollTop)), []);
    return y;
  }

  // Headline second line, driven by scroll position rather than a timer — three
  // statements the visitor advances through. Remounting re-runs the word rise.
  const LINES = [
    { a: '', em: 'A product designer', b: 'in the Bay Area.' },
    { a: '', em: '13+ years', b: 'in consumer health, wellness and AI.' },
    { a: 'I shipped the', em: 'first AI', b: 'Rx refill.' },
    { a: 'I design for', em: 'trust', b: 'in AI.' },
  ];

  function RotatingLine({ i = 0 }) {
    const l = LINES[i];
    const base = i === 0 ? 340 : 0;
    let n = 0;
    const step = 46;
    const seg = (text, serif) => {
      if (!text) return null;
      const out = <Words key={text} text={text} delay={base + n * step} step={step} serif={serif} />;
      n += text.split(' ').length;
      return out;
    };
    const ghost = g => (
      <>
        {[
          ...(g.a ? g.a.split(' ').map(w => [w, false]) : []),
          ...g.em.split(' ').map(w => [w, true]),
          ...(g.b ? g.b.split(' ').map(w => [w, false]) : []),
        ].map(([w, s], k) => (
          <React.Fragment key={k}>
            <span className="wmask"><span className={'wrise' + (s ? ' wserif' : '')}>{w}</span></span>
            {' '}
          </React.Fragment>
        ))}
      </>
    );
    return (
      <span className="rotstack">
        {LINES.map((g, k) => (
          <span className="rotghost" key={k} aria-hidden="true">{ghost(g)}</span>
        ))}
        <span className="rotline" key={i}>
          {seg(l.a)}{l.a ? ' ' : ''}{seg(l.em, true)}{l.b ? ' ' : ''}{seg(l.b)}
        </span>
      </span>
    );
  }

  // Where he's shipped. Seamless marquee, pauses on hover, each name opens its
  // case study. Owner can drop a real logo into any slot from edit mode.
  const CO = [
    { n: 'Doctronic', id: 'doctronic' }, { n: 'GoodRx', id: 'goodrx' },
    { n: 'Estée Lauder', id: 'shopex' }, { n: 'Sephora', id: 'sephora' },
    { n: 'Stripes Beauty', id: 'stripes' }, { n: 'Quicken', id: 'quicken' },
    { n: 'Amazon WFS' }, { n: 'Live Nation' }, { n: 'Old Navy' },
  ];

  // Logos live in the same media-slot store as every other image, so an upload
  // here shows up in the marquee immediately.
  const logoKey = c => 'logo-' + (c.id || c.n).toLowerCase().replace(/\W+/g, '');

  function useLogos() {
    // Resolves IndexedDB-backed logos to object URLs; cloud ones are plain URLs.
    const read = async () => {
      const out = {};
      await Promise.all(CO.map(async c => {
        const v = await window.dvMedia.resolve(logoKey(c));
        if (v && v.src) out[logoKey(c)] = v.src;
      }));
      return out;
    };
    const [m, setM] = useState({});
    useEffect(() => {
      let live = true;
      const on = () => read().then(o => live && setM(o));
      on();
      addEventListener('media-change', on);
      return () => { live = false; removeEventListener('media-change', on); };
    }, []);
    return m;
  }

  function Companies() {
    const logos = useLogos();
    const item = (c, k) => {
      const src = logos[logoKey(c)];
      const inner = src
        ? <img className="co-logo" src={src} alt={c.n} />
        : <span className="co-name">{c.n}</span>;
      return c.id
        ? <button className="co" key={k} onClick={() => window.__read && window.__read(c.id)}
            aria-label={c.n}>{inner}</button>
        : <span className="co" key={k}>{inner}</span>;
    };
    const [gray, setGray] = useState(() => localStorage.getItem('dv3.logogray') !== '0');
    useEffect(() => {
      document.body.classList.toggle('logo-gray', gray);
      localStorage.setItem('dv3.logogray', gray ? '1' : '0');
    }, [gray]);
    return (
      <div className="cowrap">
        <div className="co-head">
          <div className="mono co-eyebrow">Shipped at</div>
          <button className="mono co-tone" onClick={() => setGray(g => !g)}
            aria-pressed={!gray} title="Toggle logo colour">{gray ? 'Colour' : 'Mono'}</button>
        </div>
        <div className="comarq">
          <div className="cotrack">
            {CO.map(item)}{CO.map((c, k) => item(c, 'b' + k))}
          </div>
        </div>
      </div>
    );
  }

  // Full-size upload surface for the nine marquee logos.
  function LogoSheet({ onClose }) {
    const logos = useLogos();
    useEffect(() => {
      const k = e => e.key === 'Escape' && onClose();
      addEventListener('keydown', k); return () => removeEventListener('keydown', k);
    }, [onClose]);
    const count = Object.keys(logos).length;
    return (
      <div className="acct-scrim" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="logosheet" role="dialog" aria-label="Company logos">
          <div className="logosheet-head">
            <div>
              <h3>Company logos</h3>
              <p className="note">{count} of {CO.length} set · drop a PNG or SVG on any tile. Transparent backgrounds work best.</p>
            </div>
            <button className="close" onClick={onClose} aria-label="Close" style={{ position: 'static', float: 'none' }}>✕</button>
          </div>
          <div className="logogrid">
            {CO.map(c => (
              <div className="logocell" key={c.n}>
                <media-slot id={logoKey(c)} ratio="2/1" cover lock size="full" frame="none" fit="contain"
                  label={`${c.n} logo`}></media-slot>
                <span className="mono">{c.n}</span>
              </div>
            ))}
          </div>
          <p className="note">Tiles left empty keep showing the name as a wordmark — mixing both is fine.</p>
        </div>
      </div>
    );
  }

  // Cursor wake: a single canvas, one rAF loop. The pointer position is chased
  // by a lagging follower, the follower's path is kept as a short spline, and
  // that spline is stroked as a tapered soft band — a boat wake rather than a
  // string of rings. Clicks drop a slow ripple that widens and thins out.
  function WaterTrail() {
    useEffect(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (matchMedia('(hover:none)').matches) return;
      const cv = document.createElement('canvas');
      cv.className = 'wcanvas'; cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cv);
      const g = cv.getContext('2d');
      let w = 0, h = 0, dpr = Math.min(2, devicePixelRatio || 1);
      const size = () => {
        w = innerWidth; h = innerHeight;
        cv.width = w * dpr; cv.height = h * dpr;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      size();
      addEventListener('resize', size);

      const pts = [];            // follower path, newest last
      const rip = [];            // click blooms
      let tx = -999, ty = -999, fx = -999, fy = -999, seen = false, raf = 0;
      let vis = 0, lastMove = 0;
      const accent = () => getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#6d4aff';

      const onMove = e => {
        tx = e.clientX; ty = e.clientY; lastMove = performance.now();
        if (!seen) { fx = tx; fy = ty; seen = true; }
      };
      const onDown = e => rip.push({ x: e.clientX, y: e.clientY, t: performance.now() + 220 });
      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerdown', onDown, { passive: true });

      const tick = () => {
        raf = requestAnimationFrame(tick);
        const now = performance.now();
        // the wake only exists while the pointer is travelling, and it takes a
        // beat to appear and a longer one to dissolve
        const moving = now - lastMove < 260;
        vis += ((moving ? 1 : 0) - vis) * (moving ? .03 : .014);
        // heavy lag: the trail sails behind the cursor rather than tracking it
        if (seen) {
          fx += (tx - fx) * .009; fy += (ty - fy) * .009;
          const p = pts[pts.length - 1];
          if (!p || Math.hypot(fx - p.x, fy - p.y) > .6) pts.push({ x: fx, y: fy });
          else if (!moving) pts.shift();
        }
        while (pts.length > 54) pts.shift();
        g.clearRect(0, 0, w, h);
        const col = accent();
        if (pts.length > 3 && vis > .01) {
          g.lineCap = 'round'; g.lineJoin = 'round';
          for (const pass of [[260, .012], [160, .013], [90, .014]]) {
            for (let i = 1; i < pts.length; i++) {
              const f = i / pts.length;
              const a = pass[1] * f * f * vis;
              if (a < .0015) continue;
              g.strokeStyle = col; g.globalAlpha = a;
              g.lineWidth = pass[0] * (.25 + f * .75);
              g.beginPath();
              g.moveTo(pts[i - 1].x, pts[i - 1].y);
              const n = pts[i + 1] || pts[i];
              g.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + n.x) / 2, (pts[i].y + n.y) / 2);
              g.stroke();
            }
          }
        }
        // click → a slow soft bloom in the background, no ring edge
        for (let i = rip.length - 1; i >= 0; i--) {
          const r = rip[i], k = (now - r.t) / 2400;
          if (k >= 1) { rip.splice(i, 1); continue; }
          if (k < 0) continue;
          const e = 1 - Math.pow(1 - k, 2.4);
          const rad = 60 + e * 230;
          const a = Math.sin(Math.min(1, k * 1.6) * Math.PI) * .085;
          const grd = g.createRadialGradient(r.x, r.y, 0, r.x, r.y, rad);
          grd.addColorStop(0, col); grd.addColorStop(.55, col); grd.addColorStop(1, 'transparent');
          g.globalAlpha = a; g.fillStyle = grd;
          g.beginPath(); g.arc(r.x, r.y, rad, 0, 6.2832); g.fill();
        }
        g.globalAlpha = 1;
      };
      raf = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(raf);
        removeEventListener('resize', size);
        removeEventListener('pointermove', onMove);
        removeEventListener('pointerdown', onDown);
        cv.remove();
      };
    }, []);
    return null;
  }

  // Scroll reveal: everything matching REVEAL rises in as it enters the scroller,
  // siblings staggered. A MutationObserver picks up streamed-in answer cards too.
  const REVEAL = '.ccard,.demo,.hero-app,.playrow,.panelbox,.party,.pivot,.tile,.say,.sec,[data-reveal]';

  function RevealEngine() {
    useEffect(() => {
      const root = document.querySelector('main');
      if (!root) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const seen = new WeakSet();
      const io = new IntersectionObserver(es => {
        es.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const sibs = el.parentElement ? [...el.parentElement.children].filter(n => n.dataset.rv === '1') : [];
          el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + 'ms';
          el.classList.add('rv-in');
          io.unobserve(el);
        });
      }, { root, rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      const scan = () => root.querySelectorAll(REVEAL).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el); el.dataset.rv = '1'; io.observe(el);
      });
      scan();
      const mo = new MutationObserver(scan);
      mo.observe(root, { childList: true, subtree: true });
      return () => { io.disconnect(); mo.disconnect(); };
    }, []);
    return null;
  }

  window.dvContent.bind('headlines', LINES);
  Object.assign(window, { HeroTexture, Words, Counter, Magnetic, RotatingLine, Companies, LogoSheet, WaterTrail, RevealEngine, useMainScroll, useHeroStage, LINES, CO });
})();
