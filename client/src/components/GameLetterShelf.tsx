import { ReactNode, useContext } from "react";
import { motion } from "framer-motion";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { GRID_SIZE, SHELF_BOTTOM_OFFSET, SHELF_PADDING } from "../constants/Constants";

import { getShelvedLetterCount } from "../utils/Utils";

export default function GameLetterShelf({ children }: { children?: ReactNode }) {
    const { letterRuntimes } = useContext(ContextNavigation);

    return (
        <motion.div
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