import mltLogoText from "../../assets/images/SVG/mlt.logo.text.svg";
import "./home.css";

function Logo(props) {
    return (
        <>
            <link rel="preload" as="image" href={mltLogoText} />
            <div className="mlt-logo-container">
                <img src={mltLogoText} alt="metalevel.tech logo" className="mlt-logo-text-img" width="640" height="119" />
                <div className="mlt-logo-leading-text">
                    {props.leadingText}
                </div>
            </div>
        </>
    );
}

export default Logo;