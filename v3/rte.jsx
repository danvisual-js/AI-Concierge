// rte.jsx — the rich text editor used across the Content studio. A familiar
// blog-editor toolbar over a contentEditable surface, with an HTML source view.
// Output is clean HTML; paste is sanitised down to the same small tag set.
(() => {
  const { useRef, useEffect, useState, useCallback } = React;

  const ALLOWED = new Set(['P', 'H2', 'H3', 'H4', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'A', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'BR', 'HR', 'IMG', 'FIGURE', 'FIGCAPTION', 'CODE', 'PRE', 'SPAN']);
  const sanitize = html => {
    const d = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html');
    const root = d.body.firstChild;
    const walk = n => {
      [...n.childNodes].forEach(c => {
        if (c.nodeType === 8) { c.remove(); return; }
        if (c.nodeType !== 1) return;
        walk(c);
        if (c.tagName === 'DIV') { const p = d.createElement('p'); while (c.firstChild) p.appendChild(c.firstChild); c.replaceWith(p); return; }
        if (c.tagName === 'H1') { const h = d.createElement('h2'); while (c.firstChild) h.appendChild(c.firstChild); c.replaceWith(h); return; }
        if (!ALLOWED.has(c.tagName)) { c.replaceWith(...c.childNodes); return; }
        [...c.attributes].forEach(a => {
          const keep = (c.tagName === 'A' && a.name === 'href' && !/^\s*javascript:/i.test(a.value))
            || (c.tagName === 'IMG' && (a.name === 'src' || a.name === 'alt'));
          if (!keep) c.removeAttribute(a.name);
        });
        if (c.tagName === 'SPAN') c.replaceWith(...c.childNodes);
      });
    };
    walk(root);
    return root.innerHTML.replace(/<p>(\s|<br>)*<\/p>/g, '').trim();
  };

  // Legacy copy uses **bold** and plain paragraphs; lift it into HTML on load.
  const toHtml = (v, inline) => {
    const s = String(v ?? '');
    if (/<[a-z][\s\S]*>/i.test(s)) return s;
    const md = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    if (inline) return md;
    return md.split(/\n{2,}/).filter(Boolean).map(x => '<p>' + x.replace(/\n/g, '<br>') + '</p>').join('');
  };

  const TOOLS = [
    { id: 'undo', t: 'Undo', g: '↶', cmd: 'undo' }, { id: 'redo', t: 'Redo', g: '↷', cmd: 'redo' }, '|',
    { id: 'block' }, '|',
    { id: 'b', t: 'Bold (⌘B)', g: <b>B</b>, cmd: 'bold', st: 'bold' },
    { id: 'i', t: 'Italic (⌘I)', g: <i>I</i>, cmd: 'italic', st: 'italic' },
    { id: 'u', t: 'Underline (⌘U)', g: <u>U</u>, cmd: 'underline', st: 'underline' },
    { id: 's', t: 'Strikethrough', g: <s>S</s>, cmd: 'strikeThrough', st: 'strikeThrough' }, '|',
    { id: 'ul', t: 'Bulleted list', g: '••', cmd: 'insertUnorderedList', st: 'insertUnorderedList', blockOnly: true },
    { id: 'ol', t: 'Numbered list', g: '1.', cmd: 'insertOrderedList', st: 'insertOrderedList', blockOnly: true },
    { id: 'q', t: 'Quote', g: '❝', blockOnly: true },
    { id: 'hr', t: 'Divider', g: '—', cmd: 'insertHorizontalRule', blockOnly: true }, '|',
    { id: 'link', t: 'Link (⌘K)', g: '🔗︎' }, { id: 'unlink', t: 'Remove link', g: '⛓︎', cmd: 'unlink' },
    { id: 'img', t: 'Insert image', g: '▣', blockOnly: true }, '|',
    { id: 'clear', t: 'Clear formatting', g: 'T̸', cmd: 'removeFormat' },
  ];

  function RichEditor({ value, onChange, inline = false, placeholder = 'Start writing…', minHeight }) {
    const ref = useRef(null);
    const [src, setSrc] = useState(false);
    const [html, setHtml] = useState(() => toHtml(value, inline));
    const [state, setState] = useState({});
    const [count, setCount] = useState(0);
    const last = useRef(html);

    useEffect(() => {
      const next = toHtml(value, inline);
      if (next !== last.current) { last.current = next; setHtml(next); if (ref.current && !src) ref.current.innerHTML = next; }
    }, [value]);
    useEffect(() => { if (ref.current && !src) ref.current.innerHTML = html; }, [src]);
    useEffect(() => { setCount((ref.current ? ref.current.innerText : html.replace(/<[^>]+>/g, ' ')).trim().split(/\s+/).filter(Boolean).length); }, [html]);

    const emit = useCallback(() => {
      if (!ref.current) return;
      let h = sanitize(ref.current.innerHTML);
      if (inline) h = h.replace(/<\/?p>/g, '').replace(/<(h\d|blockquote|ul|ol|li)[^>]*>|<\/(h\d|blockquote|ul|ol|li)>/g, '');
      last.current = h; setHtml(h); onChange(h);
    }, [onChange, inline]);

    const refresh = () => {
      const s = {};
      ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'].forEach(c => { try { s[c] = document.queryCommandState(c); } catch (e) {} });
      try { s.block = (document.queryCommandValue('formatBlock') || 'p').toLowerCase().replace(/[<>]/g, ''); } catch (e) {}
      setState(s);
    };
    const exec = (cmd, arg) => { ref.current.focus(); document.execCommand(cmd, false, arg); emit(); refresh(); };

    const doLink = () => {
      const sel = getSelection();
      const url = prompt('Link URL', 'https://');
      if (!url || url === 'https://') return;
      if (sel && sel.isCollapsed) exec('insertHTML', `<a href="${url.replace(/"/g, '')}">${url.replace(/</g, '&lt;')}</a>`);
      else exec('createLink', url);
    };
    const doImg = () => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = async () => {
        const f = inp.files[0]; if (!f) return;
        let url;
        if (window.dvCloud && window.dvCloud.canWrite()) {
          try { url = await window.dvCloud.upload('content-img', f, f.name); } catch (e) { alert('Upload failed.'); return; }
        } else {
          url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); });
        }
        const alt = prompt('Describe the image (alt text)', '') || '';
        exec('insertHTML', `<figure><img src="${url}" alt="${alt.replace(/"/g, '')}"></figure><p><br></p>`);
      };
      inp.click();
    };
    const run = t => {
      if (t.id === 'link') return doLink();
      if (t.id === 'img') return doImg();
      if (t.id === 'q') return exec('formatBlock', state.block === 'blockquote' ? 'p' : 'blockquote');
      exec(t.cmd);
    };
    const onKey = e => {
      const m = e.metaKey || e.ctrlKey;
      if (m && e.key.toLowerCase() === 'k') { e.preventDefault(); doLink(); }
      if (inline && e.key === 'Enter') e.preventDefault();
    };
    const onPaste = e => {
      e.preventDefault();
      const h = e.clipboardData.getData('text/html');
      const t = e.clipboardData.getData('text/plain');
      if (h && !inline) document.execCommand('insertHTML', false, sanitize(h));
      else document.execCommand('insertText', false, t);
      emit();
    };

    return (
      <div className={'rte' + (inline ? ' inl' : '') + (src ? ' src' : '')}>
        <div className="rte-bar" onMouseDown={e => { if (e.target.tagName !== 'SELECT') e.preventDefault(); }}>
          {TOOLS.filter(t => !(inline && (t.blockOnly || t.id === 'block'))).map((t, i) => t === '|'
            ? <span key={i} className="rte-sep"></span>
            : t.id === 'block'
              ? <select key={i} className="rte-sel" value={['h2', 'h3', 'h4', 'blockquote', 'pre'].includes(state.block) ? state.block : 'p'} disabled={src}
                onChange={e => exec('formatBlock', e.target.value)} title="Text style">
                <option value="p">Paragraph</option><option value="h2">Heading</option><option value="h3">Subheading</option>
                <option value="h4">Small heading</option><option value="blockquote">Quote</option><option value="pre">Code</option>
              </select>
              : <button key={i} type="button" title={t.t} disabled={src} className={t.st && state[t.st] ? 'on' : ''} onClick={() => run(t)}>{t.g}</button>)}
          <span className="rte-grow"></span>
          <button type="button" className={'rte-txt' + (src ? ' on' : '')} title="Edit HTML" onClick={() => {
            if (src) { const h = sanitize(html); last.current = h; setHtml(h); onChange(h); }
            setSrc(!src);
          }}>{src ? 'Visual' : 'HTML'}</button>
        </div>
        {src
          ? <textarea className="rte-code" value={html} spellCheck={false} onChange={e => setHtml(e.target.value)}
            onBlur={() => { const h = sanitize(html); last.current = h; onChange(h); }} style={{ minHeight }}></textarea>
          : <div ref={ref} className="rte-body rt" contentEditable suppressContentEditableWarning data-ph={placeholder}
            onInput={emit} onKeyDown={onKey} onKeyUp={refresh} onMouseUp={refresh} onFocus={refresh} onPaste={onPaste}
            style={{ minHeight }}></div>}
        {!inline && <div className="rte-foot mono">{count} words</div>}
      </div>
    );
  }

  Object.assign(window, { RichEditor, rteSanitize: sanitize, rteToHtml: toHtml });
})();
