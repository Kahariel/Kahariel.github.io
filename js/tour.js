// Guided tour: glides through the stops in CONTENT.tour with a short caption each.
// Autoplays (~6s per stop) and pauses the moment the visitor grabs the map.
// Keys while touring: → / Space next, ← back, Esc end.
window.Tour = function (C, nav) {
  const steps = C.tour || [];
  const panel = document.getElementById('tour');
  const welcome = document.getElementById('welcome');
  const $ = sel => panel.querySelector(sel);
  const bar = $('.tour-bar i');
  const STEP_MS = 6000;
  const SEEN = 'kdt-tour-seen';

  let i = 0, playing = false, timer = null, anim = null;
  const remember = () => { try { localStorage.setItem(SEEN, '1'); } catch (e) { /* private mode etc. */ } };
  const seen = () => { try { return localStorage.getItem(SEEN) === '1'; } catch (e) { return false; } };

  function progress() {
    if (anim) anim.cancel();
    bar.style.width = '0';
    if (!playing) return;
    anim = bar.animate([{ width: '0%' }, { width: '100%' }], { duration: STEP_MS, easing: 'linear', fill: 'forwards' });
  }

  function show(n) {
    i = U.clamp(n, 0, steps.length - 1);
    const st = steps[i];
    $('.tour-step').innerHTML = `TOUR <b>${String(i + 1).padStart(2, '0')}</b> / ${String(steps.length).padStart(2, '0')}`;
    $('.tour-title').textContent = st.title;
    $('.tour-text').textContent = st.text;
    $('.tour-back').disabled = i === 0;
    $('.tour-next').textContent = i === steps.length - 1 ? 'Finish' : 'Next';
    // frame the stop in the space above the panel (measured now that the caption is in)
    Plane.insetBottom = innerHeight - panel.getBoundingClientRect().top + 12;
    nav.go(st.at);
    clearTimeout(timer);
    if (playing) timer = setTimeout(() => (i < steps.length - 1 ? show(i + 1) : pause()), STEP_MS);
    progress();
  }

  function setPlaying(v) {
    playing = v;
    $('.tour-pause').textContent = v ? 'Pause' : 'Play';
    clearTimeout(timer);
    if (v) timer = setTimeout(() => (i < steps.length - 1 ? show(i + 1) : pause()), STEP_MS);
    progress();
  }
  const pause = () => setPlaying(false);

  function start() {
    if (!steps.length) return;
    U.track('tour-start');
    welcome.hidden = true;
    document.body.classList.remove('welcoming');
    remember();
    document.body.classList.add('touring');
    panel.hidden = false;
    playing = true;
    $('.tour-pause').textContent = 'Pause';
    show(0);
  }
  function end() {
    if (!panel.hidden) U.track(i === steps.length - 1 ? 'tour-finished' : `tour-left-at-${i + 1}`);
    clearTimeout(timer);
    if (anim) anim.cancel();
    playing = false;
    panel.hidden = true;
    Plane.insetBottom = 0;
    document.body.classList.remove('touring');
  }

  $('.tour-next').onclick = () => (i === steps.length - 1 ? end() : show(i + 1));
  $('.tour-back').onclick = () => show(i - 1);
  $('.tour-pause').onclick = () => setPlaying(!playing);
  $('.tour-close').onclick = end;
  document.getElementById('tour-start').onclick = start;

  // grabbing the map means they want to look around → stop auto-advancing
  document.getElementById('viewport').addEventListener('pointerdown', () => { if (!panel.hidden && playing) pause(); });

  // capture phase so the map's arrow-key panning doesn't also fire
  addEventListener('keydown', e => {
    if (panel.hidden) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === ' ') { i === steps.length - 1 ? end() : show(i + 1); }
    else if (k === 'ArrowLeft') show(i - 1);
    else if (k === 'Escape') end();
    else return;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  // First visit, landing on the home view (not a shared deep link): offer the tour once.
  if (!seen() && !nav.hasDeepLink && steps.length) {
    setTimeout(() => { if (panel.hidden) { welcome.hidden = false; document.body.classList.add('welcoming'); } }, 1400);
    welcome.querySelector('.welcome-start').onclick = start;
    welcome.querySelector('.welcome-skip').onclick = () => {
      welcome.hidden = true;
      document.body.classList.remove('welcoming');
      remember();
    };
  }

  return { start, end };
};
