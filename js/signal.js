// Stack zone: a live graph of tools ⇄ domains ⇄ projects, with request packets moving along the edges.
// Select any node to inspect it.
//
// Performance: runs at ~30fps while idle and full rate while you hover or drag.
// With reduced motion the graph is drawn settled and only redraws on interaction.
window.Signal = function (zone, C) {
  const { w: W, h: H } = zone;
  const STILL = U.reducedMotion;
  let dirty = true;
  const { cv, ctx } = U.zoneCanvas(zone, { onResize: () => { dirty = true; } });
  cv.setAttribute('aria-hidden', 'true');

  // ── build the graph from content ──
  const nodes = [], edges = [], byKey = {};
  const key = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const add = (id, label, kind, data) => {
    const n = { id, label, kind, data, x: U.rand(.2, .8) * W, y: U.rand(.2, .8) * H, vx: 0, vy: 0, pulse: 0 };
    nodes.push(n); byKey[id] = n; return n;
  };
  const link = (a, b, len) => edges.push({ a, b, len });

  const hub = add('hub', 'karl', 'hub', { engineer: C.name.full, role: C.role, focus: C.focus, based: C.location, contact: C.email });
  const usedIn = s => C.projects.filter(p => p.stack.some(t => key(t) === key(s))).map(p => p.name);

  Object.entries(C.skills).forEach(([cat, list]) => {
    const cn = add('cat:' + key(cat), cat.toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_'), 'cat', { category: cat, tools: list });
    link(hub, cn, 230);
    list.forEach(s => {
      const sn = add(key(s), s.toLowerCase(), 'skill', null);
      sn.data = { skill: s, category: cat };
      if (usedIn(s).length) sn.data.used_in = usedIn(s);
      link(cn, sn, 110);
    });
  });
  C.projects.forEach(p => {
    const pn = add('proj:' + key(p.name), '/' + p.name.toLowerCase().replace(/\s+/g, '_'), 'proj', { project: p.name, what: p.summary, stack: p.stack });
    p.stack.forEach(s => {
      const sn = byKey[key(s)] || add(key(s), s.toLowerCase(), 'skill', { skill: s, used_in: [p.name] });
      link(pn, sn, 170);
    });
  });

  // ── simulation ──
  const packets = [];
  const cx = W * .56, cy = H * .56;
  function step(t) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + .01;
        if (d2 > 160000) continue;
        const d = Math.sqrt(d2), f = 2600 / d2;
        a.vx += dx / d * f; a.vy += dy / d * f; b.vx -= dx / d * f; b.vy -= dy / d * f;
      }
    }
    for (const e of edges) {
      const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.hypot(dx, dy) || 1;
      const f = (d - e.len) * .003;
      e.a.vx += dx / d * f; e.a.vy += dy / d * f; e.b.vx -= dx / d * f; e.b.vy -= dy / d * f;
    }
    for (const n of nodes) {
      n.vx += (cx - n.x) * .0005 + Math.sin(t * .7 + n.y * .01) * .03;
      n.vy += (cy - n.y) * .0007 + Math.cos(t * .6 + n.x * .01) * .03;
      if (n !== dragN) {
        n.x = U.clamp(n.x + n.vx, 30, W - 160);
        n.y = U.clamp(n.y + n.vy, 30, H - 30);
      }
      n.vx *= .85; n.vy *= .85; n.pulse *= .94;
    }
    if (Math.random() < .06) packets.push({ e: edges[(Math.random() * edges.length) | 0], t: 0, rev: Math.random() < .5, sp: U.rand(.006, .018) });
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.sp;
      if (p.t >= 1) { (p.rev ? p.e.a : p.e.b).pulse = 1; packets.splice(i, 1); }
    }
  }

  const ACCENT = '#d4471f';
  const style = {
    hub:   { r: 11, font: '500 22px "JetBrains Mono"', fill: '#f2f1ed', text: '#f2f1ed', ring: false },
    proj:  { r: 8,  font: '500 17px "JetBrains Mono"', fill: ACCENT,    text: '#e8e9eb', ring: false },
    cat:   { r: 7,  font: '15px "JetBrains Mono"',     fill: '#c9cbcf', text: '#c9cbcf', ring: true },
    skill: { r: 3,  font: '13px "JetBrains Mono"',     fill: '#5d6066', text: '#7d8086', ring: false },
  };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (const e of edges) {
      const lit = hover && (e.a === hover || e.b === hover);
      ctx.strokeStyle = lit ? '#9a9da3' : '#1d1f23';
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    }
    ctx.fillStyle = ACCENT;
    for (const p of packets) {
      const s = p.rev ? p.e.b : p.e.a, d = p.rev ? p.e.a : p.e.b;
      ctx.fillRect(s.x + (d.x - s.x) * p.t - 1.5, s.y + (d.y - s.y) * p.t - 1.5, 3, 3);
    }
    for (const n of nodes) {
      const st = style[n.kind];
      ctx.beginPath(); ctx.arc(n.x, n.y, st.r, 0, 7);
      if (st.ring) { ctx.strokeStyle = st.fill; ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1; }
      else { ctx.fillStyle = st.fill; ctx.fill(); }
      if (n.pulse > .05) {
        ctx.strokeStyle = `rgba(212,71,31,${n.pulse * .8})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, st.r + (1 - n.pulse) * 26, 0, 7); ctx.stroke();
      }
    }
    // labels grouped by kind, so the font is set 4 times per frame instead of once per node
    ctx.textBaseline = 'middle';
    for (const kind in style) {
      const st = style[kind];
      ctx.font = st.font;
      ctx.fillStyle = st.text;
      for (const n of byKind[kind]) {
        if (n === hover) continue;
        ctx.fillText(n.label, n.x + st.r + 8, n.y);
      }
    }
    if (hover) {
      ctx.font = style[hover.kind].font;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hover.label, hover.x + style[hover.kind].r + 8, hover.y);
    }
    dirty = false;
  }
  const byKind = { hub: [], proj: [], cat: [], skill: [] };
  nodes.forEach(n => byKind[n.kind].push(n));

  // ── interaction ──
  let hover = null, dragN = null, dragMoved = false;
  const local = e => { const w = Plane.toWorld(e.clientX, e.clientY); return { x: w.x - zone.x, y: w.y - zone.y }; };
  const pick = p => {
    let best = null, bd = 26;
    for (const n of nodes) { const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < bd) { bd = d; best = n; } }
    return best;
  };
  cv.addEventListener('pointerdown', e => {
    const n = pick(local(e));
    if (!n) return;            // empty space → let the map pan
    e.stopPropagation();
    dragN = n; dragMoved = false;
  });
  addEventListener('pointermove', e => {
    const p = local(e);
    if (dragN) { dragN.x = p.x; dragN.y = p.y; dragMoved = true; dirty = true; return; }
    const was = hover;
    hover = e.target === cv ? pick(p) : null;
    if (hover !== was) { dirty = true; cv.style.cursor = hover ? 'pointer' : ''; }
  });
  addEventListener('pointerup', e => {
    if (dragN && !dragMoved) openPayload(dragN);
    dragN = null;
  });

  function fmt(v, ind = '  ') {
    if (Array.isArray(v)) return '[\n' + v.map(x => ind + '  ' + fmt(x, ind + '  ')).join(',\n') + '\n' + ind + ']';
    if (v && typeof v === 'object')
      return '{\n' + Object.entries(v).map(([k, x]) => `${ind}<span class="k">"${U.esc(k)}"</span>: ${fmt(x, ind + '  ')}`).join(',\n') + '\n' + ind.slice(2) + '}';
    if (typeof v === 'string')
      return v.includes('@') ? `<a href="mailto:${U.esc(v)}">"${U.esc(v)}"</a>` : `<span class="s">"${U.esc(v)}"</span>`;
    return String(v);
  }

  let pz = 10;
  function openPayload(n) {
    const box = U.el('div', 'payload no-pan', `<header><span>GET /${U.esc(n.label.replace(/^\//, ''))}</span><button aria-label="close">×</button></header><pre>${fmt(n.data)}</pre>`);
    const px = U.clamp(n.x + 30, 10, W - 440), py = U.clamp(n.y - 30, 10, H - 300);
    box.style.left = px + 'px'; box.style.top = py + 'px';
    box.style.transform = `rotate(${U.rand(-2.5, 2.5)}deg)`;
    box.style.zIndex = pz++;
    box.querySelector('button').onclick = () => box.remove();
    box.querySelector('header').addEventListener('pointerdown', e => {
      if (e.target.tagName === 'BUTTON') return;
      const s = local(e), ox = s.x - box.offsetLeft, oy = s.y - box.offsetTop;
      box.style.zIndex = pz++;
      const mv = ev => { const p = local(ev); box.style.left = p.x - ox + 'px'; box.style.top = p.y - oy + 'px'; };
      addEventListener('pointermove', mv);
      addEventListener('pointerup', () => removeEventListener('pointermove', mv), { once: true });
    });
    zone.el.appendChild(box);
    n.pulse = 1;
    dirty = true;
    log(`200 OK  ← /${n.label.replace(/^\//, '')}`);
  }

  // ── fake server log ──
  const logEl = zone.el.querySelector('.log'), lines = [];
  function log(s) {
    lines.unshift(`<span>${new Date().toISOString().slice(11, 23)}</span> ${U.esc(s)}`);
    lines.length = Math.min(lines.length, 9);
    logEl.innerHTML = lines.join('<br>');
  }
  const ambient = [
    'webhook.received tenant=dental_07', 'queue.job processed InvoiceSync', 'rbac.check role=clinician ✓',
    'zapier → pandadoc doc.created', 'tenant.resolve oneshot_davao', 'notion.page.updated',
    'nginx 200 GET /api/v1/patients', 'livewire.hydrate PatientJourney', 'ssl.renew ok',
  ];
  setInterval(() => { if (Plane.visible(zone)) log(ambient[(Math.random() * ambient.length) | 0]); }, 1400);

  // settle the graph before anyone sees it
  for (let i = 0; i < 300; i++) step(i / 60);

  let last = 0;
  (function frame(t = 0) {
    requestAnimationFrame(frame);
    if (!Plane.visible(zone)) return;
    const busy = hover || dragN;
    if (STILL) {
      if (dragN) step(t / 1000);    // let a dragged node pull its neighbours along
      if (dirty || dragN) draw();
      return;
    }
    if (!busy && t - last < 32) return; // ~30fps when nobody is interacting
    last = t;
    step(t / 1000);
    draw();
  })();
};
