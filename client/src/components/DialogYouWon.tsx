import { useContext, useEffect, useRef, useState } from "react";
import { IoMdShare } from "react-icons/io";

import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { ContextGame } from "../contexts/ContextGame";

import { DialogBox } from "../types/DialogBox"
import DialogCloseButton from "./DialogCloseButton";

const congratsEmojis = ["🎉", "🌟", "🥳", "🙌", "🎊"];
const congratsText = [
    "Nice one!",
    "Nailed it!",
    "Great solve!",
    "Outstanding move!",
    "Legendary!",
]

export default function DialogYouWon() {
    const { letterRuntimes, dialogBox, setDialogBox } = useContext(ContextGame);
    const [hasCopied, setHasCopied] = useState(false);
    const isOpen = dialogBox === DialogBox.YouWon;

    const descriptionRef = useRef(
        congratsText[Math.floor(Math.random() * congratsText.length)] + " " +
        congratsEmojis[Math.floor(Math.random() * congratsEmojis.length)]
    );
    const description = descriptionRef.current;

    useEffect(() => {
        setHasCopied(false);
    }, [isOpen])

    const handleClose = () => {
        setDialogBox(null);
    }

    const generateEmojiGrid = () => {
        const result: string[] = [];

        const placedLetters = letterRuntimes.filter(letter => !letter.isShelved);
        
        // Find the min/max boundaries
        let minRow = Infinity;
        let maxRow = -Infinity;
        let minCol = Infinity;
        let maxCol = -Infinity;
        placedLetters.forEach(letter => {
            minRow = Math.min(minRow, letter.row);
            maxRow = Math.max(maxRow, letter.row);
            minCol = Math.min(minCol, letter.col);
            maxCol = Math.max(maxCol, letter.col);
        });

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        result.push(`Lettergrams ${formattedDate}`);
        
        // Generate the emoji grid
        for (let row = minRow; row <= maxRow; row++) {
            let rowString = "";
            for (let col = minCol; col <= maxCol; col++) {
                const letterAtPosition = placedLetters.find(
                    letter => letter.row === row && letter.col === col
                );
                
                rowString += letterAtPosition ? "🟧" : "⬜";
            }
            result.push(rowString);
        }

        return result.join("\n");
    }

    const emojiGrid = generateEmojiGrid();

    const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigator.clipboard.writeText(emojiGrid)
            .then(() => {
                setHasCopied(true)
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="dialog-container"
        >
            <div className="dialog-backdrop">
                <DialogPanel className="dialog-panel">
                    <DialogCloseButton handleClose={handleClose} />
                    <DialogTitle className="dialog-title">Congratulations!</DialogTitle>
                    <Description className="dialog-description">
                        {description}
                    </Description>
                    <pre className="emoji-grid">
                        {emojiGrid}
                    </pre>
                    <div className="dialog-actions">
                        <button onClick={handleCopy}>
                            <span className="inline-icon-text">
                                {hasCopied ? "Copied!" : <>Share <IoMdShare /></>}
                            </span>
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}