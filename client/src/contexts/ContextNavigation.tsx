// LetterContext.tsx
import { createContext, useState, useEffect, useRef } from 'react';

import { LetterRuntime } from '../types/LetterRuntime';

export const ContextNavigation = createContext<{
    registerDraggedLetter: (id: string, onDrag?: (e: MouseEvent) => void) => void;
    currentDraggedId: string | null;
    letterRuntimes: LetterRuntime[];
    setLetterRuntimes: (letterRuntimes: LetterRuntime[] | ((prev: LetterRuntime[]) => LetterRuntime[])) => void;
}>({ registerDraggedLetter: () => {}, currentDraggedId: null, letterRuntimes: [], setLetterRuntimes: () => {} });

export function ContextNavigationProvider({ children }: { children: React.ReactNode }) {
    const [currentDraggedId, setCurrentDraggedId] = useState<string | null>(null);
    const [letterRuntimes, setLetterRuntimes] = useState<LetterRuntime[]>([]);
    const dragCallbackRef = useRef<((e: MouseEvent) => void) | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (currentDraggedId && dragCallbackRef.current) {
                dragCallbackRef.current(e);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [currentDraggedId]);

    const registerDraggedLetter = (id: string, onDrag?: (e: MouseEvent) => void) => {
        setCurrentDraggedId(id);
        dragCallbackRef.current = onDrag || null;
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (currentDraggedId) {
                setCurrentDraggedId(null);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [currentDraggedId]);

    return (
        <ContextNavigation.Provider value={{ 
            registerDraggedLetter,
            currentDraggedId,
            letterRuntimes,
            setLetterRuntimes,
        }}>
            {children}
        </ContextNavigation.Provider>
    );
}