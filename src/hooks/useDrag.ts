import { useCallback, useRef } from 'react';
import type { Vec2, VectorName } from '@/types';
import { svgToCartesian } from '@/lib/coordinates';
import { snapToInteger } from '@/lib/math';
import { useWorkspace } from '@/Workspace';

interface UseDragOptions {
  svgRef: React.RefObject<SVGSVGElement | null>;
  name: VectorName;
  width: number;
  height: number;
}

export function useDrag({ svgRef, name, width, height }: UseDragOptions) {
  const { state, dispatch } = useWorkspace();
  const dragging = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      e.preventDefault();
      dragging.current = true;
      (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGElement>) => {
      if (!dragging.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cart = svgToCartesian(px, py, width, height, state.scale, state.panOffset);
      const snapped = snapToInteger(cart);
      dispatch({ type: 'SET_VECTOR', payload: { name, value: snapped } });
    },
    [svgRef, name, width, height, state.scale, state.panOffset, dispatch],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<SVGElement>) => {
    dragging.current = false;
    (e.currentTarget as SVGElement).releasePointerCapture(e.pointerId);
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
