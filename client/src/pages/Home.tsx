import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input, Label, Field } from '@headlessui/react'
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

import AnimatingLetters from "../components/AnimatingLetters"
import DocumentPage from "../components/DocumentPage"
import { getRandomLetters } from "../utils/Utils"

export default function Home() {
    const [letters, setLetters] = useState<string>("");
    const lettersInputRef = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();

    const handleSubmitCustomGame = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const lettersInput = lettersInputRef.current;

        if (lettersInput) {
            const letterOnlyRegex = /^[A-Za-z]+$/;
            if (!letterOnlyRegex.test(lettersInput.value)) {
                lettersInput.setCustomValidity("Please enter only letters.")
                lettersInput.reportValidity();
                return;
            }

            lettersInput.setCustomValidity("");
            navigate(`/play/${letters}`);
        }
    }

    const handleSubmitDailyGame = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/daily`);
    }

    return (
        <DocumentPage>
            <div className="page-container">
                <AnimatingLetters />
                <div className="mobile-only">
                    <b>Warning:</b> LetterGrams is not yet optimized for mobile!
                </div>
                <form onSubmit={handleSubmitDailyGame} aria-labelledby="playDailyFormTitle">
                    <h2 id="playDailyFormTitle" className="visually-hidden">Enter letters to play with:</h2>
                    <button
                        type="submit"
                        aria-label="Play Daily Game"
                    >
                        Play Daily Game!
                    </button>
                </form>
                <hr className="divider" />
                <form onSubmit={handleSubmitCustomGame} aria-labelledby="lettersFormTitle">
                    <h2 id="lettersFormTitle" className="visually-hidden">Enter letters to play with:</h2>
                    <Field className="letters-input-field">
                        <Label className="visually-hidden">Letters:</Label>
                        <Input
                            className="custom-input"
                            ref={lettersInputRef}
                            type="text"
                            name="lettersInput"
                            placeholder="Enter letters"
                            value={letters}
                            maxLength={30}
                            onChange={(event) => setLetters(event.target.value)}
                            required
                            aria-required="true"
                        />
                        <button
                            type="button"
                            aria-label="Random letters"
                            onClick={() => setLetters(getRandomLetters())}
                            style={{
                                padding: '0rem',
                                height: '2.2rem',
                                width: '2.2rem',
                                backgroundColor: 'transparent',
                            }}
                        >
                            <GiPerspectiveDiceSixFacesRandom style={{ fontSize: '2rem' }} />
                        </button>
                    </Field>

                    <button
                        type="submit"
                        aria-label="Play Custom Game"
                    >
                        Play Custom Game!
                    </button>
                </form>
            </div>
            <footer>
                <Link to="/about">About</Link>
            </footer>
        </DocumentPage>
    )
}