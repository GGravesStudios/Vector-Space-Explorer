import { useCallback, useRef } from 'react';
import { useWorkspace } from '@/Workspace';
import { MIN_SCALE, MAX_SCALE } from '@/lib/constants';
import { clamp } from '@/lib/math';
import type { Vec2 } from '@/types';

export function useZoomPan(width: number, height: number) {
  const { state, dispatch } = useWorkspace();
  const panStart = useRef<{ px: number; py: number; offset: Vec2 } | null>(null);

  const onWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = clamp(state.scale * factor, MIN_SCALE, MAX_SCALE);
      dispatch({ type: 'SET_SCALE', payload: newScale });
    },
    [state.scale, dispatch],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      // Middle mouse button or Alt+left for pan
      if (e.button !== 1 && !e.altKey) return;
      e.preventDefault();
      (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
      panStart.current = {
        px: e.clientX,
        py: e.clientY,
        offset: { ...state.panOffset },
      };
    },
    [state.panOffset],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!panStart.current) return;
      const dx = e.clientX - panStart.current.px;
      const dy = e.clientY - panStart.current.py;
      dispatch({
        type: 'SET_PAN_OFFSET',
        payload: {
          x: panStart.current.offset.x + dx,
          y: panStart.current.offset.y + dy,
        },
      });
    },
    [dispatch],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!panStart.current) return;
      panStart.current = null;
      (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId);
    },
    [],
  );

  const zoomIn = useCallback(() => {
    dispatch({ type: 'SET_SCALE', payload: clamp(state.scale * 1.2, MIN_SCALE, MAX_SCALE) });
  }, [state.scale, dispatch]);

  const zoomOut = useCallback(() => {
    dispatch({ type: 'SET_SCALE', payload: clamp(state.scale / 1.2, MIN_SCALE, MAX_SCALE) });
  }, [state.scale, dispatch]);

  const resetView = useCallback(() => {
    dispatch({ type: 'RESET_VIEW' });
  }, [dispatch]);

  return { onWheel, onPointerDown, onPointerMove, onPointerUp, zoomIn, zoomOut, resetView };
}
