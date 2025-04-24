import { useState } from "react";
import { motion } from "framer-motion";
import { ImCommand, ImShift } from "react-icons/im";

export default function Controls() {
    const [isOpen, setIsOpen] = useState(false);

    // TODO: whole thing should be clickable
    // TODO: animation
    return (
        <button 
            className="in-game-text-container bottom-right"
            onClick={() => setIsOpen(!isOpen)}>
            <span className="controls-header"> 
                <h3 style={{margin:0}}>Controls</h3>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "linear"}}
                >
                    ▼
                </motion.span>
            </span>
            <motion.div
                style={{ overflow: 'auto', height: 'auto' }}
                initial={{ width: 'auto' }}
                animate={{ width: isOpen ? 'auto' : 113 }}
            >
                <motion.div
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    initial={{ height: 0 }}
                    animate={{ height: isOpen ? 'auto' : 0 }}
                >
                    <table className="controls">
                        <tbody>
                            <tr>
                                <td><span className="keybinding">Mouse:</span></td>
                                <td className="control-name">Drag tiles</td>
                            </tr>
                            <tr>
                                <td><span className="keybinding"><ImCommand />Z:</span></td>
                                <td className="control-name">Undo</td>
                            </tr>
                            <tr>
                                <td><span className="keybinding"><ImShift /><ImCommand />Z:</span></td>
                                <td className="control-name">Redo</td>
                            </tr>
                        </tbody>
                    </table>
                </motion.div>
            </motion.div>
        </button>
    )
}