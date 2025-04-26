import { useEffect, useContext } from "react";

import { useMotionValue, useSpring, useTransform } from "framer-motion";

import Letter from "../components/Letter";

import { GRID_SIZE } from "../constants/Constants";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { getPositionFromCoords } from "../utils/Utils";

export default function GameLetter({ id }: { id: string }) {
    const { isDraggingLetters, setIsDraggingLetters, letterRuntimes, selectedLetterIds, setSelectedLetterIds } = useContext(ContextNavigation);

    const runtime = letterRuntimes.find((letter) => letter.id === id);
    const letter = runtime?.letter || '';
    const isSelected = selectedLetterIds.includes(id);
    const position = isDraggingLetters && isSelected
        ? runtime?.positionWhileDragging || { x: 0, y: 0 }
        : getPositionFromCoords(runtime?.row || 0, runtime?.col || 0);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);

    const springProperties = {
        stiffness: 300,
        damping: 30,
    }
    const smoothX = useSpring(rawX, springProperties);
    const smoothY = useSpring(rawY, springProperties);

    const x = isDraggingLetters && isSelected ? rawX : smoothX;
    const y = isDraggingLetters && isSelected ? rawY : smoothY;

    const backgroundPosition = useTransform([x, y], ([latestX, latestY]) => {
        return `-${latestX}px -${latestY}px`;
    });

    useEffect(() => {
        rawX.set(position.x);
        rawY.set(position.y);
    }, [position.x, position.y]);

    return (
        <Letter
            letter={letter}
            extraClasses={`interactive ${isSelected ? 'selected' : ''}`}
            props={{
                style: {
                    x,
                    y,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundPosition,
                    backgroundSize: '100vw 100vh',
                },
                onMouseDown: () => {
                    setSelectedLetterIds(prev => isSelected ? prev : [id]);
                    setIsDraggingLetters(true);
                },
            }}
        />
    );
}