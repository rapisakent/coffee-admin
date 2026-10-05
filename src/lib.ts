import type { CSSProperties } from 'react';

export type Tone = 'warn' | 'info' | 'danger' | 'success';

const num = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });

export const fmt = (n: number) => num.format(n);
// input is in triệu đồng: ≥1000 → T (tỷ), <1 → N (nghìn)
export const money = (tr: number) =>
  tr >= 1000 ? `${fmt(tr / 1000)} T` : tr < 1 ? `${fmt(tr * 1000)} N` : `${fmt(tr)} Tr`;
export const growth = (cur: number, prev: number) => ((cur - prev) / prev) * 100;
export const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
export const swatch = (color: string) => ({ '--c': color }) as CSSProperties;

/** Next sequential code such as KH-0009 from the existing ones. */
export function nextCode(prefix: string, codes: string[], width = 4) {
  const max = codes.reduce((m, c) => Math.max(m, Number(c.slice(prefix.length + 1)) || 0), 0);
  return `${prefix}-${String(max + 1).padStart(width, '0')}`;
}
