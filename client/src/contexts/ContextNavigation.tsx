// LetterContext.tsx
import { createContext, useState, useEffect } from 'react';

const ContextNavigation = createContext<{
    registerDraggedLetter: (id: string) => void;
    currentDraggedId: string | null;
}>({ registerDraggedLetter: () => {}, currentDraggedId: null });

export default function ContextNavigationProvider({ children }: { children: React.ReactNode }) {
    const [currentDraggedId, setCurrentDraggedId] = useState<string | null>(null);

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (currentDraggedId) {
                // Handle drag end logic
                setCurrentDraggedId(null);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [currentDraggedId]);

    return (
        <ContextNavigation.Provider value={{ 
            registerDraggedLetter: setCurrentDraggedId,
            currentDraggedId 
        }}>
            {children}
        </ContextNavigation.Provider>
    );
}