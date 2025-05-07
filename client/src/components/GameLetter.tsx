import { useEffect, useContext, useState } from "react";

import { useMotionValue, MotionValue, useTransform } from "framer-motion";

import Letter from "../components/Letter";

import { GRID_SIZE } from "../constants/Constants";

import { ContextGame } from "../contexts/ContextGame";

import { getPositionFromCoords, getScreenPositionFromShelf, getShelvedLetterCount } from "../utils/Utils";

export default function GameLetter({ id }: { id: string }) {
    const { scroll, isDraggingLetters, setIsDraggingLetters, isTypingFromShelf, letterRuntimes, setLetterRuntimes, selectedLetterIds, setSelectedLetterIds, windowDimensions } = useContext(ContextGame);

    const runtime = letterRuntimes.find((letter) => letter.id === id);
    const letter = runtime?.letter || '';
    const isShelved = runtime ? runtime.isShelved : true;
    const isSelected = selectedLetterIds.includes(id);
    const updateImmediately = isDraggingLetters && isSelected;
    const dragPosition = runtime?.positionWhileDragging || { x: 0, y: 0 };
    const boardPosition = getPositionFromCoords(runtime?.row || 0, runtime?.col || 0);
    const shelvedPosition = getScreenPositionFromShelf(runtime?.col || 0, windowDimensions, getShelvedLetterCount(letterRuntimes));

    const x = useMotionValue(shelvedPosition.x);
    const y = useMotionValue(shelvedPosition.y);
    const top = useMotionValue(0);
    const left = useMotionValue(0);
    const [_, forceRerender] = useState(true); // Hack

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
            forceRerender(true);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [dragPosition, boardPosition, shelvedPosition, x, y, updateImmediately, isShelved, scroll]);

    const backgroundPosition = useTransform(
        [x, y, top, left] as [MotionValue<number>, MotionValue<number>, MotionValue<number>, MotionValue<number>],
        (values) => {
            const [latestX, latestY, latestTop, latestLeft] = values as [number, number, number, number];
            return `-${latestX + latestLeft}px -${latestY + latestTop}px`;
        }
    );

    const onPressStart = (event: TouchEvent | MouseEvent) => {
        if (isTypingFromShelf)
            return;

        event.preventDefault();

        let upcomingSelectedLetterIds = selectedLetterIds;
        if ('shiftKey' in event && event.shiftKey) {
            upcomingSelectedLetterIds = upcomingSelectedLetterIds.includes(id)
                ? upcomingSelectedLetterIds.filter(existingId => existingId !== id)
                : [...upcomingSelectedLetterIds, id];
        } else if ('metaKey' in event && (event.metaKey || event.ctrlKey)) {
            upcomingSelectedLetterIds = [...upcomingSelectedLetterIds, id];
        } else {
            upcomingSelectedLetterIds = isSelected ? upcomingSelectedLetterIds : [id];
        }
        setSelectedLetterIds(upcomingSelectedLetterIds);

        setIsDraggingLetters(true);

        // If starting shelved, convert position to board space
        setLetterRuntimes(prev => {
            return prev.map(prevRuntime => {
                const isStartingFromShelf = prevRuntime.isShelved && upcomingSelectedLetterIds.includes(prevRuntime.id);
                if (!isStartingFromShelf)
                    return prevRuntime;

                let startingPos;
                if (isStartingFromShelf) {
                    startingPos = getScreenPositionFromShelf(prevRuntime.col, windowDimensions, getShelvedLetterCount(prev));
                    startingPos.x -= scroll.x;
                    startingPos.y -= scroll.y;
                } else {
                    startingPos = prevRuntime.positionWhileDragging;
                }

                return {
                    ...prevRuntime,
                    isShelved: false,
                    startedDragFromShelf: isStartingFromShelf,
                    positionWhileDragging: startingPos
                };
            });
        });
    }

    return (
        <Letter
            letter={letter}
            extraClasses={`interactive ${isSelected ? 'selected' : ''} ${isShelved ? 'shelved' : ''} ${updateImmediately ? 'being-dragged' : ''}`}
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