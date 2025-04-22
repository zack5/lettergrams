import { GRID_SIZE } from "../constants/Constants";

export const getPositionFromCoords = (row: number, col: number) => {
    return {
        x: col * GRID_SIZE,
        y: row * GRID_SIZE,
    };
};