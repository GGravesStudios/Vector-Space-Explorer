import { useWorkspace } from '@/Workspace';
import { cartesianToSVG, warpedGridLines } from '@/lib/coordinates';
import { GRID_RANGE } from '@/lib/constants';

interface GridLinesProps {
  width: number;
  height: number;
}

export function GridLines({ width, height }: GridLinesProps) {
  const { state } = useWorkspace();
  const { v1, v2, scale, panOffset } = state;

  const lines = warpedGridLines(v1, v2, GRID_RANGE);
  const origin = cartesianToSVG({ x: 0, y: 0 }, width, height, scale, panOffset);

  return (
    <g>
      {lines.map(([start, end], i) => {
        const s = cartesianToSVG(start, width, height, scale, panOffset);
        const e = cartesianToSVG(end, width, height, scale, panOffset);

        // Thicker lines for i=0 (the basis-vector-aligned axis lines)
        const isAxisLine = (i % (2 * GRID_RANGE + 1)) === GRID_RANGE;
        return (
          <line
            key={i}
            x1={s.px} y1={s.py}
            x2={e.px} y2={e.py}
            stroke={isAxisLine ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}
            strokeWidth={isAxisLine ? 1.5 : 1}
          />
        );
      })}
      {/* Standard x/y axes */}
      <line
        x1={0} y1={origin.py}
        x2={width} y2={origin.py}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      <line
        x1={origin.px} y1={0}
        x2={origin.px} y2={height}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
    </g>
  );
}
