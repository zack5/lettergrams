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
                        setDialogBox(DialogBox.ExitGame);
                    }}
                >
                    <IoMdExit /><span>Exit</span>
                </button>
                <button
                    className="panel-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDialogBox(DialogBox.ShareGame);
                    }}
                >
                    <IoMdShare /><span>Share Board</span>
                </button>
            </div>

        </CollapsiblePanel>
    )
}