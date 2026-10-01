// media-slot.js — owner-editable media placeholder.
//
// Visitors see the media, and nothing else: no upload affordance, no controls.
// The owner turns on edit mode (?edit=1, or ⌥⇧E) and every slot becomes a drop
// target with controls for aspect ratio, fit, size, and device frame.
//
// <media-slot id="x" ratio="16/9" fit="cover" size="full" frame="phone" label="Hero"></media-slot>
(() => {
  const RATIOS = ['16/9', '4/3', '1/1', '3/4', '4/5', '21/9', '9/19'];
  const SIZES = { sm: '58%', md: '80%', full: '100%' };
  const FRAMES = ['none', 'phone', 'tablet', 'browser', 'laptop'];
  const CROP_CSS = `:host{all:initial}
*{box-sizing:border-box}
.crop{position:fixed;inset:0;display:grid;place-content:center;gap:14px;background:rgba(8,6,12,.82);backdrop-filter:blur(10px);padding:24px}
.cbox{position:relative;overflow:hidden;cursor:grab;touch-action:none;border-radius:10px;box-shadow:0 40px 90px -50px #000;background-color:#0b0910;background-image:linear-gradient(45deg,#17141f 25%,transparent 25%),linear-gradient(-45deg,#17141f 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#17141f 75%),linear-gradient(-45deg,transparent 75%,#17141f 75%);background-size:18px 18px;background-position:0 0,0 9px,9px -9px,-9px 0}
.cbox.grab{cursor:grabbing}
.cbox img{position:absolute;left:50%;top:50%;width:auto;height:auto;max-width:none;transform-origin:center;user-select:none;-webkit-user-drag:none;object-fit:none}
.cbox:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(transparent 33.3%,rgba(255,255,255,.16) 33.3% 33.5%,transparent 33.5% 66.6%,rgba(255,255,255,.16) 66.6% 66.8%,transparent 66.8%),linear-gradient(90deg,transparent 33.3%,rgba(255,255,255,.16) 33.3% 33.5%,transparent 33.5% 66.6%,rgba(255,255,255,.16) 66.6% 66.8%,transparent 66.8%)}
.crow{display:flex;align-items:center;gap:10px;justify-self:stretch;flex-wrap:wrap;justify-content:center}
.crow span{font:400 9px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.crow input[type=range]{display:block;flex:1 1 90px;min-width:70px;max-width:190px;accent-color:var(--ms-accent,#6d4aff)}
button{font:500 10px/1 ui-monospace,monospace;letter-spacing:.09em;text-transform:uppercase;padding:9px 13px;border-radius:99px;border:1px solid rgba(255,255,255,.3);background:rgba(16,13,22,.82);color:#fff;cursor:pointer}
button:hover{background:#fff;color:#100d16}
button[data-c="ok"]{background:var(--ms-accent,#6d4aff);border-color:transparent}
button[data-c="ok"]:hover{filter:brightness(1.15);background:var(--ms-accent,#6d4aff);color:#fff}
.chint{font:400 9px/1.5 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);text-align:center}`;
  const KEY = id => 'ms:' + id;

  // Large files (any video, or images over ~1.5MB) go into IndexedDB as a Blob —
// localStorage would silently blow its quota and the upload would vanish.
  const DB = { p: null };
  const db = () => DB.p || (DB.p = new Promise((res, rej) => {
    const r = indexedDB.open('dv-media', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('files');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const idbPut = async (k, blob) => {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction('files', 'readwrite');
      t.objectStore('files').put(blob, k);
      t.oncomplete = res; t.onerror = () => rej(t.error);
    });
  };
  const idbGet = async k => {
    const d = await db();
    return new Promise(res => {
      const rq = d.transaction('files', 'readonly').objectStore('files').get(k);
      rq.onsuccess = () => res(rq.result || null); rq.onerror = () => res(null);
    });
  };

  const ownerOn = () => document.body.dataset.owner === '1';
  const slots = new Set();
  window.addEventListener('owner-change', () => slots.forEach(s => { s.render(); s.wire(); }));

  class MediaSlot extends HTMLElement {
    connectedCallback() {
      if (this._built) return; this._built = true;
      this.attachShadow({ mode: 'open' });
      slots.add(this);
      // Authored attributes are the source of truth for geometry. Only what the
      // owner explicitly changed via the controls (tracked in `userSet`) — plus
      // the media itself — is allowed to override the markup.
      const authored = {
        ratio: this.getAttribute('ratio') || '4/3', fit: this.getAttribute('fit') || 'cover',
        size: this.getAttribute('size') || 'full', frame: this.getAttribute('frame') || 'none',
      };
      const saved = this.load();
      const userSet = saved.userSet || {};
      const overrides = {};
      // `lock` means the markup owns geometry outright — used on presentation-
      // critical slots so a stale saved override can never break the layout.
      if (!this.hasAttribute('lock')) {
        for (const k of Object.keys(authored)) if (userSet[k]) overrides[k] = saved[k];
      }
      this.state = Object.assign({ src: '', type: '', userSet }, authored, overrides,
        { src: saved.src || '', type: saved.type || '' });
      this._wiredAt = performance.now();
      // Blob-backed media resolves after the first paint.
      if (this.state.src.startsWith('data:') && !(window.dvCloud && window.dvCloud.enabled)) {
        // Legacy: move inline data-URLs out of localStorage to free its quota.
        const du = this.state.src;
        fetch(du).then(r => r.blob()).then(b => idbPut(KEY(this.id), b).then(() => {
          this.state.src = URL.createObjectURL(b); this.save();
        })).catch(() => {});
      }
      if (this.state.src === 'idb') {
        this.state.src = '';
        idbGet(KEY(this.id)).then(b => {
          if (!b) return;
          this.state.src = URL.createObjectURL(b);
          this.render(); this.wire();
        });
      }
      this.render(); this.wire();
    }
    disconnectedCallback() { slots.delete(this); }
    load() { try { return JSON.parse(localStorage.getItem(KEY(this.id)) || '{}'); } catch (e) { return {}; } }
    save() {
      try {
        const keep = Object.assign({}, this.state);
        // never persist an object URL — it dies with the page
        if (keep.src.startsWith('blob:')) keep.src = 'idb';
        localStorage.setItem(KEY(this.id), JSON.stringify(keep));
      } catch (e) {
        this._busy = { pct: 100, msg: '', err: 'Browser storage is full — remove an old upload, or sign in with the cloud.' };
        setTimeout(() => { this._busy = null; this.render(); this.wire(); }, 5000);
      }
    }

    frameCss(f) {
      if (f === 'phone') return `.frame{padding:9px;background:linear-gradient(160deg,#2c2836,#14111c);border-radius:34px;box-shadow:0 24px 50px -34px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.1)}
.inner{border-radius:26px;overflow:hidden;position:relative;background:#000}
.frame:before{content:'';position:absolute;left:50%;top:16px;transform:translateX(-50%);width:44%;height:5px;border-radius:99px;background:rgba(255,255,255,.24);z-index:2}`;
      if (f === 'tablet') return `.frame{padding:13px;background:linear-gradient(160deg,#2c2836,#14111c);border-radius:22px;box-shadow:0 24px 50px -34px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.1)}
.inner{border-radius:10px;overflow:hidden;background:#000}`;
      if (f === 'laptop') return `.frame{padding:12px 12px 0;background:linear-gradient(160deg,#2c2836,#14111c);border-radius:14px 14px 0 0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.frame:after{content:'';display:block;height:12px;margin:12px -5.5% 0;border-radius:0 0 12px 12px;background:linear-gradient(#201d2a,#15121d);box-shadow:0 18px 30px -22px rgba(0,0,0,.7)}
.inner{border-radius:5px;overflow:hidden;background:#000}`;
      if (f === 'browser') return `.frame{background:var(--ms-chrome,#e9e5ee);border-radius:12px;overflow:hidden;box-shadow:0 24px 50px -36px rgba(0,0,0,.5);border:1px solid var(--ms-line,rgba(0,0,0,.12))}
.bar{display:flex;align-items:center;gap:6px;padding:9px 12px}
.bar i{width:9px;height:9px;border-radius:50%;background:rgba(0,0,0,.18)}
.bar b{flex:1;height:16px;margin-left:8px;border-radius:99px;background:rgba(0,0,0,.08)}
.inner{overflow:hidden;background:#000}`;
      return `.frame{border-radius:var(--ms-radius,14px);overflow:hidden}.inner{border-radius:var(--ms-radius,14px);overflow:hidden}`;
    }

    render() {
      const s = this.state, own = ownerOn();
      const label = this.getAttribute('label') || 'Media';
      const isCover = this.hasAttribute('cover');
      const cover = isCover
        ? `<div class="cov">${own ? '<span class="cov-m">drop an image or video</span>' : ''}</div>`
        : `<div class="ph"><b>${label}</b>${own ? '<i>drop an image or video</i>' : ''}</div>`;
      const media = s.src
        ? (s.type.startsWith('video')
          ? `<video src="${s.src}" autoplay muted loop playsinline></video>`
          : `<img src="${s.src}" alt="${label.replace(/"/g, '')}">`)
        : cover;
      // An owner-set link turns the finished media into a door to the live work.
      const wrapped = s.link && s.src && !own
        ? `<a class="golink" href="${s.link}" target="_blank" rel="noreferrer">${media}<span class="golabel">Open ↗</span></a>`
        : media;
      const busy = this._busy
        ? `<div class="busy">${this._busy.err ? `<span class="err">${this._busy.err}</span>`
          : `<div class="bar3"><i style="width:${this._busy.pct || 0}%"></i></div><span>${this._busy.msg}</span>`}</div>`
        : '';
      this.shadowRoot.innerHTML = `
<style>
:host{display:block;width:100%}
.wrap{position:relative;width:${SIZES[s.size] || '100%'};margin:0 auto}
${this.frameCss(s.frame)}
.inner{aspect-ratio:${s.ratio};display:grid;place-items:center;background:var(--ms-bg,rgba(120,110,140,.1))}
.inner.empty{border:1px ${own ? 'dashed' : 'solid'} var(--ms-line,rgba(0,0,0,.14))}
img,video{width:100%;height:100%;object-fit:${s.fit};display:block}
.ph{display:grid;gap:7px;justify-items:center;padding:16px;text-align:center}
.ph b{font:500 13px/1.35 var(--ms-font,system-ui,sans-serif);color:var(--ms-ink,#222);max-width:26ch}
.ph i{font:400 10.5px/1 var(--ms-mono,ui-monospace,monospace);letter-spacing:.13em;text-transform:uppercase;color:var(--ms-faint,#888);font-style:normal}
.inner.cover{place-items:stretch;background:linear-gradient(150deg,color-mix(in oklab,var(--ms-tint,#5b3fd6) 22%,transparent),color-mix(in oklab,var(--ms-tint,#5b3fd6) 6%,transparent));border:0!important;position:relative;overflow:hidden}
.inner.cover:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(135deg,transparent 0 11px,color-mix(in oklab,var(--ms-tint,#5b3fd6) 7%,transparent) 11px 12px)}
.cov{position:relative;box-sizing:border-box;display:grid;gap:9px;justify-items:start;align-content:end;justify-self:stretch;align-self:stretch;width:100%;height:100%;padding:clamp(14px,7%,26px)}
.cov-m{font:400 9px/1 var(--ms-mono,ui-monospace,monospace);letter-spacing:.14em;text-transform:uppercase;color:var(--ms-faint,#888)}
.drop{outline:2px solid var(--ms-accent,#5b3fd6);outline-offset:3px}
.bar2{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:6px;flex-wrap:wrap;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;z-index:5}
.wrap:hover .bar2{opacity:1;transform:none}
button{font:500 10px/1 var(--ms-mono,ui-monospace,monospace);letter-spacing:.09em;text-transform:uppercase;padding:7px 9px;border-radius:99px;border:1px solid rgba(255,255,255,.3);background:rgba(16,13,22,.82);color:#fff;cursor:pointer;backdrop-filter:blur(8px)}
button:hover{background:#fff;color:#100d16}
input{display:none}
.busy{position:absolute;inset:0;z-index:6;display:grid;gap:10px;place-content:center;justify-items:center;background:rgba(14,11,20,.78);backdrop-filter:blur(4px);color:#fff;font:400 10px/1 var(--ms-mono,ui-monospace,monospace);letter-spacing:.14em;text-transform:uppercase}
.bar3{width:min(180px,60%);height:3px;border-radius:99px;background:rgba(255,255,255,.22);overflow:hidden}
.bar3 i{display:block;height:100%;background:var(--ms-accent,#6d4aff);transition:width .2s}
.err{color:#ff9d9d;text-transform:none;letter-spacing:.02em;font-size:11px;max-width:26ch;text-align:center;line-height:1.4}
.golink{display:block;position:relative;height:100%}
.golabel{position:absolute;right:10px;bottom:10px;padding:6px 11px;border-radius:99px;background:rgba(16,13,22,.86);color:#fff;font:500 9.5px/1 var(--ms-mono,ui-monospace,monospace);letter-spacing:.12em;text-transform:uppercase;opacity:0;transform:translateY(5px);transition:opacity .3s,transform .3s;backdrop-filter:blur(6px)}
.golink:hover .golabel{opacity:1;transform:none}
</style>
<div class="wrap">
  <div class="frame">
    ${s.frame === 'browser' ? '<div class="bar"><i></i><i></i><i></i><b></b></div>' : ''}
    <div class="inner ${s.src ? '' : 'empty'} ${!s.src && isCover ? 'cover' : ''}">${wrapped}</div>
  </div>
  ${busy}
  ${own ? `<div class="bar2">
    <button data-a="pick">${s.src ? 'replace' : 'add media'}</button>
    <button data-a="link">${s.link ? 'link ✓' : 'link'}</button>
    ${isCover || this.hasAttribute('lock') ? '' : `<button data-a="frame">${s.frame}</button>
    <button data-a="ratio">${s.ratio}</button>
    <button data-a="fit">${s.fit}</button>
    <button data-a="size">${s.size}</button>`}
    ${s.src ? '<button data-a="clear">clear</button>' : ''}
  </div>` : ''}
  <input type="file" accept="image/*,video/*">
</div>`;
    }

    wire() {
      const r = this.shadowRoot, own = ownerOn();
      const box = r.querySelector('.inner'), file = r.querySelector('input');
      if (!own) return;
      this._wiredAt = performance.now();
      const pick = () => file.click();
      // The slot body is NOT a picker target — a click that navigated into this
      // view used to land here and launch Finder. Uploading is explicit: the
      // “add media” button, or a drag-and-drop.
      box.style.cursor = 'default';
      file.onchange = e => {
        const f = e.target.files[0];
        if (f) f.type.startsWith('image') ? this.openCrop(f) : this.read(f);
        e.target.value = '';
      };
      ['dragenter', 'dragover'].forEach(t => box.addEventListener(t, e => { e.preventDefault(); box.classList.add('drop'); }));
      ['dragleave', 'drop'].forEach(t => box.addEventListener(t, e => { e.preventDefault(); box.classList.remove('drop'); }));
      box.addEventListener('drop', e => {
        const f = e.dataTransfer.files[0];
        if (f) f.type.startsWith('image') ? this.openCrop(f) : this.read(f);
      });
      r.querySelectorAll('.bar2 button').forEach(b => b.onclick = e => {
        e.stopPropagation(); const a = b.dataset.a, s = this.state;
        if (a === 'pick') return pick();
        if (a === 'link') {
          const v = prompt('Link this media to a URL (empty to remove):', s.link || 'https://');
          if (v === null) return;
          s.link = v.trim() === 'https://' ? '' : v.trim();
        }        if (a === 'ratio') { s.ratio = RATIOS[(RATIOS.indexOf(s.ratio) + 1) % RATIOS.length]; s.userSet.ratio = true; }
        if (a === 'frame') { s.frame = FRAMES[(FRAMES.indexOf(s.frame) + 1) % FRAMES.length]; s.userSet.frame = true; }
        if (a === 'fit') { s.fit = s.fit === 'cover' ? 'contain' : 'cover'; s.userSet.fit = true; }
        if (a === 'size') { const k = Object.keys(SIZES); s.size = k[(k.indexOf(s.size) + 1) % k.length]; s.userSet.size = true; }
        if (a === 'clear') { s.src = ''; s.type = ''; }
        this.save(); this.render(); this.wire();
      });
    }

    // Crop step: the picked image is fitted to the slot's own aspect ratio,
    // then panned and zoomed by hand before it is committed.
    async openCrop(f) {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.src = url;
      try { await img.decode(); } catch (e) { URL.revokeObjectURL(url); return this.read(f); }
      const r = this.shadowRoot;
      // The crop stage is portalled to <body> in its own shadow root: any
      // transformed ancestor (reveal/hover transitions) would otherwise become
      // the containing block for a fixed-position child and throw it off-screen.
      const ar = (() => { const p = (this.state.ratio || '4/3').split('/'); return (+p[0] || 4) / (+p[1] || 3); })();
      let vw = Math.min(innerWidth * .78, 760), vh = vw / ar;
      const maxH = innerHeight * .64;
      if (vh > maxH) { vh = maxH; vw = vh * ar; }
      vw = Math.round(vw); vh = Math.round(vh);
      const nw = img.naturalWidth, nh = img.naturalHeight;
      const cover = Math.max(vw / nw, vh / nh), contain = Math.min(vw / nw, vh / nh);
      // Always opens FIT: the whole uploaded file is visible and untouched, and
      // the owner sizes, moves and rotates it into the frame from there.
      let mode = 'fit';
      let base = contain;
      let z = 1, ox = 0, oy = 0, rot = 0;
      const alpha = !/jpe?g/i.test(f.type);   // keep transparency for logos/PNGs

      const host = document.createElement('div');
      host.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483000';
      host.style.setProperty('--ms-accent', getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#6d4aff');
      const sr = host.attachShadow({ mode: 'open' });
      sr.innerHTML = `<style>${CROP_CSS}</style><div class="crop"><div class="cbox"><img src="${url}"></div>
<div class="crow"><button data-c="mode">fit</button><span>size</span><input type="range" data-r="z" min="0.1" max="3" step="0.01" value="1">
<span>turn</span><input type="range" data-r="rot" min="-180" max="180" step="1" value="0"><button data-c="rot90">90°</button>
<button data-c="reset">reset</button><button data-c="ok">save &amp; upload</button><button data-c="no">cancel</button></div>
<div class="chint">drag to reposition · scroll or slider to resize · turn to rotate · esc to cancel</div></div>`;
      document.body.appendChild(host);
      const ov = { remove: () => host.remove(), querySelector: s => sr.querySelector(s) };
      const cbox = sr.querySelector('.cbox'), pic = sr.querySelector('img');
      const rng = sr.querySelector('[data-r="z"]'), rrot = sr.querySelector('[data-r="rot"]');
      const mbtn = sr.querySelector('[data-c="mode"]');
      cbox.style.width = vw + 'px';
      cbox.style.height = vh + 'px';

      // Loose bounds only — with rotation in play the image is free to sit
      // anywhere that still overlaps the frame.
      const clamp = () => {
        const mx = vw / 2 + nw * base * z / 2, my = vh / 2 + nh * base * z / 2;
        ox = Math.max(-mx, Math.min(mx, ox)); oy = Math.max(-my, Math.min(my, oy));
      };
      const draw = () => {
        clamp();
        pic.style.width = nw * base + 'px';
        pic.style.height = nh * base + 'px';
        pic.style.transform = `translate(-50%,-50%) translate(${ox}px,${oy}px) rotate(${rot}deg) scale(${z})`;
        mbtn.textContent = mode;
        rng.value = z; rrot.value = rot;
      };
      draw();

      let down = null;
      cbox.addEventListener('pointerdown', e => {
        down = { x: e.clientX, y: e.clientY, ox, oy };
        cbox.classList.add('grab'); cbox.setPointerCapture(e.pointerId);
      });
      cbox.addEventListener('pointermove', e => {
        if (!down) return;
        ox = down.ox + (e.clientX - down.x); oy = down.oy + (e.clientY - down.y); draw();
      });
      const up = () => { down = null; cbox.classList.remove('grab'); };
      cbox.addEventListener('pointerup', up); cbox.addEventListener('pointercancel', up);
      cbox.addEventListener('wheel', e => {
        e.preventDefault();
        z = Math.max(.1, Math.min(3, z * (e.deltaY > 0 ? .94 : 1.06)));
        draw();
      }, { passive: false });
      rng.addEventListener('input', () => { z = +rng.value; draw(); });
      rrot.addEventListener('input', () => { rot = +rrot.value; draw(); });
      sr.querySelector('[data-c="rot90"]').onclick = () => {
        rot = ((rot + 90 + 180) % 360) - 180; draw();
      };
      mbtn.onclick = () => {
        mode = mode === 'fit' ? 'fill' : 'fit';
        base = mode === 'fit' ? contain : cover;
        z = 1; ox = 0; oy = 0; draw();
      };
      sr.querySelector('[data-c="reset"]').onclick = () => {
        mode = 'fit'; base = contain; z = 1; ox = 0; oy = 0; rot = 0; draw();
      };

      const close = () => { ov.remove(); URL.revokeObjectURL(url); removeEventListener('keydown', onKey); };
      const onKey = e => { if (e.key === 'Escape') close(); };
      addEventListener('keydown', onKey);
      ov.querySelector('[data-c="no"]').onclick = close;
      ov.querySelector('[data-c="ok"]').onclick = () => {
        // Export the visible image area, not the frame. When the picture is
        // smaller than the frame (zoomed out, fit mode, a wide logo) the frame
        // would otherwise bake empty margins into the file — and the slot's own
        // cover fit then scales those margins up and clips the picture again.
        const dw = nw * base, dh = nh * base;
        const a = rot * Math.PI / 180, c = Math.abs(Math.cos(a)), s2 = Math.abs(Math.sin(a));
        const hx = (c * dw + s2 * dh) * z / 2, hy = (s2 * dw + c * dh) * z / 2;
        const cx = vw / 2 + ox, cy = vh / 2 + oy;
        const x0 = Math.max(0, cx - hx), y0 = Math.max(0, cy - hy);
        const x1 = Math.min(vw, cx + hx), y1 = Math.min(vh, cy + hy);
        const ew = Math.max(8, x1 - x0), eh = Math.max(8, y1 - y0);
        const k = Math.min(2, 1800 / ew);
        const cv = document.createElement('canvas');
        cv.width = Math.round(ew * k); cv.height = Math.round(eh * k);
        const g = cv.getContext('2d');
        g.scale(k, k);
        g.translate(-x0, -y0);
        g.translate(cx, cy);
        g.rotate(a);
        g.scale(z, z);
        g.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        // Anything short of the full frame is letterboxed by intent: show it whole.
        if (ew < vw - 1 || eh < vh - 1) { this.state.fit = 'contain'; this.state.userSet.fit = true; }
        cv.toBlob(b => {
          close();
          if (b) this.read(new File([b], alpha ? 'crop.png' : 'crop.jpg', { type: alpha ? 'image/png' : 'image/jpeg' }));
        }, alpha ? 'image/png' : 'image/jpeg', .92);
      };
    }

    async read(f) {
      const big = f.type.startsWith('video') || f.size > 1.5e6;
      this._busy = { pct: 4, msg: 'reading — ' + Math.round(f.size / 1e5) / 10 + ' MB' };
      this.render();
      const done = () => {
        this._busy = null; this.save(); this.render(); this.wire();
        dispatchEvent(new CustomEvent('media-change', { detail: { id: this.id } }));
      };
      const fail = m => {
        this._busy = { pct: 100, msg: '', err: m };
        this.render();
        setTimeout(() => { this._busy = null; this.render(); this.wire(); }, Math.max(3200, m.length * 70));
      };
      if (window.dvCloud && window.dvCloud.canWrite()) {
        try {
          this._busy = { pct: 40, msg: 'uploading — ' + Math.round(f.size / 1e5) / 10 + ' MB' }; this.render();
          this.state.src = await window.dvCloud.upload(KEY(this.id), f, f.name);
          this.state.type = f.type;
          this._busy = { pct: 100, msg: '✓ saved' }; this.render();
          setTimeout(done, 700);
        } catch (e) { fail(e && e.message ? e.message : 'Upload failed.'); }
        return;
      }
      if (big || true) {
        // Blob → IndexedDB → object URL for every local upload. localStorage
        // caps out at ~5 MB per site, so data-URLs there fail after a few images.
        try {
          this._busy = { pct: 55, msg: 'storing' }; this.render();
          await idbPut(KEY(this.id), f);
          this.state.src = URL.createObjectURL(f);
          this.state.type = f.type;
          this._busy = { pct: 100, msg: '✓ added' }; this.render();
          setTimeout(done, 700);
        } catch (e) { fail('Could not store that file. Try one under 50 MB.'); }
        return;
      }
      const fr = new FileReader();
      fr.onprogress = e => {
        if (!e.lengthComputable) return;
        this._busy = { pct: Math.round(e.loaded / e.total * 92), msg: 'reading' };
        this.render();
      };
      fr.onerror = () => fail('That file could not be read.');
      fr.onload = () => {
        this.state.src = fr.result; this.state.type = f.type;
        this._busy = { pct: 100, msg: '✓ added' }; this.render();
        setTimeout(done, 700);
      };
      fr.readAsDataURL(f);
    }
  }
  customElements.define('media-slot', MediaSlot);

  // ---- owner mode ----
  const setOwner = on => {
    // With the cloud on, editing requires a real signed-in session.
    if (on && window.dvCloud && window.dvCloud.enabled && !window.dvCloud.isOwner()) on = false;
    document.body.dataset.owner = on ? '1' : '0';
    localStorage.setItem('dv-owner', on ? '1' : '0');
    dispatchEvent(new Event('owner-change'));
  };
  addEventListener('DOMContentLoaded', async () => {
    if (window.dvCloud) await window.dvCloud.ready;
    if (!(window.dvCloud && window.dvCloud.enabled)) {
      Object.keys(localStorage).filter(k => k.startsWith('ms:')).forEach(async k => {
        try {
          const v = JSON.parse(localStorage.getItem(k));
          if (!v || !v.src || !v.src.startsWith('data:')) return;
          const b = await (await fetch(v.src)).blob();
          await idbPut(k, b);
          v.src = 'idb'; localStorage.setItem(k, JSON.stringify(v));
        } catch (e) {}
      });
    }
    const url = new URLSearchParams(location.search).get('edit');
    const on = url === '1' || (url !== '0' && localStorage.getItem('dv-owner') === '1');
    setOwner(on);
  });
  addEventListener('keydown', e => {
    if (e.altKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) setOwner(document.body.dataset.owner !== '1');
  });
  window.dvOwner = { on: ownerOn, set: setOwner };
  // Resolve a slot's saved media to a usable URL (IndexedDB blobs → object URL).
  const urlCache = {};
  const resolve = async id => {
    let v; try { v = JSON.parse(localStorage.getItem(KEY(id)) || '{}'); } catch (e) { return null; }
    if (!v.src) return null;
    if (v.src === 'idb') {
      if (!urlCache[id]) { const b = await idbGet(KEY(id)); if (!b) return null; urlCache[id] = URL.createObjectURL(b); }
      return Object.assign({}, v, { src: urlCache[id] });
    }
    return v;
  };
  addEventListener('media-change', e => { const id = e.detail && e.detail.id; if (id) delete urlCache[id]; });
  window.dvMedia = { idbGet, resolve };
})();
