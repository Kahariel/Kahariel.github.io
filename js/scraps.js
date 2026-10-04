// Experience desk: cards you can drag, throw, scatter and re-arrange.
window.Scraps = function (zone, C) {
  const { w: W, h: H } = zone;
  const defs = [];

  C.experience.forEach((x, i) => {
    defs.push({
      cls: 'card' + (i === 1 ? ' dark' : ''),
      html: `<div class="top"><span class="eyebrow">${U.esc(x.years)}</span><span class="eyebrow">${U.esc(x.where)}</span></div>
        <h3>${U.esc(x.company)}</h3>
        <div class="role">${U.esc(x.role)}</div>
        <ul>${x.points.map(p => `<li>${U.esc(p)}</li>`).join('')}</ul>`,
      at: [.03 + i * .33, .1 + (i % 2) * .07], r: [-1.2, .8, -.6][i % 3],
    });
  });

  defs.push(
    { cls: 'card small', html: `<div class="top"><span class="eyebrow">Education</span><span class="eyebrow">${U.esc(C.education.years)}</span></div>
        <h3>${U.esc(C.education.degree)}</h3><div class="role" style="margin-bottom:0">${U.esc(C.education.school)}</div>`, at: [.05, .7], r: .7 },
    ...C.certs.map((c, i) => ({ cls: 'card small', html: `<div class="top"><span class="eyebrow">Certification</span></div>
        <h3>${U.esc(c.name)}</h3><div class="role" style="margin-bottom:0">${U.esc(c.detail)}</div>`, at: [.33 + i * .05, .74], r: -.9 })),
    { cls: 'card small dark', html: `<div class="top"><span class="eyebrow">Résumé</span><span class="eyebrow">PDF</span></div>
        <h3>Full CV</h3><div class="role" style="margin-bottom:0">${U.link(C.links.resume, 'Download ↓', 'resume pdf link')}</div>`, at: [.72, .72], r: 1 },
  );

  let z = 1;
  const items = defs.map(d => {
    const el = U.el('div', 'scrap ' + d.cls, d.html);
    zone.el.appendChild(el);
    return { el, d, x: 0, y: 0, r: d.r, vx: 0, vy: 0, vr: 0, w: 0, h: 0 };
  });

  function measure() { items.forEach(o => { o.w = o.el.offsetWidth; o.h = o.el.offsetHeight; }); }

  function place() {
    measure();
    items.forEach(o => {
      o.x = U.clamp(o.d.at[0] * W, 10, W - o.w - 10);
      o.y = U.clamp(o.d.at[1] * H, 10, H - o.h - 10);
      o.dirty = true;
      o.el.style.zIndex = z++;
    });
  }

  function mess() {
    items.forEach(o => {
      const tx = U.rand(0, W - o.w), ty = U.rand(0, H - o.h);
      o.vx = (tx - o.x) * .12; o.vy = (ty - o.y) * .12; o.vr = U.rand(-1.5, 1.5);
      o.el.style.zIndex = z++;
    });
  }
  // "Arrange" glides everything back to its resting spot
  function arrange() {
    items.forEach(o => {
      const tx = U.clamp(o.d.at[0] * W, 10, W - o.w - 10), ty = U.clamp(o.d.at[1] * H, 10, H - o.h - 10);
      o.vx = (tx - o.x) * .08; o.vy = (ty - o.y) * .08; o.vr = (o.d.r - o.r) * .1;
    });
  }
  const btns = U.el('div', 'desk-btns', '<button>Arrange</button><button>Scatter</button>');
  btns.children[0].onclick = arrange;
  btns.children[1].onclick = mess;
  zone.el.appendChild(btns);

  // dragging, in world units so it works at any zoom
  let drag = null;
  const local = e => { const w = Plane.toWorld(e.clientX, e.clientY); return { x: w.x - zone.x, y: w.y - zone.y }; };

  zone.el.addEventListener('pointerdown', e => {
    const el = e.target.closest('.scrap');
    if (!el || e.target.closest('a')) return;
    e.stopPropagation(); // don't pan the map
    const o = items.find(o => o.el === el);
    const p = local(e);
    drag = { o, ox: p.x - o.x, oy: p.y - o.y, last: p };
    o.vx = o.vy = 0;
    el.classList.add('dragging');
    el.style.zIndex = z++;
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const p = local(e), o = drag.o;
    o.vx = p.x - drag.last.x; o.vy = p.y - drag.last.y; o.vr = U.clamp(o.vx * .02, -.3, .3);
    o.x = p.x - drag.ox; o.y = p.y - drag.oy;
    drag.last = p;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    drag.o.el.classList.remove('dragging');
    drag = null;
  });
  zone.el.addEventListener('dblclick', e => {
    const el = e.target.closest('.scrap');
    if (el) el.style.zIndex = 1e5 + z++;
  });

  function frame() {
    requestAnimationFrame(frame);
    if (!Plane.visible(zone)) return;
    for (const o of items) {
      const held = drag && drag.o === o;
      // at rest and not held: nothing to move, skip the style write
      if (!held && !o.dirty && Math.abs(o.vx) + Math.abs(o.vy) + Math.abs(o.vr) < .01) continue;
      o.dirty = false;
      if (!held) {
        o.x += o.vx; o.y += o.vy; o.r = U.clamp(o.r + o.vr, -4, 4);
        o.vx *= .92; o.vy *= .92; o.vr *= .9;
        // bounce off the desk edges (half a scrap may hang off)
        if (o.x < -o.w * .4) { o.x = -o.w * .4; o.vx *= -.6; }
        if (o.y < -o.h * .4) { o.y = -o.h * .4; o.vy *= -.6; }
        if (o.x > W - o.w * .6) { o.x = W - o.w * .6; o.vx *= -.6; }
        if (o.y > H - o.h * .6) { o.y = H - o.h * .6; o.vy *= -.6; }
      }
      o.el.style.transform = `translate(${o.x}px, ${o.y}px) rotate(${o.r}deg)`;
    }
  }

  document.fonts.ready.then(() => { place(); frame(); });
};
