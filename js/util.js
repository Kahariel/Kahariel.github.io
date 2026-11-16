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

  // Brand icon for a technology name (see js/icons.js), or '' if there isn't one.
  icon(name) {
    const I = window.ICONS, slug = I && I.names[name], ic = slug && I.paths[slug];
    if (!ic) return '';
    if (ic.img) return `<img class="ico${ic.invert ? ' invert' : ''}" src="${ic.img}" alt="">`;
    if (ic.svg) return `<svg class="ico" viewBox="${ic.box}" aria-hidden="true">${ic.svg}</svg>`;
    return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"${ic[0] ? ` style="--c:${ic[0]}"` : ''}><path d="${ic[1]}"/></svg>`;
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

  track: () => {}, // replaced by js/analytics.js

  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
};
