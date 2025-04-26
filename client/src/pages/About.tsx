import { IoMail, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";

import DocumentPage from "../components/DocumentPage"
import LetterHeader from "../components/LetterHeader"
import HomeLink from "../components/HomeLink";

export default function About() {
    return (
        <DocumentPage>
            <LetterHeader text="About" />
            <h2>LetterGrams</h2>
            <p>
                This is a simple playground for manipulating letter tiles.
                Share with your friends to compete to see who can form a valid scrabble grid the fastest!
            </p>
            <h2>Contact</h2>
            <a href="mailto:isaac.cinquini@gmail.com">
                <div className="contact-row">
                <IoMail />
                <span>isaac.cinquini@gmail.com</span>
                </div>
            </a>
            <a href="https://www.linkedin.com/in/zackcinquini">
                <div className="contact-row">
                <IoLogoLinkedin />
                <span>linkedin.com/in/zackcinquini</span>
                </div>
            </a>
            <a href="https://github.com/zack5">
                <div className="contact-row">
                <IoLogoGithub />
                <span>github.com/zack5</span>
                </div>
            </a>
            <br />
            <HomeLink />
        </DocumentPage>
    )
}