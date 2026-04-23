import { useWorkspace } from '@/Workspace';
import { VECTOR_COLORS } from '@/lib/constants';

export function ScalarControls() {
  const { state, dispatch } = useWorkspace();

  if (state.mode !== 'overcomplete') return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
      <label className="text-xs font-mono font-semibold" style={{ color: VECTOR_COLORS.v3 }}>
        c₃
      </label>
      <input
        type="range"
        min={-5}
        max={5}
        step={0.1}
        value={state.c3}
        onChange={e => dispatch({ type: 'SET_C3', payload: Number(e.target.value) })}
        className="flex-1 accent-pink-400"
      />
      <input
        type="number"
        min={-10}
        max={10}
        step={0.1}
        value={state.c3}
        onChange={e => dispatch({ type: 'SET_C3', payload: Number(e.target.value) })}
        className="w-16 px-2 py-0.5 bg-white/10 rounded text-xs font-mono text-center text-white border border-white/10 focus:outline-none focus:border-white/30"
      />
    </div>
  );
}
