import { useContext } from "react";
import { IoMdExit } from "react-icons/io";
import { IoMdShare } from "react-icons/io";

import { ContextGame } from "../contexts/ContextGame";

import { DialogBox } from "../types/DialogBox"

import CollapsiblePanel from "./CollapsiblePanel"

export default function LogoInGame() {
    const { setDialogBox } = useContext(ContextGame);

    return (
        <CollapsiblePanel name="Menu" corner="bottom-left">
            <div className="panel flex-panel">
                <button
                    className="panel-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDialogBox(DialogBox.ShareGame);
                    }}
                >
                    <IoMdShare /><span>Share Board</span>
                </button>
                <button
                    className="panel-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDialogBox(DialogBox.ExitGame);
                    }}
                >
                    <IoMdExit /><span>Exit</span>
                </button>
            </div>

        </CollapsiblePanel>
    )
}