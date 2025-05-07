import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

import { ContextGameProvider } from "./contexts/ContextGame";

import About from './pages/About'
import Game from './pages/Game'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play/" element={<Navigate to="/play/LetterGrams" replace />} />
                <Route path="/play/:letters" element={
                    <ContextGameProvider>
                        <Game />
                    </ContextGameProvider>} />
                <Route path="/daily" element={
                    <ContextGameProvider>
                        <Game isDailyGame={true} />
                    </ContextGameProvider>} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}
