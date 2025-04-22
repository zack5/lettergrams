import { GRID_SIZE } from "../constants/Constants";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { ContextNavigation } from "../contexts/ContextNavigation";
import { getPositionFromCoords } from "../utils/Utils";

export default function Letter({ id }: { id: string }) {
    const [positionWhileDragging, setPositionWhileDragging] = useState({ x: 0, y: 0 });
    
    const { registerDraggedLetter, currentDraggedId, letterRuntimes, setLetterRuntimes, selectedLetterIds, setSelectedLetterIds } = useContext(ContextNavigation);
    const runtime = letterRuntimes.find((letter) => letter.id === id);
    const value = runtime?.letter || '';
    
    const isDragging = currentDraggedId === id;
    
    const positionFromCoordinates = getPositionFromCoords(runtime?.row || 0, runtime?.col || 0);

    useEffect(() => {
        if (!isDragging) {
            setLetterRuntimes((prev) => {
                const targetRow = Math.round(positionWhileDragging.y / GRID_SIZE);
                const targetCol = Math.round(positionWhileDragging.x / GRID_SIZE);

                const newLetterRuntimes = [...prev];

                const index = newLetterRuntimes.findIndex((letter) => letter.id === id);
                if (index !== -1) {

                    // Swap with existing letter
                    const existingLetterIndex = prev.findIndex((letter) => letter.row === targetRow && letter.col === targetCol);
                    if (existingLetterIndex !== -1) {
                        newLetterRuntimes[existingLetterIndex] = {
                            ...newLetterRuntimes[existingLetterIndex],
                            row: runtime?.row || 0,
                            col: runtime?.col || 0,
                        };
                    }

                    newLetterRuntimes[index] = {
                        ...newLetterRuntimes[index],
                        row: targetRow,
                        col: targetCol,
                    };
                }
                return newLetterRuntimes;
            });
        }
    }, [isDragging]);

    const isSelected = isDragging || selectedLetterIds.includes(id);

    return (
        <motion.div
            className={`letter not-selectable ${isSelected ? 'selected' : ''}`}
            style={{ 
                width: GRID_SIZE, 
                height: GRID_SIZE,
                position: 'absolute',
                top: 0,
                left: 0,
            }}
            onMouseDown={() => {
                setPositionWhileDragging(positionFromCoordinates);
                if (!isSelected) {
                    setSelectedLetterIds([id]);
                }
                registerDraggedLetter(id, (e) => {
                    setPositionWhileDragging(prev => ({ 
                        x: prev.x + e.movementX, 
                        y: prev.y + e.movementY 
                    }));
                });
            }}
            animate={isDragging 
                ? { transform: `translate(${positionWhileDragging.x}px, ${positionWhileDragging.y}px)` }
                : { transform: `translate(${positionFromCoordinates.x}px, ${positionFromCoordinates.y}px)` }
            }
            transition={{ type: "spring", duration: isDragging ? 0 : 0.4 }}
        >
            {value}
        </motion.div>
    );
}