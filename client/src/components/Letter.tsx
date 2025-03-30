import { GRID_SIZE } from "../constants/Constants";
import { useState } from "react";
import { animate, motion } from "framer-motion";

export default function Letter({ value }: { value: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const snapToGrid = (value: number) => {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    };

    const startDrag = () => {
        setIsDragging(true);
        console.log('dragging');
    };

    const stopDrag = () => {
        setIsDragging(false);
        console.log('not dragging');
    };
    
    return (
        <motion.div
            className="letter"
            style={{ 
                width: GRID_SIZE, 
                height: GRID_SIZE,
                transform: `translate(${position.x}px, ${position.y}px)`
            }}
            onMouseDown={startDrag}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onMouseMove={(e) => {
                if (isDragging) {
                    setPosition(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
                }
            }}
            animate={{
            }}
        >
            {value}
        </motion.div>
    );
}