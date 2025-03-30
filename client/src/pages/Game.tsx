import { useParams } from "react-router";
import Letter from "../components/Letter";

import { ContextNavigationProvider } from "../contexts/ContextNavigation";

export default function Game({letters : propLetters}: {letters?: string}) {
    const { letters: paramLetters } = useParams();
    const letters = paramLetters || propLetters || '';
    const letterElements = letters.toUpperCase().split('').map((letter, index) => (
        <Letter key={index} id={index.toString()} value={letter} />
    ));

    return (
        <ContextNavigationProvider>
            <main className="game">
                {letterElements}
            </main>
        </ContextNavigationProvider>
    );
}

