import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input, Label, Field } from '@headlessui/react'

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
                    <Field>
                        <Label htmlFor="lettersInput" className="visually-hidden">Letters:</Label>
                        <Input
                            className="custom-input"
                            id="lettersInput"
                            type="text"
                            name="lettersInput"
                            placeholder="Enter letters"
                            value={letters}
                            maxLength={30}
                            onChange={(event) => setLetters(event.target.value)}
                            required
                            aria-required="true"
                        />
                    </Field>

                    <button
                        type="submit"
                        aria-label="Play"
                    >
                        Play!
                    </button>
                </form>
            </div>
            <footer>
                <Link to="/about">About</Link>
            </footer>
        </DocumentPage>
    )
}