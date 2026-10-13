import { $, $$ } from '../utils.js';

const SECTIONS = [
  ['hero', 'Home'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['extras', 'More'],
];

export function initNav() {
  $('#nav-links').innerHTML = SECTIONS.slice(1)
    .map(([id, label]) => `<li><a href="#${id}">${label.toLowerCase()}</a></li>`).join('');
  $('#dock').innerHTML = SECTIONS
    .map(([id, label]) => `<a href="#${id}" data-section="${id}">${label}</a>`).join('');

  hideTopbarOnScroll();
  highlightCurrentSection();
  initSmoothScroll();
}

// Hidden after the hero; hover the top edge to bring it back. On touch screens, scrolling up shows it.
function hideTopbarOnScroll() {
  const topbar = $('#topbar');
  const touch = matchMedia('(hover: none)');
  let lastY = 0;
  let ticking = false;

  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (Math.abs(delta) > 12) {
        const scrollingUp = delta < 0;
        topbar.classList.toggle('is-hidden', currentY > 60 && !scrollingUp);
        lastY = currentY;
      }
      ticking = false;
    });
  }, { passive: true });
}

function highlightCurrentSection() {
  const links = $$('#dock a');
  const observer = new IntersectionObserver(entries => {
    entries.filter(e => e.isIntersecting).forEach(e => {
      links.forEach(a => a.classList.toggle('active', a.dataset.section === e.target.id));
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  $$('main section').forEach(section => observer.observe(section));
}

function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || anchor.classList.contains('project-link')) return;
    const target = $(href);
    if (!target) return;
    e.preventDefault();
    const topbarHeight = $('#topbar')?.offsetHeight || 60;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const dest = href === '#hero' ? 0 : Math.max(0, targetTop - (topbarHeight + 16));
    window.scrollTo({
      top: dest,
      behavior: 'smooth'
    });
  });
}
