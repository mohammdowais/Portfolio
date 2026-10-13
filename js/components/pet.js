import { $ } from '../utils.js';

const HIDDEN = 60;   // px past the screen edge
const VISIBLE = -12; // px inside the screen edge
const EDGE_ANGLES = [0, 90, -90, 180]; // bottom, left, right, top

export function initPet() {
  const pet = $('#pet');
  const head = $('#pet-head');
  const pupils = $('#pet-pupils');
  const cursor = { x: innerWidth / 2, y: innerHeight / 2 };
  let angle = 0, popTimer, hideTimer;

  const place = offset => {
    pet.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(${offset}px)`;
  };

  // Convert the cursor direction into the pet's rotated coordinate system.
  function lookAtCursor() {
    const box = pet.getBoundingClientRect();
    const dx = cursor.x - (box.left + box.width / 2);
    const dy = cursor.y - (box.top + box.height / 2);
    const rad = (angle * Math.PI) / 180;
    const x = dx * Math.cos(rad) + dy * Math.sin(rad);
    const y = -dx * Math.sin(rad) + dy * Math.cos(rad);
    const distance = Math.hypot(x, y) || 1;
    const strength = Math.min(distance / 60, 1);
    pupils.style.transform = `translate(${(x / distance) * 5 * strength}px, ${(y / distance) * 5 * strength}px)`;
    head.style.transform = `translate(${(x / distance) * 3 * strength}px, ${(y / distance) * 3 * strength}px)`;
  }

  function pop() {
    const edge = Math.floor(Math.random() * 4);
    const along = Math.random();
    angle = EDGE_ANGLES[edge];
    const x = edge === 1 ? 0 : edge === 2 ? innerWidth : 60 + along * (innerWidth - 120);
    const y = edge === 0 ? innerHeight : edge === 3 ? 0 : 60 + along * (innerHeight - 120);

    pet.style.transition = 'none';
    pet.style.left = `${x}px`;
    pet.style.top = `${y}px`;
    place(HIDDEN);
    void pet.offsetWidth;
    pet.style.transition = '';
    place(VISIBLE);
    setTimeout(lookAtCursor, 50);
    hideTimer = setTimeout(hide, 4500 + Math.random() * 2500);
  }

  function hide() {
    clearTimeout(hideTimer);
    clearTimeout(popTimer);
    place(HIDDEN);
    popTimer = setTimeout(pop, 9000 + Math.random() * 14000);
  }

  addEventListener('pointermove', e => { cursor.x = e.clientX; cursor.y = e.clientY; lookAtCursor(); }, { passive: true });
  pet.addEventListener('click', hide);
  popTimer = setTimeout(pop, 4000);
}
