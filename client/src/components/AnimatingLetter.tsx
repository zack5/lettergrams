import { useEffect } from "react";

import { useMotionValue, useSpring, useTransform } from "framer-motion";

import { LETTER_SIZE, WIDTH, HEIGHT } from "../constants/AnimatingLetterConstants";

import Letter from "../components/Letter";

import { AnimatingLetterData } from "../types/LetterData";

export default function AnimatingLetter({ index, letterData, offset } : {
    index: number,
    letterData: AnimatingLetterData,
    offset: { x: number, y: number },
}) {
    // Add LETTER_SIZE border to account for spring animation going beyond the bounds
    const backgroundSize = {
        width: (WIDTH + 2) * LETTER_SIZE,
        height: (HEIGHT + 2) * LETTER_SIZE,
    }

    const position = {
        x: (letterData.x + offset.x) * LETTER_SIZE,
        y: -1 * (letterData.y + offset.y - Math.floor(HEIGHT / 2)) * LETTER_SIZE,
    }

    const rawX = useMotionValue(position.x);
    const rawY = useMotionValue(position.y);

    useEffect(() => {
        const timeout = setTimeout(() => {
            rawX.set(position.x);
            rawY.set(position.y);
        }, index * 100);
    
        return () => clearTimeout(timeout);
    }, [position.x, position.y]);

    const springProperties = {
        stiffness: 200,
        damping: 20,
    };
    const x = useSpring(rawX, springProperties);
    const y = useSpring(rawY, springProperties);

    const backgroundPosition = useTransform([x, y], ([latestX, latestY]) => {
        return `-${(latestX as number) + LETTER_SIZE}px -${(latestY as number) + LETTER_SIZE}px`;
    });

    return (
        <Letter
            key={letterData.key}
            letter={letterData.key[0]}
            props={{
                style: {
                    x,
                    y,
                    width: LETTER_SIZE,
                    height: LETTER_SIZE,
                    position: 'absolute',
                    fontSize: '1.75rem',
                    top: 0,
                    left: 0,
                    backgroundSize: `${backgroundSize.width}px ${backgroundSize.height}px`,
                    backgroundPosition,
                },
            }}
        />
    )
};