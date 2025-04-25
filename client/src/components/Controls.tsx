import { useState } from "react";
import { motion } from "framer-motion";
import { ImCommand, ImShift } from "react-icons/im";
import { TbRotate, TbRotateClockwise } from "react-icons/tb";

export default function Controls() {
    const [isOpen, setIsOpen] = useState(false);

    const MAGIC_WIDTH = 113;

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
                initial={{ width: MAGIC_WIDTH }}
                animate={{ width: isOpen ? 'auto' : MAGIC_WIDTH }}
            >
                <motion.div
                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    initial={{ height: 0 }}
                    animate={{ height: isOpen ? 'auto' : 0 }}
                >
                    <div className="control-group-label">Navigation</div>
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
                    <div className="control-group-label">While dragging</div>
                    <table className="controls">
                        <tbody>
                            <tr>
                                <td><span className="keybinding">R:</span></td>
                                <td className="control-name">Rotate <TbRotateClockwise /></td>
                            </tr>
                            <tr>
                                <td><span className="keybinding"><ImShift />R:</span></td>
                                <td className="control-name">Rotate <TbRotate /></td>
                            </tr>
                        </tbody>
                    </table>
                </motion.div>
            </motion.div>
        </button>
    )
}