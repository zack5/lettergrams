import Letter from "../components/Letter";

import { ContextNavigationProvider } from "../contexts/ContextNavigation";

export default function Game() {
    return (
        <ContextNavigationProvider>
            <main className="game">
                <Letter id="1" value="A" />
                <Letter id="2" value="B" />
                <Letter id="3" value="C" />
            </main>
        </ContextNavigationProvider>
    );
}

