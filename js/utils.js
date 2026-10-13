export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const isMobile = () => matchMedia('(max-width: 820px)').matches;
export const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const tagsHtml = items => items.map(item => `<span class="tag">${item}</span>`).join('');

// {key|label} -> glossary term, [[Project name]] -> link that opens the project
export function richText(text) {
  return text
    .replace(/\{(\w+)\|([^}]+)\}/g, (_, key, label) => `<span class="term" tabindex="0" data-term="${key}">${label}</span>`)
    .replace(/\[\[([^\]]+)\]\]/g, (_, name) => `<a href="#projects" class="project-link" data-project="${name}">${name}</a>`);
}
