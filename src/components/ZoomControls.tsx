import { useZoomPan } from '@/hooks/useZoomPan';
import { useWorkspace } from '@/Workspace';
import { DEFAULT_SCALE } from '@/lib/constants';

export function ZoomControls() {
  const { zoomIn, zoomOut, resetView } = useZoomPan(600, 600);
  const { state } = useWorkspace();

  const pct = Math.round((state.scale / DEFAULT_SCALE) * 100);

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={zoomOut}
        className="w-7 h-7 rounded text-white/50 hover:text-white hover:bg-white/10 text-lg leading-none transition-colors"
        title="Zoom out"
      >
        −
      </button>
      <button
        onClick={resetView}
        className="px-2 h-7 rounded text-white/30 hover:text-white hover:bg-white/10 text-xs font-mono transition-colors"
        title="Reset view"
      >
        {pct}%
      </button>
      <button
        onClick={zoomIn}
        className="w-7 h-7 rounded text-white/50 hover:text-white hover:bg-white/10 text-lg leading-none transition-colors"
        title="Zoom in"
      >
        +
      </button>
    </div>
  );
}
