import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Game from './pages/Game'
import { ContextNavigationProvider } from "./contexts/ContextNavigation";

export default function App() {
  return (
    <>
      <ContextNavigationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Game letters="ABC" />} />
              <Route path="/play/:letters" element={<Game />} />
            </Routes>
          </BrowserRouter>
      </ContextNavigationProvider>
    </>
  )
}
