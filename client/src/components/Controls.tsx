import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImCommand, ImShift } from "react-icons/im";
import { TbRotate, TbRotateClockwise } from "react-icons/tb";

export default function Controls() {
    const MAGIC_WIDTH = 113;

    const [isOpen, setIsOpen] = useState(false);

    const [colWidths, setColWidths] = useState<number[]>([]);
    const tableRefs = useRef<(HTMLTableElement | null)[]>([]);

    useEffect(() => {
        if (tableRefs.current.length === 0) return;

        const colsCount = 2;
        const maxWidths = new Array(colsCount).fill(0);

        tableRefs.current.forEach((table) => {
            if (!table) return;
            const rows = Array.from(table.rows);

            rows.forEach((row) => {
                const cells = Array.from(row.cells);
                cells.forEach((cell, i) => {
                    const width = cell.getBoundingClientRect().width;
                    if (width > maxWidths[i]) {
                        maxWidths[i] = width;
                    }
                });
            });
        });

        setColWidths(maxWidths);
    }, []);

    const colgroup = (
        <colgroup>
            <col style={{ width: colWidths[0] ? `${colWidths[0]}px` : "auto" }} />
            <col style={{ width: colWidths[1] ? `${colWidths[1]}px` : "auto" }} />
        </colgroup>
    )

    return (
        <button
            className="in-game-text-container bottom-right"
            onClick={() => setIsOpen(!isOpen)}>
            <span className="controls-header">
                <h3 style={{ margin: 0 }}>Controls</h3>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "linear" }}
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
                    <div className="control-group-label">Selection</div>
                    <table className="controls" ref={(el) => { tableRefs.current[0] = el; }}>
                        {colgroup}
                        <tbody>
                            <tr>
                                <td><span className="keybinding">Mouse:</span></td>
                                <td className="control-name">Drag tiles</td>
                            </tr>
                            <tr>
                                <td><span className="keybinding"><ImCommand />Click:</span></td>
                                <td className="control-name">Add to selection</td>
                            </tr>
                            <tr>
                                <td><span className="keybinding"><ImShift />Click:</span></td>
                                <td className="control-name">Toggle selection</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="control-group-label">While dragging</div>
                    <table className="controls" ref={(el) => { tableRefs.current[1] = el; }}>
                        {colgroup}
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
                    <div className="control-group-label">Other</div>
                    <table className="controls" ref={(el) => { tableRefs.current[2] = el; }}>
                        {colgroup}
                        <tbody>
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