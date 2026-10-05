/** Lower-case and strip Vietnamese diacritics so "ha" finds "Hà". */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase();

/** Excel-friendly CSV (BOM keeps Vietnamese readable). */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const body = [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

/** 'YYYY-MM-DD' → 'DD/MM/YYYY' without going through Date (no timezone drift). */
export const fmtDate = (iso: string) => iso.split('-').reverse().join('/');

const dateTime = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const fmtDateTime = (iso: string) => dateTime.format(new Date(iso));

export const text = (f: FormData, key: string) => String(f.get(key) ?? '').trim();
export const num = (f: FormData, key: string) => Number(f.get(key));

/** Today (or today + n days) as 'YYYY-MM-DD' in local time. */
export const today = () => new Date().toLocaleDateString('sv-SE');
export const inDays = (n: number) => new Date(Date.now() + n * 864e5).toLocaleDateString('sv-SE');

export const unique = <T,>(list: T[], pick: (item: T) => string) => [...new Set(list.map(pick))].sort();
