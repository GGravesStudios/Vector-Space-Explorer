import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { WorkspaceState, WorkspaceAction } from '@/types';
import { solveCramers, solveOvercomplete } from '@/lib/math';
import { DEFAULT_SCALE, MIN_SCALE, MAX_SCALE } from '@/lib/constants';
import { clamp } from '@/lib/math';

const DEFAULT_STATE: WorkspaceState = {
  v1: { x: 1, y: 0 },
  v2: { x: 0, y: 1 },
  v3: { x: 1, y: 1 },
  target: { x: 2, y: 1 },
  c3: 0,
  mode: 'basis',
  showSymbolic: true,
  solverResult: null,
  scale: DEFAULT_SCALE,
  panOffset: { x: 0, y: 0 },
};

function computeSolver(state: WorkspaceState): WorkspaceState {
  const { v1, v2, v3, target, c3, mode } = state;
  const solverResult =
    mode === 'overcomplete'
      ? solveOvercomplete(v1, v2, v3, target, c3)
      : solveCramers(v1, v2, target);
  return { ...state, solverResult };
}

function reducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_VECTOR':
      return computeSolver({ ...state, [action.payload.name]: action.payload.value });
    case 'SET_C3':
      return computeSolver({ ...state, c3: action.payload });
    case 'SET_MODE':
      return computeSolver({ ...state, mode: action.payload });
    case 'TOGGLE_SYMBOLIC':
      return { ...state, showSymbolic: !state.showSymbolic };
    case 'SET_SCALE':
      return { ...state, scale: clamp(action.payload, MIN_SCALE, MAX_SCALE) };
    case 'SET_PAN_OFFSET':
      return { ...state, panOffset: action.payload };
    case 'RESET_VIEW':
      return { ...state, scale: DEFAULT_SCALE, panOffset: { x: 0, y: 0 } };
    case 'SET_PRESET':
      return computeSolver({ ...state, v1: action.payload.v1, v2: action.payload.v2 });
  }
}

interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used inside <Workspace>');
  return ctx;
}

interface WorkspaceProps {
  children: ReactNode;
}

export function Workspace({ children }: WorkspaceProps) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, computeSolver);
  return (
    <WorkspaceContext value={{ state, dispatch }}>
      {children}
    </WorkspaceContext>
  );
}
