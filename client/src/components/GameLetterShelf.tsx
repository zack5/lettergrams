import { ReactNode, useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import ShelfDragIndicator from "./ShelfDragIndicator";

import { ContextGame } from "../contexts/ContextGame";

import { GRID_SIZE, SHELF_BOTTOM_OFFSET, SHELF_PADDING, SHELF_MIN_TILE_COUNT_FOR_WIDTH } from "../constants/Constants";

import { getShelvedLetterCount } from "../utils/Utils";

export default function GameLetterShelf({ children }: { children?: ReactNode }) {
    const { letterRuntimes, hoveredShelfSlot, setHoveredShelfSlot, windowDimensions, isDraggingLetters } = useContext(ContextGame);

    const widgetRef = useRef<HTMLDivElement>(null);

    const shelvedLetterCount = getShelvedLetterCount(letterRuntimes);
    const width = shelvedLetterCount * GRID_SIZE;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            const isUnderMouse = elements.includes(widgetRef.current as Element);

            if (!isUnderMouse) {
                setHoveredShelfSlot(null);
                return;
            }

            const diffX = e.clientX - windowDimensions.width / 2;
            const shelfSlot = Math.round(diffX / GRID_SIZE + shelvedLetterCount / 2);
            const clamped = Math.max(0, Math.min(shelvedLetterCount, shelfSlot));
            setHoveredShelfSlot(clamped);
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [windowDimensions, shelvedLetterCount]);

    return (
        <motion.div
            ref={widgetRef}
            className="game-letter-shelf in-game-text-container"
            style={{
                padding: SHELF_PADDING,
                minWidth: GRID_SIZE * SHELF_MIN_TILE_COUNT_FOR_WIDTH,
                height: GRID_SIZE,
                bottom: `${SHELF_BOTTOM_OFFSET}px`,
            }}
            animate={{
                width,
            }}
        >
            {children}
            {hoveredShelfSlot !== null && isDraggingLetters && <ShelfDragIndicator hoveredShelfSlot={hoveredShelfSlot} shelvedLetterCount={shelvedLetterCount} />}
        </motion.div>
    )
}