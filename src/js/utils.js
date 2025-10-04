// src/js/utils.js

export function esc (s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export function resolveAssetPath (path = '') {
  const p = String(path).trim();
  if (!p || p === 'false') return '';

  if (p.startsWith('/')) {
    return p;
  }
  return `/${p}`;
}
