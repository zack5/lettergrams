export interface LetterRuntime {
    id: string;
    row: number;
    col: number;
    letter: string;
    positionWhileDragging: { x: number; y: number };
}