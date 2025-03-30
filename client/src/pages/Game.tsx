import Letter from "../components/Letter";

import ContextNavigationProvider from "../contexts/ContextNavigation";

export default function Game() {
    return (
        <ContextNavigationProvider>
            <Letter value="A" />
        </ContextNavigationProvider>
    );
}

