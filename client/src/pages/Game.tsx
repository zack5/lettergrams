import { useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Board from "../components/Board";
import Controls from "../components/Controls";
import DialogExitGame from "../components/DialogExitGame";
import DialogShareGame from "../components/DialogShareGame";
import DialogYouWon from "../components/DialogYouWon";
import GameLetter from "../components/GameLetter";
import GameLetterShelf from "../components/GameLetterShelf";
import LogoInGame from "../components/LogoInGame";
import OffScreenPointer from "../components/OffScreenPointer";

import { ContextGame } from "../contexts/ContextGame";
import { LetterRuntime } from "../types/LetterRuntime";
import { getPositionFromCoords, getScreenPositionFromShelf, getDailyLetters } from "../utils/Utils";
import { GRID_SIZE } from "../constants/Constants";
import ValidWordIndicator from "../components/VaidWordIndicator";

export default function Game({ letters: propLetters, isDailyGame }: { letters?: string, isDailyGame?: boolean }) {
    function filterAlphaOnly(input: string): string {
        return input.replace(/[^A-Za-z]/g, '');
    }

    const { letters: paramLetters } = useParams();
    const letters = filterAlphaOnly((isDailyGame && getDailyLetters()) || paramLetters || propLetters || 'LetterGrams');

    const [searchParams, _] = useSearchParams();
    const setup = searchParams.get('setup')

    const { letterRuntimes, setLetterRuntimes, setScroll, validWords, windowDimensions } = useContext(ContextGame);

    useEffect(() => {
        // Add game-active class to html and body when component mounts
        document.documentElement.classList.add('game-active');
        document.body.classList.add('game-active');
        
        // Remove game-active class when component unmounts
        return () => {
            document.documentElement.classList.remove('game-active');
            document.body.classList.remove('game-active');
        };
    }, []);

    useEffect(() => {
        
        interface GridSpace {
            row: number;
            col: number;
            isShelved: boolean;
        }

        let spaces: GridSpace[] = [];
        let usedShelfSpaces = 0;
        const givenCoords = setup?.split(' ') || []; // the + is replaced with a space in the query string
        for (let i = 0; i < letters.length; i++) {
            if (i < givenCoords.length) {
                const split = givenCoords[i].split(',');
                if (split.length === 2) {
                    const row = Number(split[0]);
                    const col = Number(split[1])
                    if (!Number.isNaN(row) && !Number.isNaN(col)) {
                        spaces.push({
                            row,
                            col,
                            isShelved: false,
                        })
                        continue;
                    }
                }
            }
            spaces.push({
                row: 0,
                col: usedShelfSpaces,
                isShelved: true,
            })
            usedShelfSpaces++;
        }

        const letterRuntimes: LetterRuntime[] = letters.toUpperCase().split('').map((letter, index) => {

            const row = spaces[index].row;
            const col = spaces[index].col;
            const isShelved = spaces[index].isShelved;
            return {
                id: index.toString(),
                letter: letter,
                isShelved,
                startedDragFromShelf: false,
                row,
                col,
                positionWhileDragging: isShelved 
                    ? getScreenPositionFromShelf(col, windowDimensions, spaces.length)
                    : getPositionFromCoords(row, col),
            }
        });
        setLetterRuntimes(letterRuntimes);

        // Center the scrolling around the unshelved letters
        const unshelvedLetters = letterRuntimes.filter(letter => !letter.isShelved);
        
        if (unshelvedLetters.length > 0) {
            const minRow = Math.min(...unshelvedLetters.map(letter => letter.row));
            const maxRow = Math.max(...unshelvedLetters.map(letter => letter.row));
            const minCol = Math.min(...unshelvedLetters.map(letter => letter.col));
            const maxCol = Math.max(...unshelvedLetters.map(letter => letter.col));
            
            const centerRow = (minRow + maxRow) / 2;
            const centerCol = (minCol + maxCol) / 2;
            
            const centerPosition = getPositionFromCoords(centerRow, centerCol);

            setScroll({
                x: windowDimensions.width / 2 - centerPosition.x - GRID_SIZE / 2,
                y: windowDimensions.height / 2 - centerPosition.y - GRID_SIZE,
            });
        } else {
            // If no unshelved letters, center on the board
            setScroll({
                x: windowDimensions.width / 2,
                y: windowDimensions.height / 2,
            });
        }
    }, [letters, setup]);

    const letterElements = letters.split('').map((_, index) => (
        <GameLetter key={index} id={index.toString()} />
    ));

    const offScreenPointers = letterRuntimes.map((runtime, index) => (
        <OffScreenPointer runtime={runtime} key={index}/>
    ));

    const validWordsElements = Array.from(validWords).map((wordData, _) => (
        <ValidWordIndicator wordData={wordData} key={`${wordData.word}-${wordData.startRow}-${wordData.startCol}`}/>
    ));

    return (
        <main className="game">
            <Board />
            {offScreenPointers}
            <AnimatePresence>
                {validWordsElements}
            </AnimatePresence>
            {letterElements}
            <GameLetterShelf />
            <Controls />
            <LogoInGame />
            <DialogExitGame />
            <DialogShareGame isDailyGame={isDailyGame || false} />
            {isDailyGame && <DialogYouWon />}
        </main>
    );
}

