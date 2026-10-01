// studio.jsx — the owner's Content studio. Sidebar of collections, a sortable
// list of entries, and a blog-style editor. Edits stay as a draft (autosaved
// to this browser) until Publish, which writes through dvContent → Supabase.
(() => {
  const { useState, useEffect, useMemo, useRef } = React;
  const C = () => window.dvContent;
  const clone = v => JSON.parse(JSON.stringify(v));
  const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const getP = (o, k) => k.split('.').reduce((a, s) => (a == null ? a : a[s]), o);
  const setP = (o, k, v) => {
    const n = clone(o), ks = k.split('.'); let t = n;
    ks.slice(0, -1).forEach(s => { if (t[s] == null || typeof t[s] !== 'object') t[s] = {}; t = t[s]; });
    t[ks[ks.length - 1]] = v; return n;
  };
  const strip = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

  const OPENS = x => ({ cases: 'Case-study cards' + (x.cat ? ' · ' + x.cat : ''), demos: 'Labs / live products', play: 'Visual design gallery',
    panel: 'Panel · ' + (x.panel || ''), talk: 'Just the reply' })[x.kind] || 'Just the reply';

  const COLS = [
    { id: 'intents', label: 'Chat replies', item: 'reply', title: x => x.q, sub: x => x.say,
      make: () => ({ id: uid('c'), q: 'New question', say: '', kind: 'talk', theme: 'base', keys: '', more: true }),
      fields: [
        { k: 'q', l: 'Question · button label', t: 'title' },
        { k: 'say', l: 'Reply', t: 'textarea', rows: 5, help: 'Typed out live in the chat, so it stays plain text. 1–3 sentences reads best.' },
        { k: '_place', l: 'Where it appears', t: 'select', opts: [['primary', 'Main suggestions on the homepage'], ['more', '“More questions” list'], ['none', 'Only when a visitor types a match']],
          get: x => x.primary ? 'primary' : x.more ? 'more' : 'none', set: (x, v) => ({ ...x, primary: v === 'primary', more: v === 'more' }) },
        { k: 'keys', l: 'Also answer when visitors type', t: 'tags', help: 'Words or phrases, comma-separated — e.g. hire, job, opening. Checked before the built-in matching.' },
        { k: '_opens', l: 'Shows below the reply', t: 'info', get: OPENS },
      ] },
    { id: 'projects', label: 'Case studies', item: 'case study', title: x => x.client, sub: x => x.title,
      make: () => ({ id: uid('p'), client: 'New project', title: '', tint: 'var(--violet)', year: String(new Date().getFullYear()), role: '', dates: '', discipline: '', cats: [],
        headline: { v: '', l: '' }, story: '', pivot: { h: 'The pivot', b: '' },
        sections: ['Problem', 'Discover', 'Design', 'Solution', 'Testing'].map(k => ({ k, b: [''] })),
        result: [], metrics: [{ v: '', l: '' }, { v: '', l: '' }, { v: '', l: '' }], shots: ['Screenshot one', 'Screenshot two'] }),
      fields: [
        { k: 'client', l: 'Client / project name', t: 'title' },
        { k: 'title', l: 'Headline', t: 'text', big: true },
        { row: [{ k: 'year', l: 'Year', t: 'text' }, { k: 'discipline', l: 'Discipline', t: 'text' }] },
        { row: [{ k: 'role', l: 'Role', t: 'text' }, { k: 'dates', l: 'Dates', t: 'text' }] },
        { row: [{ k: 'headline.v', l: 'Card stat', t: 'text' }, { k: 'headline.l', l: 'Stat label', t: 'text' }] },
        { k: 'story', l: 'Story — the opening', t: 'rich' },
        { k: 'pivot.h', l: 'Callout label', t: 'text' },
        { k: 'pivot.b', l: 'Callout', t: 'rich', min: 90 },
        { k: 'sections', l: 'Sections', t: 'repeat', add: () => ({ k: 'New section', b: [''] }), name: s => s.k,
          sub: [{ k: 'k', l: 'Section title', t: 'text' }, { k: 'b', l: 'Body', t: 'richArr' }, { k: '_blocks', t: 'info', l: 'Also contains', get: s => (s.blocks || []).length ? (s.blocks.map(b => b.type).join(', ') + ' — kept as is (edit in code)') : null }] },
        { k: 'metrics', l: 'Key numbers (top of the page)', t: 'repeat', add: () => ({ v: '', l: '' }), name: m => m.v || 'Number', compact: true,
          sub: [{ row: [{ k: 'v', l: 'Number', t: 'text' }, { k: 'l', l: 'Label', t: 'text' }] }] },
        { k: 'result', l: 'Results', t: 'lines', help: 'One per line. **double asterisks** for bold.' },
        { k: 'shots', l: 'Screenshot captions', t: 'lines', help: 'One per line — each becomes an upload slot after the Design section.' },
        { row: [{ k: 'link.label', l: 'External link label', t: 'text' }, { k: 'link.url', l: 'External link URL', t: 'text' }] },
        { k: 'cats', l: 'Categories', t: 'tags', help: 'Controls which chat answers list this: ai, health, numbers, zero-to-one, enterprise, ecom.' },
        { k: 'personal', l: 'Labs project (built outside client work)', t: 'toggle' },
        { k: 'note', l: 'Private note to self', t: 'textarea', rows: 3, help: 'Only visible to you in edit mode.' },
      ] },
    { id: 'play', label: 'Visual design', item: 'role', title: x => x.co, sub: x => x.role,
      make: () => ({ id: uid('v'), co: 'New client', role: '', d: '', url: '' }),
      fields: [{ k: 'co', l: 'Client', t: 'title' }, { k: 'role', l: 'Role', t: 'text' }, { k: 'd', l: 'Description', t: 'textarea', rows: 4 }, { k: 'url', l: 'Link', t: 'text' }] },
    { id: 'roles', label: 'Résumé · experience', item: 'role', title: x => x.co, sub: x => x.role,
      make: () => ({ co: 'New company', role: '', when: '', note: '' }),
      fields: [{ k: 'co', l: 'Company', t: 'title' }, { row: [{ k: 'role', l: 'Title', t: 'text' }, { k: 'when', l: 'Dates', t: 'text' }] }, { k: 'note', l: 'What moved', t: 'textarea', rows: 4 }] },
    { id: 'side', label: 'Résumé · labs', item: 'entry', title: x => x.co, sub: x => x.role,
      make: () => ({ co: 'New project', role: '', when: '', note: '' }),
      fields: [{ k: 'co', l: 'Project', t: 'title' }, { row: [{ k: 'role', l: 'What it is', t: 'text' }, { k: 'when', l: 'Year', t: 'text' }] }, { k: 'note', l: 'Summary', t: 'textarea', rows: 3 }] },
    { id: 'skills', label: 'Résumé · known for', item: 'skill', title: x => x.h, sub: x => x.b,
      make: () => ({ h: 'New skill', b: '' }),
      fields: [{ k: 'h', l: 'Skill', t: 'title' }, { k: 'b', l: 'Detail', t: 'textarea', rows: 3 }] },
    { id: 'bio', label: 'About', doc: true,
      fields: [{ k: 'lead', l: 'Opening line', t: 'textarea', rows: 2, big: true }, { k: 'body', l: 'Body', t: 'rich', min: 260 }, { k: 'tags', l: 'Tags', t: 'tags' }] },
    { id: 'headlines', label: 'Homepage headline', item: 'line', fixed: true, title: x => [x.a, x.em, x.b].filter(Boolean).join(' '), sub: () => 'Advances as the visitor scrolls',
      fields: [{ k: 'em', l: 'Emphasised words', t: 'text', big: true }, { k: 'b', l: 'Rest of the line', t: 'text' }, { k: 'a', l: 'Lead-in (optional)', t: 'text' }] },
  ];

  function Field({ f, item, onItem }) {
    if (f.row) return <div className="st-row">{f.row.map(g => <Field key={g.k} f={g} item={item} onItem={onItem} />)}</div>;
    const v = f.get ? f.get(item) : getP(item, f.k);
    const set = nv => onItem(f.set ? f.set(item, nv) : setP(item, f.k, nv));
    if (f.t === 'info') return v ? <div className="st-f"><label>{f.l}</label><div className="st-info">{v}</div></div> : null;
    let input;
    if (f.t === 'title') input = <input className="st-title" value={v || ''} placeholder="Add title" onChange={e => set(e.target.value)} />;
    else if (f.t === 'text') input = <input className={'st-in' + (f.big ? ' big' : '')} value={v || ''} onChange={e => set(e.target.value)} />;
    else if (f.t === 'textarea') input = <textarea className={'st-in' + (f.big ? ' big' : '')} rows={f.rows || 3} value={v || ''} onChange={e => set(e.target.value)}></textarea>;
    else if (f.t === 'rich') input = <RichEditor value={v || ''} onChange={set} minHeight={f.min || 160} />;
    else if (f.t === 'richArr') input = <RichEditor value={(v || []).map(x => rteToHtml(x)).join('')} onChange={h => set([h])} minHeight={120} />;
    else if (f.t === 'lines') input = <textarea className="st-in" rows={Math.max(3, (v || []).length + 1)} value={(v || []).join('\n')}
      onChange={e => set(e.target.value.split('\n'))} onBlur={e => set(e.target.value.split('\n').map(s => s.trim()).filter(Boolean))}></textarea>;
    else if (f.t === 'tags') {
      const arr = Array.isArray(v); const s = arr ? v.join(', ') : (v || '');
      input = <input className="st-in" value={s} onChange={e => set(arr || f.k === 'cats' || f.k === 'tags' ? e.target.value.split(',').map(x => x.trimStart()) : e.target.value)}
        onBlur={e => { if (arr || f.k === 'cats' || f.k === 'tags') set(e.target.value.split(',').map(x => x.trim()).filter(Boolean)); }} />;
    }
    else if (f.t === 'select') input = <select className="st-in" value={v} onChange={e => set(e.target.value)}>{f.opts.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>;
    else if (f.t === 'toggle') return <label className="st-tog"><input type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} /><span></span>{f.l}</label>;
    else if (f.t === 'repeat') return <Repeat f={f} list={v || []} set={set} />;
    return <div className="st-f">{f.t !== 'title' && <label>{f.l}</label>}{input}{f.help && <p className="st-help">{f.help}</p>}</div>;
  }

  function Repeat({ f, list, set }) {
    const [open, setOpen] = useState(f.compact ? -1 : 0);
    const mv = (i, d) => { const n = list.slice(); const [x] = n.splice(i, 1); n.splice(i + d, 0, x); set(n); setOpen(i + d); };
    return (
      <div className="st-f">
        <label>{f.l}</label>
        <div className="st-rep">
          {list.map((it, i) => (
            <div key={i} className={'st-blk' + (open === i ? ' open' : '')}>
              <div className="st-blk-h" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="st-caret">{open === i ? '▾' : '▸'}</span>
                <b>{strip(f.name(it)) || 'Untitled'}</b>
                <span className="st-blk-a" onClick={e => e.stopPropagation()}>
                  <button type="button" disabled={i === 0} onClick={() => mv(i, -1)} title="Move up">↑</button>
                  <button type="button" disabled={i === list.length - 1} onClick={() => mv(i, 1)} title="Move down">↓</button>
                  <button type="button" onClick={() => { const n = list.slice(); n.splice(i + 1, 0, clone(it)); set(n); }} title="Duplicate">⧉</button>
                  <button type="button" onClick={() => { if (confirm('Remove this block?')) set(list.filter((_, k) => k !== i)); }} title="Remove">✕</button>
                </span>
              </div>
              {open === i && <div className="st-blk-b">{f.sub.map((g, k) => <Field key={k} f={g} item={it} onItem={n => set(list.map((x, j) => j === i ? n : x))} />)}</div>}
            </div>
          ))}
          <button type="button" className="st-add" onClick={() => { set([...list, f.add()]); setOpen(list.length); }}>+ Add {f.l.toLowerCase().replace(/s$/, '').split(' (')[0]}</button>
        </div>
      </div>
    );
  }

  const DK = n => 'dv-draft.' + n;
  const loadDrafts = () => {
    const d = {};
    COLS.forEach(c => { try { const s = localStorage.getItem(DK(c.id)); if (s) d[c.id] = JSON.parse(s); } catch (e) {} });
    return d;
  };

  function Studio({ onClose }) {
    const cols = COLS.filter(c => C().has(c.id));
    const [col, setCol] = useState(cols[0].id);
    const [drafts, setDrafts] = useState(loadDrafts);
    const [sel, setSel] = useState(0);
    const [q, setQ] = useState('');
    const [toast, setToast] = useState('');
    const [menu, setMenu] = useState(false);
    const [mobileEdit, setMobileEdit] = useState(false);
    const [, bump] = useState(0);
    const drag = useRef(null);
    const restored = useRef(Object.keys(drafts).length > 0);

    const def = cols.find(c => c.id === col);
    const data = drafts[col] || C().get(col);
    const dirty = id => !!drafts[id];
    const anyDirty = Object.keys(drafts).length > 0;

    useEffect(() => { if (restored.current) { setToast('Restored your unpublished draft'); restored.current = false; } }, []);
    useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);
    useEffect(() => {
      const k = e => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); publish(); }
        if (e.key === 'Escape' && !document.querySelector('.st-menu')) tryClose();
      };
      addEventListener('keydown', k); return () => removeEventListener('keydown', k);
    });

    const update = next => {
      setDrafts(d => {
        const n = { ...d, [col]: next };
        try { localStorage.setItem(DK(col), JSON.stringify(next)); } catch (e) {}
        return n;
      });
    };
    const clean = (id, v) => {
      if (id !== 'projects') return v;
      return v.map(p => {
        const n = { ...p };
        if (n.link && !n.link.url) delete n.link;
        if (n.link && !n.link.label) n.link.label = 'Open ↗';
        n.result = (n.result || []).filter(Boolean); n.shots = (n.shots || []).filter(Boolean);
        return n;
      });
    };
    const publish = () => {
      const ids = Object.keys(drafts); if (!ids.length) { setToast('Nothing new to publish'); return; }
      ids.forEach(id => { C().save(id, clean(id, drafts[id])); localStorage.removeItem(DK(id)); });
      setDrafts({});
      setToast(window.dvCloud && window.dvCloud.canWrite() ? 'Published — live for everyone' : 'Saved in this browser (sign in with cloud to publish live)');
    };
    const discard = () => {
      if (!dirty(col) || !confirm('Discard unpublished changes to ' + def.label + '?')) return;
      localStorage.removeItem(DK(col)); setDrafts(d => { const n = { ...d }; delete n[col]; return n; });
    };
    const tryClose = () => { if (!anyDirty || confirm('You have unpublished changes. They’re kept as a draft in this browser. Close anyway?')) onClose(); };
    const restorePrev = () => { const p = C().prev(col); setMenu(false); if (!p) { setToast('No earlier version saved yet'); return; } update(p); setToast('Previous version loaded — Publish to keep it'); };
    const resetOrig = () => { setMenu(false); if (!confirm('Load the original built-in content for ' + def.label + '? Publish to apply.')) return; update(C().defaults(col)); };

    if (def.doc) {
      return (
        <Shell {...{ cols, col, setCol: c => { setCol(c); setSel(0); setMobileEdit(false); }, dirty, anyDirty, publish, tryClose, toast, discard, menu, setMenu, restorePrev, resetOrig, def, edited: C().edited(col) }}>
          <div className="st-ed st-ed-doc">
            <div className="st-canvas">{def.fields.map((f, i) => <Field key={i} f={f} item={data} onItem={update} />)}</div>
          </div>
        </Shell>
      );
    }

    const list = data;
    const idx = Math.min(sel, list.length - 1);
    const item = list[idx];
    const setItem = n => update(list.map((x, i) => i === idx ? n : x));
    const shown = list.map((x, i) => ({ x, i })).filter(({ x }) => !q || strip(def.title(x) + ' ' + def.sub(x)).toLowerCase().includes(q.toLowerCase()));
    const move = (from, to) => { if (from === to) return; const n = list.slice(); const [x] = n.splice(from, 1); n.splice(to, 0, x); update(n); setSel(to); };

    return (
      <Shell {...{ cols, col, setCol: c => { setCol(c); setSel(0); setQ(''); setMobileEdit(false); }, dirty, anyDirty, publish, tryClose, toast, discard, menu, setMenu, restorePrev, resetOrig, def, edited: C().edited(col) }}>
        <div className={'st-list' + (mobileEdit ? ' m-hide' : '')}>
          <div className="st-list-h">
            <input className="st-in st-search" placeholder={'Search ' + def.label.toLowerCase()} value={q} onChange={e => setQ(e.target.value)} />
            {!def.fixed && <button className="st-btn pri sm" onClick={() => { const n = [...list, def.make()]; update(n); setSel(n.length - 1); setMobileEdit(true); }}>+ New</button>}
          </div>
          <ol className="st-items">
            {shown.map(({ x, i }) => (
              <li key={i} className={(i === idx ? 'on ' : '') + (x.hidden ? 'hid' : '')} draggable={!q}
                onDragStart={() => { drag.current = i; }} onDragOver={e => e.preventDefault()}
                onDrop={() => { move(drag.current, i); drag.current = null; }}
                onClick={() => { setSel(i); setMobileEdit(true); }}>
                <span className="st-grip" title="Drag to reorder">⋮⋮</span>
                <span className="st-it">
                  <b>{strip(def.title(x)) || 'Untitled'}</b>
                  <span>{strip(def.sub(x)).slice(0, 90) || '—'}</span>
                </span>
                {x.hidden && <span className="st-pill">Hidden</span>}
              </li>
            ))}
          </ol>
          <p className="st-help" style={{ padding: '0 16px 16px' }}>Drag to change the order on the site.</p>
        </div>
        <div className={'st-ed' + (mobileEdit ? '' : ' m-hide')}>
          {item ? (
            <>
              <div className="st-ed-bar">
                <button className="st-btn ghost sm m-only" onClick={() => setMobileEdit(false)}>← All</button>
                <span className="mono">{def.item}</span>
                <span className="st-grow"></span>
                {!def.fixed && <label className="st-tog sm"><input type="checkbox" checked={!item.hidden} onChange={e => setItem({ ...item, hidden: !e.target.checked })} /><span></span>{item.hidden ? 'Hidden' : 'Visible'}</label>}
                {!def.fixed && <button className="st-btn ghost sm" title="Duplicate" onClick={() => { const n = list.slice(); const c = clone(item); if (c.id) c.id = uid(String(c.id).slice(0, 1)); n.splice(idx + 1, 0, c); update(n); setSel(idx + 1); }}>Duplicate</button>}
                {!def.fixed && <button className="st-btn ghost sm danger" onClick={() => { if (confirm('Delete “' + strip(def.title(item)) + '”? You can undo by discarding before you publish.')) { update(list.filter((_, i) => i !== idx)); setSel(Math.max(0, idx - 1)); } }}>Delete</button>}
              </div>
              <div className="st-canvas" key={col + idx}>{def.fields.map((f, i) => <Field key={i} f={f} item={item} onItem={setItem} />)}</div>
            </>
          ) : <div className="st-empty">Nothing here yet.</div>}
        </div>
      </Shell>
    );
  }

  function Shell({ cols, col, setCol, dirty, anyDirty, publish, tryClose, toast, discard, menu, setMenu, restorePrev, resetOrig, def, edited, children }) {
    const live = window.dvCloud && window.dvCloud.canWrite();
    return (
      <div className="st" role="dialog" aria-label="Content studio">
        <aside className="st-side">
          <div className="st-brand"><b>Content</b><span className="mono">{live ? 'Live · Supabase' : 'This browser'}</span></div>
          <nav>
            {cols.map(c => (
              <button key={c.id} className={c.id === col ? 'on' : ''} onClick={() => setCol(c.id)}>
                <span>{c.label}</span>{dirty(c.id) && <i title="Unpublished changes"></i>}
              </button>
            ))}
          </nav>
          <select className="st-in st-colsel" value={col} onChange={e => setCol(e.target.value)}>
            {cols.map(c => <option key={c.id} value={c.id}>{c.label}{dirty(c.id) ? ' •' : ''}</option>)}
          </select>
          <button className="st-btn ghost st-exit" onClick={tryClose}>← Back to site</button>
        </aside>
        <header className="st-top">
          <h2>{def.label}</h2>
          <span className={'st-status' + (dirty(col) ? ' warn' : '')}>{dirty(col) ? 'Unpublished changes' : edited ? 'Published' : 'Original'}</span>
          <span className="st-grow"></span>
          <div className="st-menu-w">
            <button className="st-btn ghost sm" onClick={() => setMenu(!menu)} aria-label="More">•••</button>
            {menu && (
              <div className="st-menu" onMouseLeave={() => setMenu(false)}>
                <button onClick={restorePrev}>Restore previous published version</button>
                <button onClick={resetOrig}>Load original content</button>
                {dirty(col) && <button onClick={() => { setMenu(false); discard(); }}>Discard unpublished changes</button>}
              </div>
            )}
          </div>
          <button className="st-btn ghost sm st-x" onClick={tryClose}>Close</button>
          <button className="st-btn pri" disabled={!anyDirty} onClick={publish} title="⌘S">{anyDirty ? 'Publish' : 'Published'}</button>
        </header>
        <div className="st-main">{children}</div>
        {toast && <div className="st-toast">{toast}</div>}
      </div>
    );
  }

  Object.assign(window, { Studio });
})();
