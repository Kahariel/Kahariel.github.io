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
    U.track('section/' + (h.split('/')[0] || 'index'), { once: true });
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
  const copyEmail = async () => { U.track('copy-email'); toast((await U.copy(C.email)) ? `Email copied — ${C.email}` : C.email); };
  document.getElementById('copy-email').onclick = copyEmail;

  const resume = document.getElementById('resume-btn');
  if (C.links.resume) { resume.href = C.links.resume; resume.addEventListener('click', () => U.track('resume-download')); }
  else {
    resume.classList.add('missing');
    resume.title = 'Set links.resume in js/content.js';
    resume.onclick = e => { e.preventDefault(); toast('Résumé link not added yet — set links.resume in js/content.js'); };
  }

  // outbound clicks on project links (live sites, source)
  Plane.world.addEventListener('click', e => {
    const a = e.target.closest('.proj .links a');
    if (a) U.track('project-link/' + U.slug(a.closest('.proj').querySelector('h2').textContent));
  });

  // copy buttons inside the map (delegated; stop them from starting a pan)
  Plane.world.addEventListener('pointerdown', e => { if (e.target.closest('.copy-btn')) e.stopPropagation(); });
  Plane.world.addEventListener('click', async e => {
    const b = e.target.closest('.copy-btn');
    if (!b) return;
    if (b.hasAttribute('data-copy-email')) return copyEmail();
    const link = base() + '#' + b.dataset.copyLink;
    U.track('copy-link/' + b.dataset.copyLink);
    toast((await U.copy(link)) ? 'Link copied' : link);
  });

  // Keyboard: Tab into the map → glide to whatever got focus. The map container
  // is overflow:hidden, and browsers try to scroll it to reveal focused elements;
  // undo that, since the camera does the moving here.
  const vp = document.getElementById('viewport');
  // The camera does all the moving; the map container itself must never scroll
  // (anchor jumps, focus, find-in-page can all try to scroll it).
  vp.addEventListener('scroll', () => { if (vp.scrollTop || vp.scrollLeft) vp.scrollTop = vp.scrollLeft = 0; });
  Plane.world.addEventListener('focusin', e => {
    vp.scrollTop = vp.scrollLeft = 0;
    requestAnimationFrame(() => { vp.scrollTop = vp.scrollLeft = 0; });
    const r = e.target.getBoundingClientRect();
    const top = 60, bottom = innerHeight - 40;
    const inView = r.top >= top && r.left >= 0 && r.bottom <= bottom && r.right <= innerWidth;
    if (inView) return;
    const card = e.target.closest('.proj');
    // Same card/area already on screen (e.g. tabbing down a tall card): just nudge
    // the camera enough to reveal the focused element instead of re-framing.
    const host = (card || e.target.closest('.zone'));
    const h = host && host.getBoundingClientRect();
    if (h && h.bottom > top && h.top < bottom && h.right > 0 && h.left < innerWidth) {
      const dy = r.bottom > bottom ? bottom - r.bottom - 20 : r.top < top ? top - r.top + 20 : 0;
      const dx = r.right > innerWidth ? innerWidth - r.right - 20 : r.left < 0 ? -r.left + 20 : 0;
      return Plane.glide({ s: Plane.cam.s, x: Plane.cam.x + dx, y: Plane.cam.y + dy }, 400);
    }
    if (card) return Plane.glide(cardCamera(card, zones.projects), 600);
    const zoneEl = e.target.closest('.zone');
    const zone = zoneEl && Object.values(zones).find(z => z.el === zoneEl);
    if (zone) Plane.glide(Plane.fitZone(zone), 600);
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
