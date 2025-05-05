import { useEffect, useRef, useState } from "react";
import { ImCommand, ImShift } from "react-icons/im";
import { TbRotate, TbRotateClockwise } from "react-icons/tb";

import CollapsiblePanel from "./CollapsiblePanel"

export default function Controls() {
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
        <CollapsiblePanel name="Controls" corner="bottom-right">
            <div className="panel-group-label">Moving letters</div>
            <table className="panel" ref={(el) => { tableRefs.current[0] = el; }}>
                {colgroup}
                <tbody>
                    <tr>
                        <td><span className="keybinding">Mouse:</span></td>
                        <td className="control-name">Drag letters</td>
                    </tr>
                    <tr>
                        <td><span className="keybinding">Type letters:</span></td>
                        <td className="control-name">Grab unplaced letters</td>
                    </tr>
                    <tr>
                        <td><span className="keybinding">Drag rectangle:</span></td>
                        <td className="control-name">Select multiple letters</td>
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

            <div className="panel-group-label">While dragging multiple letters</div>
            <table className="panel" ref={(el) => { tableRefs.current[1] = el; }}>
                {colgroup}
                <tbody>
                    <tr>
                        <td><span className="keybinding">Tab:</span></td>
                        <td className="panel-name">Rotate <TbRotateClockwise /></td>
                    </tr>
                    <tr>
                        <td><span className="keybinding"><ImShift />Tab:</span></td>
                        <td className="panel-name">Rotate <TbRotate /></td>
                    </tr>
                </tbody>

            </table>
            <div className="panel-group-label">Other</div>
            <table className="panel" ref={(el) => { tableRefs.current[2] = el; }}>
                {colgroup}
                <tbody>
                    <tr>
                        <td><span className="keybinding">Space + Mouse:</span></td>
                        <td className="control-name">Scroll</td>
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
        </CollapsiblePanel>
    )
}