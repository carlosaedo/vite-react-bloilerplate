function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toSpacedTitleCase(str) {
  if (!str) return '';
  return str
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map((word) => capitalizeFirst(word.toLowerCase()))
    .join(' ');
}

function toCamelCase(str) {
  if (!str) return '';
  const words = str.split(/[_-\s]+/);
  return words
    .map((word, i) => (i === 0 ? word.toLowerCase() : capitalizeFirst(word.toLowerCase())))
    .join('');
}

function toPascalCase(str) {
  if (!str) return '';
  return str
    .split(/[_-\s]+/)
    .map((word) => capitalizeFirst(word.toLowerCase()))
    .join('');
}

function toKebabCase(str) {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // handle PascalCase to kebab
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[_]+/g, '-') // underscores to hyphens
    .toLowerCase();
}

function toSnakeCase(str) {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // handle PascalCase to snake
    .replace(/\s+/g, '_') // spaces to underscores
    .replace(/[-]+/g, '_') // hyphens to underscores
    .toLowerCase();
}

export { capitalizeFirst, toSpacedTitleCase, toCamelCase, toPascalCase, toKebabCase, toSnakeCase };
