import { Link } from "react-router-dom";

export default function LogoInGame() {
    return (
        <div 
            className="in-game-text-container"
            style={{
                left: '20px',
                bottom: '20px',
            }}
        >
            <Link to="/">
                <h3 style={{margin:0}}>LetterGrams</h3>
            </Link>
        </div>
    )
}