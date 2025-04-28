import { createContext, useState, useEffect, useRef } from 'react';
import { isEqual } from 'lodash';

import { GRID_SIZE, UNDO_LIMIT } from '../constants/Constants';

import { LetterRuntime } from '../types/LetterRuntime';

import { getCoordsFromPosition, getPositionFromCoords } from '../utils/Utils';

export const ContextNavigation = createContext<{
    isDraggingLetters: boolean;
    setIsDraggingLetters: (isDraggingLetters: boolean | ((prev: boolean) => boolean)) => void;
    letterRuntimes: LetterRuntime[];
    setLetterRuntimes: (letterRuntimes: LetterRuntime[] | ((prev: LetterRuntime[]) => LetterRuntime[])) => void;
    selectedLetterIds: string[];
    setSelectedLetterIds: (selectedLetterIds: string[] | ((prev: string[]) => string[])) => void;
    dialogIsOpen: boolean;
    setDialogIsOpen: (dialogIsOpen: boolean | ((prev: boolean) => boolean)) => void;
    windowDimensions: { width: number, height: number }
}>({
    isDraggingLetters: false,
    setIsDraggingLetters: () => { },
    letterRuntimes: [],
    setLetterRuntimes: () => { },
    selectedLetterIds: [],
    setSelectedLetterIds: () => { },
    dialogIsOpen: false,
    setDialogIsOpen: () => { },
    windowDimensions: { width: 0, height: 0 },
});

