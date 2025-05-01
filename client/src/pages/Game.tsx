import { useParams, useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";

import Board from "../components/Board";
import Controls from "../components/Controls";
import DialogExitGame from "../components/DialogExitGame";
import DialogShareGame from "../components/DialogShareGame";
import GameLetter from "../components/GameLetter";
import LogoInGame from "../components/LogoInGame";

import { ContextNavigation } from "../contexts/ContextNavigation";
import { LetterRuntime } from "../types/LetterRuntime";
import { Coordinate } from "../types/Vector2";
import { getPositionFromCoords } from "../utils/Utils";
import { GRID_SIZE } from "../constants/Constants";

export default function Game({ letters: propLetters }: { letters?: string }) {
    function filterAlphaOnly(input: string): string {
        return input.replace(/[^A-Za-z]/g, '');
    }

    const { letters: paramLetters } = useParams();
    const letters = filterAlphaOnly(paramLetters || propLetters || 'LetterGrams');

    const [searchParams, _] = useSearchParams();
    const setup = searchParams.get('setup')

    const { setLetterRuntimes, setScroll, windowDimensions } = useContext(ContextNavigation);

    useEffect(() => {
        let coords: Coordinate[] = []
        if (setup) {
            coords = setup.split(';').map((value) => {
                const split = value.split(',');
                if (split.length === 2) {
                    const row = Number(split[0]);
                    const col = Number(split[1])
                    if (!Number.isNaN(row) && !Number.isNaN(col)) {
                        return {
                            row,
                            col,
                        }
                    }
                }
                return undefined
            }).filter(value => !!value)
        }

        let col = 0
        while (coords.length < letters.length) {
            const next = {
                row: 0,
                col,
            }
            if (!coords.includes(next)) {
                coords.push(next);
            }
            col++;
        }

        const letterRuntimes: LetterRuntime[] = letters.toUpperCase().split('').map((letter, index) => {

            const row = coords ? coords[index].row : 0;
            const col = coords ? coords[index].col : index;
            return {
                id: index.toString(),
                row,
                col,
                letter: letter,
                positionWhileDragging: getPositionFromCoords(row, col),
            }
        });
        setLetterRuntimes(letterRuntimes);

        const { minRow, maxRow, minCol, maxCol } = letterRuntimes.reduce(
            (acc, runtime) => {
                acc.minRow = Math.min(acc.minRow, runtime.row);
                acc.maxRow = Math.max(acc.maxRow, runtime.row);
                acc.minCol = Math.min(acc.minCol, runtime.col);
                acc.maxCol = Math.max(acc.maxCol, runtime.col);
                return acc;
            },
            {
                minRow: Infinity,
                maxRow: -Infinity,
                minCol: Infinity,
                maxCol: -Infinity
            }
        );

        const centerRow = (minRow + maxRow) / 2 + 1;
        const centerCol = (minCol + maxCol) / 2;
        console.log(centerCol, centerRow);

        setScroll({
            x: windowDimensions.width / 2 - GRID_SIZE * centerCol,
            y: windowDimensions.height / 2 - GRID_SIZE * centerRow,
        })
    }, [letters, setup]);

    const letterElements = letters.split('').map((_, index) => (
        <GameLetter key={index} id={index.toString()} />
    ));

    return (
        <main className="game">
            <Board />
            {letterElements}
            <Controls />
            <LogoInGame />
            <DialogExitGame />
            <DialogShareGame />
        </main>
    );
}

