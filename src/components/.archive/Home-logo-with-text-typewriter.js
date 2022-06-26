/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import mltLogoText from "../../assets/images/SVG/mlt.logo.text.svg";
import "./home-logo-with-text.css";

function Logo(props) {
    // const [counter, setCounter] = useState(30);
    const [leadingText, setLeadingText] = useState("");

    function typeText(text = 'abc', output = '') {
        const firstLetter = text.charAt(0);
        text = text.slice(1);
        output = `${output}${firstLetter}`;
        setLeadingText(output);

        if (text !== '') {
            setTimeout(() => {
                typeText(text, output);
            }, 33 - text.length);
        }
    }

    useEffect(() => {
        if (props.leadingTextTypewriter) {
            setTimeout(() => { typeText(props.leadingText); }, 700);
        } else {
            setLeadingText(props.leadingText);
        }
    }, []);

    return (
        <React.Fragment>
            <link rel="preload" as="image" href={mltLogoText} />
            <div className="mlt-logo-container">
                <img src={mltLogoText} alt="metalevel.tech logo" className="mlt-logo-img" width="640" height="119" />
                <div
                    className={`mlt-logo-leading-text${props.leadingTextTypewriter ? ' typewriter' : ''}`}>
                    {leadingText}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Logo;