export function ContextNavigationProvider({ children }: { children: React.ReactNode }) {
    const [isDraggingLetters, setIsDraggingLetters] = useState<boolean>(false);
    const [letterRuntimes, setLetterRuntimes] = useState<LetterRuntime[]>([]);
    const [selectedLetterIds, setSelectedLetterIds] = useState<string[]>([]);
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const [stacks, setStacks] = useState<{
        undo: LetterRuntime[][];
        redo: LetterRuntime[][];
    }>({
        undo: [],
        redo: [],
    });

    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const hasReceivedLetterRuntimes = useRef(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function PushUndoState(newState: LetterRuntime[]) {
        setStacks(prev => {
            const { undo } = prev;
            if (undo.length === 0 || (undo.length > 0 && !isEqual(undo[undo.length - 1], newState))) {
                const newUndo = [...undo];
                newUndo.push([...newState]);
                if (newUndo.length > UNDO_LIMIT) {
                    newUndo.shift();
                }
                return {
                    ...prev,
                    undo: newUndo,
                };
            }
            return prev;
        });
    }

    useEffect(() => {
        if (!hasReceivedLetterRuntimes.current) {
            if (letterRuntimes.length > 0) {
                PushUndoState(letterRuntimes);
                hasReceivedLetterRuntimes.current = true;
            }
        }
    }, [letterRuntimes]);

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            let clientX: number, clientY: number, movementX = 0, movementY = 0;
    
            if (window.TouchEvent && e instanceof window.TouchEvent) {
                if (e.touches.length > 0) {
                    const touch = e.touches[0];
                    clientX = touch.clientX;
                    clientY = touch.clientY;
    
                    // Calculate movement manually for touch
                    setMousePosition(prev => {
                        movementX = clientX - prev.x;
                        movementY = clientY - prev.y;
                        return { x: clientX, y: clientY };
                    });
                } else {
                    return; // no touch to process
                }
            } else if (e instanceof MouseEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
                movementX = e.movementX;
                movementY = e.movementY;
                
                setMousePosition({ x: clientX, y: clientY });
            }
    
            if (isDraggingLetters) {
                setLetterRuntimes(prev => {
                    return prev.map(runtime => {
                        if (!selectedLetterIds.includes(runtime.id))
                            return runtime;
    
                        const startingPos = runtime.positionWhileDragging;
                        return {
                            ...runtime,
                            positionWhileDragging: {
                                x: startingPos.x + movementX,
                                y: startingPos.y + movementY,
                            }
                        };
                    });
                });
            }
        };
    
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: false });
    
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, [isDraggingLetters, selectedLetterIds]);
    

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrl = event.ctrlKey || event.metaKey;
            const isShift = event.shiftKey;
            const isCtrlY = event.key === 'y' && isCtrl;
            const isCtrlZ = event.key === 'z' && isCtrl;
            const isShiftZ = event.key === 'z' && isShift;

            // Undo
            if (isCtrlZ && !isShiftZ) {
                event.preventDefault();
                setStacks(prev => {
                    const { undo, redo } = prev;
                    if (undo.length > 1) {
                        const newUndo = undo.slice(0, undo.length - 1);
                        const newRedo = [...redo, undo[undo.length - 1]];
                        const newLetterRuntimes = undo[undo.length - 2];
                        setLetterRuntimes(newLetterRuntimes);
                        return {
                            undo: newUndo,
                            redo: newRedo,
                        };
                    }
                    return prev;
                });
            }

            // Redo
            if ((isCtrlZ && isShiftZ) || isCtrlY) {
                event.preventDefault();
                setStacks(prev => {
                    const { undo, redo } = prev;
                    if (redo.length > 0) {
                        const newRedo = redo.slice(0, redo.length - 1);
                        const newUndo = [...undo, redo[redo.length - 1]];
                        const newLetterRuntimes = redo[redo.length - 1];
                        setLetterRuntimes(newLetterRuntimes);
                        return {
                            undo: newUndo,
                            redo: newRedo,
                        };
                    }
                    return prev;
                });
            }

            function RotateLetters(clockwise: boolean) {
                setLetterRuntimes(prev => {
                    const newLetterRuntimes = [...prev];

                    let closestIndex = -1;
                    let closestDistance = Infinity;
                    const offset = GRID_SIZE / 2;
                    selectedLetterIds.forEach(id => {
                        const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === id);
                        if (runtimeIndex !== -1) {
                            const l1Distance = Math.abs(newLetterRuntimes[runtimeIndex].positionWhileDragging.x - mousePosition.x + offset)
                                + Math.abs(newLetterRuntimes[runtimeIndex].positionWhileDragging.y - mousePosition.y + offset);
                            if (l1Distance < closestDistance) {
                                closestDistance = l1Distance;
                                closestIndex = runtimeIndex;
                            }
                        }
                    });

                    const centerPoint = newLetterRuntimes[closestIndex].positionWhileDragging;
                    const cx = centerPoint.x;
                    const cy = centerPoint.y;
                    const dir = clockwise ? 1 : -1;

                    selectedLetterIds.forEach(id => {
                        const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === id);

                        const found = runtimeIndex !== -1;
                        if (!found) {
                            console.error("Should have one runtime for each selected letter");
                        } else {
                            const runtime = newLetterRuntimes[runtimeIndex];
                            const x = runtime.positionWhileDragging.x;
                            const y = runtime.positionWhileDragging.y;
                            const updatedRuntime = {
                                ...runtime,
                                positionWhileDragging: {
                                    x: cx - dir * (y - cy),
                                    y: cy + dir * (x - cx),
                                },
                            }

                            newLetterRuntimes[runtimeIndex] = updatedRuntime;
                        }
                    });

                    return newLetterRuntimes;
                });
            }

            // Rotate
            if (event.key.toLowerCase() === 'r' && isDraggingLetters && selectedLetterIds.length >= 2) {
                event.preventDefault();
                RotateLetters(!isShift);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stacks, isDraggingLetters, selectedLetterIds, mousePosition]);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            // Stop dragging
            setIsDraggingLetters(false);

            // Resolve placement
            setLetterRuntimes(prev => {
                if (selectedLetterIds.length <= 0) {
                    return prev;
                }

                // Check if all tiles are in bounds
                let allInBounds = true;
                prev.forEach(letterRuntime => {
                    if (selectedLetterIds.includes(letterRuntime.id)) {
                        const pos = getPositionFromCoords(getCoordsFromPosition(letterRuntime.positionWhileDragging));
                        if (pos.x < 0 || pos.x > windowDimensions.width
                            || pos.y < 0 || pos.y > windowDimensions.height
                        ) {
                            allInBounds = false;
                        }
                        return;
                    }
                })
                if (!allInBounds) {
                    // Revert to last valid state
                    return stacks.undo[stacks.undo.length - 1];
                }

                const newLetterRuntimes = [...prev];

                // 1. originalSpaces: orignal spaces from which we are moving
                // 2. targetSpaces: spaces to which we are moving
                // 3. freedSpaces: orignal - target
                // 4. occupiedSpaces: target - original
                // 5. sort freedSpaces and occupiedSpaces by sweeping through the spaces in a wave pattern according to drag direction
                // 6. for every Runtime in occupiedSpaces, move it to corresponding place in freedSpaces

                // This function intentionally references un-updated selectedLetterIds

                interface GridSpace {
                    row: number;
                    col: number;
                }

                const originalSpaces: GridSpace[] = selectedLetterIds.map(id => {
                    const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === id);
                    if (runtimeIndex !== -1) {
                        const runtime = newLetterRuntimes[runtimeIndex];
                        return { row: runtime.row, col: runtime.col };
                    }
                    return { row: -1, col: -1 };
                });

                const targetSpaces: GridSpace[] = selectedLetterIds.map(id => {
                    const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === id);
                    if (runtimeIndex !== -1) {
                        const runtime = newLetterRuntimes[runtimeIndex];
                        const targetRow = Math.round(runtime.positionWhileDragging.y / GRID_SIZE);
                        const targetCol = Math.round(runtime.positionWhileDragging.x / GRID_SIZE);
                        return { row: targetRow, col: targetCol };
                    }
                    return { row: -1, col: -1 };
                });

                const isSameSpace = (a: GridSpace, b: GridSpace) => a.row === b.row && a.col === b.col;

                const freedSpaces = originalSpaces.filter(
                    original => !targetSpaces.some(target => isSameSpace(original, target))
                );

                const occupiedSpaces = targetSpaces.filter(
                    target => !originalSpaces.some(original => isSameSpace(target, original))
                );

                const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === selectedLetterIds[0]);
                if (runtimeIndex === -1) {
                    console.error("Should have one runtime for each selected letter");
                } else {
                    const runtime = newLetterRuntimes[runtimeIndex];
                    // final - initial
                    const dy = Math.round(runtime.positionWhileDragging.y / GRID_SIZE) - runtime.row;
                    const dx = Math.round(runtime.positionWhileDragging.x / GRID_SIZE) - runtime.col;

                    const sortingValue = (a: GridSpace) => {
                        return a.row * dx - a.col * dy;
                    }

                    const sortingFunction = (a: GridSpace, b: GridSpace) => {
                        return sortingValue(a) - sortingValue(b);
                    };

                    freedSpaces.sort(sortingFunction);
                    occupiedSpaces.sort(sortingFunction);
                }

                console.assert(freedSpaces.length === occupiedSpaces.length,
                    "Freed spaces and occupied spaces should be the same length");

                // Move letters from occupiedSpaces to freedSpaces
                for (let i = 0; i < occupiedSpaces.length; i++) {
                    const occupiedSpace = occupiedSpaces[i];

                    const runtimeIndex = newLetterRuntimes.findIndex(letter => {
                        return letter.row === occupiedSpace.row && letter.col === occupiedSpace.col;
                    });

                    if (runtimeIndex !== -1) {
                        const runtime = newLetterRuntimes[runtimeIndex];
                        const targetRow = freedSpaces[i].row;
                        const targetCol = freedSpaces[i].col;
                        const updatedRuntime = {
                            ...runtime,
                            row: targetRow,
                            col: targetCol,
                            positionWhileDragging: getPositionFromCoords(targetRow, targetCol),
                        }

                        newLetterRuntimes[runtimeIndex] = updatedRuntime;
                    }
                }

                // Move letters that were dragged
                selectedLetterIds.forEach(id => {
                    const runtimeIndex = newLetterRuntimes.findIndex(letter => letter.id === id);

                    const found = runtimeIndex !== -1;
                    if (!found) {
                        console.error("Should have one runtime for each selected letter");
                    } else {
                        const runtime = newLetterRuntimes[runtimeIndex];
                        const targetRow = Math.round(runtime.positionWhileDragging.y / GRID_SIZE);
                        const targetCol = Math.round(runtime.positionWhileDragging.x / GRID_SIZE);
                        const updatedRuntime = {
                            ...runtime,
                            row: targetRow,
                            col: targetCol,
                            positionWhileDragging: getPositionFromCoords(targetRow, targetCol),
                        }

                        newLetterRuntimes[runtimeIndex] = updatedRuntime;
                    }
                });

                PushUndoState(newLetterRuntimes);

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
            dialogIsOpen,
            setDialogIsOpen,
            windowDimensions,
        }}>
            {children}
        </ContextNavigation.Provider>
    );
}