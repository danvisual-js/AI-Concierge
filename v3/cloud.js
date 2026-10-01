// Cloud content layer. Site content lives in Supabase, not in the code, so a
// redeploy never touches uploads or edits.
//  • Keys starting with `ms:` (media slots) or `dv3.` (site-wide settings) are
//    mirrored: remote values are pulled into localStorage before the app renders,
//    and owner writes are pushed back up.
//  • Files go to a public Storage bucket; slots store the public URL.
//  • Per-visitor prefs (theme, sound, owner flag) stay local.
(() => {
  const C = window.DV_CONFIG || {};
  const enabled = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase);
  const SYNC = k => k.startsWith('ms:') || k.startsWith('dv3.');
  const rawSet = Storage.prototype.setItem;
  const rawRemove = Storage.prototype.removeItem;
  let sb = null, session = null;

  const norm = s => String(s || '').trim().toLowerCase();
  // No owner email configured = nobody can edit. Never fall open.
  const isOwner = () => !!(session && C.OWNER_EMAIL && norm(session.user.email) === norm(C.OWNER_EMAIL));
  const canWrite = () => enabled && isOwner();

  const timers = {};
  const put = (key, value) => {
    if (!canWrite()) return;
    clearTimeout(timers[key]);
    timers[key] = setTimeout(async () => {
      const { error } = await sb.from('content').upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) console.warn('[cloud] save failed', key, error.message);
    }, 400);
  };
  const del = async key => { if (canWrite()) await sb.from('content').delete().eq('key', key); };

  if (enabled) {
    Storage.prototype.setItem = function (k, v) {
      rawSet.call(this, k, v);
      if (this === localStorage && SYNC(k)) put(k, String(v));
    };
    Storage.prototype.removeItem = function (k) {
      rawRemove.call(this, k);
      if (this === localStorage && SYNC(k)) del(k);
    };
  }

  const upload = async (key, blob, name) => {
    if (!canWrite()) throw new Error(session ? 'Signed in as ' + session.user.email + ', which isn’t OWNER_EMAIL in config.js.' : 'Not signed in.');
    const ext = (name && name.includes('.') ? name.split('.').pop() : (blob.type.split('/')[1] || 'bin')).toLowerCase();
    const path = `${key.replace(/[^a-z0-9_-]/gi, '_')}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from(C.BUCKET || 'media').upload(path, blob, { contentType: blob.type, upsert: true, cacheControl: '31536000' });
    if (error) throw new Error(explain(error));
    return sb.storage.from(C.BUCKET || 'media').getPublicUrl(path).data.publicUrl;
  };

  const explain = e => {
    const m = String((e && (e.message || e.error)) || e || '');
    const l = m.toLowerCase();
    if (l.includes('bucket not found')) return 'Storage bucket “' + (C.BUCKET || 'media') + '” doesn’t exist — run the setup SQL (step 01).';
    if (l.includes('row-level security') || l.includes('violates') || l.includes('unauthorized') || l.includes('403')) return 'Supabase refused the upload — the email in the storage policy doesn’t match your sign-in email.';
    if (l.includes('exceeded') || l.includes('too large') || l.includes('413')) return 'File too large for your Supabase plan (free tier: 50 MB per file).';
    if (l.includes('mime') || l.includes('invalid')) return 'Supabase rejected this file type: ' + m;
    if (l.includes('failed to fetch') || l.includes('network')) return 'Couldn’t reach Supabase — check SUPABASE_URL in config.js.';
    return m || 'Unknown error';
  };

  // Step-by-step check of every piece the editor relies on.
  const diagnose = async () => {
    const out = [];
    const ok = (l, v) => out.push({ l, ok: true, v }), bad = (l, v) => out.push({ l, ok: false, v });
    if (!enabled) { bad('Config', 'SUPABASE_URL / SUPABASE_ANON_KEY empty in v3/config.js'); return out; }
    ok('Config', C.SUPABASE_URL);
    if (!session) { bad('Signed in', 'No session — sign in first'); return out; }
    ok('Signed in', session.user.email);
    if (!isOwner()) { bad('Owner match', 'OWNER_EMAIL in config.js is “' + (C.OWNER_EMAIL || '(blank)') + '”'); return out; }
    ok('Owner match', C.OWNER_EMAIL);
    let r = await sb.from('content').select('key').limit(1);
    r.error ? bad('Read content table', explain(r.error)) : ok('Read content table', 'OK');
    r = await sb.from('content').upsert({ key: 'dv3.__check', value: String(Date.now()) });
    r.error ? bad('Write content table', explain(r.error)) : ok('Write content table', 'OK');
    const path = '__check/' + Date.now() + '.txt';
    r = await sb.storage.from(C.BUCKET || 'media').upload(path, new Blob(['ok'], { type: 'text/plain' }), { upsert: true });
    if (r.error) bad('Upload to storage', explain(r.error));
    else { ok('Upload to storage', 'OK'); await sb.storage.from(C.BUCKET || 'media').remove([path]); }
    return out;
  };

  const pull = async () => {
    const { data, error } = await sb.from('content').select('key,value');
    if (error) { console.warn('[cloud] load failed', error.message); return; }
    // Remote is the source of truth for every key it has. Local-only keys are
    // left alone so unmigrated work on the owner's machine isn't wiped.
    (data || []).forEach(r => rawSet.call(localStorage, r.key, r.value));
  };

  // One-time push of everything made in local mode: blobs and data-URLs are
  // uploaded, then every synced key is written to the table.
  const migrate = async onProgress => {
    if (!canWrite()) throw new Error('Sign in first.');
    const keys = Object.keys(localStorage).filter(SYNC);
    let n = 0;
    for (const k of keys) {
      let v = localStorage.getItem(k);
      if (k.startsWith('ms:')) {
        try {
          const o = JSON.parse(v);
          let blob = null;
          if (o.src === 'idb' && window.dvMedia) blob = await window.dvMedia.idbGet(k);
          else if (o.src && o.src.startsWith('data:')) blob = await (await fetch(o.src)).blob();
          if (blob) { o.src = await upload(k, blob, o.type ? 'f.' + o.type.split('/')[1] : ''); v = JSON.stringify(o); }
          else if (o.src === 'idb') { onProgress && onProgress(++n, keys.length); continue; }
        } catch (e) { console.warn('[cloud] migrate', k, e); }
      }
      await sb.from('content').upsert({ key: k, value: v, updated_at: new Date().toISOString() });
      rawSet.call(localStorage, k, v);
      onProgress && onProgress(++n, keys.length);
    }
    dispatchEvent(new Event('media-change'));
    return n;
  };

  // Only the owner address can request a link, and Supabase is told never to
  // create an account from this form. Already signed in? Skip the email.
  const signIn = async (email, password) => {
    if (!C.OWNER_EMAIL) throw new Error('Owner email isn’t set in config.js.');
    if (norm(email) !== norm(C.OWNER_EMAIL)) throw new Error('This site only accepts its owner.');
    if (isOwner()) return 'already';
    if (password) {
      const { data, error } = await sb.auth.signInWithPassword({ email: norm(email), password });
      if (error) throw new Error((error.message || '').toLowerCase().includes('invalid') ? 'Wrong email or password.' : error.message);
      session = data.session;
      return 'in';
    }
    const { error } = await sb.auth.signInWithOtp({ email: norm(email), options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } });
    if (error) {
      const m = (error.message || '').toLowerCase();
      if (error.status === 429 || m.includes('rate limit') || m.includes('seconds')) throw new Error('Too many links requested. Wait a minute, or use the last link you received.');
      if (m.includes('signups not allowed') || m.includes('not found')) throw new Error('No account for that email yet. See setup step 01.');
      throw error;
    }
    return 'sent';
  };
  const signOut = async () => { await sb.auth.signOut(); session = null; window.dvOwner && window.dvOwner.set(false); };

  const ready = !enabled ? Promise.resolve() : (async () => {
    sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY);
    const s = await sb.auth.getSession();
    session = s.data.session;
    sb.auth.onAuthStateChange((_e, sess) => {
      session = sess;
      if (window.dvOwner) window.dvOwner.set(isOwner());
      dispatchEvent(new Event('cloud-auth'));
    });
    await Promise.race([pull(), new Promise(r => setTimeout(r, 5000))]);
  })().catch(e => console.warn('[cloud]', e));

  window.dvCloud = { enabled, ready, canWrite, isOwner, upload, migrate, signIn, signOut, diagnose,
    get email() { return session && session.user.email; } };
})();
