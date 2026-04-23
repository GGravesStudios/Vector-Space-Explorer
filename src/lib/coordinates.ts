import type { Vec2 } from '@/types';
import { GRID_RANGE } from './constants';

export function cartesianToSVG(
  v: Vec2,
  width: number,
  height: number,
  scale: number,
  panOffset: Vec2 = { x: 0, y: 0 },
): { px: number; py: number } {
  return {
    px: width / 2 + v.x * scale + panOffset.x,
    py: height / 2 - v.y * scale + panOffset.y,
  };
}

export function svgToCartesian(
  px: number,
  py: number,
  width: number,
  height: number,
  scale: number,
  panOffset: Vec2 = { x: 0, y: 0 },
): Vec2 {
  return {
    x: (px - panOffset.x - width / 2) / scale,
    y: (height / 2 - py + panOffset.y) / scale,
  };
}

export function warpedGridLines(
  v1: Vec2,
  v2: Vec2,
  range = GRID_RANGE,
): Array<[Vec2, Vec2]> {
  const lines: Array<[Vec2, Vec2]> = [];
  for (let i = -range; i <= range; i++) {
    // Lines parallel to v1
    lines.push([
      { x: i * v2.x - range * v1.x, y: i * v2.y - range * v1.y },
      { x: i * v2.x + range * v1.x, y: i * v2.y + range * v1.y },
    ]);
    // Lines parallel to v2
    lines.push([
      { x: i * v1.x - range * v2.x, y: i * v1.y - range * v2.y },
      { x: i * v1.x + range * v2.x, y: i * v1.y + range * v2.y },
    ]);
  }
  return lines;
}
