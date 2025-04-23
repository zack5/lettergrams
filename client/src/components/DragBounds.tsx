import { useContext, useEffect } from "react";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { getPositionFromCoords } from "../utils/Utils";

import { GRID_SIZE } from "../constants/Constants";

type DragBoundsProps = {
    isDragging: boolean;
    startPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
};

export default function DragBounds({ isDragging, startPosition, currentPosition }: DragBoundsProps) {
    const { letterRuntimes, setSelectedLetterIds } = useContext(ContextNavigation);

    const width = Math.abs(currentPosition.x - startPosition.x);
    const height = Math.abs(currentPosition.y - startPosition.y);
    const left = Math.min(currentPosition.x, startPosition.x);
    const top = Math.min(currentPosition.y, startPosition.y);

    useEffect(() => {
        if (!isDragging) {
            return;
        }

        const l1 = { x: left, y: top };
        const r1 = { x: left + width, y: top + height };

        const selectedLetterIds = letterRuntimes.filter((letter) => {
            const l2 = getPositionFromCoords(letter.row, letter.col);
            const r2 = {x: l2.x + GRID_SIZE, y: l2.y + GRID_SIZE};

            if (l1.x > r2.x || l2.x > r1.x) return false;
            if (r1.y < l2.y || r2.y < l1.y) return false;
            return true;
        }).map((runtime) => runtime.id);
        setSelectedLetterIds(selectedLetterIds);
    }, [isDragging, currentPosition, startPosition, letterRuntimes, setSelectedLetterIds]);

    if (!isDragging) {
        return null;
    }

    const style: React.CSSProperties = {
        position: 'absolute',
        left: left,
        top: top,
        width: width,
        height: height,
    };
    return (
        <div className="drag-bounds" style={style}>
        </div>
    )
}