import yaml from 'js-yaml';

const rawFiles = import.meta.glob('/problems/*.md', { query: '?raw', import: 'default', eager: true });

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  return { data: yaml.load(match[1]), body: match[2].trim() };
};

export const loadProblems = () =>
  Object.entries(rawFiles)
    .map(([path, content]) => {
      const { data, body } = parseFrontmatter(content);
      return { ...data, body, _path: path };
    })
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
