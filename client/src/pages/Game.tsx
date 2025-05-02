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
import { Coordinate } from "../types/Vector2";
import { getScreenPositionFromShelf, getShelvedLetterCount } from "../utils/Utils";

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
                letter: letter,
                isShelved: true,
                row,
                col,
                positionWhileDragging: getScreenPositionFromShelf(col, windowDimensions, coords.length),
            }
        });
        setLetterRuntimes(letterRuntimes);

        setScroll({
            x: 0,//windowDimensions.width / 2,
            y: 0//windowDimensions.height / 2,
        })
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

