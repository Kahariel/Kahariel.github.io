// Lays out the map: where each zone sits, the signposts between them, and the compass.
(function () {
  const C = window.CONTENT;

  // World coordinates of every zone. Move things around here.
  const LAYOUT = {
    erosion:  { x: 2100, y: 1500, w: 1800, h: 1000, color: '#141519', n: '00', nav: 'Index',      label: null },
    scraps:   { x: 250,  y: 200,  w: 1700, h: 1150, color: '#d9d6cf', n: '01', nav: 'Experience', label: 'Drag to rearrange' },
    signal:   { x: 3950, y: 150,  w: 1800, h: 1300, color: '#0e0f11', n: '02', nav: 'Stack',      label: 'Tools, domains and where they were used' },
    about:    { x: 250,  y: 1650, w: 1600, h: 1050, color: '#c4c1b9', n: '03', nav: 'About',      label: 'Background' },
    projects: { x: 1000, y: 2850, w: 3000, h: 1350, color: '#ffffff', n: '04', nav: 'Work',       label: 'Selected projects' },
    contact:  { x: 4400, y: 2850, w: 1450, h: 1100, color: '#141519', n: '05', nav: 'Contact',    label: 'Get in touch' },
  };

  const zones = {};
  Object.entries(LAYOUT).forEach(([id, z]) => {
    const el = U.el('section', 'zone z-' + id);
    el.id = id;
    el.setAttribute('aria-label', z.nav === 'Index' ? 'Introduction' : z.nav);
    Object.assign(el.style, { left: z.x + 'px', top: z.y + 'px', width: z.w + 'px', height: z.h + 'px' });
    Plane.world.appendChild(el);
    zones[id] = { id, el, ...z };
    Plane.addZone(zones[id]);
    if (z.label) {
      const lab = U.el('div', 'zone-label', `<b>${z.n}</b><span>${U.esc(z.nav)}</span>${U.esc(z.label)}`);
      lab.setAttribute('aria-hidden', 'true');
      Object.assign(lab.style, { left: z.x + 'px', top: z.y - 48 + 'px' });
      Plane.world.appendChild(lab);
    }
    if (Zones[id]) Zones[id](zones[id], C);
  });

  Erosion(zones.erosion, C.words);
  Scraps(zones.scraps, C);
  Signal(zones.signal, C);
  Plain(C);

  // every area gets a section heading for screen readers (h1 name → h2 section → h3 items)
  Object.values(zones).forEach(z => {
    if (z.id === 'erosion' || z.el.querySelector(':scope > h2, :scope > .big > h2')) return;
    z.el.prepend(U.el('h2', 'sr-only', U.esc(z.nav === 'Work' ? 'Selected work' : z.nav)));
  });

  // Project cards size themselves; grow the Work zone (and the world) to fit them.
  function fitProjects() {
    const z = zones.projects, h = z.layout();
    z.h = h;
    z.el.style.height = h + 'px';
    Plane.setSize(Plane.WW, Math.max(4400, z.y + h + 400));
  }
  fitProjects();
  document.fonts.ready.then(fitProjects);

  // ── signposts between zones ──
  const decor = [
    { note: '← 01 Experience', x: 1990, y: 1330 },
    { note: '02 Stack →', x: 3560, y: 1330 },
    { note: '← 03 About', x: 1890, y: 1960 },
    { note: '↓ 04 Work', x: 2900, y: 2620 },
    { note: '05 Contact ↘', x: 4180, y: 2620 },
  ];
  decor.forEach(d => {
    const el = U.el('div', 'decor note', U.esc(d.note));
    el.setAttribute('aria-hidden', 'true');
    Object.assign(el.style, { left: d.x + 'px', top: d.y + 'px' });
    Plane.world.appendChild(el);
  });
  // thin leader lines: index → each zone
  const leaders = [[2100, 1500, 1950, 1350], [3900, 1500, 3950, 1450], [2100, 2100, 1850, 2100], [3000, 2500, 3000, 2850], [3900, 2500, 4400, 2850]];
  Plane.world.insertAdjacentHTML('beforeend',
    `<svg class="decor" aria-hidden="true" style="left:0;top:0" width="${Plane.WW}" height="${Plane.WH}">${leaders.map(([a, b, c, d]) =>
      `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#141519" stroke-opacity=".35" stroke-width="1.5"/><circle cx="${c}" cy="${d}" r="5" fill="#d4471f"/>`).join('')}</svg>`);

  // ── compass: free-floating jump buttons ──
  const compass = document.getElementById('compass');
  const fitZone = z => {
    // frame the zone plus its label, leaving room for the top bar
    const r = z.label ? { x: z.x, y: z.y - 90, w: z.w, h: z.h + 110 } : z;
    const f = Plane.fit(r, z.id === 'erosion' ? .95 : .86);
    f.y += innerWidth < 700 ? 0 : 18;
    const READABLE = .7;
    if (z.id === 'erosion' || f.s >= READABLE || innerWidth < 900) return f;
    // too wide to read at full fit: zoom to a readable level, starting at the zone's top-left
    return { s: READABLE, x: 60 - (z.x - 40) * READABLE, y: 90 - (z.y - 70) * READABLE };
  };
  Object.values(zones).forEach(z => {
    const b = U.el('button', '', `<i>${z.n}</i>${U.esc(z.nav)}`);
    b.onclick = () => Plane.glide(fitZone(z));
    z.btn = b;
    compass.appendChild(b);
  });
  Plane.onChange(() => {
    const c = Plane.center();
    Object.values(zones).forEach(z => {
      const here = c.x > z.x && c.x < z.x + z.w && c.y > z.y && c.y < z.y + z.h;
      z.btn.classList.toggle('here', here);
      if (here) z.btn.setAttribute('aria-current', 'location'); else z.btn.removeAttribute('aria-current');
    });
  });

  Plane.fitZone = fitZone;
  Object.assign(Plane.cam, fitZone(zones.erosion));
  Plane.apply();

  // shareable links (#work/syncro), quick actions, and the guided tour
  const nav = Nav(zones, C);
  Plane.home = () => nav.go('index');
  Tour(C, nav);
})();
