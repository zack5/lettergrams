import { useEffect, useContext } from "react";

import { useMotionValue, useTransform } from "framer-motion";

import Letter from "../components/Letter";

import { GRID_SIZE } from "../constants/Constants";

import { ContextNavigation } from "../contexts/ContextNavigation";

import { getPositionFromCoords } from "../utils/Utils";

export default function GameLetter({ id }: { id: string }) {
    const { isDraggingLetters, setIsDraggingLetters, letterRuntimes, selectedLetterIds, setSelectedLetterIds } = useContext(ContextNavigation);

    const runtime = letterRuntimes.find((letter) => letter.id === id);
    const letter = runtime?.letter || '';
    const isSelected = selectedLetterIds.includes(id);
    const updateImmediately = isDraggingLetters && isSelected;
    const dragPosition = runtime?.positionWhileDragging || { x: 0, y: 0 };
    const boardPosition = getPositionFromCoords(runtime?.row || 0, runtime?.col || 0);

    const x = useMotionValue(boardPosition.x);
    const y = useMotionValue(boardPosition.y);

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
          } else {
            const currentX = x.get();
            const currentY = y.get();
            const deltaX = boardPosition.x - currentX;
            const deltaY = boardPosition.y - currentY;
      
            if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
              x.set(boardPosition.x);
              y.set(boardPosition.y);
              return;
            }
      
            const moveX = deltaX * Math.min(1, speed * deltaTime);
            const moveY = deltaY * Math.min(1, speed * deltaTime);
      
            x.set(currentX + moveX);
            y.set(currentY + moveY);
      
            animationFrameId = requestAnimationFrame(animate);
          }
        };
      
        animationFrameId = requestAnimationFrame(animate);
      
        return () => cancelAnimationFrame(animationFrameId);
      }, [dragPosition, boardPosition, x, y, updateImmediately]);
      

    const backgroundPosition = useTransform([x, y], ([latestX, latestY]) => {
        return `-${latestX}px -${latestY}px`;
    });

    const onPressStart = (event : TouchEvent | MouseEvent) => {
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
            extraClasses={`interactive ${isSelected ? 'selected' : ''}`}
            props={{
                style: {
                    x,
                    y,
                    width: GRID_SIZE,
                    height: GRID_SIZE,
                    position: 'absolute',
                    top: 0,
                    left: 0,
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