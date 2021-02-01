/* eslint no-param-reassign: 0 */

export default function parsePath(path?: string): string {
  if (!path || path.length === 0) return '/';

  if (!path.startsWith('/')) path = `/${path}`;
  if (path.endsWith('/')) path = path.slice(0, path.length - 1);

  return path;
}
