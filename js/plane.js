// The map: a huge world you pan & zoom around. Every zone lives inside it.
(function () {
  const vp = document.getElementById('viewport');
  const world = document.getElementById('world');
  const coords = document.getElementById('coords');
  const mini = document.getElementById('minimap');
  const mctx = mini.getContext('2d');

  let WW = 6000, WH = 4400;
  const MIN_S = .12, MAX_S = 2.2;
  world.style.width = WW + 'px';
  world.style.height = WH + 'px';

  const cam = { x: 0, y: 0, s: 1 };
  const listeners = [];
  const zones = [];
  let anim = null;

  function apply() {
    world.style.transform = `translate3d(${cam.x}px, ${cam.y}px, 0) scale(${cam.s})`;
    const c = center();
    coords.textContent = `x ${fmt(c.x - WW / 2)}  y ${fmt(c.y - WH / 2)}  ×${cam.s.toFixed(2)}`;
    drawMini();
    listeners.forEach(f => f(cam));
  }
  const fmt = n => (n >= 0 ? '+' : '') + Math.round(n);

  const toWorld = (cx, cy) => ({ x: (cx - cam.x) / cam.s, y: (cy - cam.y) / cam.s });
  const center = () => toWorld(innerWidth / 2, innerHeight / 2);
  function view() {
    const a = toWorld(0, 0), b = toWorld(innerWidth, innerHeight);
    return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y };
  }
  function visible(r, pad = 0) {
    const v = view();
    return r.x - pad < v.x + v.w && r.x + r.w + pad > v.x && r.y - pad < v.y + v.h && r.y + r.h + pad > v.y;
  }

  // Camera that fits a world rect on screen
  // Plane.insetBottom: screen pixels at the bottom covered by UI (e.g. the tour
  // panel); framing then centres content in the visible area above it.
  function fit(r, margin = .9) {
    const vh = innerHeight - (API.insetBottom || 0);
    const s = U.clamp(Math.min(innerWidth / r.w, vh / r.h) * margin, MIN_S, MAX_S);
    return { x: innerWidth / 2 - (r.x + r.w / 2) * s, y: vh / 2 - (r.y + r.h / 2) * s, s };
  }

  function glide(to, ms = 1000) {
    cancelAnimationFrame(anim);
    vx = vy = 0;
    if (U.reducedMotion) { Object.assign(cam, to); apply(); return; }
    const from = { ...cam }, t0 = performance.now();
    // zoom out a little mid-flight, like a map fly-to
    const dip = Math.min(from.s, to.s) * .75;
    (function f(t) {
      const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const s = from.s + (to.s - from.s) * e - (Math.sin(Math.PI * e) * Math.max(0, Math.min(from.s, to.s) - dip));
      // keep the interpolated world-center moving in a straight line
      const fc = { x: (innerWidth / 2 - from.x) / from.s, y: (innerHeight / 2 - from.y) / from.s };
      const tc = { x: (innerWidth / 2 - to.x) / to.s, y: (innerHeight / 2 - to.y) / to.s };
      const wx = fc.x + (tc.x - fc.x) * e, wy = fc.y + (tc.y - fc.y) * e;
      cam.s = s; cam.x = innerWidth / 2 - wx * s; cam.y = innerHeight / 2 - wy * s;
      apply();
      if (k < 1) anim = requestAnimationFrame(f);
    })(t0);
  }

  function zoomAt(px, py, f) {
    const s = U.clamp(cam.s * f, MIN_S, MAX_S);
    f = s / cam.s;
    cam.x = px - (px - cam.x) * f;
    cam.y = py - (py - cam.y) * f;
    cam.s = s;
    apply();
  }

  // ── pointer: pan with inertia, pinch to zoom ──
  const pointers = new Map();
  let vx = 0, vy = 0, downAt = null;
  const API = { moved: false };

  vp.addEventListener('pointerdown', e => {
    if (e.target.closest('a, button, input, summary, .no-pan')) return;
    cancelAnimationFrame(anim);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vp.classList.add('panning');
    downAt = { x: e.clientX, y: e.clientY };
    API.moved = false;
    vx = vy = 0;
  });
  addEventListener('pointermove', e => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d0 = Math.hypot(a.x - b.x, a.y - b.y);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a2, b2] = [...pointers.values()];
      const d1 = Math.hypot(a2.x - b2.x, a2.y - b2.y);
      cam.x += ((a2.x + b2.x) - (a.x + b.x)) / 2;
      cam.y += ((a2.y + b2.y) - (a.y + b.y)) / 2;
      zoomAt((a2.x + b2.x) / 2, (a2.y + b2.y) / 2, d0 ? d1 / d0 : 1);
      API.moved = true;
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vx = e.clientX - prev.x; vy = e.clientY - prev.y;
    if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) API.moved = true;
    cam.x += vx; cam.y += vy;
    apply();
  });
  const end = e => {
    if (!pointers.delete(e.pointerId)) return;
    if (pointers.size) return;
    vp.classList.remove('panning');
    coast();
  };
  addEventListener('pointerup', end);
  addEventListener('pointercancel', end);

  function coast() {
    if (pointers.size || (Math.abs(vx) < .3 && Math.abs(vy) < .3)) return;
    cam.x += vx; cam.y += vy; vx *= .93; vy *= .93;
    apply();
    anim = requestAnimationFrame(coast);
  }

  // Wheel: trackpad pinch (ctrlKey) zooms, trackpad two-finger scroll pans, mouse wheel zooms.
  vp.addEventListener('wheel', e => {
    e.preventDefault();
    cancelAnimationFrame(anim);
    const isTrackpadPan = !e.ctrlKey && e.deltaMode === 0 && (Math.abs(e.deltaX) > 0 || !Number.isInteger(e.deltaY));
    if (isTrackpadPan) { cam.x -= e.deltaX; cam.y -= e.deltaY; apply(); }
    else zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)));
  }, { passive: false });

  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea') || document.getElementById('plain').hidden === false) return;
    const step = 120;
    const k = e.key;
    if (k === 'ArrowLeft') cam.x += step; else if (k === 'ArrowRight') cam.x -= step;
    else if (k === 'ArrowUp') cam.y += step; else if (k === 'ArrowDown') cam.y -= step;
    else if (k === '+' || k === '=') return zoomAt(innerWidth / 2, innerHeight / 2, 1.2);
    else if (k === '-') return zoomAt(innerWidth / 2, innerHeight / 2, 1 / 1.2);
    else if (k === '0' || k === 'h') return API.home && API.home();
    else return;
    e.preventDefault();
    apply();
  });

  // ── minimap ──
  const MW = mini.width, MH = mini.height;
  function drawMini() {
    mctx.clearRect(0, 0, MW, MH);
    const sx = MW / WW, sy = MH / WH;
    zones.forEach(z => { mctx.fillStyle = z.color; mctx.fillRect(z.x * sx, z.y * sy, z.w * sx, z.h * sy); });
    const v = view();
    mctx.strokeStyle = '#e2401c'; mctx.lineWidth = 2;
    mctx.strokeRect(v.x * sx, v.y * sy, v.w * sx, v.h * sy);
  }
  mini.addEventListener('pointerdown', e => {
    const r = mini.getBoundingClientRect();
    const wx = (e.clientX - r.left) / r.width * WW, wy = (e.clientY - r.top) / r.height * WH;
    glide({ x: innerWidth / 2 - wx * cam.s, y: innerHeight / 2 - wy * cam.s, s: cam.s }, 700);
  });

  addEventListener('resize', apply);

  // grow the world when content needs more room (e.g. more projects)
  function setSize(w, h) {
    WW = w; WH = h;
    world.style.width = WW + 'px';
    world.style.height = WH + 'px';
    apply();
  }

  Object.defineProperties(API, {
    WW: { get: () => WW, enumerable: true },
    WH: { get: () => WH, enumerable: true },
  });
  window.Plane = Object.assign(API, {
    setSize,
    cam, world, zones, apply, toWorld, center, view, visible, fit, glide,
    onChange: f => listeners.push(f),
    addZone(z) { zones.push(z); },
  });
})();
