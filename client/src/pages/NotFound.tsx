import DocumentPage from "../components/DocumentPage"
import LetterHeader from "../components/LetterHeader"
import HomeLink from "../components/HomeLink"

export default function NotFound() {
    return (
        <DocumentPage>
            <main>
                <LetterHeader text="Error"/>
                <h2>Oops!</h2>
                <p>Page not found.</p>
                <br />
                <HomeLink />
            </main>
        </DocumentPage>
    );
}