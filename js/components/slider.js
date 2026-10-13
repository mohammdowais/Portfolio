import { $, $$, slug } from '../utils.js';

const SCREENSHOT_DIR = 'assets/screenshots/';

// Real screenshots win; otherwise stock placeholders are generated.
export function screenshotUrls(project) {
  if (project.screenshots?.length) {
    return project.screenshots.map(file => (/^https?:/.test(file) ? file : SCREENSHOT_DIR + file));
  }
  return Array.from({ length: project.placeholders || 0 }, (_, i) =>
    `https://picsum.photos/seed/${slug(project.name)}-${i + 1}/960/540.webp`);
}

export function sliderHtml(project) {
  const urls = screenshotUrls(project);
  if (!urls.length) {
    return `<p class="no-shots">No screenshots${project.closedSource ? ' (closed-source project)' : ' yet'}.</p>`;
  }

  const images = urls.map((url, i) =>
    `<img src="${url}" width="960" height="540" alt="${project.name} screenshot ${i + 1}" decoding="async" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('');
  const controls = urls.length > 1
    ? `<button class="slider-btn prev" aria-label="Previous screenshot">&lsaquo;</button>
       <button class="slider-btn next" aria-label="Next screenshot">&rsaquo;</button>
       <div class="slider-dots">${urls.map((_, i) => `<i class="${i ? '' : 'active'}"></i>`).join('')}</div>`
    : '';

  return `<div class="slider"><div class="track">${images}</div>${controls}</div>`;
}

export function initSlider(root) {
  const track = $('.track', root);
  if (!track) return;

  $$('img', track).forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  });

  const dots = $$('.slider-dots i', root);
  if (!dots.length) return;
  const scrollBy = direction => track.scrollBy({ left: direction * track.clientWidth });
  $('.prev', root).addEventListener('click', () => scrollBy(-1));
  $('.next', root).addEventListener('click', () => scrollBy(1));
  track.addEventListener('scroll', () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }, { passive: true });
}
