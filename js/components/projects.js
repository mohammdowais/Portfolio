import { projects } from '../data/projects.js';
import { $, $$, isMobile, richText, tagsHtml } from '../utils.js';
import { sliderHtml, initSlider } from './slider.js';

const view = $('#projects-view');
const list = $('#project-list');
const detail = $('#project-detail');

const cardHtml = (project, index) => `
  <button class="card" data-index="${index}">
    <h3>${project.name}</h3>
    <span class="meta">${project.period}${project.closedSource ? ' · Closed source' : ''}</span>
    <p class="summary">${richText(project.summary)}</p>
    <div class="tags">${tagsHtml(project.stack.slice(0, 3))}</div>
  </button>`;

function linksHtml(project) {
  if (project.links?.length) {
    return project.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label} &nearr;</a>`).join('');
  }
  return project.closedSource ? '<span>Private repository</span>' : '';
}

const detailHtml = project => `
  <div class="detail-toolbar">
    <button class="back-button">&larr; All projects</button>
    <button class="menu-button">Other projects</button>
  </div>
  <h3>${project.name}</h3>
  <p class="meta">${project.period}</p>
  ${sliderHtml(project)}
  <p class="summary">${richText(project.summary)}</p>
  <h4>STACK</h4>
  <div class="tags">${tagsHtml(project.stack)}</div>
  <h4>HIGHLIGHTS</h4>
  <ul>${project.highlights.map(h => `<li>${richText(h)}</li>`).join('')}</ul>
  <div class="links">${linksHtml(project)}</div>`;

// Animate the cards from their old positions to their new ones when the layout changes.
function animateLayout(change) {
  const cards = $$('.card', list);
  const before = cards.map(card => card.getBoundingClientRect());
  change();
  cards.forEach((card, i) => {
    const after = card.getBoundingClientRect();
    card.animate(
      [{ transform: `translate(${before[i].left - after.left}px, ${before[i].top - after.top}px)` }, { transform: 'none' }],
      { duration: 520, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
    );
  });
}

function renderDetail(index) {
  $$('.card', list).forEach((card, i) => card.classList.toggle('active', i === index));
  detail.innerHTML = detailHtml(projects[index]);
  initSlider(detail);
  detail.style.animation = 'none';
  void detail.offsetWidth;
  detail.style.animation = '';
  detail.scrollTop = 0;
}

const setDrawer = open => view.classList.toggle('is-drawer', open);

function openProject(index) {
  const enterMenu = () => { view.classList.add('is-menu'); renderDetail(index); };
  if (view.classList.contains('is-menu')) renderDetail(index);
  else if (isMobile()) enterMenu();
  else animateLayout(enterMenu);
  setDrawer(false);
  $('#projects').scrollIntoView({ behavior: 'smooth' });
}

function closeDetail() {
  if (!view.classList.contains('is-menu')) return;
  setDrawer(false);
  const exitMenu = () => view.classList.remove('is-menu');
  if (isMobile()) exitMenu();
  else animateLayout(exitMenu);
  $('.card.active', list)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
  $$('.card', list).forEach(card => card.classList.remove('active'));
}

export function initProjects() {
  list.innerHTML = projects.map(cardHtml).join('');

  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  view.append(scrim);

  list.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (card) openProject(Number(card.dataset.index));
  });
  detail.addEventListener('click', e => {
    if (e.target.closest('.back-button')) closeDetail();
    if (e.target.closest('.menu-button')) setDrawer(true);
  });
  scrim.addEventListener('click', () => setDrawer(false));

  document.addEventListener('click', e => {
    const link = e.target.closest('.project-link');
    if (!link) return;
    e.preventDefault();
    const index = projects.findIndex(p => p.name === link.dataset.project);
    if (index >= 0) openProject(index);
  });

  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (view.classList.contains('is-drawer')) setDrawer(false);
    else closeDetail();
  });
}
