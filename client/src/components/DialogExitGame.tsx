import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { ContextNavigation } from "../contexts/ContextNavigation";

export default function DialogExitGame() {
    const navigate = useNavigate();
    const { dialogIsOpen, setDialogIsOpen } = useContext(ContextNavigation);

    const handleClose = () => {
        setDialogIsOpen(false);
    }
    const handleExit = () => {
        handleClose();
        navigate("/");
    }

    return (
        <Dialog
            open={dialogIsOpen}
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