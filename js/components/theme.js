import { $ } from '../utils.js';

const MODES = ['auto', 'light', 'dark'];
const LABELS = { auto: 'theme: system', light: 'theme: light', dark: 'theme: dark' };

export function initTheme() {
  const button = $('#theme-toggle');
  let mode = 'auto';
  try { mode = localStorage.getItem('theme') || 'auto'; } catch {}

  function apply(next) {
    mode = next;
    if (next === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    button.textContent = LABELS[next];
    try { localStorage.setItem('theme', next); } catch {}
  }

  button.addEventListener('click', () => apply(MODES[(MODES.indexOf(mode) + 1) % MODES.length]));
  apply(mode);
}
