import { useParams } from "react-router";
import { useContext, useEffect } from "react";

import Board from "../components/Board";
import Controls from "../components/Controls";
import DialogExitGame from "../components/DialogExitGame";
import GameLetter from "../components/GameLetter";
import LogoInGame from "../components/LogoInGame";

import { ContextNavigation } from "../contexts/ContextNavigation";
import { LetterRuntime } from "../types/LetterRuntime";
import { getPositionFromCoords } from "../utils/Utils";

export default function Game({letters : propLetters}: {letters?: string}) {
    const { letters: paramLetters } = useParams();
    const letters = paramLetters || propLetters || '';

    const { setLetterRuntimes } = useContext(ContextNavigation);
    
    useEffect(() => {
        const letterRuntimes: LetterRuntime[] = letters.toUpperCase().split('').map((letter, index) => ({
            id: index.toString(),
            row: 0,
            col: index,
            letter: letter,
            positionWhileDragging: getPositionFromCoords(0, index),
        }));
        setLetterRuntimes(letterRuntimes);
    }, [letters]);

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
        </main>
    );
}

