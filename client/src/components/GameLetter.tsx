import { useContext } from "react";

import Letter from "../components/Letter";

import { GRID_SIZE } from "../constants/Constants";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { getPositionFromCoords } from "../utils/Utils";
import { initial } from "lodash";

export default function GameLetter({ id }: { id: string }) {
    const { isDraggingLetters, setIsDraggingLetters, letterRuntimes, selectedLetterIds, setSelectedLetterIds } = useContext(ContextNavigation);
    
    const runtime = letterRuntimes.find((letter) => letter.id === id);
    const letter = runtime?.letter || '';
    const positionWhileDragging = runtime?.positionWhileDragging || { x: 0, y: 0 };
    const positionFromCoordinates = getPositionFromCoords(runtime?.row || 0, runtime?.col || 0);
    const isSelected = selectedLetterIds.includes(id);

    return (
        <Letter
            letter={letter}
            extraClasses={`interactive ${isSelected ? 'selected' : ''}`}
            props={{
                style: {
                    width: GRID_SIZE, 
                    height: GRID_SIZE,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                },
                onMouseDown: () => {
                    setSelectedLetterIds(prev => isSelected ? prev : [id]);
                    setIsDraggingLetters(true);
                },
                animate: (isDraggingLetters && isSelected 
                    ? { transform: `translate(${positionWhileDragging.x}px, ${positionWhileDragging.y}px)` }
                    : { transform: `translate(${positionFromCoordinates.x}px, ${positionFromCoordinates.y}px)` }
                ),
                transition: { type: "spring", duration: isDraggingLetters ? 0 : 0.4 }
            }}
        />
    );
}