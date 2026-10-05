import { useState } from 'react';
import type { Share } from './data';
import { fmt, swatch } from '../../lib';

const R = 70;
const C = 2 * Math.PI * R;
const color = (i: number) => `var(--chart-${i + 1})`;

export function DonutChart({ data }: { data: Share[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const starts = data.map((_, i) => data.slice(0, i).reduce((s, d) => s + d.value, 0));
  const pct = (v: number) => fmt((v / total) * 100);
  const hover = (i: number) => ({
    onPointerEnter: () => setActive(i),
    onPointerLeave: () => setActive(null),
    onFocus: () => setActive(i),
    onBlur: () => setActive(null),
  });

  return (
    <>
      <div className={`donut ${active === null ? '' : 'has-active'}`}>
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Doanh thu theo nhóm: ${data.map((d) => `${d.name} ${pct(d.value)}%`).join(', ')}`}
        >
          <g transform="rotate(-90 100 100)">
            {data.map((d, i) => {
              const len = (d.value / total) * C;
              return (
                <circle
                  key={d.name}
                  className={`seg ${active === i ? 'active' : ''}`}
                  style={swatch(color(i))}
                  cx={100}
                  cy={100}
                  r={R}
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={(-starts[i] / total) * C}
                  {...hover(i)}
                />
              );
            })}
          </g>
        </svg>
        {active !== null && (
          <div className="donut-center" aria-hidden="true">
            <strong>{pct(data[active].value)}%</strong>
            <span>{data[active].name}</span>
          </div>
        )}
      </div>

      <ul className="legend">
        {data.map((d, i) => (
          <li key={d.name} className={`legend-item ${active === i ? 'on' : ''}`} tabIndex={0} {...hover(i)}>
            <span className="swatch" style={swatch(color(i))} />
            {d.name}
          </li>
        ))}
      </ul>
    </>
  );
}
