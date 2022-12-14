import React from 'react';
import { throttle } from '@src/utils/limit';

export default function useNodeBoundingRect(): {
    rect: DOMRectReadOnly | null;
    ref: Function;
    cleanObserver: () => void;
} {
    const [rect, setRect] = React.useState<DOMRectReadOnly | null>(null);

    const resizeObserver = new ResizeObserver(
        throttle(entries => {
            setRect(entries[0]?.contentRect);
        }, 50)
    );

    const ref = React.useCallback(node => {
        if (node !== null) {
            resizeObserver.observe(node);
        }
    }, []);

    const cleanObserver = React.useCallback(() => {
        resizeObserver.disconnect();
    }, []);

    return { rect, ref, cleanObserver };
}
