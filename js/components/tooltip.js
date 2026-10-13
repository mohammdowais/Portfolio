import { $ } from '../utils.js';
import { glossary } from '../data/glossary.js';

export function initTooltip() {
  const tooltip = $('#tooltip');
  let hideTimer;

  function show(term) {
    const entry = glossary[term.dataset.term];
    if (!entry) return;
    clearTimeout(hideTimer);
    const wiki = entry.wiki ? `<br><a href="https://en.wikipedia.org/wiki/${entry.wiki}" target="_blank" rel="noopener">Wikipedia</a>` : '';
    tooltip.innerHTML = `<b>${entry.title}</b>${entry.text}${wiki}`;
    tooltip.classList.add('visible');

    const rect = term.getBoundingClientRect();
    const { offsetWidth: w, offsetHeight: h } = tooltip;
    const above = rect.top - h - 8 >= 8;
    tooltip.style.left = `${Math.max(8, Math.min(innerWidth - w - 8, rect.left + rect.width / 2 - w / 2))}px`;
    tooltip.style.top = `${above ? rect.top - h - 8 : rect.bottom + 8}px`;
  }

  const hide = () => { hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 180); };
  const termFrom = e => e.target.closest('.term');

  document.addEventListener('mouseover', e => { const t = termFrom(e); if (t) show(t); });
  document.addEventListener('focusin', e => { const t = termFrom(e); if (t) show(t); });
  document.addEventListener('mouseout', e => { if (termFrom(e)) hide(); });
  document.addEventListener('focusout', e => { if (termFrom(e)) hide(); });
  tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  tooltip.addEventListener('mouseleave', hide);
}
