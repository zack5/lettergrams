import { useEffect, useState } from 'react';

import DragBounds from './DragBounds';

export default function Board() {
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
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

    console.log(currentPosition)
    
    return (
        <div
            className="board"
            onMouseDown={(e) => {
                setIsDragging(true);
                setStartPosition({ x: e.clientX, y: e.clientY });
                setCurrentPosition({ x: e.clientX, y: e.clientY });
            }}
        >
            {isDragging && <DragBounds
                startPosition={startPosition}
                currentPosition={currentPosition}
            />}
        </div>
    )
}