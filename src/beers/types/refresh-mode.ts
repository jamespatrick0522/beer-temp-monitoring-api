export type RefreshMode = 'always' | 'throttle' | 'false';

export function normalizeRefreshMode(input?: string): RefreshMode {
  if (!input) return 'always';
  const v = input.toLowerCase();
  if (v === 'always' || v === 'throttle' || v === 'false') return v;
  if (v === 'true') return 'always';
  if (v === '0' || v === 'no') return 'false';
  return 'always';
}
