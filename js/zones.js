// DOM for each zone. Interactive zones get a skeleton here; their behaviour lives in their own file.
window.Zones = {
  erosion(z, C) {
    z.el.innerHTML = `
      <h1 class="sr-only">${U.esc(C.name.full)}</h1>
      <div class="hint eyebrow" aria-hidden="true">Select the name to cycle · Move away and it dissolves</div>
      <div class="tagline">${U.esc(C.role)} <i>—</i> ${U.esc(C.focus)}<small>${U.esc(C.location)}</small></div>`;
  },

  signal(z, C) {
    z.el.innerHTML = `
      <div class="big"><h2>Stack</h2>
        <div class="eyebrow">${Object.values(C.skills).flat().length} tools · ${Object.keys(C.skills).length} domains · ${C.projects.length} projects</div></div>
      <div class="sr-only">
        ${Object.entries(C.skills).map(([cat, list]) => `<h3>${U.esc(cat)}</h3><ul>${list.map(t => `<li>${U.esc(t)}</li>`).join('')}</ul>`).join('')}
      </div>
      <div class="log" aria-hidden="true"></div>
      <div class="shint" aria-hidden="true"><i>●</i> project &nbsp; ○ domain &nbsp; · tool<br>Select a node to inspect it</div>`;
  },

  about(z, C) {
    const facts = [
      ['Based in', C.location],
      ['Education', `${C.education.degree}, ${C.education.school} (${C.education.years})`],
      ...C.certs.map(c => ['Certification', `${c.name} — ${c.detail}`]),
      ['Focus', C.focus],
    ];
    z.el.innerHTML = `
      <figure class="photo" style="left:40px;top:60px;transform:rotate(-1deg)">
        <div class="frame">${U.img(C.photo, C.name.full, 'portrait')}</div>
        <figcaption>Fig. 1 — ${U.esc(C.name.full)}</figcaption>
      </figure>
      <p class="bio" style="left:540px;top:40px">${U.esc(C.bio)}</p>
      <dl class="facts" style="left:540px;top:640px">
        ${facts.map(([k, v]) => `<div><dt>${U.esc(k)}</dt><dd>${U.esc(v)}</dd></div>`).join('')}
      </dl>`;
  },

  projects(z, C) {
    // "Syncro — clinic management…" → product name in bold, the rest as normal text
    const summaryHtml = t => {
      const i = t.indexOf(' — ');
      return i > 0 && i < 40 ? `<b class="product">${U.esc(t.slice(0, i))}</b> — ${U.esc(t.slice(i + 3))}` : U.esc(t);
    };
    const cards = C.projects.map((p, i) => {
      const dark = [1, 3, 6].includes(i);
      const links = [
        p.live ? U.link(p.live, 'Live site ↗') : '',
        p.repo ? U.link(p.repo, 'Source ↗') : '',
        p.private && !p.repo ? '<span class="private">Private codebase · walkthrough on request</span>' : '',
        !p.live && !p.repo && !p.private ? U.link(null, '', 'live url') : '',
      ].join('');
      return `
        <article class="proj${dark ? ' dark' : ''}" id="project-${p.id || U.slug(p.name)}">
          <div class="shot${p.imageFit === 'contain' ? ' contain' : ''}">${U.img(p.image, p.name + ' screenshot', p.name + ' — screenshot (demo data)')}</div>
          <div class="head"><span class="eyebrow">${U.esc(p.kicker)}</span><span class="eyebrow">P/${String(i + 1).padStart(2, '0')}<button class="copy-btn" type="button" data-copy-link="work/${p.id || U.slug(p.name)}" aria-label="Copy link to ${U.esc(p.name)}">Copy link</button></span></div>
          <h2>${U.esc(p.name)}</h2>
          <div class="meta">${U.esc(p.year)} · ${U.esc(p.role)}${p.status ? `<span class="status">${U.esc(p.status)}</span>` : ''}</div>
          <p>${summaryHtml(p.summary)}</p>
          ${p.facts && p.facts.length ? `<dl class="facts">${p.facts.map(([k, v]) => `<div><dt>${U.esc(k)}</dt><dd>${U.esc(v)}</dd></div>`).join('')}</dl>` : ''}
          <div class="eyebrow sub">Technical details</div>
          <ul>${p.highlights.slice(0, 3).map(x => `<li>${U.esc(x)}</li>`).join('')}</ul>
          ${p.highlights.length > 3 ? `<details class="more"><summary><span class="c">+ ${p.highlights.length - 3} more technical details</span><span class="o">− Show fewer</span></summary>
            <ul>${p.highlights.slice(3).map(x => `<li>${U.esc(x)}</li>`).join('')}</ul></details>` : ''}
          <div class="stack">${p.stack.map(t => `<span>${U.esc(t)}</span>`).join('')}</div>
          <div class="links">${links}</div>
        </article>`;
    });
    z.el.innerHTML = cards.join('');

    // Masonry-ish: three staggered columns, each card dropped into the shortest one.
    // Offsets and tilts are fixed so it looks deliberate, not random.
    z.layout = () => {
      const cols = [{ x: 0, y: 40 }, { x: 1010, y: 120 }, { x: 2010, y: 180 }];
      const tilt = [-.6, .5, -.4, .4, -.5, .3, -.3];
      [...z.el.querySelectorAll('.proj')].forEach((el, i) => {
        const col = cols.reduce((a, b) => (b.y < a.y ? b : a));
        el.style.left = col.x + 'px';
        el.style.top = col.y + 'px';
        el.style.transform = `rotate(${tilt[i % tilt.length]}deg)`;
        col.y += el.offsetHeight + 90;
      });
      return Math.max(...cols.map(c => c.y)) + 20;
    };
  },

  contact(z, C) {
    z.el.innerHTML = `
      <div class="say" style="left:80px;top:90px">Let's build<br>something<i>.</i></div>
      <div class="lines" style="left:86px;top:480px">
        <div class="eyebrow">Email</div><a href="mailto:${U.esc(C.email)}">${U.esc(C.email)}</a><button class="copy-btn" type="button" data-copy-email aria-label="Copy email address">Copy</button>
        <div class="eyebrow" style="margin-top:16px">Phone</div><a href="tel:${U.esc(C.phone.replace(/\s/g, ''))}">${U.esc(C.phone)}</a>
      </div>
      <div class="socials" style="left:86px;top:880px">
        ${U.link(C.links.github, 'GitHub ↗', 'github')}${U.link(C.links.linkedin, 'LinkedIn ↗', 'linkedin')}${U.link(C.links.resume, 'Résumé ↓', 'resume pdf')}
      </div>`;
  },
};
