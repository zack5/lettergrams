import { useEffect, useState } from "react";
import Letter from "../components/Letter";
import { del } from "motion/react-client";

export default function GameLetter() {
    const LETTER_SIZE = 45;
    const WIDTH = 11;
    const HEIGHT = 5
    const DELAY = 4 * 1000;

    const ANIMATIONS = [
        {
            // Lettergrams reverse
            offset: {x: 0, y: 0},
            letters: [
                { key: 'S1', x: 10, y: 0 },
                { key: 'M1', x: 9, y: 0 },
                { key: 'A1', x: 8, y: 0 },
                { key: 'R2', x: 7, y: 0 },
                { key: 'G1', x: 6, y: 0 },
                { key: 'R1', x: 5, y: 0 },
                { key: 'E2', x: 4, y: 0 },
                { key: 'T2', x: 3, y: 0 },
                { key: 'T1', x: 2, y: 0 },
                { key: 'E1', x: 1, y: 0 },
                { key: 'L1', x: 0, y: 0 },
            ]
        },
        {
            // Pattern 1
            offset: {x: 2.5, y: 0},
            letters: [
                { key: 'S1', x: 3, y: 1 },
                { key: 'M1', x: 1, y: -1 },
                { key: 'A1', x: 3, y: -1 },
                { key: 'R2', x: 3, y: -2 },
                { key: 'G1', x: 1, y: 1 },
                { key: 'R1', x: 5, y: 0 },
                { key: 'E2', x: 4, y: 0 },
                { key: 'T2', x: 3, y: 0 },
                { key: 'T1', x: 2, y: 0 },
                { key: 'E1', x: 1, y: 0 },
                { key: 'L1', x: 0, y: 0 },
            ]
        },
        {
            // Lettergrams
            offset: {x: 0, y: 0},
            letters: [
                { key: 'L1', x: 0, y: 0 },
                { key: 'E1', x: 1, y: 0 },
                { key: 'T1', x: 2, y: 0 },
                { key: 'T2', x: 3, y: 0 },
                { key: 'E2', x: 4, y: 0 },
                { key: 'R1', x: 5, y: 0 },
                { key: 'G1', x: 6, y: 0 },
                { key: 'R2', x: 7, y: 0 },
                { key: 'A1', x: 8, y: 0 },
                { key: 'M1', x: 9, y: 0 },
                { key: 'S1', x: 10, y: 0 },
            ]
        },
        {
            // Pattern 2
            offset: {x: 3, y: 0},
            letters: [
                { key: 'L1', x: 2, y: 1 },
                { key: 'E1', x: 2, y: -2 },
                { key: 'T1', x: 2, y: -1 },
                { key: 'T2', x: 4, y: -1 },
                { key: 'E2', x: 4, y: 1 },
                { key: 'R1', x: 4, y: 2 },
                { key: 'G1', x: 0, y: 0 },
                { key: 'R2', x: 1, y: 0 },
                { key: 'A1', x: 2, y: 0 },
                { key: 'M1', x: 3, y: 0 },
                { key: 'S1', x: 4, y: 0 },
            ]
        },
    ]

    const [frame, setFrame] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => (prev + 1) % ANIMATIONS.length);
        }, DELAY);
        return () => clearInterval(interval);
    }, []);

    const letterElements = ANIMATIONS[frame].letters
        .map((letterData, i) => {
            const offset = ANIMATIONS[frame].offset;
            const transform = `translate(${(letterData.x + offset.x) * LETTER_SIZE}px, ${-1 * (letterData.y + offset.y - Math.floor(HEIGHT/2)) * LETTER_SIZE}px)`;
            return (
                <Letter 
                    key={letterData.key}
                    letter={letterData.key[0]}
                    props={{
                        style: {
                            width: LETTER_SIZE,
                            height: LETTER_SIZE,
                            position: 'absolute',
                            fontSize: '1.75rem',
                            top: 0,
                            left: 0,
                        },
                        initial: { transform },
                        animate: { transform },
                        transition: {
                            type: "spring",
                            duration: 0.8,
                            delay: i * 0.1,
                        }
                    }}
                />
            )
        });

    return (
        <>
            <div className="animating-letters" style={{ position: 'relative', width: LETTER_SIZE * WIDTH, height: LETTER_SIZE * HEIGHT }}>
                {letterElements}
            </div>
        </>
    );
}