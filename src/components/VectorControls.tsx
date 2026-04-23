import { useWorkspace } from '@/Workspace';
import { VECTOR_COLORS } from '@/lib/constants';
import type { Vec2, VectorName } from '@/types';

interface VectorInputRowProps {
  name: VectorName;
  label: string;
  color: string;
  value: Vec2;
}

function VectorInputRow({ name, label, color, value }: VectorInputRowProps) {
  const { dispatch } = useWorkspace();

  const set = (axis: 'x' | 'y', raw: number) => {
    const n = isNaN(raw) ? 0 : raw;
    dispatch({
      type: 'SET_VECTOR',
      payload: { name, value: { ...value, [axis]: n } },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="w-5 text-xs font-mono font-bold shrink-0"
        style={{ color }}
      >
        {label}
      </span>
      <div className="flex flex-col gap-1 flex-1">
        {(['x', 'y'] as const).map(axis => (
          <div key={axis} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/30 w-3">{axis}</span>
            <input
              type="range"
              min={-10}
              max={10}
              step={0.1}
              value={value[axis]}
              onChange={e => set(axis, Number(e.target.value))}
              className="flex-1 h-1.5 accent-current"
              style={{ accentColor: color }}
            />
            <input
              type="number"
              min={-10}
              max={10}
              step={0.1}
              value={value[axis]}
              onChange={e => set(axis, parseFloat(e.target.value))}
              className="w-14 px-1.5 py-0.5 bg-white/10 rounded text-[11px] font-mono text-white text-right border border-white/10 focus:outline-none focus:border-white/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function VectorControls() {
  const { state } = useWorkspace();
  const { v1, v2, v3, target, mode } = state;

  return (
    <div className="flex flex-col gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/10">
      <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Vector Controls</h3>
      <VectorInputRow name="v1" label="v₁" color={VECTOR_COLORS.v1} value={v1} />
      <VectorInputRow name="v2" label="v₂" color={VECTOR_COLORS.v2} value={v2} />
      {mode === 'overcomplete' && (
        <VectorInputRow name="v3" label="v₃" color={VECTOR_COLORS.v3} value={v3} />
      )}
      {(mode === 'basis' || mode === 'overcomplete') && (
        <VectorInputRow name="target" label="b" color={VECTOR_COLORS.target} value={target} />
      )}
    </div>
  );
}
