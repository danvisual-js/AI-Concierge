// play.jsx — the visual design side: one card per role/client, two-up like the
// case studies, each linking out to the live page on danielvisual.com. Every card
// has an owner-editable media slot. Exports window.PlayGallery, window.PLAY.
(() => {
  const PLAY = [
    { id: 'sephora', co: 'Sephora', role: 'Digital marketing design', year: '2015–16',
      d: 'Campaign pages, email and app creative for Sephora and the Sephora Collection rebrand — playful product storytelling built to work inside a heavily merchandised system.',
      body: 'Sephora Collection was being relaunched with a lighter, more editorial voice. I designed the swipe-to-shop app moments ("Swipe it, shop it"), desktop landing pages and out-of-home pieces, keeping product photography front and centre and letting copy do the playful work.',
      url: 'https://www.danielvisual.com/play/sephora-digital-6hb9b',
      gal: [["## Sephora Collection relaunch — “Beauty, uncomplicated”", "App, web, email and out-of-home for the 2016 relaunch: playful product storytelling with the copy doing the work."], ["Swipe it, shop it — in motion", "assets/play/sephora-swipe.mp4"], ["“The beauty uncomplicator” — fill in the blanks", "assets/play/sephora-madlib.mp4"], ["Desktop landing page — “Get what you want”", "assets/play/g/se-getwhat.jpg", "w"], ["The uncomplicator, swipe and lipstick screens", "assets/play/g/se-phones.jpg"], ["Lip campaign creative", "assets/play/g/se-lips.jpg"], ["Key visual — “I want beauty, uncomplicated”", "assets/play/g/se-kv.jpg", "w"], ["Out-of-home: bus shelter", "assets/play/g/se-shelter.jpg"], ["Mobile: eyeliner finder", "assets/play/g/se-eyeliner.jpg"], ["Store-front takeover", "assets/play/g/se-store.jpg", "w"], ["Email: Mini Makeover", "assets/play/g/se-minimakeover.jpg"], ["Email: the “Uncomplicated” series", "assets/play/g/se-uncomp-email.jpg"], ["## Holiday & gifting", "Seasonal campaigns across the site, app and inbox — advent calendar, gift cards and holiday navigation."], ["“Instant gift-ification” landing page", "assets/play/g/se-giftification.jpg", "w"], ["Holiday social film", "assets/play/sephora-holiday-film.mp4"], ["Holiday advent calendar — 25 days of samples", "assets/play/sephora-advent.mp4"], ["Holiday in the app, in motion", "assets/play/sephora-holiday-app.mp4"], ["Gift-card ornament email", "assets/play/sephora-ornament.mp4"], ["Holiday meganav", "assets/play/sephora-meganav.mp4", "w"], ["Beauty Studio gift cards on mobile", "assets/play/sephora-giftcard.mp4"], ["“One gift card fits all”", "assets/play/g/se-onegift.jpg"], ["Gifts category page", "assets/play/g/se-gifts.jpg", "w"], ["Holiday gift-card shop", "assets/play/g/se-giftshop.jpg"], ["Gift-card page on mobile", "assets/play/g/se-giftcard-m.jpg"], ["## Skincare & beauty services", "Product launches and in-store services, told with the same editorial voice."], ["“Science, not fiction” skincare landing", "assets/play/g/se-science.jpg", "w"], ["Color iQ and Beauty Together", "assets/play/g/se-coloriq.jpg"], ["Beauty Together in-store board", "assets/play/sephora-beautytogether.mp4"], ["“Science, not fiction” print spread", "assets/play/g/se-spread.jpg", "w"], ["## Email", "Promotional and editorial emails — scroll each one."], ["Black Friday", "assets/play/g/se-em-blackfriday.jpg"], ["PLAY! by Sephora", "assets/play/g/se-em-play.jpg"], ["New products for VIB", "assets/play/g/se-em-new.jpg"], ["Sephora favorites", "assets/play/g/se-em-favs.jpg"], ["Fragrance minis", "assets/play/g/se-em-frag.jpg"]] },
    { id: 'oldnavy', co: 'Old Navy', role: 'Lead designer, paid media', year: '2016–17',
      d: 'Lead designer on paid media — seasonal campaigns across social, partner sites and out-of-home, shipped on a fast weekly cadence.',
      body: 'I led paid-media design for campaigns like the NFL / CBS partnership and "Meet Stevie", adapting one idea across Facebook carousels, partner placements such as Who What Wear, and city billboards — all held together by a tight colour palette.',
      url: 'https://www.danielvisual.com/play/old-navy-digital-r84fd',
      gal: [["## NFL × CBS Sports partnership", "Flex-fit menswear placements built to sit inside live sports coverage."], ["NFL Player News takeover", "assets/play/g/on-nfl-1.jpg", "w"], ["Animated banner on a sports news page", "assets/play/oldnavy-nfl.mp4"], ["Inline placement", "assets/play/g/on-nfl-2.jpg"], ["## Who What Wear × “Meet Stevie”", "A partner campaign that ran as editorial-style placements on desktop and mobile."], ["Desktop placements", "assets/play/g/on-www-1.jpg", "w"], ["Who What Wear mobile placement", "assets/play/oldnavy-www.mp4"], ["“Meet Stevie” on mobile", "assets/play/g/on-stevie-m.jpg"], ["“Meet Stevie” video unit", "assets/play/g/on-stevie.jpg", "w"], ["## Sales & promotions", "Weekly sale creative across social, paid media and out-of-home."], ["Out-of-home: San Francisco", "assets/play/g/on-billboard.jpg", "w"], ["Summer sale social ad", "assets/play/oldnavy-social.mp4"], ["Sale creative: all pants & jeans", "assets/play/g/on-pants.jpg"], ["Facebook carousel", "assets/play/g/on-fb.jpg", "w"], ["In-store poster: 2 days only", "assets/play/g/on-2days.jpg"], ["Paid-media banner system, every IAB size", "assets/play/g/on-iab.jpg"], ["## Email", "Promotional emails — scroll each one."], ["2 days only", "assets/play/g/on-em-2days.jpg"], ["Clearance", "assets/play/g/on-em-clearance.jpg"], ["Winter sale", "assets/play/g/on-em-winter.jpg"], ["Ending soon", "assets/play/g/on-em-ending.jpg"], ["Swim, today only", "assets/play/g/on-em-swim.jpg"], ["Summer uniform", "assets/play/g/on-em-summer.jpg"], ["## Brand standards", "Evergreen guidelines for the paid-media team."], ["Franklin Gothic in use", "assets/play/g/on-franklin.jpg", "w"], ["Campaign colour palette", "assets/play/g/on-palette.jpg"], ["Price-lockup type system", "assets/play/g/on-price.jpg"]] },
    { id: 'amazon', hero: 'assets/play/amazon-student.mp4', co: 'Amazon WFS', role: 'Brand & recruiting design', year: '2021',
      d: 'Brand colours and recruiting creative for Amazon Workforce Staffing — helping it stand apart from Amazon Retail while staying inside the umbrella.',
      body: 'The goal was employee acquisition. Campaigns like "Beyond the 9 to 5", the $15/hr starting-wage push and Upskilling 2025 ran across Instagram, Facebook and email. Colour, type and photography were kept simple and relatable — real associates, plain promises, one clear action.',
      url: 'https://www.danielvisual.com/play/amazon-wfs-fztdw',
      gal: [["## Site", "The recruiting landing page."], ["Recruiting landing page", "assets/play/g/az-landing.jpg", "w"], ["## Email", "Recruiting and shift emails, desktop and mobile."], ["“Think outside the 9 to 5” email, desktop & mobile", "assets/play/g/az-email.jpg", "w"], ["Animated email: “When they’re open, you’re open.”", "assets/play/amazon-open.mp4"], ["Night-shift email: “Sleep in late. Get done early.”", "assets/play/amazon-3.jpg"], ["## Banners & social", "Instagram, Facebook and video end cards."], ["Instagram campaign: shifts, tuition and pay", "assets/play/g/az-ig.jpg", "w"], ["Facebook ad for warehouse roles", "assets/play/g/az-fb.jpg"], ["Instagram set with a video end card", "assets/play/g/az-igset.jpg"], ["## Brand system", "Evergreen guidelines that set Workforce Staffing apart from Amazon Retail."], ["Workforce wordmark and definition", "assets/play/g/az-wordmark.jpg", "w"], ["Colours", "assets/play/g/az-colors.jpg", "w"], ["Tone and voice", "assets/play/g/az-tone.jpg", "w"], ["Photography direction", "assets/play/g/az-photo.jpg", "w"], ["Photography in use", "assets/play/g/az-photo-2.jpg", "w"], ["Associate stories", "assets/play/g/az-story.jpg", "w"]] },
    { id: 'livenation', co: 'Live Nation', role: 'Artist web & tour creative', year: '2014–15',
      d: 'Artist sites, tour pages, fan-club and pre-sale flows for touring acts — where the artist brand always leads and the layout gets out of the way.',
      body: 'I designed artist landing pages (like the Nickelback splash), tour-date tables built around pre-sale, tickets and VIP packages, plus fan-club registration and pre-sale campaigns for tours such as Rebel Heart and Zac Brown Band.',
      url: 'https://www.danielvisual.com/play/live-nation-dxxzm',
      gal: [["## Madonna — Rebel Heart and MDNA tours", "Tour dates, VIP packages and the fan-club account behind every pre-sale."], ["Tour dates with pre-sale & packages", "assets/play/g/ln-tour.jpg"], ["Choose a package and sign up", "assets/play/g/ln-packages.jpg"], ["Fan-club account and pre-sale code", "assets/play/g/ln-account.jpg"], ["## Fan clubs & pre-sales", "Sign-up flows built so the artist brand leads and the form gets out of the way."], ["Zac Brown Band fan club, laptop & phone", "assets/play/g/ln-zbb.jpg"], ["Nickelback splash page", "assets/play/g/ln-nickelback.jpg"], ["Mobile pre-sale sign-up", "assets/play/livenation-5.jpg"], ["## Merch stores", "Storefronts for artist merchandise."], ["Jay-Z store: On the Run and Magna Carta merch", "assets/play/g/ln-jayz.jpg"], ["Megadeth “Dystopia” pre-order on mobile", "assets/play/g/ln-megadeth.jpg"], ["Insomniac store email", "assets/play/g/ln-insomniac.jpg"]] },
    { id: 'vaxsmart', co: 'Vax Smart', role: 'UX/UI, visual design & development', year: '4 weeks',
      d: 'A responsive homepage for a mobile pet-vaccination clinic — so owners arrive with the right documents and fewer visits get rescheduled.',
      body: 'Pet owners need health history and prescriptions before a vaccination, and missing paperwork meant delays. I designed and built a homepage that puts testing protocols, forms and over-the-counter products up front, working across tablet and phone.',
      url: 'https://www.danielvisual.com/play/vaxsmart-nndht',
      gal: [['Desktop homepage', 2], ['Tablet homepage', 3], ['Sitemap: point of sale, information and servicing', 4], ['Competitive analysis against two Bay Area clinics', 5], ['Product page: NexGard comparison', 6]] },
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

  // card thumbnail: a looping clip when the project has a hero video, otherwise the cover slot
  function PlayThumb({ v, label }) {
    if (v.hero) return <video className="x-pthumb" src={v.hero} autoPlay muted loop playsInline aria-label={label || v.co}
      style={{ display: 'block', width: '100%', aspectRatio: '16/10', objectFit: 'cover', background: '#000' }} />;
    return <media-slot id={`play-${v.id}`} ratio="16/10" cover lock size="full" frame="none" fit="cover" src={`assets/play/${v.id}.jpg`} label={label || `${v.co} — ${v.role}`}></media-slot>;
  }
  window.PlayThumb = PlayThumb;
  window.dvContent.bind('play', PLAY);
  Object.assign(window, { PlayGallery, PlayCard, PLAY });
})();
