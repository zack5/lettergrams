import { useEffect, useState } from "react";
import { LetterRuntime } from "../types/LetterRuntime";
import { Coordinate } from "../types/Vector2";
import { FoundWord } from "../types/FoundWord";

export const useWordValidator = (
    isDraggingLetters: boolean,
    letterRuntimes: LetterRuntime[],
    selectedLetterIds: string[],
    setValidWords: (validWords: Set<FoundWord>) => void,
    setInWinningBoardState: (inWinningBoardState: boolean) => void) => {

    const [dictionary, setDictionary] = useState<Set<string>>(new Set());

    const fetchDictionary = async () => {
        try {
            const response = await fetch('/enable1.txt');
            if (!response.ok) {
                throw new Error('Failed to fetch dictionary');
            }
            const text = await response.text();
            const words = text.split('\n').filter(word => word.trim().length > 0);
            setDictionary(new Set(words));
        } catch (error) {
            console.error('Error loading dictionary:', error);
        }
    };

    interface ValidWordResult {
        validWords: Set<FoundWord>;
        hasWon: boolean;
    }

    const getValidWordLetterIds = (letterRuntimes: LetterRuntime[], selectedLetterIds: string[], isDraggingLetters: boolean, dictionary: Set<string>): ValidWordResult => {
        interface LetterAndId {
            letter: string;
            id: string;
        }

        // Construct lookup table of letters at positions
        let allLettersOnBoard = true;
        const lettersAtPositions = new Map<string, LetterAndId>();
        for (let i = 0; i < letterRuntimes.length; i++) {
            const letterRuntime = letterRuntimes[i];
            if (!letterRuntime.isShelved && !letterRuntime.startedDragFromShelf && !(isDraggingLetters && selectedLetterIds.includes(letterRuntime.id))) {
                const key = `${letterRuntime.row},${letterRuntime.col}`;
                lettersAtPositions.set(key, { letter: letterRuntime.letter, id: letterRuntime.id });
            } else {
                allLettersOnBoard = false;
            }
        }

        // Get word from position in direction
        const getWord = (position: Coordinate, horizontal: boolean): string => {
            const word = [];
            let i = 0;
            while (true) {
                const key = `${position.row + (horizontal ? 0 : i)},${position.col + (horizontal ? i : 0)}`;
                const letter = lettersAtPositions.get(key);
                if (letter === undefined) {
                    break;
                }
                word.push(letter.letter);
                i++;
            }
            return word.join('').toLowerCase();
        }

        const validWords: Set<FoundWord> = new Set();
        let allWordsValid = true;
        for (const [key, _] of lettersAtPositions.entries()) {
            const [row, col] = key.split(',').map(Number);
            const position = { row, col };

            const getPositionKey = (row: number, col: number): string => `${row},${col}`;

            const leftLetter = lettersAtPositions.get(getPositionKey(row, col - 1));
            const rightLetter = lettersAtPositions.get(getPositionKey(row, col + 1));
            const upLetter = lettersAtPositions.get(getPositionKey(row - 1, col));
            const downLetter = lettersAtPositions.get(getPositionKey(row + 1, col));

            if (!leftLetter && !rightLetter && !upLetter && !downLetter) {
                allWordsValid = false;
                continue;
            }

            const startsHorizontal = leftLetter === undefined
                && rightLetter !== undefined;
            const startsVertical = upLetter === undefined
                && downLetter !== undefined;


            if (startsHorizontal) {
                const word = getWord(position, true);
                if (word.length > 2 && dictionary.has(word)) {
                    validWords.add({
                        startRow: row,
                        startCol: col,
                        horizontal: true,
                        length: word.length,
                        word: word
                    });
                } else if (word.length > 1) {
                    allWordsValid = false;
                }
            }

            if (startsVertical) {
                const word = getWord(position, false);
                if (word.length > 2 && dictionary.has(word)) {
                    validWords.add({
                        startRow: row,
                        startCol: col,
                        horizontal: false,
                        length: word.length,
                        word: word
                    });
                } else if (word.length > 1) {
                    allWordsValid = false;
                }
            }
        }

        const hasWon = allLettersOnBoard && allWordsValid && validWords.size > 0;

        return { validWords, hasWon };
    };

    useEffect(() => {
        fetchDictionary();
    }, []);

    useEffect(() => {
        if (!dictionary) {
            setValidWords(new Set());
            return;
        }

        const { validWords, hasWon } = getValidWordLetterIds(letterRuntimes, selectedLetterIds, isDraggingLetters, dictionary);
        setValidWords(validWords);
        setInWinningBoardState(hasWon);
    }, [dictionary, letterRuntimes, isDraggingLetters, selectedLetterIds]);
}; 