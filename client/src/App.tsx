import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ContextNavigationProvider } from "./contexts/ContextNavigation";

import About from './pages/About'
import Game from './pages/Game'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <ContextNavigationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Game letters="ABC" />} />
              <Route path="/play/:letters" element={<Game />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
          </BrowserRouter>
      </ContextNavigationProvider>
    </>
  )
}
