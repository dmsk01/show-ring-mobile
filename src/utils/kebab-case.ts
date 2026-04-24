/**
 * Convert a string to kebab-case.
 *
 * Handles camelCase / PascalCase, acronyms (`HTMLParser` → `html-parser`),
 * spaces, underscores and punctuation. Matches the subset of
 * es-toolkit `kebabCase` behavior we rely on for post-title URL slugs.
 */
export function kebabCase(input: string): string {
  return input
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
