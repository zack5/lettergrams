import { useContext } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { ContextNavigation } from "../contexts/ContextNavigation";
import { LetterRuntime } from "../types/LetterRuntime";
import { GRID_SIZE } from "../constants/Constants";

export default function OffScreenPointer({ runtime }: { runtime: LetterRuntime }) {
    const { scroll, windowDimensions, selectedLetterIds, isDraggingLetters } = useContext(ContextNavigation);

    const buffer = 12;
    const dimension = 15;
    const borderRadius = 75  ;
    const screenX = runtime.col * GRID_SIZE + scroll.x + GRID_SIZE / 2 - dimension / 2;
    const screenY = runtime.row * GRID_SIZE + scroll.y + GRID_SIZE / 2 - dimension / 2;
    const isDraggingThisLetter = selectedLetterIds.includes(runtime.id) && isDraggingLetters;

    function clampToRoundedRect(screenX: number, screenY: number) {
        const minX = buffer;
        const maxX = windowDimensions.width - dimension - buffer;
        const minY = buffer;
        const maxY = windowDimensions.height - dimension - buffer;

        let x = Math.max(minX, Math.min(maxX, screenX));
        let y = Math.max(minY, Math.min(maxY, screenY));

        const inCornerX = (screenX < minX + borderRadius) || (screenX > maxX - borderRadius);
        const inCornerY = (screenY < minY + borderRadius) || (screenY > maxY - borderRadius);

        if (inCornerX && inCornerY) {
            // Identify which corner
            const cornerCenterX = (screenX < minX + borderRadius) ? minX + borderRadius : maxX - borderRadius;
            const cornerCenterY = (screenY < minY + borderRadius) ? minY + borderRadius : maxY - borderRadius;

            // Vector from corner center to screen point
            const dx = screenX - cornerCenterX;
            const dy = screenY - cornerCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Clamp to arc if outside radius
            if (dist > borderRadius) {
                const scale = borderRadius / dist;
                x = cornerCenterX + dx * scale;
                y = cornerCenterY + dy * scale;
            } else {
                // If inside, just use screenX/Y (clamped)
                x = screenX;
                y = screenY;
            }

            // Clamp final values inside the rectangle
            x = Math.max(minX, Math.min(maxX, x));
            y = Math.max(minY, Math.min(maxY, y));
        }

        return { x, y };
    }

    if (!(runtime.isShelved || isDraggingThisLetter) &&
        (
            screenX < 0 || screenX > windowDimensions.width
            || screenY < 0 || screenY > windowDimensions.height
        )
    ) {
        const { x, y } = clampToRoundedRect(screenX, screenY);

        const centerX = windowDimensions.width / 2;
        const centerY = windowDimensions.height / 2;
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 45;

        return <FaLocationArrow className="off-screen-pointer" style={{
            position: 'absolute',
            top: y,
            left: x,
            width: dimension,
            height: dimension,
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'center',
        }} />
    }

    return <></>
}