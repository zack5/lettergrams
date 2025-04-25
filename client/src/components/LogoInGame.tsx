import { useContext } from "react";

import { ContextNavigation } from "../contexts/ContextNavigation";

export default function LogoInGame() {
    const { setDialogIsOpen } = useContext(ContextNavigation);

    return (
        <button
            className="in-game-text-container bottom-left" 
            onClick={() => setDialogIsOpen(true)}>
            <h3 style={{margin:0}}>LetterGrams</h3>
        </button>
    )
}