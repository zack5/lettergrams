import { useContext } from "react";
import { motion } from "motion/react";

import { ContextGame } from "../contexts/ContextGame";

import { FoundWord } from "../types/FoundWord";

import { getPositionFromCoords } from "../utils/Utils";
import { GRID_SIZE } from "../constants/Constants";

export default function ValidWordIndicator({ wordData }: { wordData: FoundWord }) {
    const { scroll } = useContext(ContextGame);
    const startPosition = getPositionFromCoords(wordData.startRow, wordData.startCol);
    const isHorizontal = wordData.horizontal;
    const width = isHorizontal ? GRID_SIZE * wordData.length : GRID_SIZE;
    const height = isHorizontal ? GRID_SIZE : GRID_SIZE * wordData.length;

    // Initial border width for animation
    const initialBorderWidth = 0;
    const finalBorderWidth = 9;

    // Adjust position to account for border growth
    const top = startPosition.y + scroll.y - initialBorderWidth;
    const left = startPosition.x + scroll.x - initialBorderWidth;

    return (
        <div
            style={{
                position: "absolute",
                top,
                left,
                height,
                width,
            }}
        >
            <motion.div
                className="valid-word-indicator"
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    border: `${initialBorderWidth}px solid transparent`,
                    boxSizing: "content-box",
                    borderRadius: "0px",
                    zIndex: 1,
                    backgroundPosition: `-${left}px -${top}px`,
                    backgroundSize: '100vw 100vh',
                }}
                animate={{
                    top: [initialBorderWidth, -finalBorderWidth],
                    left: [initialBorderWidth, -finalBorderWidth],
                    border: [`${initialBorderWidth}px solid transparent`, `${finalBorderWidth}px solid transparent`],
                    opacity: [0, 1],
                    borderRadius: [0, 12],
                    transition: { duration: 0.1 }
                }}
                exit={{
                    opacity: [1, 0],
                    transition: { duration: 0.1 }
                }}
            />
        </div>
    );
}