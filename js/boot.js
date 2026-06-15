/* ============================================================
   boot.js — terminal boot sequence
   Jitter-timed messages + unicode loading bars -> flicker into hero.
   Configurable constants below (also overridable via data/site.json).
   ============================================================ */
(function () {
  'use strict';

  /* ---- Configurable constants (fallbacks; site.json may override) ---- */
  var CONFIG = {
    baseDelay: 1800,   // ms baseline between message completions
    jitter:    600,    // ms of random extra delay per message
    barLength: 10,     // number of blocks in a loading bar
    barStepMin: 35,    // ms min per bar-block fill
    barStepMax: 130    // ms max per bar-block fill
  };

  var MESSAGES = [
    'INITIALIZING G.H.O.S.T. NETWORK...',
    'VERIFYING OPERATIVE CLEARANCE...',
    'SYNCING TACTICAL DISPLAY...',
    'LOADING DIVISION MANIFESTS...',
    'ALL SYSTEMS ONLINE.'
  ];

  var BLOCK_EMPTY = '░'; // ░
  var BLOCK_FULL  = '█'; // █

  var boot = document.getElementById('boot');
  var log  = document.getElementById('boot-log');
  var skipBtn = document.getElementById('boot-skip');
  if (!boot || !log) return;

  var finished = false;
  var timers = [];

  function rand(min, max) { return min + Math.random() * (max - min); }

  function makeBar(filled) {
    var bar = '';
    for (var i = 0; i < CONFIG.barLength; i++) {
      bar += i < filled ? BLOCK_FULL : BLOCK_EMPTY;
    }
    return bar;
  }

  function addCursor() {
    var c = document.createElement('span');
    c.className = 'boot__cursor';
    return c;
  }

  /* Render one message: animate its bar, then print the label. */
  function runMessage(index, done) {
    if (finished) return;
    var line = document.createElement('div');
    line.className = 'boot__line';
    var barSpan = document.createElement('span');
    barSpan.className = 'bar';
    var label = document.createElement('span');
    line.appendChild(barSpan);
    line.appendChild(label);
    log.appendChild(line);

    var filled = 0;
    barSpan.textContent = '[' + makeBar(0) + '] ';

    function fillStep() {
      if (finished) return;
      filled++;
      barSpan.textContent = '[' + makeBar(filled) + '] ';
      if (filled < CONFIG.barLength) {
        timers.push(setTimeout(fillStep, rand(CONFIG.barStepMin, CONFIG.barStepMax)));
      } else {
        // bar complete -> print message
        var isLast = index === MESSAGES.length - 1;
        label.className = isLast ? 'ok' : '';
        label.textContent = MESSAGES[index];
        log.scrollTop = log.scrollHeight;
        var wait = CONFIG.baseDelay * 0.18 + Math.random() * CONFIG.jitter;
        timers.push(setTimeout(done, wait));
      }
    }
    timers.push(setTimeout(fillStep, rand(CONFIG.barStepMin, CONFIG.barStepMax)));
  }

  function runSequence(i) {
    if (finished) return;
    if (i >= MESSAGES.length) {
      // trailing cursor + small pause, then reveal
      var tail = document.createElement('div');
      tail.className = 'boot__line';
      tail.appendChild(addCursor());
      log.appendChild(tail);
      timers.push(setTimeout(reveal, 700));
      return;
    }
    runMessage(i, function () { runSequence(i + 1); });
  }

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function reveal() {
    if (finished) return;
    finished = true;
    clearTimers();
    boot.classList.add('is-flicker');
    document.body.dataset.bootDone = 'true';
    document.dispatchEvent(new CustomEvent('ghost:boot-complete'));
    setTimeout(function () { boot.classList.add('is-hidden'); }, 600);
  }

  function skip() { reveal(); }

  boot.addEventListener('click', skip);
  if (skipBtn) skipBtn.addEventListener('click', function (e) { e.stopPropagation(); skip(); });
  document.addEventListener('keydown', function (e) {
    if (!finished && (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ')) skip();
  });

  /* Pull overrides from site.json if present, then start. */
  function start() { runSequence(0); }

  fetch('data/site.json')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data && data.bootSequence) {
        var b = data.bootSequence;
        if (typeof b.baseDelay === 'number') CONFIG.baseDelay = b.baseDelay;
        if (typeof b.jitter === 'number')    CONFIG.jitter    = b.jitter;
        if (typeof b.barLength === 'number') CONFIG.barLength = b.barLength;
      }
    })
    .catch(function () { /* use defaults */ })
    .finally(start);
})();
