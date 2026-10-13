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
    return '';
  }

  const images = urls.map((url, i) =>
    `<img src="${url}" width="960" height="540" alt="${project.name} screenshot ${i + 1}" decoding="async" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`).join('');
  const controls = urls.length > 1
    ? `<button class="slider-btn prev" aria-label="Previous screenshot" type="button">&lsaquo;</button>
       <button class="slider-btn next" aria-label="Next screenshot" type="button">&rsaquo;</button>
       <div class="slider-dots">${urls.map((_, i) => `<i class="${i ? '' : 'active'}" data-index="${i}" title="Screenshot ${i + 1}"></i>`).join('')}</div>`
    : '';

  return `<div class="slider"><div class="track">${images}</div>${controls}</div>`;
}

export function initSlider(root) {
  const slider = $('.slider', root);
  if (!slider) return;
  const track = $('.track', slider);
  if (!track) return;

  const images = $$('img', track);
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
    }
  });

  const prevBtn = $('.slider-btn.prev', slider);
  const nextBtn = $('.slider-btn.next', slider);
  const dots = $$('.slider-dots i', slider);
  const count = images.length;
  if (count <= 1) return;

  const getIndex = () => {
    const width = track.clientWidth || 1;
    return Math.round(track.scrollLeft / width);
  };

  const goTo = index => {
    const width = track.clientWidth || 1;
    let target = index;
    if (target < 0) target = count - 1;
    if (target >= count) target = 0;
    track.scrollTo({
      left: target * width,
      behavior: 'smooth'
    });
  };

  if (prevBtn) {
    prevBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      goTo(getIndex() - 1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      goTo(getIndex() + 1);
    };
  }

  dots.forEach((dot, i) => {
    dot.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      goTo(i);
    };
  });

  track.addEventListener('scroll', () => {
    const index = getIndex();
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }, { passive: true });
}
