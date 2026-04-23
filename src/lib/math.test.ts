import { describe, it, expect } from 'vitest';
import { det2, classifyHealth, solveCramers, solveOvercomplete, snapToInteger } from './math';

describe('det2', () => {
  it('standard basis → 1', () => {
    expect(det2({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(1);
  });
  it('scaled basis → 6', () => {
    expect(det2({ x: 2, y: 0 }, { x: 0, y: 3 })).toBe(6);
  });
  it('collinear vectors → 0', () => {
    expect(det2({ x: 1, y: 2 }, { x: 2, y: 4 })).toBe(0);
  });
  it('clockwise orientation → -1', () => {
    expect(det2({ x: 1, y: 0 }, { x: 0, y: -1 })).toBe(-1);
  });
});

describe('classifyHealth', () => {
  it('0 → collapsed', () => {
    expect(classifyHealth(0)).toBe('collapsed');
  });
  it('0.05 → collapsed', () => {
    expect(classifyHealth(0.05)).toBe('collapsed');
  });
  it('exactly 0.1 → ill-conditioned (not < 0.1)', () => {
    expect(classifyHealth(0.1)).toBe('ill-conditioned');
  });
  it('0.5 → ill-conditioned', () => {
    expect(classifyHealth(0.5)).toBe('ill-conditioned');
  });
  it('exactly 1.0 → healthy', () => {
    expect(classifyHealth(1.0)).toBe('healthy');
  });
  it('-2.0 → healthy (sign irrelevant)', () => {
    expect(classifyHealth(-2.0)).toBe('healthy');
  });
});

describe('solveCramers', () => {
  it('standard basis with target (3,4) → c1=3, c2=4', () => {
    const r = solveCramers({ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 3, y: 4 });
    expect(r.c1).toBeCloseTo(3);
    expect(r.c2).toBeCloseTo(4);
    expect(r.health).toBe('healthy');
    expect(r.reachable).toBe(true);
  });
  it('scaled basis with target (4,6) → c1=2, c2=3', () => {
    const r = solveCramers({ x: 2, y: 0 }, { x: 0, y: 2 }, { x: 4, y: 6 });
    expect(r.c1).toBeCloseTo(2);
    expect(r.c2).toBeCloseTo(3);
  });
  it('non-axis-aligned: v1=(1,1), v2=(1,-1), target=(2,0) → c1=1, c2=1', () => {
    const r = solveCramers({ x: 1, y: 1 }, { x: 1, y: -1 }, { x: 2, y: 0 });
    expect(r.c1).toBeCloseTo(1);
    expect(r.c2).toBeCloseTo(1);
  });
  it('collapsed basis → health=collapsed, c1=NaN', () => {
    const r = solveCramers({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 0 });
    expect(r.health).toBe('collapsed');
    expect(r.reachable).toBe(false);
    expect(isNaN(r.c1)).toBe(true);
  });
});

describe('solveOvercomplete', () => {
  it('c3=0 gives same result as solveCramers', () => {
    const v1 = { x: 1, y: 0 };
    const v2 = { x: 0, y: 1 };
    const v3 = { x: 1, y: 1 };
    const target = { x: 3, y: 4 };
    const over = solveOvercomplete(v1, v2, v3, target, 0);
    const base = solveCramers(v1, v2, target);
    expect(over.c1).toBeCloseTo(base.c1);
    expect(over.c2).toBeCloseTo(base.c2);
    expect(over.c3).toBe(0);
  });
  it('c3=1 adjusts target before solving', () => {
    const r = solveOvercomplete(
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 3, y: 4 },
      1,
    );
    // adjustedTarget = (3-1, 4-1) = (2, 3) → c1=2, c2=3
    expect(r.c1).toBeCloseTo(2);
    expect(r.c2).toBeCloseTo(3);
    expect(r.c3).toBe(1);
  });
});

describe('snapToInteger', () => {
  it('both axes within threshold → both snap', () => {
    const result = snapToInteger({ x: 2.08, y: 1.92 });
    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });
  it('x outside threshold → x unchanged, y snaps', () => {
    const result = snapToInteger({ x: 2.2, y: 1.92 });
    expect(result.x).toBeCloseTo(2.2);
    expect(result.y).toBe(2);
  });
  it('origin snaps cleanly', () => {
    const result = snapToInteger({ x: 0, y: 0 });
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
  it('well outside threshold → does not snap', () => {
    const result = snapToInteger({ x: 2.3, y: 0 });
    expect(result.x).toBeCloseTo(2.3);
  });
});
