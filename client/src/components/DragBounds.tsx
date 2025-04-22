import { useContext, useEffect } from "react";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { getPositionFromCoords } from "../utils/Utils";
import { select } from "motion/react-client";
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
        const selectedLetterIds = letterRuntimes.filter((letter) => {
                const position = getPositionFromCoords(letter.row, letter.col);
                const validX = (position.x >= left && position.x <= left + width)
                    || (position.x + GRID_SIZE >= left && position.x + GRID_SIZE <= left + width);
                const validY = (position.y >= top && position.y <= top + height)
                    || (position.y + GRID_SIZE >= top && position.y + GRID_SIZE <= top + height);
                return validX && validY;
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