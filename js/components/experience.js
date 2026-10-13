import { $, richText } from '../utils.js';
import { experience } from '../data/experience.js';

export function renderExperience() {
  $('#experience-list').innerHTML = experience.map(job => `
    <div class="job reveal">
      <div>
        <span class="company">${job.company}</span>
        <span class="job-period">${job.period}</span>
        <span class="job-type">${job.type}</span>
      </div>
      <div>
        <p class="job-role">${job.role}</p>
        <ul>${job.points.map(point => `<li>${richText(point)}</li>`).join('')}</ul>
      </div>
    </div>`).join('');
}
