import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { ContextNavigation } from "../contexts/ContextNavigation";

import { DialogBox } from "../types/DialogBox"

export default function DialogExitGame() {
    const navigate = useNavigate();
    const { dialogBox, setDialogBox } = useContext(ContextNavigation);

    const handleClose = () => {
        setDialogBox(null);
    }
    const handleExit = () => {
        handleClose();
        navigate("/");
    }

    return (
        <Dialog
            open={dialogBox === DialogBox.ExitGame}
            onClose={handleClose}
            className="dialog-container"
        >
            <div className="dialog-backdrop">
                <DialogPanel className="dialog-panel">
                    <DialogTitle className="dialog-title">Exit game</DialogTitle>
                    <Description className="dialog-description">
                        Are you sure you want to exit the game?
                    </Description>
                    <div className="dialog-actions">
                        <button onClick={handleExit}>Yes</button>
                        <button onClick={handleClose}>No</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}