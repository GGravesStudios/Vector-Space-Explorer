import { useWorkspace } from '@/Workspace';
import type { Vec2 } from '@/types';

interface Preset {
  label: string;
  v1: Vec2;
  v2: Vec2;
  title: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Standard',
    v1: { x: 1, y: 0 },
    v2: { x: 0, y: 1 },
    title: 'Standard basis: identity matrix',
  },
  {
    label: '45°',
    v1: { x: 1, y: 1 },
    v2: { x: -1, y: 1 },
    title: 'Rotated 45° basis',
  },
  {
    label: 'Shear',
    v1: { x: 1, y: 0 },
    v2: { x: 1, y: 1 },
    title: 'Shear transformation',
  },
  {
    label: 'Near-singular',
    v1: { x: 1, y: 0.1 },
    v2: { x: 2, y: 0.2 },
    title: 'Ill-conditioned — nearly collinear vectors',
  },
];

export function PresetSelector() {
  const { dispatch } = useWorkspace();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Presets</h3>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            title={preset.title}
            onClick={() =>
              dispatch({
                type: 'SET_PRESET',
                payload: { v1: preset.v1, v2: preset.v2 },
              })
            }
            className="px-3 py-1 text-xs font-mono rounded border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
