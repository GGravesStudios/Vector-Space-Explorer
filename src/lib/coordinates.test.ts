import { describe, it, expect } from 'vitest';
import { cartesianToSVG, svgToCartesian, warpedGridLines } from './coordinates';

const W = 600, H = 600, S = 50;
const PAN = { x: 0, y: 0 };

describe('cartesianToSVG / svgToCartesian round-trip', () => {
  const cases: [number, number][] = [
    [0, 0],
    [3, -2],
    [-5, 4],
    [1, 1],
  ];

  for (const [cx, cy] of cases) {
    it(`round-trips (${cx}, ${cy})`, () => {
      const { px, py } = cartesianToSVG({ x: cx, y: cy }, W, H, S, PAN);
      const back = svgToCartesian(px, py, W, H, S, PAN);
      expect(back.x).toBeCloseTo(cx, 10);
      expect(back.y).toBeCloseTo(cy, 10);
    });
  }

  it('origin maps to SVG center', () => {
    const { px, py } = cartesianToSVG({ x: 0, y: 0 }, W, H, S, PAN);
    expect(px).toBe(300);
    expect(py).toBe(300);
  });

  it('positive y → smaller py (upward in SVG = smaller y value)', () => {
    const { py: py0 } = cartesianToSVG({ x: 0, y: 0 }, W, H, S, PAN);
    const { py: py1 } = cartesianToSVG({ x: 0, y: 1 }, W, H, S, PAN);
    expect(py1).toBeLessThan(py0);
  });
});

describe('warpedGridLines', () => {
  it('standard basis produces axis-aligned lines', () => {
    const lines = warpedGridLines({ x: 1, y: 0 }, { x: 0, y: 1 }, 2);
    // parallel to v1=(1,0): start.y === end.y
    // parallel to v2=(0,1): start.x === end.x
    for (const [start, end] of lines) {
      const isHorizontal = Math.abs(start.y - end.y) < 1e-10;
      const isVertical = Math.abs(start.x - end.x) < 1e-10;
      expect(isHorizontal || isVertical).toBe(true);
    }
  });

  it('produces correct number of lines: 2 * (2*range+1)', () => {
    const range = 3;
    const lines = warpedGridLines({ x: 1, y: 0 }, { x: 0, y: 1 }, range);
    expect(lines.length).toBe(2 * (2 * range + 1));
  });
});
