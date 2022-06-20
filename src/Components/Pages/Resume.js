import mltLogo from "../../assets/images/SVG/mlt.logo.svg";
import "./resume.css";

function Logo(props) {
    return (
        <>
            <link rel="preload" as="image" href={mltLogo} />
            <div className="mlt-resume-container">
                <img src={mltLogo} alt="metalevel.tech logo" className="mlt-logo-img" width="260" height="260" />
            </div>
        </>
    );
}

export default Logo;