/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import mltLogo from "../assets/images/SVG/mlt.logo.text.svg";
import "./LogoWithCounter.css";

function LogoWithCounter(props) {
    const [counter, setCounter] = useState(30);

    function countDown(seconds) {
        seconds--;
        if (seconds >= 0) {
            setTimeout(() => {
                setCounter(seconds);
                countDown(seconds);
            }, 1000);
        } else {
            console.log('window.open("https://wiki.metalevel.tech/wiki/Home")');
        }
    }

    useEffect(() => {
        if (props.counter) countDown(counter);
    }, []);

    return (
        <React.Fragment>
            <link rel="preload" as="image" href={mltLogo} />
            <div className="mlt-logo-container">
                <img src={mltLogo} alt="metalevel.tech logo" className="mlt-logo-img" width="640" height="119" />
                {props.counter ? <div className="mlt-redirect-counter">{counter}</div> : null}
            </div>
        </React.Fragment>
    );
}

export default LogoWithCounter;