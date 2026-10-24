// v5/editor.jsx — shared media settings + the owner's media editor.
// Media files live in media-slot storage (same ids as before). Display
// settings (shape, fit, zoom, focal point, opacity) live in the 'v5' content
// collection, so they publish with everything else.
(() => {
  const { useState, useEffect, useRef } = React;
  const DEF = { statOp: [.2, .2, .2], heroOp: .22, stagger: .5, fx: {}, logo: {}, logoGray: true };
  const V5 = window.dvContent ? dvContent.bind('v5', JSON.parse(JSON.stringify(DEF))) : JSON.parse(JSON.stringify(DEF));
  const v5 = () => Object.assign({}, DEF, V5);
  const saveV5 = patch => { if (window.dvContent) dvContent.save('v5', { ...DEF, ...dvContent.get('v5'), ...patch }); else { Object.assign(V5, patch); dispatchEvent(new CustomEvent('content-change')); } };
  const getFx = (key, d = {}) => Object.assign({ shape: '16/10', fit: 'cover', zoom: 1, x: 50, y: 50, op: 1 }, d, (v5().fx || {})[key] || {});
  const setFx = (key, patch) => { const fx = { ...(v5().fx || {}) }; fx[key] = { ...(fx[key] || {}), ...patch }; saveV5({ fx }); };
  const resetFx = key => { const fx = { ...(v5().fx || {}) }; delete fx[key]; saveV5({ fx }); };
  const fxStyle = f => ({ objectFit: f.fit, objectPosition: `${f.x}% ${f.y}%`, transform: f.zoom !== 1 ? `scale(${f.zoom})` : undefined, transformOrigin: `${f.x}% ${f.y}%`, opacity: f.op });

  function useMedia(id) {
    const [m, setM] = useState(null);
    useEffect(() => {
      let live = true;
      const read = () => window.dvMedia.resolve(id).then(v => live && setM(v && (v.src || v.link) ? v : null));
      read(); addEventListener('media-change', read);
      return () => { live = false; removeEventListener('media-change', read); };
    }, [id]);
    return m;
  }
  const isFigma = u => /^https?:\/\/([\w-]+\.)?figma\.com\//i.test(String(u || ''));
  const embedUrl = u => {
    if (!isFigma(u) || /embed\.figma\.com/.test(u)) return u;
    try {
      const x = new URL(u); const kind = /\/proto\//.test(x.pathname) ? 'proto' : 'design';
      const path = x.pathname.replace(/^\/(proto|design|file|board)\//, '/' + kind + '/');
      const q = new URLSearchParams(x.search); q.set('embed-host', 'danielvisual'); q.set('footer', 'false');
      if (kind === 'proto') { q.set('hide-ui', '1'); q.set('scaling', 'contain'); q.set('content-scaling', 'fixed'); q.set('page-selector', 'false'); q.set('bg-color', 'ffffff'); }
      return 'https://embed.figma.com' + path + '?' + q.toString();
    } catch (er) { return 'https://www.figma.com/embed?embed_host=share&url=' + encodeURIComponent(u); }
  };
  const isVid = m => String(m && m.type || '').startsWith('video');
  const MediaFill = ({ m, style }) => !m || !m.src ? null : isVid(m)
    ? <video src={m.src} autoPlay muted loop playsInline aria-hidden="true" style={style} />
    : <img src={m.src} alt="" style={style} />;

  const SHAPES = [['16/10', 'Landscape'], ['16/9', 'Wide'], ['1/1', 'Square'], ['4/5', 'Vertical'], ['3/4', 'Portrait']];
  const slotOf = id => document.querySelector(`media-slot[id="${id}"]`);
  const recrop = async id => {
    const s = slotOf(id); const src = s && s.state && s.state.src; if (!src) return;
    const b = await fetch(src).then(r => r.blob());
    s.openCrop(new File([b], 'image', { type: b.type || 'image/jpeg' }));
  };
  const clearMedia = id => {
    const s = slotOf(id); if (!s || !s.state) return;
    s.state.src = ''; s.state.type = ''; s.save(); s.render(); s.wire();
    dispatchEvent(new CustomEvent('media-change', { detail: { id } }));
  };
  const clearLink = id => {
    const s = slotOf(id); if (!s || !s.state) return;
    s.state.link = ''; s.save(); s.render(); s.wire();
    dispatchEvent(new CustomEvent('media-change', { detail: { id } }));
  };
  const upload = (id, f) => { const s = slotOf(id); if (!s || !f) return; f.type.startsWith('image') ? s.openCrop(f) : s.read(f); };
  const setLink = id => {
    const s = slotOf(id); if (!s || !s.state) return;
    const v = prompt('Live URL or Figma prototype / file link (empty to remove):', s.state.link || 'https://');
    if (v === null) return;
    s.state.link = v.trim() === 'https://' ? '' : v.trim(); s.save(); s.render(); s.wire();
    dispatchEvent(new CustomEvent('media-change', { detail: { id } }));
  };

  // cfg: { title, items:[{id, key, label, ratio}], shapes, opacity, link, extra }
  function MediaEditor({ cfg, onClose }) {
    const [tab, setTab] = useState(cfg.start || 0);
    const [, setRev] = useState(0);
    const it = cfg.items[tab];
    const f = getFx(it.key, it.def);
    const m = useMedia(it.id);
    const file = useRef(null);
    useEffect(() => {
      const r = () => setRev(x => x + 1); addEventListener('content-change', r);
      const esc = e => e.key === 'Escape' && !document.querySelector('.crop') && onClose();
      addEventListener('keydown', esc);
      if (cfg.onTab) cfg.onTab(tab);
      return () => { removeEventListener('content-change', r); removeEventListener('keydown', esc); };
    }, [tab]);
    const ratio = cfg.shapes ? f.shape : (it.ratio || '16/9');
    const rng = (k, min, max, step, label, fmt) => (
      <label className="x-ed-r" key={k}><span>{label}<b>{fmt(f[k])}</b></span>
        <input type="range" min={min} max={max} step={step} value={f[k]} onChange={e => setFx(it.key, { [k]: +e.target.value })} /></label>
    );
    return (
      <div className="x-ed-scrim" onMouseDown={e => e.target === e.currentTarget && onClose()}>
        <div className="x-ed" role="dialog" aria-label={cfg.title}>
          <div className="x-ed-h"><b>{cfg.title}</b><span className="x-sp" /><button className="x-btn" onClick={onClose}>Done</button></div>
          {cfg.items.length > 1 && <div className="x-ed-tabs" role="tablist">{cfg.items.map((x, k) =>
            <button key={x.id} role="tab" aria-selected={k === tab} className={'x-chip' + (k === tab ? ' on' : '')} onClick={() => setTab(k)}>{x.label}</button>)}</div>}
          <div className="x-ed-b">
            <div className="x-ed-pvw">
              <span className="x-mono">Preview — as it appears on the site</span>
              {cfg.render ? <div className={'x-ed-ctx ' + (cfg.ctx || '')}>{cfg.render(tab)}</div> : (
              <div className="x-ed-pv" style={{ aspectRatio: ratio, width: `min(100%, calc(56vh * ${ratio}))`, background: cfg.dark ? '#15131a' : undefined }}>
                {m && m.src ? <MediaFill m={m} style={fxStyle(f)} />
                  : m && m.link && isFigma(m.link) ? <iframe className="x-fig" src={embedUrl(m.link)} title="Figma preview" />
                  : <span className="x-ed-empty">{m && m.link ? 'Live link: ' + m.link : 'No media yet — upload an image or video'}</span>}
              </div>)}
              {m && m.link && <span className="x-ed-link">Link · <a href={m.link} target="_blank" rel="noreferrer">{m.link}</a></span>}
            </div>
            <div className="x-ed-c">
              <div className="x-ed-row">
                <button className="x-btn k" onClick={() => file.current.click()}>{m && m.src ? 'Replace' : 'Upload'}</button>
                <button className="x-btn" disabled={!m || !m.src || isVid(m)} onClick={() => recrop(it.id)}>Re-crop</button>
                {cfg.link && <button className="x-btn" onClick={() => setLink(it.id)}>{m && m.link ? 'Edit link' : 'Add live link'}</button>}
                <button className="x-btn" disabled={!m || !m.src} onClick={() => clearMedia(it.id)}>Remove image / video</button>
                {cfg.link && m && m.link && <button className="x-btn" onClick={() => clearLink(it.id)}>Remove link</button>}
                <button className="x-btn" onClick={() => resetFx(it.key)}>Reset adjustments</button>
                <input ref={file} type="file" accept="image/*,video/*" hidden onChange={e => { upload(it.id, e.target.files[0]); e.target.value = ''; }} />
              </div>
              {cfg.shapes && <div className="x-ed-g"><span className="x-mono">Shape</span><div className="x-ed-row">{SHAPES.map(([v, l]) =>
                <button key={v} className={'x-chip' + (f.shape === v ? ' on' : '')} onClick={() => setFx(it.key, { shape: v })}>{l} <span style={{ opacity: .6, marginLeft: 4 }}>{v.replace('/', ':')}</span></button>)}</div></div>}
              <div className="x-ed-g"><span className="x-mono">Fit</span><div className="x-ed-row">{[['cover', 'Fill & crop'], ['contain', 'Fit whole image']].map(([v, l]) =>
                <button key={v} className={'x-chip' + (f.fit === v ? ' on' : '')} onClick={() => setFx(it.key, { fit: v })}>{l}</button>)}</div></div>
              <div className="x-ed-grid">
                {rng('zoom', .3, 2.5, .01, 'Zoom (below 100% zooms out)', v => Math.round(v * 100) + '%')}
                {rng('x', 0, 100, 1, 'Focus — left / right', v => v + '%')}
                {rng('y', 0, 100, 1, 'Focus — top / bottom', v => v + '%')}
                {cfg.opacity && rng('op', 0, 1, .02, 'Opacity', v => Math.round(v * 100) + '%')}
              </div>
              {cfg.extra}
            </div>
          </div>
          {cfg.items.map(x => <media-slot key={x.id} id={x.id} ratio={cfg.shapes ? getFx(x.key, x.def).shape : (x.ratio || '16/9')} lock size="full" frame="none" fit="cover" style={{ display: 'none' }}></media-slot>)}
        </div>
      </div>
    );
  }

  // logo manager: upload, re-crop, size per logo
  function LogoSheet5({ onClose }) {
    const [, setRev] = useState(0);
    useEffect(() => { const r = () => setRev(x => x + 1); addEventListener('content-change', r); addEventListener('media-change', r);
      return () => { removeEventListener('content-change', r); removeEventListener('media-change', r); }; }, []);
    const logos = window.useLogos ? useLogos() : {};
    const st = v5();
    const files = useRef({});
    const scale = k => (st.logo || {})[k] || 1;
    const all = st.logoSize || 1;
    const setScale = (k, v) => saveV5({ logo: { ...(st.logo || {}), [k]: v } });
    return (
      <div className="x-ed-scrim" onMouseDown={e => e.target === e.currentTarget && onClose()}>
        <div className="x-ed" role="dialog" aria-label="Company logos">
          <div className="x-ed-h"><b>Company logos</b><span className="x-sp" />
            <label className="x-ed-r" style={{ minWidth: 220 }}><span>All logos<b>{Math.round(all * 100)}%</b></span>
              <input type="range" min=".5" max="2" step=".05" value={all} onChange={e => saveV5({ logoSize: +e.target.value })} /></label>
            <label className="x-ed-tg"><input type="checkbox" checked={st.logoGray !== false} onChange={e => saveV5({ logoGray: e.target.checked })} /> Greyscale in ticker</label>
            <button className="x-btn" onClick={onClose}>Done</button></div>
          <div className="x-lg">{(window.CO || []).map(c => {
            const k = logoKey(c), src = logos[k];
            return (
              <div className="x-lgc" key={k}>
                <div className="x-lgp">{src ? <img src={src} alt={c.n} style={{ height: 40 * scale(k) * all }} /> : <span>{c.n}</span>}</div>
                <b>{c.n}</b>
                <div className="x-ed-row">
                  <button className="x-btn k" onClick={() => files.current[k].click()}>{src ? 'Replace' : 'Upload'}</button>
                  <button className="x-btn" disabled={!src} onClick={() => recrop(k)}>Re-crop</button>
                  <button className="x-btn" disabled={!src} onClick={() => clearMedia(k)}>Clear</button>
                </div>
                <label className="x-ed-r"><span>Size<b>{Math.round(scale(k) * 100)}%</b></span>
                  <input type="range" min=".4" max="3" step=".05" value={scale(k)} onChange={e => setScale(k, +e.target.value)} /></label>
                <input ref={el => files.current[k] = el} type="file" accept="image/*" hidden onChange={e => { upload(k, e.target.files[0]); e.target.value = ''; }} />
                <media-slot id={k} ratio="2/1" lock size="full" frame="none" fit="contain" style={{ display: 'none' }}></media-slot>
              </div>
            );
          })}</div>
        </div>
      </div>
    );
  }

  Object.assign(window, { isFigma, embedUrl, V5, v5, saveV5, getFx, setFx, fxStyle, useMedia, MediaFill, MediaEditor, LogoSheet5, isVid });
})();
