import DocumentPage from "../components/DocumentPage"
import LetterHeader from "../components/LetterHeader"

export default function NotFound() {
    return (
        <DocumentPage>
            <LetterHeader text="Error"/>
            <h2>Oops!</h2>
            <p>Page not found.</p>
        </DocumentPage>
    );
}