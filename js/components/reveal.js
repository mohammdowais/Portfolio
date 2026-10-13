import { $$ } from '../utils.js';

export function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.filter(e => e.isIntersecting).forEach(e => {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => observer.observe(el));
}
