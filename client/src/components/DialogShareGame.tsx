import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Checkbox, Dialog, DialogPanel, DialogTitle, Field, Input, Label } from '@headlessui/react'

import { IoMdClose } from "react-icons/io";

import { ContextGame } from "../contexts/ContextGame";

import { DialogBox } from "../types/DialogBox"

export default function DialogExitGame() {
    const [sharePositions, setSharePositions] = useState(true);
    const [hasCopied, setHasCopied] = useState(false);
    const { dialogBox, setDialogBox, letterRuntimes } = useContext(ContextGame);
    const urlInputRef = useRef<HTMLInputElement | null>(null);
    const location = useLocation();
    const isOpen = dialogBox === DialogBox.ShareGame;

    const handleClose = () => {
        setDialogBox(null);
    }

    let query = "";
    if (sharePositions) {
        query = "?setup=" + letterRuntimes.map(runtime => runtime.isShelved ? '' : `${runtime.row},${runtime.col}`).join('+')
    }

    const currentUrl = window.location.origin + location.pathname + query;

    const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (urlInputRef.current) {
            navigator.clipboard.writeText(urlInputRef.current.value)
                .then(() => {
                    setHasCopied(true)
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                });
        }
    }

    useEffect(() => {
        setHasCopied(false);
    }, [currentUrl, isOpen])

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="dialog-container"
        >
            <div className="dialog-backdrop">
                <DialogPanel className="dialog-panel">
                    <button
                        onClick={handleClose}
                        className="close-button"
                        aria-label="Close popup"
                    >
                        <IoMdClose />
                    </button>
                    <DialogTitle className="dialog-title">Share</DialogTitle>

                    <form className="share-form">
                        <Field className="field-horizontal">
                            <Label className="visually-hidden">Letters:</Label>
                            <Input
                                className="custom-input share-url"
                                ref={urlInputRef}
                                type="text"
                                name="sharable url"
                                placeholder="Sharable URL"
                                value={currentUrl}
                                maxLength={30}
                                required
                                aria-required="true"
                                readOnly
                            />
                            <button
                                className={`copy-button ${hasCopied ? 'copied' : ''}`}
                                onClick={handleCopy}
                            >
                                {`${hasCopied ? "Copied!" : "Copy"}`}
                            </button>
                        </Field>

                        <Field className="field-horizontal">
                            <Checkbox
                                checked={true}
                                onChange={() => setSharePositions(prev => !prev)}
                                className={`checkbox-container ${sharePositions && 'checked'}`}
                            >
                                {/* Checkmark icon */}
                                <svg className={`checkbox-icon ${sharePositions && 'checked'}`} viewBox="0 2 14 14" fill="none">
                                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Checkbox>
                            <Label>Share letter positions</Label>
                        </Field>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    )
}