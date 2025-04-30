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

export default function Game({letters : propLetters}: {letters?: string}) {
    function filterAlphaOnly(input: string): string {
        return input.replace(/[^A-Za-z]/g, '');
    }

    const { letters: paramLetters } = useParams();
    const letters = filterAlphaOnly(paramLetters || propLetters || 'LetterGrams');

    const [searchParams, _] = useSearchParams();
    const setup = searchParams.get('setup')

    const { setLetterRuntimes } = useContext(ContextNavigation);
    
    useEffect(() => {
        let coords: Coordinate[] = []
        if (setup) {
            coords = setup.split(';').map((value) => {
                const split = value.split(',');
                console.log(split)
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

        console.log(setup?.split(';').filter(value => !!value), coords)
        
        const letterRuntimes: LetterRuntime[] = letters.toUpperCase().split('').map((letter, index) => ({
            id: index.toString(),
            row: coords ? coords[index].row : 0,
            col: coords ? coords[index].col : index,
            letter: letter,
            positionWhileDragging: getPositionFromCoords(0, index),
        }));
        setLetterRuntimes(letterRuntimes);
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

