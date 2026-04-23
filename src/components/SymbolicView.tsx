import { useWorkspace } from '@/Workspace';
import { VECTOR_COLORS } from '@/lib/constants';
import type { Vec2 } from '@/types';

function fmt(n: number, decimals = 3): string {
  if (isNaN(n)) return '?';
  const rounded = Math.round(n * 1000) / 1000;
  return rounded.toFixed(decimals);
}

function Col({ vec, color, label }: { vec: Vec2; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-mono mb-1" style={{ color }}>{label}</span>
      <div className="flex flex-col items-center px-2 py-1.5 border-l-2 border-r-2 border-current" style={{ color, borderColor: color + '80' }}>
        <span className="font-mono text-sm leading-tight">{fmt(vec.x)}</span>
        <span className="font-mono text-sm leading-tight">{fmt(vec.y)}</span>
      </div>
    </div>
  );
}

function Scalar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-mono mb-1" style={{ color }}>{label}</span>
      <div className="font-mono text-sm px-2 py-1.5 bg-white/5 rounded border border-white/10" style={{ color }}>
        {fmt(value)}
      </div>
    </div>
  );
}

export function SymbolicView() {
  const { state } = useWorkspace();
  const { v1, v2, v3, target, mode, solverResult } = state;

  const health = solverResult?.health;
  const collapsed = health === 'collapsed';

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/10 font-mono">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Symbolic View</h3>

      {mode === 'span' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-white/50">Span = all reachable points:</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/40 text-sm">t₁ ·</span>
            <Col vec={v1} color={VECTOR_COLORS.v1} label="v₁" />
            <span className="text-white/40 text-sm">+ t₂ ·</span>
            <Col vec={v2} color={VECTOR_COLORS.v2} label="v₂" />
            <span className="text-white/40 text-sm">, t₁,t₂ ∈ ℝ</span>
          </div>
          {collapsed ? (
            <div className="text-red-400 text-xs">Span = a line (collinear basis)</div>
          ) : (
            <div className="text-emerald-400 text-xs">Span = all of ℝ²</div>
          )}
        </div>
      )}

      {(mode === 'basis' || mode === 'overcomplete') && (
        <div className="flex flex-col gap-3">
          {/* Matrix equation */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* [v1 | v2 | v3?] matrix */}
            <div className="flex items-stretch gap-0.5 border-l-2 border-r-2 border-white/20 px-1">
              <Col vec={v1} color={VECTOR_COLORS.v1} label="v₁" />
              <Col vec={v2} color={VECTOR_COLORS.v2} label="v₂" />
              {mode === 'overcomplete' && (
                <Col vec={v3} color={VECTOR_COLORS.v3} label="v₃" />
              )}
            </div>

            <span className="text-white/40 text-sm">·</span>

            {/* Scalar column */}
            <div className="flex flex-col items-center border-l-2 border-r-2 border-white/20 px-2 py-1">
              {collapsed ? (
                <span className="text-white/30 text-sm italic">?</span>
              ) : (
                <>
                  <span className="font-mono text-sm leading-tight" style={{ color: VECTOR_COLORS.v1 }}>
                    {fmt(solverResult!.c1)}
                  </span>
                  <span className="font-mono text-sm leading-tight" style={{ color: VECTOR_COLORS.v2 }}>
                    {fmt(solverResult!.c2)}
                  </span>
                  {mode === 'overcomplete' && (
                    <span className="font-mono text-sm leading-tight" style={{ color: VECTOR_COLORS.v3 }}>
                      {fmt(state.c3)}
                    </span>
                  )}
                </>
              )}
            </div>

            <span className="text-white/40 text-sm">=</span>

            {/* Target */}
            <Col vec={target} color={VECTOR_COLORS.target} label="b" />
          </div>

          {/* Linear combination breakdown */}
          {!collapsed && solverResult?.reachable && (
            <div className="flex flex-col gap-1 text-xs text-white/40 mt-2">
              <div className="text-white/25 text-[10px] uppercase tracking-widest mb-1">Decomposition</div>
              <LinearCombTerm scalar={solverResult.c1} vec={v1} color={VECTOR_COLORS.v1} label="c₁" />
              <span className="text-white/20">+</span>
              <LinearCombTerm scalar={solverResult.c2} vec={v2} color={VECTOR_COLORS.v2} label="c₂" />
              {mode === 'overcomplete' && (
                <>
                  <span className="text-white/20">+</span>
                  <LinearCombTerm scalar={state.c3} vec={v3} color={VECTOR_COLORS.v3} label="c₃" />
                </>
              )}
              <span className="text-white/20">=</span>
              <div className="flex gap-1" style={{ color: VECTOR_COLORS.target }}>
                <span>[{fmt(target.x)},</span>
                <span>{fmt(target.y)}]</span>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="text-red-400 text-xs mt-1">
              No unique solution — basis is degenerate (det = 0)
            </div>
          )}
        </div>
      )}

      {/* Determinant readout */}
      <div className="pt-2 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/30">det(v₁,v₂)</span>
          <span
            className="font-mono font-semibold"
            style={{
              color:
                health === 'collapsed'
                  ? '#f87171'
                  : health === 'ill-conditioned'
                    ? '#fbbf24'
                    : '#4ade80',
            }}
          >
            {solverResult ? fmt(solverResult.determinant, 4) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

function LinearCombTerm({
  scalar,
  vec,
  color,
  label,
}: {
  scalar: number;
  vec: Vec2;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1" style={{ color }}>
      <span>{fmt(scalar)}</span>
      <span className="text-white/20">·</span>
      <span>[{fmt(vec.x)}, {fmt(vec.y)}]</span>
      <span className="text-white/30 text-[10px] ml-1">({label})</span>
    </div>
  );
}

export function SymbolicScalars() {
  const { state } = useWorkspace();
  const { solverResult } = state;

  if (!solverResult?.reachable) return null;

  return (
    <div className="flex gap-3 flex-wrap">
      <Scalar value={solverResult.c1} color={VECTOR_COLORS.v1} label="c₁" />
      <Scalar value={solverResult.c2} color={VECTOR_COLORS.v2} label="c₂" />
      {solverResult.c3 !== undefined && (
        <Scalar value={solverResult.c3} color={VECTOR_COLORS.v3} label="c₃" />
      )}
    </div>
  );
}
