import { $ } from '../utils.js';

const LINK_DISTANCE = 130;
const CURSOR_DISTANCE = 160;

export function initBackground() {
  const canvas = $('#background');
  const ctx = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width, height, stars = [], color = '200,245,66', frame = 0;
  const cursor = { x: -999, y: -999 };

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(90, Math.floor((width * height) / 17000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.2 + 0.5,
    }));
  }

  function line(a, b, distance, limit, strength) {
    ctx.strokeStyle = `rgba(${color},${(1 - distance / limit) * strength})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function draw() {
    if (frame++ % 30 === 0) color = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      if (!reducedMotion) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;
      }
      ctx.fillStyle = `rgba(${color},0.7)`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = 0.6;
    stars.forEach((a, i) => {
      for (let j = i + 1; j < stars.length; j++) {
        const d = Math.hypot(a.x - stars[j].x, a.y - stars[j].y);
        if (d < LINK_DISTANCE) line(a, stars[j], d, LINK_DISTANCE, 0.28);
      }
      const d = Math.hypot(a.x - cursor.x, a.y - cursor.y);
      if (d < CURSOR_DISTANCE) line(a, cursor, d, CURSOR_DISTANCE, 0.5);
    });

    if (!reducedMotion) requestAnimationFrame(draw);
  }

  addEventListener('pointermove', e => { cursor.x = e.clientX; cursor.y = e.clientY; }, { passive: true });
  addEventListener('resize', () => { resize(); if (reducedMotion) draw(); });
  resize();
  draw();
}
