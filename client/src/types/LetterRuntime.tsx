export interface LetterRuntime {
    id: string;
    letter: string;
    isShelved: boolean;
    row: number;
    col: number;
    positionWhileDragging: { x: number; y: number };
}