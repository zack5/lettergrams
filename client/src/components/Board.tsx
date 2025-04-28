import { useContext, useEffect, useState } from 'react';

import DragBounds from './DragBounds';

import { ContextNavigation } from '../contexts/ContextNavigation';

import { GRID_SIZE } from '../constants/Constants';

export default function Board() {
    const { windowDimensions } = useContext(ContextNavigation);

    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: -1, y: -1 });
    const [currentPosition, setCurrentPosition] = useState({ x: -1, y: -1 });

    useEffect(() => {
        const handleGlobalEnd = () => {
            setIsDragging(false);
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

    useEffect(() => {
        const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
            e.preventDefault();
            console.log(e);
            if (isDragging) {
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
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('touchmove', handleGlobalMove);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
        };
    }, [isDragging]);

    const handlePressStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
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

        setIsDragging(true);
        setStartPosition({ x: clientX, y: clientY });
        setCurrentPosition({ x: clientX, y: clientY });
    }

    const verticalLines = [];
    const horizontalLines = [];

    for (let x = GRID_SIZE; x <= windowDimensions.width; x += GRID_SIZE) {
        verticalLines.push(
            <div key={`v-${x}`} className="grid-line vertical" style={{ left: x }} />
        );
    }

    for (let y = GRID_SIZE; y <= windowDimensions.height; y += GRID_SIZE) {
        horizontalLines.push(
            <div key={`h-${y}`} className="grid-line horizontal" style={{ top: y }} />
        );
    }

    return (
        <div
            className="board"
            onMouseDown={handlePressStart}
            onTouchStart={handlePressStart}
        >
            {verticalLines}
            {horizontalLines}
            {<DragBounds
                isDragging={isDragging}
                startPosition={startPosition}
                currentPosition={currentPosition}
            />}
        </div>
    )
}