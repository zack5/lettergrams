import { useEffect, useState } from "react";
import { LetterRuntime } from "../types/LetterRuntime";
import { Coordinate } from "../types/Vector2";
import { FoundWord } from "../types/FoundWord";

export const useWordValidator = (isDraggingLetters: boolean, letterRuntimes: LetterRuntime[], selectedLetterIds: string[], setValidWords: (validWords: Set<FoundWord>) => void) => {
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

    const getValidWordLetterIds = (letterRuntimes: LetterRuntime[], selectedLetterIds: string[], isDraggingLetters: boolean, dictionary: Set<string>): Set<FoundWord> => {
        interface LetterAndId {
            letter: string;
            id: string;
        }
    
        // Construct lookup table of letters at positions
        const lettersAtPositions = new Map<string, LetterAndId>();
        for (let i = 0; i < letterRuntimes.length; i++) {
            const letterRuntime = letterRuntimes[i];
            if (!letterRuntime.isShelved && !letterRuntime.startedDragFromShelf && !(isDraggingLetters && selectedLetterIds.includes(letterRuntime.id))) {
                const key = `${letterRuntime.row},${letterRuntime.col}`;
                lettersAtPositions.set(key, {letter: letterRuntime.letter, id: letterRuntime.id});
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
        for (const [key, _] of lettersAtPositions.entries()) {
            const [row, col] = key.split(',').map(Number);
            const position = {row, col};
            
            const getPositionKey = (row: number, col: number): string => `${row},${col}`;
            
            const leftKey = getPositionKey(row, col - 1);
            const rightKey = getPositionKey(row, col + 1);
            const upKey = getPositionKey(row - 1, col);
            const downKey = getPositionKey(row + 1, col);
            
            const startsHorizontal = lettersAtPositions.get(leftKey) === undefined 
                && lettersAtPositions.get(rightKey) !== undefined;
            const startsVertical = lettersAtPositions.get(upKey) === undefined
                && lettersAtPositions.get(downKey) !== undefined;
    
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
                }
            }
        }
    
        return validWords;
    };

    useEffect(() => {
        fetchDictionary();
    }, []);

    useEffect(() => {
        if (!dictionary) {
            setValidWords(new Set());
            return;
        }

        const validWords = getValidWordLetterIds(letterRuntimes, selectedLetterIds, isDraggingLetters, dictionary);
        setValidWords(validWords);
    }, [dictionary, letterRuntimes, isDraggingLetters, selectedLetterIds]);
}; 