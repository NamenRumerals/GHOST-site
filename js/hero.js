/* ============================================================
   hero.js — tactical command display with orbiting divisions.
   Starfield + glowing orbit trails + radar guides (HUD) and
   division emblems orbiting on two rings with depth. Click an
   emblem -> dispatches ghost:division-select (modal in home.js).
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SQUASH = 0.40; // ellipse flatten (perspective tilt)

  var hero   = document.getElementById('hero');
  var canvas = document.getElementById('hero-stars');
  var svg    = document.getElementById('hero-orbits');
  var nodesL = document.getElementById('hero-nodes');
  if (!hero || !svg || !nodesL) return;

  /* ---------------- starfield ---------------- */
  function startStarfield() {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h, dpr, stars;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((w * h) / 1600);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h,
          z: Math.random(), r: Math.random() * 1.4 + 0.2, tw: Math.random() * Math.PI * 2 });
      }
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(s.tw + (reduceMotion ? 0 : t * 0.0015)));
        ctx.globalAlpha = a * (0.4 + s.z * 0.6);
        ctx.fillStyle = '#bcd08a';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  }

  /* ---------------- orbit geometry ---------------- */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var defs = svg.querySelector('defs');
  var cx, cy, R1, R2;

  function ellipse(r, stroke, sw, op, dash, sp, reverse) {
    var el = document.createElementNS(SVGNS, 'ellipse');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy);
    el.setAttribute('rx', r); el.setAttribute('ry', r * SQUASH);
    el.setAttribute('fill', 'none'); el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', sw); el.setAttribute('opacity', op);
    if (dash) {
      el.setAttribute('stroke-dasharray', dash);
      if (!reduceMotion) {
        el.setAttribute('class', 'dash');
        el.style.setProperty('--sp', sp + 's');
        if (reverse) el.style.animationDirection = 'reverse';
      }
    } else {
      el.setAttribute('filter', 'url(#hero-bloom)');
    }
    svg.appendChild(el);
  }

  function buildOrbits() {
    var W = hero.clientWidth, H = hero.clientHeight;
    cx = W / 2; cy = H * 0.40;
    var base = Math.min(W * 0.40, H * 0.58);
    R2 = base; R1 = base * 0.60;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = defs.outerHTML;
    ellipse(R1 * 0.82, '#3d5420', 0.8, 0.45, '2 9', 26, false);    // inner radar guide
    ellipse(R1, '#8a9a5e', 2.2, 0.5, null);                        // inner glow trail
    ellipse((R1 + R2) / 2, '#3d5420', 0.8, 0.4, '30 12', 40, true);// mid radar guide
    ellipse(R2, '#7a8a52', 2.2, 0.5, null);                        // outer glow trail
    ellipse(R2 * 1.12, '#3d5420', 0.7, 0.35, '2 11', 32, false);   // outer radar guide
  }

  /* ---------------- nodes ---------------- */
  var nodes = [];
  function makeNode(div, ring, idx, count) {
    var n = document.createElement('div');
    n.className = 'hero-node';
    n.style.setProperty('--c', div.glowColor || 'var(--accent)');
    var size = ring === 0 ? 62 : 70;
    n.innerHTML =
      '<div class="ring" style="width:' + size + 'px;height:' + size + 'px">' +
        '<img src="' + div.logo + '" alt="' + div.name + '" style="width:' + (size - 14) + 'px;height:' + (size - 14) + 'px">' +
      '</div><span>' + (div.short || div.name) + '</span>';
    n.addEventListener('click', function () {
      document.dispatchEvent(new CustomEvent('ghost:division-select', { detail: div }));
    });
    nodesL.appendChild(n);
    nodes.push({ el: n, ring: ring, phase: (idx / count) * Math.PI * 2 });
  }

  /* ---------------- animation ---------------- */
  function animate(divisions) {
    var inner = divisions.slice(0, 4);
    var outer = divisions.slice(4);
    inner.forEach(function (d, i) { makeNode(d, 0, i, inner.length); });
    outer.forEach(function (d, i) { makeNode(d, 1, i, outer.length); });

    buildOrbits();
    window.addEventListener('resize', buildOrbits);

    var t0 = performance.now();
    function place(now) {
      var t = reduceMotion ? 0 : (now - t0) / 1000;
      for (var i = 0; i < nodes.length; i++) {
        var nd = nodes[i];
        var r = nd.ring === 0 ? R1 : R2;
        var sp = nd.ring === 0 ? 0.15 : 0.095;
        var a = nd.phase + t * sp;
        var x = cx + Math.cos(a) * r;
        var y = cy + Math.sin(a) * r * SQUASH;
        var depth = (Math.sin(a) + 1) / 2;          // 0 back .. 1 front
        var scale = 0.74 + depth * 0.46;
        nd.el.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) scale(' + scale + ')';
        nd.el.style.zIndex = 3 + Math.round(depth * 4);
        nd.el.style.opacity = 0.58 + depth * 0.42;
      }
      if (!reduceMotion) requestAnimationFrame(place);
    }
    requestAnimationFrame(place);
  }

  /* ---------------- boot ---------------- */
  startStarfield();
  fetch('data/divisions.json')
    .then(function (r) { return r.json(); })
    .then(animate)
    .catch(function (err) { console.error('hero: failed to load divisions.json', err); });
})();
