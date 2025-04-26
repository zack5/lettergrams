export const LETTER_SIZE = 45;
export const WIDTH = 11;
export const HEIGHT = 5
export const DELAY = 4 * 1000;

export const ANIMATIONS = [
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