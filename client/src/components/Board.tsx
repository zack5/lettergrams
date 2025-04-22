import { useEffect, useState } from 'react';

import DragBounds from './DragBounds';

export default function Board() {
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

    return (
        <div
            className="board"
            onMouseDown={(e) => {
                setIsDragging(true);
                setStartPosition({ x: e.clientX, y: e.clientY });
                setCurrentPosition({ x: e.clientX, y: e.clientY });
            }}
        >
            {<DragBounds
                isDragging={isDragging}
                startPosition={startPosition}
                currentPosition={currentPosition}
            />}
        </div>
    )
}