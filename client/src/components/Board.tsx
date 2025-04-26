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
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            setStartPosition({ x: -1, y: -1 });
            setCurrentPosition({ x: -1, y: -1 });
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setCurrentPosition({ x: e.clientX, y: e.clientY });
            }
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [isDragging]);

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
            onMouseDown={(e) => {
                setIsDragging(true);
                setStartPosition({ x: e.clientX, y: e.clientY });
                setCurrentPosition({ x: e.clientX, y: e.clientY });
            }}
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