export const DialogBox = {
    ExitGame: "ExitGame",
    ShareGame: "ShareGame",
} as const;

export type DialogBox = (typeof DialogBox)[keyof typeof DialogBox] | null;
