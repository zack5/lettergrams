import { useParams, useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";

import Board from "../components/Board";
import Controls from "../components/Controls";
import DialogExitGame from "../components/DialogExitGame";
import DialogShareGame from "../components/DialogShareGame";
import GameLetter from "../components/GameLetter";
import GameLetterShelf from "../components/GameLetterShelf";
import LogoInGame from "../components/LogoInGame";
import OffScreenPointer from "../components/OffScreenPointer";

import { ContextNavigation } from "../contexts/ContextNavigation";
import { LetterRuntime } from "../types/LetterRuntime";
import { getPositionFromCoords, getScreenPositionFromShelf } from "../utils/Utils";
import { GRID_SIZE } from "../constants/Constants";

export default function Game({ letters: propLetters }: { letters?: string }) {
    function filterAlphaOnly(input: string): string {
        return input.replace(/[^A-Za-z]/g, '');
    }

    const { letters: paramLetters } = useParams();
    const letters = filterAlphaOnly(paramLetters || propLetters || 'LetterGrams');

    const [searchParams, _] = useSearchParams();
    const setup = searchParams.get('setup')

    const { letterRuntimes, setLetterRuntimes, setScroll, windowDimensions } = useContext(ContextNavigation);

    useEffect(() => {
        
        interface GridSpace {
            row: number;
            col: number;
            isShelved: boolean;
        }

        let spaces: GridSpace[] = [];
        let usedShelfSpaces = 0;
        const givenCoords = setup?.split(';') || [];
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

    return (
        <main className="game">
            <Board />
            {offScreenPointers}
            {letterElements}
            <GameLetterShelf />
            <Controls />
            <LogoInGame />
            <DialogExitGame />
            <DialogShareGame />
        </main>
    );
}

