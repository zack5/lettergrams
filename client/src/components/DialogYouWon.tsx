import { useContext, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Confetti from 'react-confetti'

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
    const { dialogBox, setDialogBox, windowDimensions } = useContext(ContextGame);
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
        <AnimatePresence>
            {isOpen && (
                <Dialog
                    open={isOpen}
                    onClose={handleClose}
                    className="dialog-container"
                >
                    <motion.div 
                        className="dialog-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Confetti
                            width={windowDimensions.width}
                            height={windowDimensions.height}
                            recycle={false}
                            numberOfPieces={150}
                            gravity={0.25}
                            colors={['#FFD700', '#FF6347', '#4682B4', '#32CD32', '#9370DB']}

                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogPanel className="dialog-panel">
                                <DialogCloseButton handleClose={handleClose} />
                                <DialogTitle className="dialog-title">Congratulations!</DialogTitle>
                                <Description className="dialog-description">
                                    {description}
                                </Description>
                                <ShareButtons />
                            </DialogPanel>
                        </motion.div>
                    </motion.div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}