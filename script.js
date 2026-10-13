(() => {
  const canvas = document.getElementById("stars");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tones = ["255, 62, 165", "178, 107, 255", "252, 204, 66", "255, 236, 248"];
  const pointer = { x: -9999, y: -9999 };

  let w = 0;
  let h = 0;
  let link = 120;
  let stars = [];
  let raf = 0;

  function makeStar() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 0.8 + Math.random() * 1.5,
      tone: tones[Math.floor(Math.random() * tones.length)],
      tw: Math.random() * Math.PI * 2,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const widthChanged = window.innerWidth !== w;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    link = Math.max(90, Math.min(150, w / 7));

    // Mobile URL bars resize height on scroll; only reseed when width changes.
    if (widthChanged) {
      const count = Math.round(Math.max(36, Math.min(100, (w * h) / 13000)));
      stars = Array.from({ length: count }, makeStar);
    }
  }

  function line(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 0.8;

    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) line(a.x, a.y, b.x, b.y, `rgba(${a.tone}, ${(1 - d / link) * 0.42})`);
      }

      const reach = link * 1.4;
      const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
      if (pd < reach) line(a.x, a.y, pointer.x, pointer.y, `rgba(255, 62, 165, ${(1 - pd / reach) * 0.7})`);
    }

    ctx.shadowBlur = 10;
    for (const s of stars) {
      ctx.shadowColor = `rgba(${s.tone}, 0.9)`;
      ctx.fillStyle = `rgba(${s.tone}, ${0.55 + Math.sin(s.tw) * 0.45})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function tick() {
    for (const s of stars) {
      s.x += s.vx;
      s.y += s.vy;
      s.tw += 0.025;
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  function clearPointer() {
    pointer.x = -9999;
    pointer.y = -9999;
  }

  window.addEventListener("resize", () => {
    resize();
    if (reduce) draw();
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    },
    { passive: true }
  );

  window.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) clearPointer();
  });

  window.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "mouse") clearPointer();
  });

  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && !reduce) raf = requestAnimationFrame(tick);
  });

  resize();
  if (reduce) draw();
  else raf = requestAnimationFrame(tick);
})();
