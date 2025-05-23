import { useContext, useEffect, useState } from 'react';

import DragBounds from './DragBounds';

import { ContextGame } from '../contexts/ContextGame';

import { GRID_BOUNDS, GRID_SIZE } from '../constants/Constants';

export default function Board() {
    const { windowDimensions, setLetterRuntimes, scroll, setScroll, isTypingFromShelf, selectedLetterIds, isDraggingLetters } = useContext(ContextGame);

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: -1, y: -1 });
    const [currentPosition, setCurrentPosition] = useState({ x: -1, y: -1 });
    const [isSpacePressed, setIsSpacePressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsSpacePressed(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsSpacePressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const handleGlobalEnd = () => {
            setIsMouseDown(false);
            setStartPosition({ x: -1, y: -1 });
            setCurrentPosition({ x: -1, y: -1 });
        };

        window.addEventListener('mouseup', handleGlobalEnd);
        window.addEventListener('touchend', handleGlobalEnd);

        return () => {
            window.removeEventListener('mouseup', handleGlobalEnd);
            window.removeEventListener('touchend', handleGlobalEnd);
        };
    }, []);

    const updateActiveLetters = (deltaX: number, deltaY: number) => {
        if (!(isDraggingLetters || isTypingFromShelf))
            return;
        setLetterRuntimes(prev => {
            const newLetterRuntimes = [...prev].map(runtime => {
                if (!selectedLetterIds.includes(runtime.id))
                    return runtime;

                return {
                    ...runtime,
                    positionWhileDragging: {
                        x: runtime.positionWhileDragging.x + (isTypingFromShelf ? 1 : -1) * deltaX,
                        y: runtime.positionWhileDragging.y + (isTypingFromShelf ? 1 : -1) * deltaY,
                    }
                }
            });

            return newLetterRuntimes;
        });
    }

    useEffect(() => {
        const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault();
            if (isMouseDown) {
                if (isSpacePressed && e instanceof MouseEvent) {
                    setScroll(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }))
                    updateActiveLetters(e.movementX, e.movementY)
                } else {
                    if (window.TouchEvent && e instanceof window.TouchEvent) {
                        if (e.touches.length > 0) {
                            setCurrentPosition({
                                x: e.touches[0].clientX,
                                y: e.touches[0].clientY
                            });
                        }
                    } else if (e instanceof MouseEvent) {
                        setCurrentPosition({
                            x: e.clientX,
                            y: e.clientY
                        });
                    }
                }
            }
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('touchmove', handleGlobalMove);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
        };
    }, [isMouseDown, isSpacePressed, isTypingFromShelf, selectedLetterIds, isDraggingLetters]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            setScroll(prev => ({
                x: prev.x - e.deltaX,
                y: prev.y - e.deltaY
            }));
            updateActiveLetters(e.deltaX, e.deltaY)
        };

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isTypingFromShelf, selectedLetterIds, isDraggingLetters]);

    const handlePressStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (isTypingFromShelf)
            return;

        let clientX: number;
        let clientY: number;

        if (e.type === "mousedown") {
            const mouseEvent = e as React.MouseEvent<HTMLDivElement>;
            clientX = mouseEvent.clientX;
            clientY = mouseEvent.clientY;
        } else if (e.type === "touchstart") {
            const touchEvent = e as React.TouchEvent<HTMLDivElement>;
            clientX = touchEvent.touches[0].clientX;
            clientY = touchEvent.touches[0].clientY;
        } else {
            return;
        }

        setIsMouseDown(true);
        setStartPosition({ x: clientX, y: clientY });
        setCurrentPosition({ x: clientX, y: clientY });
    }

    const verticalLines = [];
    const horizontalLines = [];

    const xOffset = scroll.x % GRID_SIZE;
    for (let x = xOffset; x <= windowDimensions.width; x += GRID_SIZE) {
        verticalLines.push(
            <div key={`v-${x}`} className="grid-line vertical" style={{ left: x }} />
        );
    }

    const yOffset = scroll.y % GRID_SIZE;
    for (let y = yOffset; y <= windowDimensions.height; y += GRID_SIZE) {
        horizontalLines.push(
            <div key={`h-${y}`} className="grid-line horizontal" style={{ top: y }} />
        );
    }

    const outOfBounds = [];
    const { width, height } = windowDimensions;
    const border = GRID_SIZE * (GRID_BOUNDS + 1);

    // Right overlay
    let value = width - border - scroll.x;
    if (value > 0) {
        outOfBounds.push(
            <div className="out-of-bounds" style={{ right: 0, height, width: value }} />
        )
    };

    // Left overlay
    value = -border + GRID_SIZE + scroll.x;
    if (value > 0) {
        outOfBounds.push(
            <div className="out-of-bounds" style={{ left: 0, height, width: value }} />
        )
    };

    // Top overlay
    value = -border + GRID_SIZE + scroll.y;
    if (value > 0) {
        outOfBounds.push(
            <div className="out-of-bounds" style={{ top: 0, height: value, width }} />
        )
    };

    // Bottom overlay
    value = height - border - scroll.y;
    if (value > 0) {
        outOfBounds.push(
            <div className="out-of-bounds" style={{ bottom: 0, height: value, width }} />
        )
    };


    return (
        <div
            className={`board ${isSpacePressed ? 'moving' : ''}`}
            onMouseDown={handlePressStart}
            onTouchStart={handlePressStart}
        >
            {verticalLines}
            {horizontalLines}
            {outOfBounds}
            {<DragBounds
                isDragging={isMouseDown && !isSpacePressed}
                startPosition={startPosition}
                currentPosition={currentPosition}
            />}
        </div>
    )
}