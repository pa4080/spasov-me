import "./footerLinks.css";
import iconGitHub from "../../assets/icons/github-gray.svg";
import iconUbuntu from "../../assets/icons/ubuntu-gray.svg";
import iconLinkedIn from "../../assets/icons/linked-in-gray-square.svg";
import iconWikiMedia from "../../assets/icons/wikimedia-gray.svg";
import iconMlt from "../../assets/images/SVG/mlw.icon.blue-gray.svg";

function FooterLinks(props) {
    return (
        <div className="mlt-footer-links">
            <a className="regular-icon" href="https://github.com/metalevel-tech" target="_blank" rel="noopener noreferrer">
                <img src={iconGitHub} alt="GitHub Icon" width={32} height={32} />
            </a>
            <a className="regular-icon" href="https://askubuntu.com/users/566421/pa4080" target="_blank" rel="noopener noreferrer">
                <img src={iconUbuntu} alt="AskUbuntu Icon"  width={32} height={32} />
            </a>
            <a className="mlw-icon" href="https://wiki.metalevel.tech" target="_blank" rel="noopener noreferrer">
                <img src={iconMlt} alt="MLT Icon" width={32} height={32} />
            </a>
            <a className="regular-icon" href="https://www.linkedin.com/in/spas-z-spasov" target="_blank" rel="noopener noreferrer">
                <img src={iconLinkedIn} alt="LinkedIn Icon" width={32} height={32} />
            </a>
            <a className="regular-icon" href="https://meta.wikimedia.org/wiki/User:Spas.Z.Spasov" target="_blank" rel="noopener noreferrer">
                <img src={iconWikiMedia} alt="MediaWiki Icon" width={32} height={32} />
            </a>
        </div>
    )
}

export default FooterLinks;