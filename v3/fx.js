// fx.js — two ambient layers that don't belong to React:
//   1. UI sound: short, soft, synthesised (no audio files). Hover ticks and a
//      two-note click pluck, both low-gain and lowpassed so they read as
//      texture rather than notification.
//   2. Scroll position published as --sp on <html>, so the ambient background
//      can drift as the page moves.
(() => {
  const SEL_HOVER = 'button,a,.chip,.ccard,.hero-app,.playrow,.co,.pill,[data-fx]';
  const q = k => localStorage.getItem(k);
  let on = q('dv-sound') !== '0';
  let ctx = null, master = null, last = 0;

  const boot = () => {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = .5;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 5200; lp.Q.value = .4;
    master.connect(lp); lp.connect(ctx.destination);
    return ctx;
  };

  // one soft airy grain: filtered noise, slow attack — breath, not a pluck
  let nb = null;
  const noise = (t0, dur, peak, f, q) => {
    if (!nb) {
      nb = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate);
      const d = nb.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    }
    const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = nb; s.playbackRate.value = .8 + Math.random() * .4;
    bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q || 1.1;
    g.gain.setValueAtTime(.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + dur * .35);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    s.connect(bp); bp.connect(g); g.connect(master);
    s.start(t0); s.stop(t0 + dur + .05);
  };

  // one soft sine grain with a fast exponential tail
  const grain = (f, t0, dur, peak, type) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    o.frequency.exponentialRampToValueAtTime(f * .82, t0 + dur);
    g.gain.setValueAtTime(.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + .008);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + .02);
  };

  const play = kind => {
    if (!on) return;
    const c = boot(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    const t = c.currentTime;
    if (kind === 'hover') {
      const now = performance.now();
      if (now - last < 140) return;          // rate-limit fast pointer sweeps
      last = now;
      noise(t, .22, .016, 900 + Math.random() * 500, .9);
    } else if (kind === 'click') {
      grain(880, t, .09, .045);
      grain(1318, t + .035, .13, .03);
    } else if (kind === 'open') {
      grain(587, t, .14, .04);
      grain(880, t + .06, .18, .028);
      grain(1174, t + .12, .22, .018);
    }
  };

  addEventListener('pointerdown', e => {
    if (!(e.target instanceof Element)) return;
    if (e.target.closest(SEL_HOVER)) play('click');
  }, { passive: true });

  window.dvFx = {
    get on() { return on; },
    set(v) { on = !!v; localStorage.setItem('dv-sound', on ? '1' : '0'); if (on) play('click'); },
    play,
  };

  // --sp: 0 → 1 across the first three viewports of the main scroller, plus a
  // coarse zone that swaps the ambient tint (CSS eases the change over ~2s).
  const pub = () => {
    const m = document.querySelector('main');
    const y = m ? m.scrollTop : scrollY;
    const vh = (m ? m.clientHeight : 0) || innerHeight;
    if (!vh) return;
    document.documentElement.style.setProperty('--sp', Math.min(1, y / (vh * 3)).toFixed(4));
    const z = y < vh * .8 ? '0' : y < vh * 2.4 ? '1' : '2';
    if (document.body.dataset.zone !== z) document.body.dataset.zone = z;
  };
  const attach = () => {
    // capture-phase window listener: survives <main> being re-created
    addEventListener('scroll', () => requestAnimationFrame(pub), { passive: true, capture: true });
    addEventListener('resize', pub, { passive: true });
    pub();
    requestAnimationFrame(pub);
    addEventListener('load', pub);
    setTimeout(pub, 600);
  };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', attach) : attach();
})();
