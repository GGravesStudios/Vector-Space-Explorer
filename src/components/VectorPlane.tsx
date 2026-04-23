import { useRef } from 'react';
import { useWorkspace } from '@/Workspace';
import { cartesianToSVG } from '@/lib/coordinates';
import { spanParallelogram } from '@/lib/math';
import { VECTOR_COLORS, GRID_RANGE } from '@/lib/constants';
import { useZoomPan } from '@/hooks/useZoomPan';
import { GridLines } from './GridLines';
import { VectorArrow } from './VectorArrow';

const WIDTH = 600;
const HEIGHT = 600;

function fmt(n: number): string {
  return isNaN(n) ? '?' : n.toFixed(2);
}

interface ScalarLabelProps {
  x: number;
  y: number;
  color: string;
  text: string;
}

function ScalarLabel({ x, y, color, text }: ScalarLabelProps) {
  return (
    <text
      x={x} y={y}
      fill={color}
      fontSize={11}
      fontFamily="ui-monospace, monospace"
      textAnchor="middle"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {text}
    </text>
  );
}

export function VectorPlane() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useWorkspace();
  const { v1, v2, v3, target, mode, scale, panOffset, solverResult } = state;

  const { onWheel, onPointerDown, onPointerMove, onPointerUp } = useZoomPan(WIDTH, HEIGHT);

  const toSVG = (v: { x: number; y: number }) =>
    cartesianToSVG(v, WIDTH, HEIGHT, scale, panOffset);

  const origin = cartesianToSVG({ x: 0, y: 0 }, WIDTH, HEIGHT, scale, panOffset);

  const spanPts = spanParallelogram(v1, v2, GRID_RANGE);
  const spanPoints = spanPts.map(toSVG).map(({ px, py }) => `${px},${py}`).join(' ');

  const health = solverResult?.health ?? 'healthy';
  const spanFillColor =
    health === 'collapsed'
      ? 'rgba(239,68,68,0.07)'
      : health === 'ill-conditioned'
        ? 'rgba(234,179,8,0.07)'
        : 'rgba(96,165,250,0.07)';

  return (
    <svg
      ref={svgRef}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ display: 'block', background: '#0f0f13', touchAction: 'none' }}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Span region fill */}
      <polygon points={spanPoints} fill={spanFillColor} stroke="none" />

      <GridLines width={WIDTH} height={HEIGHT} />

      {/* v1 */}
      <VectorArrow
        name="v1"
        from={origin}
        to={toSVG(v1)}
        color={VECTOR_COLORS.v1}
        label="v₁"
        svgRef={svgRef}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* v2 */}
      <VectorArrow
        name="v2"
        from={origin}
        to={toSVG(v2)}
        color={VECTOR_COLORS.v2}
        label="v₂"
        svgRef={svgRef}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* v3 — overcomplete mode only */}
      {mode === 'overcomplete' && (
        <VectorArrow
          name="v3"
          from={origin}
          to={toSVG(v3)}
          color={VECTOR_COLORS.v3}
          label="v₃"
          svgRef={svgRef}
          width={WIDTH}
          height={HEIGHT}
        />
      )}

      {/* target — basis + overcomplete */}
      {(mode === 'basis' || mode === 'overcomplete') && (
        <VectorArrow
          name="target"
          from={origin}
          to={toSVG(target)}
          color={VECTOR_COLORS.target}
          label="b"
          svgRef={svgRef}
          width={WIDTH}
          height={HEIGHT}
        />
      )}

      {/* Scalar labels */}
      {mode === 'basis' && solverResult?.reachable && (
        <>
          <ScalarLabel
            x={toSVG({ x: v1.x / 2, y: v1.y / 2 }).px}
            y={toSVG({ x: v1.x / 2, y: v1.y / 2 }).py - 10}
            color={VECTOR_COLORS.v1}
            text={`c₁=${fmt(solverResult.c1)}`}
          />
          <ScalarLabel
            x={toSVG({ x: v2.x / 2, y: v2.y / 2 }).px}
            y={toSVG({ x: v2.x / 2, y: v2.y / 2 }).py - 10}
            color={VECTOR_COLORS.v2}
            text={`c₂=${fmt(solverResult.c2)}`}
          />
        </>
      )}

      {/* Origin dot */}
      <circle cx={origin.px} cy={origin.py} r={3} fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
