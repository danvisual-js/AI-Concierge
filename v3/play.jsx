// play.jsx — the visual design side: one card per role/client, two-up like the
// case studies, each linking out to the live page on danielvisual.com. Every card
// has an owner-editable media slot. Exports window.PlayGallery, window.PLAY.
(() => {
  const PLAY = [
    { id: 'sephora', co: 'Sephora', role: 'Digital marketing design',
      d: 'Campaign pages, email and promotional creative for beauty launches — built to hold up across a heavily merchandised template system.',
      url: 'https://www.danielvisual.com/play/sephora-digital-6hb9b' },
    { id: 'oldnavy', co: 'Old Navy', role: 'Digital design',
      d: 'Seasonal promo and merchandising creative across web and email, working inside a fast weekly campaign cadence.',
      url: 'https://www.danielvisual.com/play/old-navy-digital-r84fd' },
    { id: 'amazon', co: 'Amazon WFS', role: 'Brand & digital design',
      d: 'Identity and communication design for an Amazon fulfillment programme — internal-facing work that had to read clearly at speed.',
      url: 'https://www.danielvisual.com/play/amazon-wfs-fztdw' },
    { id: 'livenation', co: 'Live Nation', role: 'Event & tour creative',
      d: 'Key art, social and ticketing promo for live events, where the artist brand always leads and the layout has to get out of the way.',
      url: 'https://www.danielvisual.com/play/live-nation-dxxzm' },
    { id: 'vaxsmart', co: 'Vax Smart', role: 'Identity & campaign design',
      d: 'Identity and campaign system for a public-health vaccination effort — plain language, high trust, zero clinical coldness.',
      url: 'https://www.danielvisual.com/play/vaxsmart-nndht' },
  ];

  function PlayCard({ p, i }) {
    return (
      <a className="ccard" href={p.url} target="_blank" rel="noreferrer" style={{ '--tint': 'var(--accent)' }}>
        <span className="thumb">
          <media-slot id={`play-${p.id}`} ratio="16/10" cover lock size="full" frame="none" fit="cover" label={`${p.co} — ${p.role}`}></media-slot>
          <span className="ccard-go" aria-hidden="true">Open ↗</span>
        </span>
        <span className="ccard-body">
          <span className="mono ccard-kick">{String(i + 1).padStart(2, '0')} · {p.role}</span>
          <span className="ccard-co">{p.co}</span>
          <span className="ccard-t">{p.d}</span>
        </span>
      </a>
    );
  }

  function PlayGallery({ stagger = true }) {
    const own = typeof document !== 'undefined' && document.body.dataset.owner === '1';
    return (
      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'grid', gap: 10, maxWidth: '62ch' }}>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink-2)', margin: 0 }}>
            Before the product work — and alongside it — Dan spent years on the visual craft. Five separate roles, each its
            own client and its own design language. It’s the reason his product work has a point of view about type and
            rhythm, not just flows.
          </p>
          <a className="chip" href="https://www.danielvisual.com/play" target="_blank" rel="noreferrer"
            style={{ justifySelf: 'start' }}>See the full Visual Design archive ↗</a>
        </div>
        {window.Stages
          ? <window.Stages className="cgrid" items={PLAY.map((p, i) => ({ label: p.co, node: <PlayCard key={p.id} p={p} i={i} /> }))} />
          : <div className="cgrid">{PLAY.map((p, i) => <PlayCard key={p.id} p={p} i={i} />)}</div>}
        {own && <div className="mono" style={{ color: 'var(--accent)' }}>Edit mode on — drop images straight into any card</div>}
      </div>
    );
  }

  window.dvContent.bind('play', PLAY);
  Object.assign(window, { PlayGallery, PlayCard, PLAY });
})();
