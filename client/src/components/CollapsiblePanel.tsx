import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

export default function Controls({children, name, corner} : {children?: ReactNode, name: string, corner: string}) {
    const MAGIC_WIDTH = 115;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <button
            className={`in-game-text-container ${corner}`}
            onClick={() => setIsOpen(!isOpen)}>
            <span className="panel-header" style={{flexDirection: corner.includes("left") ? "row-reverse" : "row"}}>
                <h3 style={{ margin: 0 }}>{name}</h3>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "linear" }}
                >
                    ▲
                </motion.span>
            </span>
            <motion.div
                style={{ overflow: 'auto', height: 'auto' }}
                initial={{ width: MAGIC_WIDTH }}
                animate={{ width: isOpen ? 'auto' : MAGIC_WIDTH }}
            >
                <motion.div
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    initial={{ height: 0 }}
                    animate={{ height: isOpen ? 'auto' : 0 }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </button>
    )
}