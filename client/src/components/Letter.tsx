import { GRID_SIZE } from "../constants/Constants";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { ContextNavigation } from "../contexts/ContextNavigation";

export default function Letter({ id, value }: { id: string, value: string }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const { registerDraggedLetter, currentDraggedId } = useContext(ContextNavigation);

    const isDragging = currentDraggedId === id;

    const snapToGrid = (value: number) => {
        return Math.round(value / GRID_SIZE) * GRID_SIZE;
    };

    useEffect(() => {
        if (!isDragging) {
            setPosition({ x: snapToGrid(position.x), y: snapToGrid(position.y) });
        }
    }, [isDragging]);
    
    return (
        <motion.div
            className="letter not-selectable"
            style={{ 
                width: GRID_SIZE, 
                height: GRID_SIZE,
            }}
            onMouseDown={() => registerDraggedLetter(id, (e) => {
                setPosition(prev => ({ 
                    x: prev.x + e.movementX, 
                    y: prev.y + e.movementY 
                }));
            })}
            animate={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            transition={{ type: "spring", duration: isDragging ? 0 : 0.4 }}
        >
            {value}
        </motion.div>
    );
}