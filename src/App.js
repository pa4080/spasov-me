/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, createContext } from "react";
import React, { useState, useEffect } from "react";
import mltLogo from "./assets/images/mlt.logo.text.svg";
import "./App.css";

// The main class of the application.
function App(props) {
    const [counter, setCounter] = useState(10);

    function countDown(seconds) {
        seconds--;
        if (seconds > 0) {
            setTimeout(() => {
                setCounter(seconds);
                countDown(seconds);
            }, 1000);
        } else {
            window.location.href = "https://wiki.metalevel.tech/wiki/Home";
        }
    }

    useEffect(() => {
        countDown(counter);
    }, []);

    return (
        <React.Fragment>
            <div className="mlt-flex-container">
                <div className="mlt-log-container">
                    <img src={mltLogo} alt="metalevel.tech logo" className="mlt-logo-img" />
                    <div className="mlt-redirect-counter" >{counter}</div>
                </div>
            </div>
        </React.Fragment>
    );
}

export { App as default };
