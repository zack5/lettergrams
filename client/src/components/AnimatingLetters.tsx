import { useEffect, useState } from "react";
import AnimatingLetter from "../components/AnimatingLetter";
import { ANIMATIONS, LETTER_SIZE, WIDTH, HEIGHT, DELAY } from "../constants/AnimatingLetterConstants";

export default function AnimatingLetters() {
    const [frame, setFrame] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => (prev + 1) % ANIMATIONS.length);
        }, DELAY);
        return () => clearInterval(interval);
    }, []);

    const backgroundSize = {
        width: WIDTH * LETTER_SIZE,
        height: HEIGHT * LETTER_SIZE,
    }

    const offset = ANIMATIONS[frame].offset || { x: 0, y: 0 };
    const letterElements = ANIMATIONS[frame].letters
        .map((letterData, index) => {
            return (
                <AnimatingLetter
                    index={index}
                    letterData={letterData}
                    offset={offset}
                    key={letterData.key}
                />
            )
        });

    return (
        <>
            <div className="animating-letters" style={{ position: 'relative', width: backgroundSize.width, height: backgroundSize.height }}>
                {letterElements}
            </div>
        </>
    );
}