// Shareable links + quick actions.
//
//   #experience, #stack, #about, #work, #contact   → that section
//   #work/<project-slug>                           → that project card (e.g. #work/syncro)
//   (no hash) or #index                            → home
//   #plain                                         → list view (handled by plain.js)
//
// The address bar follows you around the map (replaceState, so Back isn't spammed),
// and every link can be pasted to land someone exactly there.
window.Nav = function (zones, C) {
  const byName = {};
  Object.values(zones).forEach(z => { byName[z.nav.toLowerCase()] = z; });
  const base = () => location.href.split('#')[0];

  // ── toast ──
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ── hash → camera ──
  function cardCamera(el, zone) {
    const x = zone.x + el.offsetLeft, y = zone.y + el.offsetTop, w = el.offsetWidth;
    const phone = innerWidth < 700;
    const s = phone ? (innerWidth - 24) / w : Math.min(.9, (innerWidth - 80) / w);
    return { s, x: innerWidth / 2 - (x + w / 2) * s, y: (phone ? 56 : 70) - y * s };
  }
  function cameraFor(hash) {
    const [area, item] = hash.replace(/^#/, '').toLowerCase().split('/');
    if (!area || area === 'plain') return null;
    const zone = byName[area];
    if (!zone) return null;
    if (item && zone.id === 'projects') {
      const el = document.getElementById('project-' + item);
      if (el) return cardCamera(el, zone);
    }
    return Plane.fitZone(zone);
  }

  let lastSet = '';
  function setHash(h) {
    lastSet = h;
    const url = h && h !== 'index' ? base() + '#' + h : base();
    if (url !== location.href) history.replaceState(null, '', url);
  }

  // go('work/syncro') — glide (or jump) there and reflect it in the address bar
  function go(h, { animate = true } = {}) {
    h = h.replace(/^#/, '');
    const cam = cameraFor(h || 'index');
    if (!cam) return false;
    setHash(h);
    if (animate) Plane.glide(cam);
    else { Object.assign(Plane.cam, cam); Plane.apply(); }
    return true;
  }

  addEventListener('hashchange', () => {
    if (location.hash !== '#plain') go(location.hash);
  });

  // While wandering: once the camera settles, put the section you're in into the
  // address bar — but never downgrade a project link (#work/syncro) to #work.
  let settle;
  Plane.onChange(() => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      if (location.hash === '#plain' || document.body.classList.contains('touring')) return;
      const c = Plane.center();
      const z = Object.values(zones).find(z => c.x > z.x && c.x < z.x + z.w && c.y > z.y && c.y < z.y + z.h);
      if (!z) return;
      const name = z.nav.toLowerCase();
      if (lastSet.split('/')[0] === name) return;
      setHash(name);
    }, 600);
  });

  // ── quick actions ──
  const copyEmail = async () => toast((await U.copy(C.email)) ? `Email copied — ${C.email}` : C.email);
  document.getElementById('copy-email').onclick = copyEmail;

  const resume = document.getElementById('resume-btn');
  if (C.links.resume) resume.href = C.links.resume;
  else {
    resume.classList.add('missing');
    resume.title = 'Set links.resume in js/content.js';
    resume.onclick = e => { e.preventDefault(); toast('Résumé link not added yet — set links.resume in js/content.js'); };
  }

  // copy buttons inside the map (delegated; stop them from starting a pan)
  Plane.world.addEventListener('pointerdown', e => { if (e.target.closest('.copy-btn')) e.stopPropagation(); });
  Plane.world.addEventListener('click', async e => {
    const b = e.target.closest('.copy-btn');
    if (!b) return;
    if (b.hasAttribute('data-copy-email')) return copyEmail();
    const link = base() + '#' + b.dataset.copyLink;
    toast((await U.copy(link)) ? 'Link copied' : link);
  });

  // compass buttons update the address bar too
  Object.values(zones).forEach(z => {
    if (z.btn) z.btn.addEventListener('click', () => setHash(z.nav.toLowerCase()));
  });

  // ── initial deep link ──
  // Project cards only have final positions once fonts load, so wait for that.
  if (location.hash && location.hash !== '#plain') {
    const h = location.hash;
    go(h, { animate: false });
    document.fonts.ready.then(() => go(h, { animate: false }));
  }

  return { go, toast, hasDeepLink: !!location.hash };
};
