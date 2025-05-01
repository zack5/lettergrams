import { useContext } from "react";
import { IoMdExit } from "react-icons/io";
import { IoMdShare } from "react-icons/io";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { DialogBox } from "../types/DialogBox"

import CollapsiblePanel from "./CollapsiblePanel"

export default function LogoInGame() {
    const { setDialogBox } = useContext(ContextNavigation);

    return (
        <CollapsiblePanel name="LetterGrams" corner="bottom-left">
            <div className="panel flex-panel">
                <button
                    className="panel-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDialogBox(DialogBox.ShareGame);
                    }}
                >
                    <IoMdExit /><span>Share Board</span>
                </button>
                <button
                    className="panel-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDialogBox(DialogBox.ExitGame);
                    }}
                >
                    <IoMdShare /><span>Exit</span>
                </button>
            </div>

        </CollapsiblePanel>
    )
}