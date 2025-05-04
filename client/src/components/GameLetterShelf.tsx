import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { GRID_SIZE, SHELF_BOTTOM_OFFSET, SHELF_PADDING } from "../constants/Constants";

import { getShelvedLetterCount } from "../utils/Utils";

export default function GameLetterShelf({ children }: { children?: ReactNode }) {
    const { letterRuntimes, setIsHoveringShelf } = useContext(ContextNavigation);

    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const elements = document.elementsFromPoint(e.clientX, e.clientY);
            const isUnderMouse = elements.includes(widgetRef.current as Element);
            setIsHoveringShelf(isUnderMouse);
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
                width: getShelvedLetterCount(letterRuntimes) * GRID_SIZE,
            }}
        >
            {children}
        </motion.div>
    )
}