import { $ } from '../utils.js';
import { skills } from '../data/skills.js';

export function renderSkills() {
  $('#skill-grid').innerHTML = Object.entries(skills).map(([group, items]) => `
    <div class="skill-group reveal">
      <p>${group}</p>
      <div>${items.map(item => `<span>${item}</span>`).join('')}</div>
    </div>`).join('');
}
