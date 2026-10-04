// Optional, privacy-friendly analytics. Does nothing unless CONTENT.analytics is set.
// U.track('name') records an event with whichever provider is configured.
(function () {
  const cfg = window.CONTENT.analytics;
  const sent = new Set();

  U.track = (name, { once = false } = {}) => {
    if (!cfg || (once && sent.has(name))) return;
    sent.add(name);
    try {
      if (cfg.goatcounter && window.goatcounter && window.goatcounter.count)
        window.goatcounter.count({ path: name, title: name, event: true });
      else if (cfg.plausible && window.plausible)
        window.plausible(name);
    } catch (e) { /* analytics must never break the site */ }
  };
  if (!cfg) return;

  const s = document.createElement('script');
  s.async = true;
  if (cfg.goatcounter) {
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${cfg.goatcounter}.goatcounter.com/count`;
  } else if (cfg.plausible) {
    s.defer = true;
    s.src = 'https://plausible.io/js/script.js';
    s.dataset.domain = cfg.plausible;
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  } else return;
  document.head.appendChild(s);
})();
