import { useNavigate } from "react-router-dom";

export default function LogoInGame() {
    const navigate = useNavigate();

    return (
        <button
            className="in-game-text-container bottom-left" 
            onClick={() => navigate('/')}>
            <h3 style={{margin:0}}>LetterGrams</h3>
        </button>
    )
}