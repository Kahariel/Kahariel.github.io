// Center zone: the name as particles. Mouse scatters them, click swaps the word,
// and the further you wander away from the center the more it crumbles to dust.
//
// Performance: once the particles settle (and nothing is disturbing them) the
// loop stops simulating and drawing until the mouse, a click or the camera
// wakes it.
//
// Alignment: the dots sit on a GAP-spaced grid. The canvas resolution is chosen
// so GAP is a whole number of pixels, and settling particles snap exactly onto
// their grid point, so the letters never look uneven or broken when still.
window.Erosion = function (zone, words) {
  const { w: W, h: H } = zone;
  const REPEL = 16000;           // squared radius of the mouse's push
  // fewer particles on low-core devices and phones; same look on desktops
  const GAP = (navigator.hardwareConcurrency || 8) <= 4 || innerWidth < 700 ? 9 : 7;
  let parts = [], wi = 0;
  let awake = 0, dirty = true;   // frames left to simulate / needs a redraw
  const wake = (frames = 90) => { awake = Math.max(awake, frames); };
  const mouse = { x: -1e4, y: -1e4 };

  // Particles are written straight into a pixel buffer (≈3× faster than fillRect
  // for thousands of dots). The buffer is rebuilt whenever the canvas is resized.
  let img = null, px32 = null;
  const { cv, ctx } = U.zoneCanvas(zone, { snap: GAP, onResize: () => { img = null; dirty = true; } });
  const INK = 0xff191514, ACCENT = 0xff1f47d4; // #141519 / #d4471f as little-endian ABGR

  function sample(word) {
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const o = off.getContext('2d');
    let fs = H * .5;
    const setFont = () => { o.font = `800 ${fs}px 'Inter Tight', system-ui, sans-serif`; o.letterSpacing = `${-fs * .04}px`; };
    setFont();
    fs = Math.min(fs, fs * (W * .9) / o.measureText(word).width); // shrink long words to fit
    setFont();
    o.textAlign = 'center'; o.textBaseline = 'middle';
    o.fillText(word, W / 2, H / 2 - 20);
    const d = o.getImageData(0, 0, W, H).data, pts = [];
    for (let y = 0; y < H; y += GAP)
      for (let x = 0; x < W; x += GAP)
        if (d[(y * W + x) * 4 + 3] > 128) pts.push([x, y]);
    return pts.sort(() => Math.random() - .5);
  }

  function setWord(word) {
    const pts = sample(word);
    while (parts.length < pts.length)
      parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, tx: 0, ty: 0, hot: Math.random() < .035 });
    parts.length = pts.length;
    parts.forEach((p, i) => { p.tx = pts[i][0]; p.ty = pts[i][1]; });
    dirty = true;
    wake(30);
  }

  addEventListener('pointermove', e => {
    const w = Plane.toWorld(e.clientX, e.clientY);
    mouse.x = w.x - zone.x; mouse.y = w.y - zone.y;
    if (mouse.x > -150 && mouse.x < W + 150 && mouse.y > -150 && mouse.y < H + 150) wake(20);
  });
  // Forget the pointer when it's gone (finger lifted, cursor left the window),
  // otherwise the letters stay pushed apart around a hole that never closes.
  const release = () => { mouse.x = mouse.y = -1e4; wake(30); };
  addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') release(); });
  addEventListener('pointercancel', release);
  addEventListener('pointerout', e => { if (!e.relatedTarget) release(); });
  addEventListener('blur', release);
  // camera moved → erosion amount may have changed; stir the dust for a moment
  let stir = 0;
  Plane.onChange(() => { stir = 1; wake(10); });

  zone.el.addEventListener('click', () => {
    if (Plane.moved) return;
    wi = (wi + 1) % words.length;
    parts.forEach(p => {
      const a = Math.random() * Math.PI * 2, f = U.rand(10, 30);
      p.vx += Math.cos(a) * f; p.vy += Math.sin(a) * f;
    });
    wake(30);
    setTimeout(() => setWord(words[wi]), 250);
  });

  // 0 when the camera is on the name, → 1 as you wander off
  function erosion() {
    const c = Plane.center();
    const d = Math.hypot(c.x - (zone.x + W / 2), c.y - (zone.y + H / 2));
    return U.clamp((d - 500) / 1400, 0, 1);
  }

  function simulate() {
    const er = erosion();
    const pull = .035 * (1 - er * .97), jitter = er * stir;
    let moving = false;
    for (const p of parts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < REPEL) {
        const d = Math.sqrt(d2) || 1, f = (REPEL - d2) / REPEL * 2.5;
        p.vx += dx / d * f; p.vy += dy / d * f;
      }
      p.vx += (p.tx - p.x) * pull;
      p.vy += (p.ty - p.y) * pull + er * .35 * (p.hot ? 1.6 : 1);
      if (jitter > .001) p.vx += (Math.random() - .5) * jitter;
      p.vx *= .86; p.vy *= .86;
      p.x += p.vx; p.y += p.vy;
      if (p.y > H - 4) { // dust piles on the floor and comes to rest there
        p.y = H - 4; p.vx *= .7;
        p.vy = Math.abs(p.vy) < 1 ? 0 : p.vy * -.3;
      }
      if (Math.abs(p.vx) + Math.abs(p.vy) > .03) moving = true;
      // close enough and nearly still → sit exactly on the grid point
      else if (er === 0 && Math.abs(p.x - p.tx) < .75 && Math.abs(p.y - p.ty) < .75) {
        p.x = p.tx; p.y = p.ty; p.vx = p.vy = 0;
      }
    }
    stir *= .97; // jitter fades once the camera stops, so the dust can settle
    if (moving) wake(10);
  }

  function draw() {
    // exact snapped scale (GAP lands on whole pixels); cw / W alone drifts by the width rounding
    const cw = cv.width, ch = cv.height, sc = Math.round(cw / W * GAP) / GAP;
    if (!img) { img = ctx.createImageData(cw, ch); px32 = new Uint32Array(img.data.buffer); }
    px32.fill(0);
    const ink = Math.max(1, Math.round(2.4 * sc)), hot = Math.max(1, Math.round(2.8 * sc));
    for (const p of parts) {
      const size = p.hot ? hot : ink, color = p.hot ? ACCENT : INK;
      const x = Math.round(p.x * sc), y = Math.round(p.y * sc);
      if (x < 0 || y < 0 || x + size > cw || y + size > ch) continue;
      for (let j = 0; j < size; j++) {
        const row = (y + j) * cw + x;
        for (let i = 0; i < size; i++) px32[row + i] = color;
      }
    }
    ctx.putImageData(img, 0, 0);
    dirty = false;
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!Plane.visible(zone)) return;
    if (awake > 0) { awake--; simulate(); dirty = true; }
    if (dirty) draw();
  }

  setWord(words[0]);
  document.fonts.load("800 100px 'Inter Tight'").then(() => setWord(words[wi]));
  frame();
};
