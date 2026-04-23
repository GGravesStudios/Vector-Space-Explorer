import { useRef } from 'react';
import type { Vec2, VectorName } from '@/types';
import { useDrag } from '@/hooks/useDrag';

interface VectorArrowProps {
  name: VectorName;
  from: { px: number; py: number };
  to: { px: number; py: number };
  color: string;
  label: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  width: number;
  height: number;
}

const ARROW_SIZE = 10;

function arrowHead(
  x1: number, y1: number,
  x2: number, y2: number,
): string {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.8;
  const a2 = angle - Math.PI * 0.8;
  return [
    `${x2},${y2}`,
    `${x2 + ARROW_SIZE * Math.cos(a1)},${y2 + ARROW_SIZE * Math.sin(a1)}`,
    `${x2 + ARROW_SIZE * Math.cos(a2)},${y2 + ARROW_SIZE * Math.sin(a2)}`,
  ].join(' ');
}

export function VectorArrow({ name, from, to, color, label, svgRef, width, height }: VectorArrowProps) {
  const groupRef = useRef<SVGGElement>(null);
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag({
    svgRef,
    name,
    width,
    height,
  });

  const dx = to.px - from.px;
  const dy = to.py - from.py;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Shorten tip to not overlap arrowhead
  const tipX = len > ARROW_SIZE ? to.px - (dx / len) * ARROW_SIZE * 0.4 : to.px;
  const tipY = len > ARROW_SIZE ? to.py - (dy / len) * ARROW_SIZE * 0.4 : to.py;

  const labelOffset = 14;
  const labelX = to.px + (dx === 0 ? labelOffset : Math.sign(dx) * labelOffset);
  const labelY = to.py + (dy === 0 ? -labelOffset : Math.sign(dy) * -labelOffset);

  return (
    <g
      ref={groupRef}
      style={{ cursor: 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* invisible wider hit area */}
      <line
        x1={from.px} y1={from.py}
        x2={to.px} y2={to.py}
        stroke="transparent"
        strokeWidth={16}
      />
      <line
        x1={from.px} y1={from.py}
        x2={tipX} y2={tipY}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <polygon
        points={arrowHead(from.px, from.py, to.px, to.py)}
        fill={color}
      />
      <text
        x={labelX}
        y={labelY}
        fill={color}
        fontSize={13}
        fontFamily="ui-monospace, monospace"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {label}
      </text>
    </g>
  );
}
