import { GRID_SIZE } from "../constants/Constants";

export default function GameLetterShelf() {
    const padding = GRID_SIZE / 3;

    return (
        <div 
            className="game-letter-shelf in-game-text-container"
            style={{
                padding,
                minWidth: GRID_SIZE * 5,
                height: GRID_SIZE,

            }}
        >

        </div>
    )
}