export const DialogBox = {
    ExitGame: "ExitGame",
    ShareGame: "ShareGame",
    YouWon: "YouWon",
} as const;

export type DialogBox = (typeof DialogBox)[keyof typeof DialogBox] | null;
