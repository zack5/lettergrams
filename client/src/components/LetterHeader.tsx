import { GRID_SIZE } from "../constants/Constants";
import Letter from "./Letter";

export default function LetterHeader({ text }: { text: string }) {
    const backgroundWidth = Math.max(text.length, 12) * GRID_SIZE
    const backgroundSize = `${backgroundWidth}px ${GRID_SIZE * 2}px`
    const elems = text.toUpperCase().split('').map((letter, index) => {
        const backgroundPosition = `-${GRID_SIZE * index}px 0px`
        return (
            <Letter
                key={index}
                letter={letter}
                props={{
                    style: {
                        width: GRID_SIZE,
                        height: GRID_SIZE,
                        backgroundPosition,
                        backgroundSize,
                    }
                }}
            />
        );
    });
    return <div className="letter-header">{elems}</div>;
}