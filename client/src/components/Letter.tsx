import { motion } from "framer-motion";

import { GRID_SIZE } from "../constants/Constants";

interface LetterProps {
    letter: string;
    extraClasses?: string;
    props?: any;
}

export default function Letter({ letter, extraClasses, props }: LetterProps) {
    return (
        <>
            <motion.div
                className={`letter not-selectable ${extraClasses}`}
                style={{
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                }}
                {...props}
            >
                {letter}
            </motion.div>
        </>
    );
}
