import { useWorkspace } from '@/Workspace';

export function DeterminantWarning() {
  const { state } = useWorkspace();
  const health = state.solverResult?.health;

  if (!health || health === 'healthy') return null;

  const isCollapsed = health === 'collapsed';

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-mono font-medium ${
        isCollapsed
          ? 'bg-red-900/60 border border-red-500/50 text-red-300'
          : 'bg-yellow-900/60 border border-yellow-500/50 text-yellow-300'
      }`}
    >
      <span className="text-base">{isCollapsed ? '⚠' : '△'}</span>
      <span>
        {isCollapsed
          ? 'Structural Collapse — basis vectors are collinear (det ≈ 0). Space has collapsed to a line.'
          : `Ill-Conditioned — basis is nearly degenerate (|det| = ${Math.abs(state.solverResult!.determinant).toFixed(3)}). Solutions are numerically unstable.`}
      </span>
    </div>
  );
}
