// Content store. Every editable collection (chat replies, case studies, résumé…)
// is declared in code as its default, then bound here. A published edit is a
// full copy of the collection saved under `dv3.c.<name>` — which cloud.js syncs
// to Supabase — so redeploying code never overwrites it.
// The live array the site renders is mutated in place (hidden items filtered
// out), so existing components keep reading the same globals.
(() => {
  const K = n => 'dv3.c.' + n;
  const reg = {};
  const clone = v => JSON.parse(JSON.stringify(v));
  const read = n => { try { const s = localStorage.getItem(K(n)); return s ? JSON.parse(s) : null; } catch (e) { return null; } };

  const apply = n => {
    const r = reg[n]; if (!r) return;
    const full = read(n) || clone(r.defaults);
    if (Array.isArray(r.live)) {
      const vis = full.filter(x => !(x && x.hidden));
      r.live.splice(0, r.live.length, ...vis);
    } else {
      Object.keys(r.live).forEach(k => delete r.live[k]);
      Object.assign(r.live, full);
    }
  };

  const bind = (name, live) => {
    reg[name] = { live, defaults: clone(live) };
    apply(name);
    return live;
  };

  const save = (name, value) => {
    const cur = localStorage.getItem(K(name));
    if (cur) localStorage.setItem(K(name) + '.prev', cur);
    localStorage.setItem(K(name), JSON.stringify(value));
    apply(name);
    dispatchEvent(new CustomEvent('content-change', { detail: { name } }));
  };
  const reset = name => {
    const cur = localStorage.getItem(K(name));
    if (cur) localStorage.setItem(K(name) + '.prev', cur);
    localStorage.removeItem(K(name));
    apply(name);
    dispatchEvent(new CustomEvent('content-change', { detail: { name } }));
  };
  const prev = name => { try { const s = localStorage.getItem(K(name) + '.prev'); return s ? JSON.parse(s) : null; } catch (e) { return null; } };

  window.dvContent = {
    bind, save, reset, prev,
    get: n => clone(read(n) || reg[n].defaults),
    defaults: n => clone(reg[n].defaults),
    edited: n => !!localStorage.getItem(K(n)),
    has: n => !!reg[n],
  };
  // Cloud values land after scripts may have bound — re-apply once they're in.
  if (window.dvCloud) window.dvCloud.ready.then(() => Object.keys(reg).forEach(apply));
})();
