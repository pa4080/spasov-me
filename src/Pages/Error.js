import mltLogo from "../assets/images/SVG/mlt.logo.svg";
import "./error.css"; 

function Error(props) {
    return (
        <>
            <link rel="preload" as="image" href={mltLogo} />
            <div className="mlt-error-container">
                <img src={mltLogo} alt="metalevel.tech logo" className="mlt-logo-img" width="260" height="260" />
                <div className="mlt-http-error-desc">
                    {`HTTP ERROR ${props.number}: ${props.desc} Probably we are working on it`}
                </div>
                <div className="mlt-http-error-number">
                    {props.number}
                </div>
            </div>
        </>
    );
}

export default Error;