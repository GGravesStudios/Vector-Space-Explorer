import { useWorkspace } from '@/Workspace';
import type { ExplorationMode } from '@/types';

const MODES: { id: ExplorationMode; label: string; description: string }[] = [
  { id: 'span', label: 'Span', description: 'Explore what vectors reach' },
  { id: 'basis', label: 'Basis', description: 'Solve Ax = b via Cramer\'s Rule' },
  { id: 'overcomplete', label: 'Null Space', description: 'Three vectors, one target' },
];

export function ModeSelector() {
  const { state, dispatch } = useWorkspace();

  return (
    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
      {MODES.map(({ id, label, description }) => (
        <button
          key={id}
          onClick={() => dispatch({ type: 'SET_MODE', payload: id })}
          title={description}
          className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            state.mode === id
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
