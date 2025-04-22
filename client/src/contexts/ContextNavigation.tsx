import { createContext, useState, useEffect, useRef } from 'react';

import { GRID_SIZE } from '../constants/Constants';

import { LetterRuntime } from '../types/LetterRuntime';

import { getPositionFromCoords } from '../utils/Utils';

export const ContextNavigation = createContext<{
    isDraggingLetters: boolean;
    setIsDraggingLetters: (isDraggingLetters: boolean | ((prev: boolean) => boolean)) => void;
    letterRuntimes: LetterRuntime[];
    setLetterRuntimes: (letterRuntimes: LetterRuntime[] | ((prev: LetterRuntime[]) => LetterRuntime[])) => void;
    selectedLetterIds: string[];
    setSelectedLetterIds: (selectedLetterIds: string[] | ((prev: string[]) => string[])) => void;
}>({
    isDraggingLetters: false,
    setIsDraggingLetters: () => {},
    letterRuntimes: [],
    setLetterRuntimes: () => {},
    selectedLetterIds: [],
    setSelectedLetterIds: () => {}
});

export function ContextNavigationProvider({ children }: { children: React.ReactNode }) {
    const [isDraggingLetters, setIsDraggingLetters] = useState<boolean>(false);
    const [letterRuntimes, setLetterRuntimes] = useState<LetterRuntime[]>([]);
    const [selectedLetterIds, setSelectedLetterIds] = useState<string[]>([]);
    const firstFrameDraggingRef = useRef<boolean>(true);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            let recalculateStartingDragPosition = false;
            if (isDraggingLetters) {
                if (firstFrameDraggingRef.current) {
                    firstFrameDraggingRef.current = false;
                    recalculateStartingDragPosition = true;
                }
            } else {
                firstFrameDraggingRef.current = true;
            }

            if (isDraggingLetters) {
                setLetterRuntimes(prev => {
                    const newLetterRuntimes = prev.map(runtime => {
                        if (!selectedLetterIds.includes(runtime.id))
                            return runtime;

                        const startingPos = runtime.positionWhileDragging;
                        return {
                            ...runtime,
                            positionWhileDragging: {
                                x: startingPos.x + e.movementX,
                                y: startingPos.y + e.movementY,
                            }
                        }
                    });
                    
                    return newLetterRuntimes;
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isDraggingLetters, selectedLetterIds]);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            // Deselect letters
            if (isDraggingLetters) setSelectedLetterIds([]);

            // Stop dragging
            setIsDraggingLetters(false);
            
            // Resolve placement
            setLetterRuntimes(prev => {
                const newLetterRuntimes = [...prev];

                // Intentionally using un-updated selectecLetterIds
                selectedLetterIds.forEach(id => {
                    const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === id);
                    if (runtimeIndex !== -1) {
                        const runtime = newLetterRuntimes[runtimeIndex];
                        const targetRow = Math.round(runtime.positionWhileDragging.y / GRID_SIZE);
                        const targetCol = Math.round(runtime.positionWhileDragging.x / GRID_SIZE);

                        const updatedRuntime = {
                            ...runtime,
                            row: targetRow,
                            col: targetCol,
                            positionWhileDragging: getPositionFromCoords(targetRow, targetCol),
                        }

                        // Swap letters if one was present in new spot
                        const index = newLetterRuntimes.findIndex(letter => letter.row === targetRow && letter.col === targetCol);
                        if (index !== -1) {
                            const existingLetter = newLetterRuntimes[index];
                            if (!selectedLetterIds.includes(existingLetter.id)) {
                                newLetterRuntimes[index] = {
                                    ...existingLetter,
                                    row: runtime.row,
                                    col: runtime.col,
                                    positionWhileDragging: getPositionFromCoords(runtime.row, runtime.col),
                                };
                            }
                        }
                        
                        newLetterRuntimes[runtimeIndex] = updatedRuntime;
                    }
                });

                return newLetterRuntimes;
            });
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDraggingLetters, selectedLetterIds]);

    return (
        <ContextNavigation.Provider value={{
            isDraggingLetters,
            setIsDraggingLetters, 
            letterRuntimes,
            setLetterRuntimes,
            selectedLetterIds,
            setSelectedLetterIds,
        }}>
            {children}
        </ContextNavigation.Provider>
    );
}