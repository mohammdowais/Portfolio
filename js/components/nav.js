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
}

// Hidden after the hero; hover the top edge to bring it back. On touch screens, scrolling up shows it.
function hideTopbarOnScroll() {
  const topbar = $('#topbar');
  const touch = matchMedia('(hover: none)');
  let lastY = 0;
  addEventListener('scroll', () => {
    const scrollingUp = touch.matches && scrollY < lastY - 4;
    topbar.classList.toggle('is-hidden', scrollY > 40 && !scrollingUp);
    lastY = scrollY;
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
