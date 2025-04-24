import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import AnimatingLetters from "../components/AnimatingLetters"
import DocumentPage from "../components/DocumentPage"

export default function Home() {
    const [letters, setLetters] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/play/${letters}`);
    }

    return (
        <DocumentPage>
            <div className="page-container">
                <AnimatingLetters />
                <form onSubmit={handleSubmit} aria-labelledby="lettersFormTitle">
                    <h2 id="lettersFormTitle" className="visually-hidden">Enter letters to play with:</h2>
                    <label htmlFor="lettersInput" className="visually-hidden">Letters:</label>
                    <input
                        id="lettersInput"
                        type="text"
                        name="lettersInput"
                        placeholder="Enter letters"
                        value={letters}
                        maxLength={30}
                        onChange = {(event) => setLetters(event.target.value)}
                        required
                        aria-required="true"
                    />

                    <motion.button
                        type="submit"
                        className="letter"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        aria-label="Play"
                    >
                        Play!
                    </motion.button>
                </form>
            </div>
            <footer>
                <Link to="/about">About</Link>
            </footer>
        </DocumentPage>
    )
}