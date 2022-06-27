import React, { useState, useEffect } from "react";
import "./logo.css";

// import mltLogoTextWide from "../../assets/images/SVG/mlt.logo.text.svg";
// import mltLogoTextSmall from "../../assets/images/SVG/mlt.logo.text.small.svg";

function Logo(props) {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    // let screenWidth = window.innerWidth;
    const [logo, setLogo] = useState({
        src: props.logoFull,
        alt: "Site full logo.",
        width: 640,
        height: 119,
        breakPoint: 580
    });

    const handleResizeWindow = () => setScreenWidth(window.innerWidth);
    // const handleResizeWindow = () => setScreenWidth(window.innerWidth);

    useEffect(() => {
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow);

        // unsubscribe "onComponentDestroy"
        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);

    if (screenWidth <= logo.breakPoint && logo.src !== props.logoSmall) {
        setLogo({...logo, src: props.logoSmall, width: 521, height: 181});
    } else if (screenWidth > logo.breakPoint && logo.src !== props.logoFull) {
        setLogo({...logo, src: props.logoFull, width: 640, height: 119});
    }

    return (
        <>
            <div className="mlt-logo-container">
                <img src={logo.src} alt={logo.alt} className="mlt-logo-text-img" width={logo.width} height={logo.height} />
                <div className="mlt-logo-leading-text">
                    {props.leadingText}
                </div>
            </div>
        </>
    );
}

export default Logo;