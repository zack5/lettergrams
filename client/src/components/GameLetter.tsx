import { useEffect, useContext, useState } from "react";

import { useMotionValue, MotionValue, useTransform } from "framer-motion";

import Letter from "../components/Letter";

import { GRID_SIZE } from "../constants/Constants";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { getPositionFromCoords, getScreenPositionFromShelf, getShelvedLetterCount } from "../utils/Utils";

export default function GameLetter({ id }: { id: string }) {
    const { scroll, isDraggingLetters, setIsDraggingLetters, isTypingFromShelf, letterRuntimes, selectedLetterIds, setSelectedLetterIds, windowDimensions } = useContext(ContextNavigation);

    const runtime = letterRuntimes.find((letter) => letter.id === id);
    const letter = runtime?.letter || '';
    const isShelved = runtime ? runtime.isShelved : true;
    const isSelected = selectedLetterIds.includes(id);
    const updateImmediately = isDraggingLetters && isSelected;// && !(runtime?.isShelved);
    const dragPosition = runtime?.positionWhileDragging || { x: 0, y: 0 };
    const boardPosition = getPositionFromCoords(runtime?.row || 0, runtime?.col || 0);
    const shelvedPosition = getScreenPositionFromShelf(runtime?.col || 0, windowDimensions, getShelvedLetterCount(letterRuntimes));

    const x = useMotionValue(boardPosition.x);
    const y = useMotionValue(boardPosition.y);
    const top = useMotionValue(0);
    const left = useMotionValue(0);
    const [lastAnimationIsShelved, setLastAnimationIsShelved] = useState(true);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const threshold = 1;
        const speed = 12; // units per second
        
        const animate = (time: number) => {
            const deltaTime = (time - lastTime) / 1000; // seconds
            lastTime = time;

            if (updateImmediately) {
                x.set(dragPosition.x);
                y.set(dragPosition.y);
                top.set(scroll.y)
                left.set(scroll.x)
            } else {
                const currentX = x.get();
                const currentY = y.get();
                const currentTop = top.get();
                const currentLeft = left.get();

                const targetPosition = isShelved ? shelvedPosition : boardPosition;
                const targetTop = isShelved ? 0 : scroll.y;
                const targetLeft = isShelved ? 0 : scroll.x;

                const deltaX = targetPosition.x - currentX;
                const deltaY = targetPosition.y - currentY;
                const deltaTop = targetTop - currentTop;
                const deltaLeft = targetLeft - currentLeft;

                if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
                    x.set(targetPosition.x);
                    y.set(targetPosition.y);
                    top.set(targetTop);
                    left.set(targetLeft);
                    return;
                }

                const step = Math.min(1, speed * deltaTime)
                const moveX = deltaX * step;
                const moveY = deltaY * step;
                const moveTop = deltaTop * step;
                const moveLeft = deltaLeft * step;

                x.set(currentX + moveX);
                y.set(currentY + moveY);
                top.set(currentTop + moveTop);
                left.set(currentLeft + moveLeft);
                
                animationFrameId = requestAnimationFrame(animate);
            }
            setLastAnimationIsShelved(isShelved);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [dragPosition, boardPosition, shelvedPosition, x, y, updateImmediately, isShelved, scroll]);


    const backgroundPosition = isShelved 
    ? useTransform(
        [x, y] as [MotionValue<number>, MotionValue<number>],
        (values) => {
            const [latestX, latestY] = values as [number, number];
            return `-${latestX}px -${latestY}px`;
        }
    ): useTransform(
        [x, y] as [MotionValue<number>, MotionValue<number>],
        (values) => {
            const [latestX, latestY] = values as [number, number];
            return `-${latestX + scroll.x}px -${latestY + scroll.y}px`;
        }
    );

    const onPressStart = (event: TouchEvent | MouseEvent) => {
        if (isTypingFromShelf)
            return;

        event.preventDefault();
        if ('shiftKey' in event && event.shiftKey) {
            setSelectedLetterIds(prev =>
                prev.includes(id)
                    ? prev.filter(existingId => existingId !== id)
                    : [...prev, id]
            );
        } else if ('metaKey' in event && (event.metaKey || event.ctrlKey)) {
            setSelectedLetterIds(prev => [...prev, id]);
        } else {
            setSelectedLetterIds(prev => isSelected ? prev : [id]);
        }
        setIsDraggingLetters(true);
    }

    return (
        <Letter
            letter={letter}
            extraClasses={`interactive ${isSelected ? 'selected' : ''} ${isShelved ? 'shelved' : ''}`}
            props={{
                style: {
                    x,
                    y,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                    position: 'absolute',
                    top,
                    left,
                    backgroundPosition,
                    backgroundSize: '100vw 100vh',
                },
                onMouseDown: onPressStart,
                onTouchStart: onPressStart,
            }
            }
        />
    );
}