// reader.jsx — the case-study reader. Opens as a sheet over the chat with real
// margins: story lead first, then Problem → Discover → Design → Solution →
// Testing, with the pivot pulled out. Exports window.Reader.
(() => {
  const { useEffect } = React;

  function Shot({ id, cap, tint }) {
    return (
      <figure style={{ margin: 0 }}>
        <media-slot id={id} ratio="4/3" cover label={cap} style={{ '--ms-tint': tint }}></media-slot>
        <figcaption className="mono" style={{ marginTop: 10 }}>{cap}</figcaption>
      </figure>
    );
  }

  function Sec({ k, children }) {
    return <section className="sec"><h3>{k}</h3><div className="body">{children}</div></section>;
  }

  function Block({ b }) {
    if (b.type === 'callout') return (
      <div className={'callout' + (b.tone === 'good' ? ' good' : '')}>
        {b.h && <div className="mono">{b.h}</div>}
        <Rich as="p" t={b.b} style={{ marginTop: b.h ? 9 : 0 }} />
      </div>
    );
    if (b.type === 'funnel') return (
      <table className="tbl funnel">
        <thead><tr>{b.head.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{b.rows.map((r, i) => (
          <tr key={i} className={r[3] === 'warn' ? 'warn' : ''}>
            <td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
          </tr>))}</tbody>
      </table>
    );
    if (b.type === 'releases') return (
      <table className="tbl">
        <thead><tr><th>Release</th><th>Date</th><th>What shipped</th></tr></thead>
        <tbody>{b.rows.map((r, i) => (
          <tr key={i}><td className="mono">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>))}</tbody>
      </table>
    );
    if (b.type === 'timeline') return (
      <ol className="tline">
        {b.items.map((it, i) => (
          <li key={i}>
            <div className="mono">{it.d}</div>
            <h4>{it.t}</h4>
            <Rich as="p" t={it.b} />
          </li>
        ))}
      </ol>
    );
    if (b.type === 'decisions') return (
      <ol className="kd">
        {b.items.map((it, i) => (
          <li key={i}>
            <span className="mono n">{String(i + 1).padStart(2, '0')}</span>
            <div><h4>{it.h}</h4><Rich as="p" t={it.b} /></div>
          </li>
        ))}
      </ol>
    );
    if (b.type === 'outcomes') return (
      <div className="outcomes">
        {b.items.map((it, i) => (
          <div key={i} className="tile">
            <div className="mono" style={{ color: 'var(--accent)' }}>{it.f}</div>
            <h4 style={{ margin: '9px 0 7px', fontSize: 16.5, fontWeight: 500, letterSpacing: '-.02em', color: 'var(--ink)' }}>{it.h}</h4>
            <Rich as="p" t={it.b} style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--dim)', margin: 0 }} />
          </div>
        ))}
      </div>
    );
    return null;
  }

  function Reader({ p, onClose, onNext }) {
    useEffect(() => {
      const esc = e => e.key === 'Escape' && onClose();
      addEventListener('keydown', esc); return () => removeEventListener('keydown', esc);
    }, [onClose]);
    return (
      <div className="reader" onMouseDown={e => e.target === e.currentTarget && onClose()}>
        <div className="sheet" style={{ '--tint': p.tint }}>
          <div className="sheet-in">
            <button className="close" onClick={onClose} aria-label="Close case study">×</button>
            <div className="mono" style={{ color: 'var(--tint)' }}>{p.discipline} · {p.year}</div>
            <h2 style={{ marginTop: 16, maxWidth: '18ch' }}>{p.client}</h2>
            <p className="lede" style={{ marginTop: 16, maxWidth: '34ch', fontWeight: 400 }}>{p.title}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 22, margin: '34px 0 8px',
              padding: 'clamp(20px,2.6vw,28px)', borderRadius: 18, background: 'var(--surface-2)' }}>
              {p.metrics.map((m, i) => (
                <div className="stat" key={i}><b>{m.v}</b><span className="mono">{m.l}</span></div>
              ))}
            </div>

            <div style={{ margin: '38px 0 6px' }}>
              {p.demo && DEMOS.find(d => d.id === p.demo)
                ? <LiveEmbed demo={DEMOS.find(d => d.id === p.demo)} />
                : (<>
                  <media-slot id={`r-${p.id}-hero`} ratio="16/9" cover label={`${p.client} — hero image or video`}
                    style={{ '--ms-tint': p.tint }}></media-slot>
                  <div className="mono" style={{ marginTop: 10 }}>{p.client} — hero image or video</div>
                </>)}
            </div>

            {/* the story lead */}
            <div style={{ padding: 'clamp(34px,4vw,54px) 0 clamp(10px,2vw,22px)' }}>
              <Rich as="p" className="lede" t={p.story} style={{ maxWidth: '46ch' }} />
            </div>

            <div className="pivot" style={{ margin: '10px 0 26px' }}>
              <div className="mono" style={{ color: 'var(--tint)' }}>{p.pivot.h}</div>
              <Rich as="p" t={p.pivot.b} style={{ marginTop: 12, fontSize: 'clamp(17px,1.8vw,21px)', lineHeight: 1.5, letterSpacing: '-.015em', color: 'var(--ink)' }} />
            </div>

            {p.sections.map((s, i) => (
              <React.Fragment key={s.k}>
                <Sec k={s.k}>
                  {s.b.map((t, k) => <Rich key={k} as="p" t={t} />)}
                  {s.list && (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
                      {s.list.map((x, k) => (
                        <li key={k} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 12, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                          <span style={{ color: 'var(--tint)' }}>→</span><Rich t={x} /></li>
                      ))}
                    </ul>
                  )}
                  {s.after && <Rich as="p" t={s.after} />}
                  {(s.blocks || []).map((b, k) => <Block key={k} b={b} />)}
                </Sec>
                {i === 2 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 22,
                    padding: 'clamp(10px,2vw,20px) 0 clamp(20px,3vw,34px)' }} className="rshots">
                    {p.shots.map((c, k) => <Shot key={k} id={`r-${p.id}-shot${k + 1}`} cap={c} tint={p.tint} />)}
                  </div>
                )}
              </React.Fragment>
            ))}

            <Sec k="Result">
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 13 }}>
                {p.result.map((r, k) => (
                  <li key={k} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 12, fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                    <span style={{ color: 'var(--tint)' }}>✦</span><Rich t={r} /></li>
                ))}
              </ul>
              <dl style={{ display: 'grid', gap: 12, margin: '10px 0 0' }}>
                {[['Role', p.role], ['Dates', p.dates], ['Discipline', p.discipline]].map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 14 }}>
                    <dt className="mono">{k}</dt><dd style={{ margin: 0, fontSize: 15.5, color: 'var(--ink-2)' }}>{v}</dd>
                  </div>
                ))}
              </dl>
              {p.note && <div className="mono" style={{ marginTop: 10, padding: '14px 18px', borderRadius: 12,
                border: '1px dashed var(--tint)', textTransform: 'none', letterSpacing: 0, fontSize: 12.5,
                lineHeight: 1.7, color: 'var(--dim)' }}>Note to self · {p.note}</div>}
            </Sec>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 34 }}>
              <button className="btn solid" onClick={onClose}><span>Back to the conversation</span></button>
              {onNext && <button className="btn" onClick={onNext}><span>Next case study →</span></button>}
            </div>
          </div>
          <style>{`@media(max-width:760px){.rshots{grid-template-columns:minmax(0,1fr)!important}}`}</style>
        </div>
      </div>
    );
  }

  Object.assign(window, { Reader });
})();
