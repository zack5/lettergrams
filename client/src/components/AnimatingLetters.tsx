import { useEffect, useState } from "react";
import AnimatingLetter from "../components/AnimatingLetter";
import { ANIMATIONS, LETTER_SIZE, WIDTH, HEIGHT, DELAY } from "../constants/AnimatingLetterConstants";

export default function AnimatingLetters() {
    const [frame, setFrame] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => (prev + 1) % ANIMATIONS.length);
        }, DELAY);
        
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const backgroundSize = {
        width: WIDTH * LETTER_SIZE,
        height: HEIGHT * LETTER_SIZE,
    }

    const scale = Math.min((windowWidth - 48) / backgroundSize.width, 1);

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
            <div className="animating-letters" style={{ 
                position: 'relative', 
                width: backgroundSize.width, 
                height: backgroundSize.height,
                transform: `scale(${scale})`,
                transformOrigin: 'center center'
            }}>
                {letterElements}
            </div>
        </>
    );
}