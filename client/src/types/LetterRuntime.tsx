export interface LetterRuntime {
    id: string;
    letter: string;
    isShelved: boolean;
    startedDragFromShelf: boolean;
    row: number;
    col: number;
    positionWhileDragging: { x: number; y: number };
}