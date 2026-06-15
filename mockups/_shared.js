/* Shared helpers for hero mockups: division data + starfield canvas. */
window.GHOST_DIVISIONS = [
  { name: '69th M3CH',      logo: '../Assets/69th-M3ch-Company---metallic.png',                 color: '#a0b800' },
  { name: '39th Hell-Blast', logo: '../Assets/39th-Hell-Blast-Company---metallic.png',          color: '#cc2200' },
  { name: 'Taskforce 27',   logo: '../Assets/T27.png',                                          color: '#c8a832' },
  { name: 'HiveBreakers',   logo: '../Assets/HiveBreakers.png',                                 color: '#7a40cc' },
  { name: 'Pale Riders',    logo: '../Assets/Pale-Riders---texture.png',                        color: '#b8b8c4' },
  { name: 'G.H.O.S.T. TR',  logo: '../Assets/GTR.png',                                          color: '#cc0000' },
  { name: '666th Rangers',  logo: '../Assets/666th-Recoilless-Ranger-Regiment---metallic_1.png', color: '#e06020' }
];
window.GHOST_CENTER = '../Assets/G.H.O.S.T---flat_r2.png';

window.startStarfield = function (canvas, opts) {
  opts = opts || {};
  const ctx = canvas.getContext('2d');
  let w, h, stars, dpr;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 1600) * (opts.density || 1);
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        z: Math.random(), r: Math.random() * 1.4 + 0.2,
        tw: Math.random() * Math.PI * 2
      });
    }
  }
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(s.tw + t * 0.0015));
      ctx.globalAlpha = a * (0.4 + s.z * 0.6);
      ctx.fillStyle = opts.color || '#cfe0a0';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
      ctx.fill();
      if (opts.drift) { s.x += (s.z * 0.06) * (opts.drift); if (s.x > w) s.x = 0; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
};
