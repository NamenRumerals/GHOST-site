/* ============================================================
   home.js — loads JSON data and renders the home page sections:
   About, Latest Events, Stats + Socials, Footer. Also handles the
   division modal (triggered by the solar system) and nav behavior.
   ============================================================ */
(function () {
  'use strict';

  var TIKTOK_ICON =
    '<svg class="social-link__icon" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9V9c-1.3.1-2.5-.3-3.6-1v6.6c0 3.4-2.6 5.7-5.7 5.7C7.9 20.3 6 18 6 15.4c0-2.7 2.2-4.8 4.9-4.8.4 0 .8 0 1.1.1v2.6c-.3-.1-.7-.2-1.1-.2-1.3 0-2.3 1-2.3 2.3 0 1.3 1 2.3 2.3 2.3 1.3 0 2.4-1 2.4-2.6V3h2.3z"/></svg>';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var DATA = { site: null, divisions: null, events: null };

  /* ---------------- NAV ---------------- */
  function initNav() {
    var nav = $('#nav');
    var burger = $('#nav-burger');
    if (burger) burger.addEventListener('click', function () { nav.classList.toggle('is-open'); });
    window.addEventListener('scroll', function () {
      nav.style.background = window.scrollY > 40 ? 'rgba(10,12,8,0.92)' : 'rgba(10,12,8,0.72)';
    });
  }

  function fillDivisionsDropdown(divisions) {
    var menu = $('#divisions-menu');
    if (!menu) return;
    menu.innerHTML = '';
    divisions.forEach(function (d) {
      var a = el('a', null, esc(d.name));
      a.href = d.pageUrl;
      menu.appendChild(a);
    });
  }

  /* ---------------- SITE / ABOUT / STATS / SOCIALS ---------------- */
  function applySite(site) {
    // discord / join links
    document.querySelectorAll('[data-discord]').forEach(function (a) {
      a.href = site.discordInvite || '#';
      if (!site.discordInvite) a.setAttribute('aria-disabled', 'true');
    });

    var about = $('#about-text');
    if (about) about.textContent = site.about || '';
    var motto = $('#about-motto');
    if (motto) motto.textContent = site.motto || '';

    // stats
    var statsGrid = $('#stats-grid');
    if (statsGrid && Array.isArray(site.stats)) {
      statsGrid.innerHTML = '';
      site.stats.forEach(function (s) {
        var card = el('div', 'stat');
        card.appendChild(el('div', 'stat__value', esc(s.value)));
        card.appendChild(el('div', 'stat__label', esc(s.label)));
        statsGrid.appendChild(card);
      });
    }

    // socials
    var socialsGrid = $('#socials-grid');
    if (socialsGrid && site.socials) {
      socialsGrid.innerHTML = '';
      if (site.socials.main && site.socials.main.tiktok) {
        socialsGrid.appendChild(socialLink(site.socials.main.label, site.socials.main.tiktok, true));
      }
      (site.socials.divisions || []).forEach(function (d) {
        socialsGrid.appendChild(socialLink(d.label, d.tiktok, false));
      });
    }
  }

  function socialLink(label, url, isMain) {
    var a = el('a', 'social-link' + (isMain ? ' is-main' : ''));
    a.innerHTML = TIKTOK_ICON + '<span>' + esc(label) + '</span>';
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else { a.href = '#'; a.title = 'Link coming soon'; a.style.opacity = '0.55'; }
    return a;
  }

  /* ---------------- EVENTS ---------------- */
  function renderEvents(events) {
    var grid = $('#events-grid');
    if (!grid) return;
    grid.innerHTML = '';
    events.slice(0, 3).forEach(function (ev) {
      var card = el('div', 'event-card');
      var img = el('div', 'event-card__img', ev.coverImage ? '' : 'NO TRANSMISSION IMAGE');
      if (ev.coverImage) img.style.backgroundImage = 'url("' + ev.coverImage + '")';
      var body = el('div', 'event-card__body');
      body.appendChild(el('div', 'event-card__date', esc(fmtDate(ev.date))));
      body.appendChild(el('div', 'event-card__title', esc(ev.name)));
      body.appendChild(el('div', 'event-card__desc', esc(ev.shortDesc)));
      card.appendChild(img);
      card.appendChild(body);
      card.addEventListener('click', function () { window.location.href = 'events.html'; });
      grid.appendChild(card);
    });
  }

  /* ---------------- DIVISION MODAL ---------------- */
  function initModal() {
    var modal = $('#division-modal');
    if (!modal) return;
    var box = $('#modal-box');
    var close = function () { modal.classList.remove('is-open'); };

    $('#modal-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    document.addEventListener('ghost:division-select', function (e) {
      var d = e.detail;
      box.style.setProperty('--modal-glow', d.glowColor || 'var(--accent)');
      $('#modal-logo').src = d.logo;
      $('#modal-logo').alt = d.name + ' logo';
      $('#modal-name').textContent = d.name;
      $('#modal-motto').textContent = d.motto || '';
      $('#modal-oneliner').textContent = d.oneLiner || '';
      $('#modal-btn').href = d.pageUrl;
      modal.classList.add('is-open');
    });
  }

  /* ---------------- FOOTER ---------------- */
  function applyFooter(site) {
    var fm = $('#footer-motto');
    if (fm) fm.textContent = site.motto || '';
    var yr = $('#footer-year');
    if (yr) yr.textContent = new Date().getFullYear();
    var fn = $('#footer-faction');
    if (fn) fn.textContent = site.factionName || 'G.H.O.S.T.';
  }

  /* ---------------- BOOT ---------------- */
  function loadAll() {
    Promise.all([
      fetch('data/site.json').then(function (r) { return r.json(); }),
      fetch('data/divisions.json').then(function (r) { return r.json(); }),
      fetch('data/events.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      DATA.site = res[0]; DATA.divisions = res[1]; DATA.events = res[2];
      fillDivisionsDropdown(DATA.divisions);
      applySite(DATA.site);
      renderEvents(DATA.events);
      applyFooter(DATA.site);
    }).catch(function (err) {
      console.error('Failed to load site data. Serve over http(s), not file://.', err);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initModal();
    loadAll();
  });
})();
