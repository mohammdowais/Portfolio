import { projects } from '../data/projects.js';
import { $, $$, richText, tagsHtml } from '../utils.js';
import { sliderHtml, initSlider } from './slider.js';

const view = $('#projects-view');
const list = $('#project-list');
const detail = $('#project-detail');
const pipsContainer = $('#deck-pips');

let activeDeckIndex = 1;
let activeDetailIndex = 1;

const cardHtml = (project, index) => `
  <button class="card" data-index="${index}" data-offset="${index}" tabindex="${index === 0 ? '0' : '-1'}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="${project.name} - Project ${index + 1} of ${projects.length}">
    <div class="card-top">
      <span class="card-badge">${String(index + 1).padStart(2, '0')}</span>
      <span class="meta">${project.period}${project.closedSource ? ' · Closed source' : ''}</span>
    </div>
    <h3>${project.name}</h3>
    <p class="summary">${richText(project.summary)}</p>
    <div class="tags">${tagsHtml(project.stack.slice(0, 3))}</div>
    <div class="card-footer">
      <span class="view-prompt">View details &rarr;</span>
    </div>
  </button>`;

function linksHtml(project) {
  if (project.links?.length) {
    return project.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label} &nearr;</a>`).join('');
  }
  return project.closedSource ? '<span>Private repository</span>' : '';
}

const detailHtml = (project, index) => {
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject = index < projects.length - 1 ? projects[index + 1] : null;

  return `
    <div class="detail-toolbar">
      <button class="back-button" aria-label="Return to projects deck">&larr; All projects</button>
      <div class="detail-nav-group" role="group" aria-label="Project switcher">
        <button class="detail-nav-btn prev" id="detail-prev-btn" aria-label="Previous project${prevProject ? ': ' + prevProject.name : ''}" ${!prevProject ? 'disabled' : ''}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          <span>Prev</span>
        </button>
        <span class="detail-count" id="detail-count" aria-live="polite" aria-atomic="true">
          ${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}
        </span>
        <button class="detail-nav-btn next" id="detail-next-btn" aria-label="Next project${nextProject ? ': ' + nextProject.name : ''}" ${!nextProject ? 'disabled' : ''}>
          <span>Next</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <button class="menu-button">Other projects</button>
    </div>
    <h3>${project.name}</h3>
    <p class="meta">${project.period}${project.closedSource ? ' · Closed source' : ''}</p>
    ${sliderHtml(project)}
    <p class="summary">${richText(project.summary)}</p>
    <h4>STACK</h4>
    <div class="tags">${tagsHtml(project.stack)}</div>
    <h4>HIGHLIGHTS</h4>
    <ul>${project.highlights.map(h => `<li>${richText(h)}</li>`).join('')}</ul>
    <div class="links">${linksHtml(project)}</div>
    <div class="detail-footer-nav">
      ${prevProject ? `<button class="button detail-footer-btn" data-go="${index - 1}">&larr; ${prevProject.name}</button>` : '<span></span>'}
      ${nextProject ? `<button class="button detail-footer-btn" data-go="${index + 1}">${nextProject.name} &rarr;</button>` : '<span></span>'}
    </div>`;
};

export function updateDeck(newIndex, focusActive = false) {
  activeDeckIndex = Math.max(0, Math.min(newIndex, projects.length - 1));
  const cards = $$('.card', list);
  const pips = $$('.deck-pip', pipsContainer);

  cards.forEach((card, i) => {
    const offset = i - activeDeckIndex;
    card.dataset.offset = offset;
    const isCenter = offset === 0;
    const isVisibleRear = Math.abs(offset) === 1;
    const isHidden = Math.abs(offset) > 1;

    card.dataset.hidden = isHidden ? 'true' : 'false';
    card.setAttribute('aria-current', isCenter ? 'true' : 'false');
    card.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
    card.setAttribute('tabindex', isCenter ? '0' : (isVisibleRear ? '0' : '-1'));
    card.classList.toggle('active', isCenter);
  });

  pips.forEach((pip, i) => {
    const isCurr = i === activeDeckIndex;
    pip.classList.toggle('active', isCurr);
    pip.setAttribute('aria-selected', isCurr ? 'true' : 'false');
  });

  const prevBtn = $('#deck-prev');
  const nextBtn = $('#deck-next');
  if (prevBtn) prevBtn.disabled = activeDeckIndex === 0;
  if (nextBtn) nextBtn.disabled = activeDeckIndex === projects.length - 1;

  const counter = $('#deck-counter');
  if (counter) {
    counter.textContent = `${String(activeDeckIndex + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    counter.setAttribute('aria-label', `Project ${activeDeckIndex + 1} of ${projects.length}: ${projects[activeDeckIndex].name}`);
  }

  if (focusActive && cards[activeDeckIndex]) {
    cards[activeDeckIndex].focus();
  }
}

function renderDetail(index) {
  activeDetailIndex = index;
  updateDeck(index);
  detail.innerHTML = detailHtml(projects[index], index);
  initSlider(detail);
  if (detail.scrollTop > 0) {
    detail.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const setDrawer = open => view.classList.toggle('is-drawer', open);

export function openProject(index) {
  activeDetailIndex = index;
  renderDetail(index);
  view.classList.add('is-menu');
  setDrawer(false);

  // Smoothly align section head below topbar
  const section = $('#projects');
  if (section) {
    const topbarHeight = $('#topbar')?.offsetHeight || 60;
    const targetY = section.getBoundingClientRect().top + window.scrollY - (topbarHeight + 12);
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }
}

export function switchDetailProject(index) {
  if (index < 0 || index >= projects.length) return;
  detail.animate([
    { opacity: 0.35, transform: 'translateY(6px)' },
    { opacity: 1, transform: 'none' }
  ], { duration: 250, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  renderDetail(index);
}

export function closeDetail() {
  if (!view.classList.contains('is-menu')) return;
  setDrawer(false);
  detail.animate([
    { opacity: 1, transform: 'none' },
    { opacity: 0, transform: 'translateY(8px)' }
  ], { duration: 180, easing: 'ease' }).onfinish = () => {
    view.classList.remove('is-menu');
    updateDeck(activeDetailIndex, true);
    const section = $('#projects');
    if (section) {
      const topbarHeight = $('#topbar')?.offsetHeight || 60;
      const targetY = section.getBoundingClientRect().top + window.scrollY - (topbarHeight + 12);
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }
  };
}

function initDeckSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;
  let isDragging = false;

  list.addEventListener('touchstart', e => {
    if (view.classList.contains('is-menu')) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  list.addEventListener('touchend', e => {
    if (!isDragging || view.classList.contains('is-menu')) return;
    isDragging = false;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) updateDeck(activeDeckIndex + 1);
      else updateDeck(activeDeckIndex - 1);
    }
  }, { passive: true });

  let mouseStartX = 0;
  let mouseDown = false;
  list.addEventListener('mousedown', e => {
    if (view.classList.contains('is-menu')) return;
    mouseStartX = e.clientX;
    mouseDown = true;
  });
  window.addEventListener('mouseup', e => {
    if (!mouseDown || view.classList.contains('is-menu')) return;
    mouseDown = false;
    const deltaX = e.clientX - mouseStartX;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) updateDeck(activeDeckIndex + 1);
      else updateDeck(activeDeckIndex - 1);
    }
  });
}

function initDetailSwipe() {
  let touchStartX = null;
  let touchStartY = null;

  detail.addEventListener('touchstart', e => {
    // CRITICAL: Do NOT interfere with screenshot slider carousel!
    if (e.target.closest('.slider') || e.target.closest('.track')) {
      touchStartX = null;
      return;
    }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  detail.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    if (e.target.closest('.slider') || e.target.closest('.track')) {
      touchStartX = null;
      return;
    }
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    touchStartX = null;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && activeDetailIndex < projects.length - 1) {
        switchDetailProject(activeDetailIndex + 1);
      } else if (deltaX > 0 && activeDetailIndex > 0) {
        switchDetailProject(activeDetailIndex - 1);
      }
    }
  }, { passive: true });
}

