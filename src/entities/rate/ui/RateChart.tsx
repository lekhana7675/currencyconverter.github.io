import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { formatDate, formatRate } from '@/shared/lib';
import type { RatePoint } from '../model/types';
import styles from './RateChart.module.css';

interface RateChartProps {
  points: readonly RatePoint[];
  quote: string;
}

const HEIGHT = 280;
const PAD = { top: 16, right: 16, bottom: 30, left: 60 };
const TIP = { width: 128, height: 46, gap: 12 };
const DAY_MS = 86_400_000;

export function RateChart({ points, quote }: RateChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  // Measure the container so SVG text stays at a readable pixel size on every screen.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    setWidth(Math.round(element.clientWidth));
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => setActive(null), [points]);

  const extremes = useMemo(() => {
    let high = 0;
    let low = 0;
    points.forEach((point, index) => {
      if (point.value > points[high].value) high = index;
      if (point.value < points[low].value) low = index;
    });
    return { high, low };
  }, [points]);

  const geometry = useMemo(() => {
    if (width === 0 || points.length === 0) return null;

    const innerW = Math.max(width - PAD.left - PAD.right, 1);
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const times = points.map((p) => Date.parse(p.date));
    const values = points.map((p) => p.value);

    let lo = Math.min(...values);
    let hi = Math.max(...values);
    const margin = hi === lo ? Math.abs(hi) * 0.01 || 1 : (hi - lo) * 0.12;
    lo -= margin;
    hi += margin;

    const t0 = times[0];
    const t1 = times[times.length - 1];
    const tSpan = t1 - t0 || 1;

    const xs = times.map((t) => PAD.left + ((t - t0) / tSpan) * innerW);
    const ys = values.map((v) => PAD.top + (1 - (v - lo) / (hi - lo)) * innerH);

    const baseY = PAD.top + innerH;
    const line = xs
      .map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`)
      .join(' ');
    const area = `${line} L${xs[xs.length - 1].toFixed(1)} ${baseY} L${xs[0].toFixed(1)} ${baseY} Z`;

    const yTicks = [0, 1, 2, 3].map((k) => ({
      value: lo + ((hi - lo) * k) / 3,
      y: PAD.top + (1 - k / 3) * innerH,
    }));
    const xTicks =
      points.length === 1 ? [0] : [0, Math.floor((points.length - 1) / 2), points.length - 1];

    return { xs, ys, line, area, yTicks, xTicks, baseY, longSpan: (t1 - t0) / DAY_MS > 180 };
  }, [points, width]);

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!geometry) return;
    const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
    let best = 0;
    let bestDistance = Infinity;
    geometry.xs.forEach((px, index) => {
      const distance = Math.abs(px - x);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    setActive(best);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const step = event.key === 'ArrowLeft' ? -1 : 1;
      setActive((current) => {
        const from = current ?? points.length - 1;
        return Math.min(points.length - 1, Math.max(0, from + step));
      });
    } else if (event.key === 'Escape') {
      setActive(null);
    }
  }

  const activePoint = active !== null ? points[active] : undefined;
  const tickFormat: Intl.DateTimeFormatOptions = geometry?.longSpan
    ? { month: 'short', year: 'numeric' }
    : { day: 'numeric', month: 'short' };

  return (
    <div
      ref={containerRef}
      className={styles.wrap}
      style={{ height: HEIGHT }}
      tabIndex={0}
      role="group"
      aria-label="Rate chart. Use the left and right arrow keys to read individual values."
      onKeyDown={handleKeyDown}
      onBlur={() => setActive(null)}
    >
      <p className={styles.srOnly} aria-live="polite">
        {activePoint ? `${formatDate(activePoint.date)}: ${formatRate(activePoint.value)} ${quote}` : ''}
      </p>

      {geometry && (
        <svg
          className={styles.svg}
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          aria-hidden="true"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActive(null)}
        >
          {geometry.yTicks.map((tick) => (
            <g key={tick.y}>
              <line className={styles.grid} x1={PAD.left} x2={width - PAD.right} y1={tick.y} y2={tick.y} />
              <text className={styles.tick} x={PAD.left - 8} y={tick.y + 4} textAnchor="end">
                {formatRate(tick.value)}
              </text>
            </g>
          ))}

          {geometry.xTicks.map((index, position) => (
            <text
              key={index}
              className={styles.tick}
              x={geometry.xs[index]}
              y={HEIGHT - 8}
              textAnchor={
                geometry.xTicks.length === 1 || position === 0
                  ? 'start'
                  : position === geometry.xTicks.length - 1
                    ? 'end'
                    : 'middle'
              }
            >
              {formatDate(points[index].date, tickFormat)}
            </text>
          ))}

          <path className={styles.area} d={geometry.area} />
          <path className={styles.line} d={geometry.line} />

          {points.length > 1 &&
            [extremes.high, extremes.low].map((index) => (
              <circle
                key={index}
                className={styles.extreme}
                cx={geometry.xs[index]}
                cy={geometry.ys[index]}
                r={4.5}
              />
            ))}

          {activePoint && active !== null && (
            <g>
              <line
                className={styles.cursor}
                x1={geometry.xs[active]}
                x2={geometry.xs[active]}
                y1={PAD.top}
                y2={geometry.baseY}
              />
              <circle className={styles.dot} cx={geometry.xs[active]} cy={geometry.ys[active]} r={5} />
              <g
                transform={`translate(${
                  geometry.xs[active] + TIP.gap + TIP.width > width - 4
                    ? geometry.xs[active] - TIP.gap - TIP.width
                    : geometry.xs[active] + TIP.gap
                } ${PAD.top + 4})`}
              >
                <rect className={styles.tipBox} width={TIP.width} height={TIP.height} rx={6} />
                <text className={styles.tipDate} x={10} y={19}>
                  {formatDate(activePoint.date)}
                </text>
                <text className={styles.tipValue} x={10} y={37}>
                  {formatRate(activePoint.value)} {quote}
                </text>
              </g>
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
