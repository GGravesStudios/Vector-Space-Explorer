export interface Vec2 {
  x: number;
  y: number;
}

export type ExplorationMode = 'span' | 'basis' | 'overcomplete';

export type DeterminantHealth = 'healthy' | 'ill-conditioned' | 'collapsed';

export interface SolverResult {
  c1: number;
  c2: number;
  c3?: number;
  determinant: number;
  health: DeterminantHealth;
  reachable: boolean;
}

export interface WorkspaceState {
  v1: Vec2;
  v2: Vec2;
  v3: Vec2;
  target: Vec2;
  c3: number;
  mode: ExplorationMode;
  showSymbolic: boolean;
  solverResult: SolverResult | null;
  scale: number;
  panOffset: Vec2;
}

export type VectorName = 'v1' | 'v2' | 'v3' | 'target';

export type WorkspaceAction =
  | { type: 'SET_VECTOR'; payload: { name: VectorName; value: Vec2 } }
  | { type: 'SET_C3'; payload: number }
  | { type: 'SET_MODE'; payload: ExplorationMode }
  | { type: 'TOGGLE_SYMBOLIC' }
  | { type: 'SET_SCALE'; payload: number }
  | { type: 'SET_PAN_OFFSET'; payload: Vec2 }
  | { type: 'RESET_VIEW' }
  | { type: 'SET_PRESET'; payload: { v1: Vec2; v2: Vec2 } };
