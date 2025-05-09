import { useContext, useRef } from "react";

import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

import { ContextGame } from "../contexts/ContextGame";

import { DialogBox } from "../types/DialogBox"
import DialogCloseButton from "./DialogCloseButton";
import ShareButtons from "./ShareButtons";

const congratsEmojis = ["🎉", "🌟", "🥳", "🙌", "🎊"];
const congratsText = [
    "Nice one!",
    "Nailed it!",
    "Great solve!",
    "Outstanding move!",
    "Legendary!",
]

export default function DialogYouWon() {
    const { dialogBox, setDialogBox } = useContext(ContextGame);
    const isOpen = dialogBox === DialogBox.YouWon;

    const descriptionRef = useRef(
        congratsText[Math.floor(Math.random() * congratsText.length)] + " " +
        congratsEmojis[Math.floor(Math.random() * congratsEmojis.length)]
    );
    const description = descriptionRef.current;

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
                    <DialogCloseButton handleClose={handleClose} />
                    <DialogTitle className="dialog-title">Congratulations!</DialogTitle>
                    <Description className="dialog-description">
                        {description}
                    </Description>
                    <ShareButtons />
                </DialogPanel>
            </div>
        </Dialog>
    )
}