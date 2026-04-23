import type { Vec2, DeterminantHealth, SolverResult } from '@/types';
import { DET_COLLAPSE, DET_INSTABILITY, SNAP_THRESHOLD } from './constants';

export function det2(v1: Vec2, v2: Vec2): number {
  return v1.x * v2.y - v1.y * v2.x;
}

export function classifyHealth(det: number): DeterminantHealth {
  const abs = Math.abs(det);
  if (abs < DET_COLLAPSE) return 'collapsed';
  if (abs < DET_INSTABILITY) return 'ill-conditioned';
  return 'healthy';
}

export function solveCramers(v1: Vec2, v2: Vec2, target: Vec2): SolverResult {
  const d = det2(v1, v2);
  const health = classifyHealth(d);

  if (health === 'collapsed') {
    return { c1: NaN, c2: NaN, determinant: d, health, reachable: false };
  }

  const c1 = det2(target, v2) / d;
  const c2 = det2(v1, target) / d;
  return { c1, c2, determinant: d, health, reachable: true };
}

export function solveOvercomplete(
  v1: Vec2,
  v2: Vec2,
  v3: Vec2,
  target: Vec2,
  c3: number,
): SolverResult {
  const adjustedTarget: Vec2 = {
    x: target.x - c3 * v3.x,
    y: target.y - c3 * v3.y,
  };
  const base = solveCramers(v1, v2, adjustedTarget);
  return { ...base, c3 };
}

export function snapToInteger(v: Vec2, threshold = SNAP_THRESHOLD): Vec2 {
  const snapAxis = (n: number): number => {
    const rounded = Math.round(n);
    return Math.abs(n - rounded) < threshold ? rounded : n;
  };
  return { x: snapAxis(v.x), y: snapAxis(v.y) };
}

export function spanParallelogram(v1: Vec2, v2: Vec2, range: number): Vec2[] {
  return [
    { x: 0, y: 0 },
    { x: v1.x * range, y: v1.y * range },
    { x: v1.x * range + v2.x * range, y: v1.y * range + v2.y * range },
    { x: v2.x * range, y: v2.y * range },
  ];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
