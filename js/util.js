// Small shared helpers.
window.U = {
  esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },

  // Real link if the value exists, dashed placeholder if it's still null.
  link(href, text, label) {
    if (!href) return `<span class="ph" title="Fill this in js/content.js">[${U.esc(label || text)}]</span>`;
    const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${U.esc(href)}"${ext}>${U.esc(text)}</a>`;
  },

  // Image if the path exists, placeholder box if not.
  img(src, alt, label) {
    if (!src) return `<span class="ph ph-box">[${U.esc(label)}]</span>`;
    return `<img src="${U.esc(src)}" alt="${U.esc(alt)}" loading="lazy">`;
  },

  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  },

  // A canvas covering a zone. Its backing store matches how big the zone is on
  // screen (zoom × devicePixelRatio) instead of its full world size, and is
  // re-sized shortly after the camera stops zooming. Drawing code keeps using
  // world units; onResize lets the caller redraw after the canvas is cleared.
  // `snap` (optional): a world-unit grid spacing that should land on whole canvas
  // pixels, so evenly spaced dots stay evenly spaced on screen.
  zoneCanvas(zone, { maxScale = 1.5, onResize, snap } = {}) {
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    cv.style.width = zone.w + 'px';
    cv.style.height = zone.h + 'px';
    let scale = 0, timer;
    const fit = () => {
      let want = U.clamp(Plane.cam.s * (devicePixelRatio || 1), .25, maxScale);
      if (snap) want = Math.max(1, Math.round(want * snap)) / snap;
      if (scale && Math.abs(want - scale) / scale < .2) return; // close enough, skip the realloc
      scale = want;
      cv.width = Math.round(zone.w * scale);
      cv.height = Math.round(zone.h * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      if (onResize) onResize();
    };
    fit();
    Plane.onChange(() => { clearTimeout(timer); timer = setTimeout(fit, 150); });
    zone.el.prepend(cv);
    return { cv, ctx };
  },

  slug: s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),

  // Clipboard with a fallback for browsers/contexts without the async API.
  async copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
    const t = Object.assign(document.createElement('textarea'), { value: text });
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t); t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    t.remove();
    return ok;
  },

  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  rand: (a, b) => a + Math.random() * (b - a),
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
};
