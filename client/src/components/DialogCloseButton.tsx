import { IoMdClose } from "react-icons/io";

export default function DialogCloseButton({ handleClose }: { handleClose: () => void }) {
    return (
        <button
            onClick={handleClose}
            className="close-button"
            aria-label="Close popup"
        >
            <IoMdClose />
        </button>
    )
}