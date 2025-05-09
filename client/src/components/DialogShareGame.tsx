import { useContext } from "react";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import DialogCloseButton from "./DialogCloseButton";
import ShareButtons from "./ShareButtons";

import { ContextGame } from "../contexts/ContextGame";

import { DialogBox } from "../types/DialogBox"

export default function DialogExitGame() {
    const { dialogBox, setDialogBox } = useContext(ContextGame);
    const isOpen = dialogBox === DialogBox.ShareGame;

    const handleClose = () => {
        setDialogBox(null);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="dialog-container"
        >
            <div className="dialog-backdrop">
                <DialogPanel className="dialog-panel">
                    <DialogCloseButton handleClose={handleClose}/>
                    <DialogTitle className="dialog-title">Share</DialogTitle>
                    <ShareButtons />
                </DialogPanel>
            </div>
        </Dialog>
    )
}