export function initProjects() {
  list.innerHTML = projects.map(cardHtml).join('');

  if (pipsContainer) {
    pipsContainer.innerHTML = projects.map((p, i) => `
      <button class="deck-pip ${i === activeDeckIndex ? 'active' : ''}" data-index="${i}" role="tab" aria-selected="${i === activeDeckIndex ? 'true' : 'false'}" aria-label="Go to project ${i + 1}: ${p.name}"></button>
    `).join('');
  }

  updateDeck(activeDeckIndex);
  initDeckSwipe();
  initDetailSwipe();

  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  view.append(scrim);

  // Deck click interactions
  list.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const index = Number(card.dataset.index);

    if (view.classList.contains('is-drawer') || e.target.closest('.view-prompt') || e.target.closest('.card-footer')) {
      openProject(index);
      setDrawer(false);
      return;
    }

    if (index === activeDeckIndex) {
      openProject(index);
    } else {
      updateDeck(index, true);
    }
  });

  // Deck controls
  $('#deck-prev')?.addEventListener('click', () => updateDeck(activeDeckIndex - 1, true));
  $('#deck-next')?.addEventListener('click', () => updateDeck(activeDeckIndex + 1, true));
  pipsContainer?.addEventListener('click', e => {
    const pip = e.target.closest('.deck-pip');
    if (pip) updateDeck(Number(pip.dataset.index), true);
  });

  // Detail buttons
  detail.addEventListener('click', e => {
    if (e.target.closest('.back-button')) {
      closeDetail();
      return;
    }
    if (e.target.closest('.menu-button')) {
      setDrawer(true);
      return;
    }
    if (e.target.closest('#detail-prev-btn')) {
      switchDetailProject(activeDetailIndex - 1);
      return;
    }
    if (e.target.closest('#detail-next-btn')) {
      switchDetailProject(activeDetailIndex + 1);
      return;
    }
    const footerBtn = e.target.closest('.detail-footer-btn');
    if (footerBtn) {
      switchDetailProject(Number(footerBtn.dataset.go));
      return;
    }
  });

  scrim.addEventListener('click', () => setDrawer(false));

  // Project links inside text / other sections
  document.addEventListener('click', e => {
    const link = e.target.closest('.project-link');
    if (!link) return;
    e.preventDefault();
    const index = projects.findIndex(p => p.name === link.dataset.project);
    if (index >= 0) openProject(index);
  });

  // Keyboard navigation
  addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;

    if (view.classList.contains('is-menu')) {
      if (e.key === 'ArrowLeft') {
        if (activeDetailIndex > 0) {
          e.preventDefault();
          switchDetailProject(activeDetailIndex - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (activeDetailIndex < projects.length - 1) {
          e.preventDefault();
          switchDetailProject(activeDetailIndex + 1);
        }
      } else if (e.key === 'Escape') {
        if (view.classList.contains('is-drawer')) setDrawer(false);
        else closeDetail();
      }
    } else {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateDeck(activeDeckIndex - 1, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateDeck(activeDeckIndex + 1, true);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement?.classList.contains('card')) {
          e.preventDefault();
          openProject(activeDeckIndex);
        }
      }
    }
  });
}
