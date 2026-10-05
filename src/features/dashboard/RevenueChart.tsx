import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { MonthStat } from './data';
import { clamp, money, swatch } from '../../lib';
import { Money } from '../../components/ui';

type Series = 'revenue' | 'orders';
type Point = [x: number, y: number];

const SERIES: [Series, string, string][] = [
  ['revenue', 'Doanh thu', 'var(--chart-bar)'],
  ['orders', 'Đơn hàng', 'var(--chart-line)'],
];
const H = 240;
const P = { t: 16, r: 8, b: 32, l: 52 };
const TICKS = 4;

const niceMax = (v: number) => {
  const raw = v / TICKS;
  const half = 10 ** Math.floor(Math.log10(raw)) / 2;
  return Math.ceil(raw / half) * half * TICKS;
};

// Catmull-Rom spline as cubic Béziers
const smoothPath = (pts: Point[]) =>
  pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [x0, y0] = pts[i - 2] ?? pts[i - 1];
    const [x1, y1] = pts[i - 1];
    const [x3, y3] = pts[i + 1] ?? [x, y];
    return `${d} C${x1 + (x - x0) / 6},${y1 + (y - y0) / 6} ${x - (x3 - x1) / 6},${y - (y3 - y1) / 6} ${x},${y}`;
  }, '');

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function RevenueChart({ data }: { data: MonthStat[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hidden, setHidden] = useState<Series[]>([]);
  const [active, setActive] = useState<number | null>(null);

  const ph = H - P.t - P.b;
  const base = P.t + ph;
  const step = Math.max(width - P.l - P.r, 0) / data.length;
  const barW = Math.min(32, step * 0.42);
  const yMax = niceMax(Math.max(...data.map((d) => d.revenue)));
  // ponytail: orders ride a hidden axis with 35% headroom so the line sits under the tallest bar
  const oMax = Math.max(...data.map((d) => d.orders)) * 1.35;
  const x = (i: number) => P.l + step * (i + 0.5);
  const y = (v: number, max = yMax) => P.t + ph * (1 - v / max);
  const revPts = data.map((d, i): Point => [x(i), y(d.revenue)]);
  const ordPts = data.map((d, i): Point => [x(i), y(d.orders, oMax)]);
  const cur = active === null ? null : data[active];

  const toggle = (s: Series) => setHidden((h) => (h.includes(s) ? h.filter((v) => v !== s) : [...h, s]));

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const i = Math.floor((e.clientX - e.currentTarget.getBoundingClientRect().left - P.l) / step);
    setActive(i >= 0 && i < data.length ? i : null);
  };

  const onKey = (e: KeyboardEvent) => {
    const dir = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!dir) return;
    e.preventDefault();
    setActive((a) => clamp((a ?? (dir > 0 ? -1 : data.length)) + dir, 0, data.length - 1));
  };

  const summary = data.map((d) => `Tháng ${d.month}: ${money(d.revenue)} đồng, ${d.orders} đơn`).join('; ');

  return (
    <>
      <div ref={ref} className={`chart ${hidden.map((s) => `hide-${s}`).join(' ')} ${cur ? 'is-hover' : ''}`}>
        {width > 0 && (
          <svg
            width={width}
            height={H}
            role="img"
            tabIndex={0}
            aria-label={`Doanh thu và đơn hàng theo tháng. ${summary}`}
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKey}
            onBlur={() => setActive(null)}
          >
            <defs>
              <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--chart-area)" stopOpacity={0.9} />
                <stop offset="1" stopColor="var(--chart-area)" stopOpacity={0} />
              </linearGradient>
            </defs>

            {Array.from({ length: TICKS + 1 }, (_, k) => {
              const v = (yMax / TICKS) * k;
              return (
                <g key={k}>
                  <line className="grid" x1={P.l} x2={width - P.r} y1={y(v)} y2={y(v)} />
                  <text className="axis" x={P.l - 12} y={y(v)} dy="0.32em" textAnchor="end">{Math.round(v)}tr</text>
                </g>
              );
            })}

            {active !== null && <rect className="hover-col" x={P.l + step * active} y={P.t} width={step} height={ph} rx={8} />}

            <path
              className="area s-revenue"
              fill="url(#area-fill)"
              d={`${smoothPath(revPts)} L${x(data.length - 1)},${base} L${x(0)},${base} Z`}
            />
            {data.map((d, i) => (
              <rect
                key={d.month}
                className={`bar s-revenue ${active === i ? 'on' : ''}`}
                x={x(i) - barW / 2}
                y={y(d.revenue)}
                width={barW}
                height={base - y(d.revenue)}
                rx={3}
              />
            ))}
            <polyline className="line s-orders" points={ordPts.join(' ')} />
            {active !== null && <circle className="dot s-orders" cx={ordPts[active][0]} cy={ordPts[active][1]} r={4.5} />}

            {data.map((d, i) => (
              <text key={d.month} className={`axis ${active === i ? 'on' : ''}`} x={x(i)} y={H - 8} textAnchor="middle">
                T{d.month}
              </text>
            ))}
          </svg>
        )}

        {cur && active !== null && (
          <div
            className="tooltip"
            style={{ left: clamp(x(active), 90, width - 90), top: Math.min(y(cur.revenue), y(cur.orders, oMax)) - 12 }}
          >
            <strong>Tháng {cur.month}</strong>
            <span><i className="swatch" style={swatch('var(--chart-bar)')} />Doanh thu <b><Money tr={cur.revenue} /></b></span>
            <span><i className="swatch" style={swatch('var(--chart-line)')} />Đơn hàng <b>{cur.orders}</b></span>
          </div>
        )}
      </div>

      <div className="legend">
        {SERIES.map(([key, label, color]) => (
          <button key={key} className="legend-item" aria-pressed={!hidden.includes(key)} onClick={() => toggle(key)}>
            <span className="swatch" style={swatch(color)} />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
