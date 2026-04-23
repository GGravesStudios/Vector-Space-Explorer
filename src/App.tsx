import { Workspace, useWorkspace } from './Workspace';
import { VectorPlane } from './components/VectorPlane';
import { SymbolicView } from './components/SymbolicView';
import { ModeSelector } from './components/ModeSelector';
import { DeterminantWarning } from './components/DeterminantWarning';
import { ScalarControls } from './components/ScalarControls';
import { VectorControls } from './components/VectorControls';
import { PresetSelector } from './components/PresetSelector';
import { ZoomControls } from './components/ZoomControls';

function AppContent() {
  const { state, dispatch } = useWorkspace();

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white/90 tracking-tight">
            Vector Space Explorer
          </h1>
          <p className="text-xs text-white/30 font-mono mt-0.5">
            Drag vectors · Alt+drag to pan · Scroll to zoom
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ZoomControls />
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SYMBOLIC' })}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
              state.showSymbolic
                ? 'border-white/20 text-white/70 hover:border-white/40'
                : 'border-white/10 text-white/30 hover:text-white/60'
            }`}
          >
            {state.showSymbolic ? 'Hide Symbolic' : 'Show Symbolic'}
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <ModeSelector />

      {/* Warning */}
      <DeterminantWarning />

      {/* Main canvas + side panels */}
      <div className="flex gap-4 flex-1">
        {/* Canvas */}
        <div className="shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <VectorPlane />
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          {state.showSymbolic && <SymbolicView />}
          <VectorControls />
          <ScalarControls />
          <PresetSelector />
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Workspace>
      <AppContent />
    </Workspace>
  );
}
