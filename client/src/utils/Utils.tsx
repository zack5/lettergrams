import { GRID_SIZE, SHELF_BOTTOM_OFFSET, SHELF_PADDING, DICE } from "../constants/Constants";
import { LetterRuntime } from "../types/LetterRuntime";
import { Coordinate, Position, Size } from "../types/Vector2";

export const getCoordsFromPosition = (
    position: { x: number, y: number }
): Coordinate => {
    return {
        row: Math.round(position.y / GRID_SIZE),
        col: Math.round(position.x / GRID_SIZE),
    }
};

export const getPositionFromCoords = (
    rowOrPos: number | Coordinate,
    col?: number
): Position => {
    if (typeof rowOrPos === 'object') {
        return {
            x: rowOrPos.col * GRID_SIZE,
            y: rowOrPos.row * GRID_SIZE,
        };
    } else if (typeof rowOrPos === 'number' && typeof col === 'number') {
        return {
            x: col * GRID_SIZE,
            y: rowOrPos * GRID_SIZE,
        };
    } else {
        throw new Error('Invalid arguments passed to getPositionFromCoords');
    }
};

export const getScreenPositionFromShelf = (
    col: number,
    windowDimensions: Size,
    shelvedCount: number,
): Position => {
    const x = windowDimensions.width/2 -(shelvedCount / 2 - col) * GRID_SIZE;
    const y = windowDimensions.height - GRID_SIZE - SHELF_BOTTOM_OFFSET - SHELF_PADDING;
    return { x, y }
}

export const getShelvedLetterCount = (letterRuntimes: LetterRuntime[]): number => {
    let result = 0;
    for (let i = 0; i < letterRuntimes.length; i++) {
        if (letterRuntimes[i].isShelved || letterRuntimes[i].startedDragFromShelf) {
            result++;
        }
    }
    return result;
}

export const getRandomLetters = (): string => {
    let result = '';
    for (let i = 0; i < DICE.length; i++) {
        const dieLetters = DICE[i];
        const randomIndex = Math.floor(Math.random() * dieLetters.length);
        result += dieLetters[randomIndex];
    }
    // Randomize the order of the letters before returning
    return result.split('').sort(() => Math.random()).join('');
}

export const getDailyLetters = (): string => {
    const dailyOptions = [
        'Daily',
    ]
    
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    return dailyOptions[daysSinceEpoch % dailyOptions.length];
}