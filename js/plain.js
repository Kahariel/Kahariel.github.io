// "The boring version": the same content as a plain, linear, readable page.
window.Plain = function (C) {
  const root = document.getElementById('plain');
  const toggle = document.getElementById('plain-toggle');
  const e = U.esc;

  root.innerHTML = `
    <button class="close">Back to map</button>
    <div class="wrap">
      <h1>${e(C.name.full)}</h1>
      <p>${e(C.role)} — ${e(C.focus)}<br><span class="muted">${e(C.location)}</span></p>
      <p style="margin-top:12px"><a href="mailto:${e(C.email)}">${e(C.email)}</a> · ${e(C.phone)}<br>
        ${U.link(C.links.github, 'GitHub', 'github')} · ${U.link(C.links.linkedin, 'LinkedIn', 'linkedin')} · ${U.link(C.links.resume, 'Resume (PDF)', 'resume pdf')}</p>

      <h2>About</h2>
      <p>${e(C.bio)}</p>

      <h2>Experience</h2>
      ${C.experience.map(x => `
        <h3>${e(x.role)} — ${e(x.company)}</h3>
        <div class="muted">${e(x.years)} · ${e(x.where)}</div>
        <ul>${x.points.map(p => `<li>${e(p)}</li>`).join('')}</ul>`).join('')}

      <h2>Projects</h2>
      ${C.projects.map(p => `
        <h3>${e(p.name)} <span class="muted">— ${e(p.kicker)}</span></h3>
        <div class="muted">${e(p.year)} · ${e(p.role)}${p.status ? ' · ' + e(p.status) : ''}</div>
        <p>${e(p.summary)}</p>
        <ul>${p.highlights.map(x => `<li>${e(x)}</li>`).join('')}</ul>
        <div class="muted">${p.stack.map(e).join(' · ')}</div>
        <div>${p.live ? U.link(p.live, 'Live site') : ''}${p.repo ? ' ' + U.link(p.repo, 'Source') : ''}${p.private && !p.repo ? ' <span class="muted">Private codebase — walkthrough on request</span>' : ''}</div>`).join('')}

      <h2>Skills</h2>
      ${Object.entries(C.skills).map(([k, v]) => `<p><b>${e(k)}:</b> ${v.map(e).join(', ')}</p>`).join('')}

      <h2>Education</h2>
      <p>${e(C.education.degree)} — ${e(C.education.school)} <span class="muted">(${e(C.education.years)})</span></p>
      ${C.certs.map(c => `<p>${e(c.name)} — ${e(c.detail)}</p>`).join('')}
    </div>`;

  const open = v => {
    root.hidden = !v;
    toggle.hidden = v;
    history.replaceState(null, '', v ? '#plain' : location.pathname);
    (v ? root : toggle).focus();
    if (v) U.track('list-view', { once: true });
  };
  addEventListener('hashchange', () => { if (location.hash === '#plain') open(true); });
  toggle.onclick = () => open(true);
  root.querySelector('.close').onclick = () => open(false);
  addEventListener('keydown', ev => { if (ev.key === 'Escape' && !root.hidden) open(false); });
  if (location.hash === '#plain') open(true);
};
