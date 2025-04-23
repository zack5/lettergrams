import Letter from "./Letter";

export default function LetterHeader({text} : {text: string}) {
    const elems = text.toUpperCase().split('').map((letter, index) => {
        return <Letter key={index} letter={letter} />;
    });
    return <div className="letter-header">{elems}</div>;
}