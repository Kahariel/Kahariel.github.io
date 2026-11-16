// Builds the page from js/content.js and wires up the few interactive bits:
// copy buttons, screenshot zoom, the nav highlight and analytics events.
//
// Shareable links are plain anchors:
//   #work, #experience, #stack, #about, #contact   → that section
//   #work/<project-id>                             → that project (e.g. #work/syncro)
(function () {
  const C = window.CONTENT, e = U.esc;
  const $ = id => document.getElementById(id);
  const pid = p => p.id || U.slug(p.name);
  const resume = (cls, text) => C.links.resume
    ? `<a class="${cls}" href="${e(C.links.resume)}" download data-resume>${text}</a>`
    : `<span class="ph" title="Set links.resume in js/content.js">[resume pdf]</span>`;

  // ── header ──
  $('brand').textContent = `${C.name.first} ${C.name.middle} ${C.name.last}`;
  $('bar-resume').outerHTML = resume('btn solid small', 'Résumé ↓');

  // ── intro ──
  $('hero').innerHTML = `
    <p class="eyebrow">${e(C.role)} <i>—</i> ${e(C.focus)}</p>
    <h1>${e(C.name.first)} ${e(C.name.middle)} <em>${e(C.name.last)}</em></h1>
    <p class="lead">${e(C.lead)}</p>
    <div class="cta">
      <a class="btn solid" href="#work">See the work</a>
      ${resume('btn', 'Résumé ↓')}
      <button class="btn" type="button" data-copy-email>Copy email</button>
      <span class="where">${e(C.location)}</span>
    </div>
    <div class="shipped">
      <div class="eyebrow">${e(C.shipped.title)}</div>
      ${C.shipped.items.map(x => `<a href="#work/${e(x.to)}" data-shipped="${e(x.to)}"><b>${e(x.name)}</b><span>${e(x.text).replace(/\*(.+?)\*/g, '<strong>$1</strong>')}</span><i aria-hidden="true">→</i></a>`).join('')}
    </div>`;

  // ── work ──
  // "Syncro — clinic management…" → product name in bold, the rest as normal text
  const summaryHtml = t => {
    const i = t.indexOf(' — ');
    return i > 0 && i < 40 ? `<b>${e(t.slice(0, i))}</b> — ${e(t.slice(i + 3))}` : e(t);
  };
  const bullets = list => `<ul class="points">${list.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
  const project = p => {
    const id = pid(p), shown = p.featured ? 3 : 0, rest = p.highlights.slice(shown);
    const links = [
      p.live ? U.link(p.live, 'Live site ↗') : '',
      p.repo ? U.link(p.repo, 'Source ↗') : '',
      p.private && !p.repo ? '<span class="private">Private codebase · walkthrough on request</span>' : '',
      !p.live && !p.repo && !p.private ? U.link(null, '', 'live url') : '',
      `<button class="copy-link" type="button" data-copy-link="work/${id}" aria-label="Copy link to ${e(p.name)}">Copy link</button>`,
    ].join('');
    // no image → a text-only card
    const shot = p.image
      ? `<div class="shot${p.imageFit === 'contain' ? ' contain' : ''}"><button class="zoom" type="button" data-zoom="${e(p.image)}" data-id="${id}" aria-label="Enlarge screenshot of ${e(p.name)}">${U.img(p.image, p.name + ' screenshot')}</button></div>`
      : '';
    return `
      <article class="proj${p.featured ? ' featured' : ''}${shot ? '' : ' noshot'}" id="work/${id}">
        ${shot}
        <div class="body">
          <div class="intro">
          <div class="eyebrow kicker"><span>${e(p.kicker)}</span><span>${e(p.year)}</span></div>
          <h3>${e(p.name)}</h3>
          <div class="meta"><span>${e(p.role)}</span>${p.status ? `<span class="status">${e(p.status)}</span>` : ''}</div>
          <p class="summary">${summaryHtml(p.summary)}</p>
          ${p.facts && p.facts.length ? `<dl class="facts">${p.facts.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl>` : ''}
          </div>
          <div class="detail">
          ${shown ? bullets(p.highlights.slice(0, shown)) : ''}
          ${rest.length ? `<details><summary>${shown ? `${rest.length} more technical details` : `Technical details · ${rest.length}`}</summary>${bullets(rest)}</details>` : ''}
          <div class="tags">${p.stack.map(t => `<span>${U.icon(t)}${e(t)}</span>`).join('')}</div>
          <div class="links">${links}</div>
          </div>
        </div>
      </article>`;
  };
  $('work-note').textContent = `${C.projects.length} projects`;
  $('work-featured').innerHTML = C.projects.filter(p => p.featured).map(project).join('');
  $('work-grid').innerHTML = C.projects.filter(p => !p.featured).map(project).join('');

  // ── experience ──
  $('experience-list').innerHTML = C.experience.map(x => `
    <article class="job">
      <div class="when"><span>${e(x.years)}</span><span>${e(x.where)}</span></div>
      <div>
        <h3>${e(x.role)}</h3>
        <p class="co">${e(x.company)}</p>
        ${bullets(x.points)}
      </div>
    </article>`).join('');

  // ── stack ──
  const groups = Object.entries(C.skills);
  $('stack-note').textContent = `${groups.reduce((n, [, v]) => n + v.length, 0)} tools · ${groups.length} domains`;
  $('stack-list').innerHTML = groups.map(([name, list]) => `
    <div class="group"><h3>${e(name)}</h3><ul>${list.map(t => `<li>${U.icon(t)}${e(t)}</li>`).join('')}</ul></div>`).join('');

  // ── about ──
  const facts = [
    ['Based in', C.location],
    ['Education', `${C.education.degree}, ${C.education.school} (${C.education.years})`],
    ...C.certs.map(c => ['Certification', `${c.name} — ${c.detail}`]),
    ['Focus', C.focus],
  ];
  $('about-body').innerHTML = `
    <figure class="photo">${U.img(C.photo, C.name.full, 'portrait')}</figure>
    <div>
      <p class="bio">${e(C.bio)}</p>
      <dl class="rows">${facts.map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl>
    </div>`;

  // ── contact ──
  $('contact-body').innerHTML = `
    <h2>Let's build<br>something<i>.</i></h2>
    <div class="reach">
      <div>
        <div class="eyebrow">Email</div>
        <a class="big" href="mailto:${e(C.email)}">${e(C.email)}</a>
        <button class="copy-link" type="button" data-copy-email aria-label="Copy email address">Copy</button>
      </div>
      <div>
        <div class="eyebrow">Phone</div>
        <a class="big" href="tel:${e(C.phone.replace(/\s/g, ''))}">${e(C.phone)}</a>
      </div>
    </div>
    <div class="socials">
      ${U.link(C.links.github, 'GitHub ↗', 'github')}${U.link(C.links.linkedin, 'LinkedIn ↗', 'linkedin')}${resume('', 'Résumé ↓')}
    </div>
    <p class="fine"><span>© ${new Date().getFullYear()} ${e(C.name.full)}</span><span>${e(C.location)}</span><a href="#top">Back to top ↑</a></p>`;

  // ── toast ──
  const toastEl = $('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ── screenshot zoom ──
  const box = $('lightbox'), boxImg = box.querySelector('img');
  box.addEventListener('click', ev => { if (ev.target !== boxImg) box.close(); });

  // ── clicks: copy email / copy link / zoom / tracked links ──
  document.addEventListener('click', async ev => {
    const t = ev.target.closest('[data-copy-email], [data-copy-link], [data-zoom], [data-resume], [data-shipped], .proj .links a');
    if (!t) return;
    if (t.hasAttribute('data-copy-email')) {
      U.track('copy-email');
      toast((await U.copy(C.email)) ? `Email copied — ${C.email}` : C.email);
    } else if (t.dataset.copyLink) {
      const link = location.href.split('#')[0] + '#' + t.dataset.copyLink;
      U.track('copy-link/' + t.dataset.copyLink);
      toast((await U.copy(link)) ? 'Link copied' : link);
    } else if (t.dataset.zoom) {
      boxImg.src = t.dataset.zoom;
      boxImg.alt = t.querySelector('img').alt;
      box.showModal();
      U.track('zoom/' + t.dataset.id, { once: true });
    } else if (t.dataset.shipped) {
      U.track('hero-link/' + t.dataset.shipped);
    } else if (t.hasAttribute('data-resume')) {
      U.track('resume-download');
    } else {
      U.track('project-link/' + t.closest('.proj').id.replace(/^work\//, ''));
    }
  });

  // ── nav highlight + "reached this section" events ──
  const navLinks = [...document.querySelectorAll('#nav a')];
  U.track('section/index', { once: true });
  // a thin band just above mid-screen decides "where you are"
  const spy = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const id = en.target.id;
    navLinks.forEach(a => {
      if (a.hash === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (id !== 'hero') U.track('section/' + id, { once: true });
  }), { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('#hero, main > .band, #contact').forEach(s => spy.observe(s));

  // hairline under the header once the page has scrolled
  const bar = $('bar');
  const onScroll = () => bar.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── gentle fade-in as things scroll into view ──
  if (!U.reducedMotion) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.proj, .job, .group, #about-body, .head').forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  // ── deep links ──
  // The page is built after load, so jump to the #target ourselves — and again once
  // fonts have settled the layout. Old map links (#plain, #index) just land at the top.
  const jump = () => {
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (err) { /* malformed hash */ }
    const el = id && $(id);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  };
  if (location.hash) { jump(); document.fonts.ready.then(jump); }
})();
