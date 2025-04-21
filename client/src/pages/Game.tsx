import { useParams } from "react-router";
import { use, useContext, useEffect } from "react";

import Letter from "../components/Letter";

import { ContextNavigation } from "../contexts/ContextNavigation";
import { LetterRuntime } from "../types/LetterRuntime";

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
        }));
        setLetterRuntimes(letterRuntimes);
    }, [letters]);

    const letterElements = letters.split('').map((_, index) => (
        <Letter key={index} id={index.toString()} />
    ));

    return (
        <main className="game">
            {letterElements}
        </main>
    );
}

