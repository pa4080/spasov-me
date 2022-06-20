import "./HeaderMenu.css";

function FooterLinks(props) {
    return (
        <div className="mlt-header-menu-container">
            <div className="mlt-header-menu-item">Home</div>
            <div className="mlt-header-menu-item">About</div>
        </div>
        // <div className="mlt-footer-links">
        //     <a className="regular-icon" href="https://github.com/metalevel-tech" target="_blank" rel="noopener noreferrer">
        //         <img src={props} alt="GitHub Icon" width={32} height={32} />
        //     </a>
        //     <a className="regular-icon" href="https://askubuntu.com/users/566421/pa4080" target="_blank" rel="noopener noreferrer">
        //         <img src={props} alt="AskUbuntu Icon"  width={32} height={32} />
        //     </a>
        //     <a className="own-source-icon" href="https://wiki.metalevel.tech" target="_blank" rel="noopener noreferrer">
        //         <img src={props} alt="MLT Icon" width={32} height={32} />
        //     </a>
        //     <a className="regular-icon" href="https://www.linkedin.com/in/spas-z-spasov" target="_blank" rel="noopener noreferrer">
        //         <img src={props} alt="LinkedIn Icon" width={32} height={32} />
        //     </a>
        //     <a className="regular-icon" href="https://meta.wikimedia.org/wiki/User:Spas.Z.Spasov" target="_blank" rel="noopener noreferrer">
        //         <img src={props} alt="MediaWiki Icon" width={32} height={32} />
        //     </a>
        // </div>
    )
}

export default FooterLinks;