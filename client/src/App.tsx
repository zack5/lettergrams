import Game from './pages/Game'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game letters="ABC" />} />
        <Route path="/play/:letters" element={<Game />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}
