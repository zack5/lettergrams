import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { GRID_SIZE, SHELF_BOTTOM_OFFSET, SHELF_PADDING } from "../constants/Constants";

import { getShelvedLetterCount } from "../utils/Utils";

export default function GameLetterShelf({ children }: { children?: ReactNode }) {
    const { letterRuntimes, setHoveredShelfSlot, windowDimensions } = useContext(ContextNavigation);

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
            const clamped = Math.max(0, Math.min(shelvedLetterCount - 1, shelfSlot));
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
                minWidth: GRID_SIZE * 5,
                height: GRID_SIZE,
                bottom: `${SHELF_BOTTOM_OFFSET}px`,
            }}
            animate={{
                width,
            }}
        >
            {children}
        </motion.div>
    )
}