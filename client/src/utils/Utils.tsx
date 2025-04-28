import { GRID_SIZE } from "../constants/Constants";
import { Coordinate, Position } from "../types/Vector2";

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