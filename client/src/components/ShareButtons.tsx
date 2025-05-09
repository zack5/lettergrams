import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { Checkbox, Field, Input, Label } from '@headlessui/react'

import { ContextGame } from "../contexts/ContextGame";

const CurrentlyCopied = {
    URL: "URL",
    EmojiGrid: "EmojiGrid",
} as const;
type CurrentlyCopied = (typeof CurrentlyCopied)[keyof typeof CurrentlyCopied] | null;

export default function ShareButtons({ isDailyGame }: { isDailyGame: boolean }) {
    const { letterRuntimes, inWinningBoardState } = useContext(ContextGame);
    const [sharePositions, setSharePositions] = useState(false);
    const [currentlyCopied, setCurrentlyCopied] = useState<CurrentlyCopied>(null);
    const urlInputRef = useRef<HTMLInputElement | null>(null);
    const location = useLocation();

    let query = "";
    if (sharePositions) {
        query = "?setup=" + letterRuntimes.map(runtime => runtime.isShelved ? '' : `${runtime.row},${runtime.col}`).join('+')
    }

    const currentUrl = window.location.origin + location.pathname + query;

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
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        result.push(`LetterGrams\n${formattedDate}`);

        // Generate the emoji grid
        for (let row = minRow; row <= maxRow; row++) {
            let rowString = "";
            for (let col = minCol; col <= maxCol; col++) {
                const letterAtPosition = placedLetters.find(
                    letter => letter.row === row && letter.col === col
                );

                rowString += letterAtPosition ? "🟩" : "⬜";
            }
            result.push(rowString);
        }

        return result.join("\n");
    }

    const emojiGrid = generateEmojiGrid();

    const handleCopyEmojiGrid = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigator.clipboard.writeText(emojiGrid)
            .then(() => {
                setCurrentlyCopied(CurrentlyCopied.EmojiGrid)
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    }

    const handleCopyUrl = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (urlInputRef.current) {
            navigator.clipboard.writeText(urlInputRef.current.value)
                .then(() => {
                    setCurrentlyCopied(CurrentlyCopied.URL)
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                });
        }
    }


    useEffect(() => {
        setCurrentlyCopied(null);
    }, [inWinningBoardState, currentUrl])

    return (
        <>
            {inWinningBoardState && isDailyGame && <>
                <form className="share-form">
                    <Field className="field-horizontal">
                        <Label className="visually-hidden">URL:</Label>
                        <pre className="emoji-grid share-content">
                            {emojiGrid}
                        </pre>
                        <div className="dialog-actions">
                            <button className="copy-button" onClick={handleCopyEmojiGrid}>
                                {currentlyCopied === CurrentlyCopied.EmojiGrid ? "Copied!" : <>Copy Results</>}
                            </button>
                        </div>
                    </Field>
                </form>
                <hr className="divider" />
            </>}

            <form className="share-form">
                <Field className="field-horizontal">
                    <Label className="visually-hidden">URL:</Label>
                    <Input
                        className="custom-input share-content"
                        ref={urlInputRef}
                        type="text"
                        name="sharable url"
                        placeholder="Sharable URL"
                        value={currentUrl}
                        required
                        aria-required="true"
                        readOnly
                    />
                    <button
                        className={`copy-button ${currentlyCopied === CurrentlyCopied.URL ? 'copied' : ''}`}
                        onClick={handleCopyUrl}
                    >
                        {`${currentlyCopied === CurrentlyCopied.URL ? "Copied!" : "Copy Link"}`}
                    </button>
                </Field>

                <Field className="field-horizontal">
                    <Checkbox
                        checked={true}
                        onChange={() => setSharePositions(prev => !prev)}
                        className={`checkbox-container ${sharePositions && 'checked'}`}
                    >
                        {/* Checkmark icon */}
                        <svg className={`checkbox-icon ${sharePositions && 'checked'}`} viewBox="0 2 14 14" fill="none">
                            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Checkbox>
                    <Label>Share letter positions</Label>
                </Field>
            </form>
        </>
    )
}