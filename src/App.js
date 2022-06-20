/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, createContext } from "react";
// import React, { useState, useEffect } from "react";
import React from "react";
import LogoWithCounter from "./components/LogoWithCounter";
import FooterLinks from "./components/FooterLinks";
import "./App.css";

// The main class of the application.
function App(props) {
    return (
        <div className="mlt-flex-container">
            <div className="mlt-header"></div>
            <div className="mlt-body">
                <LogoWithCounter counter={false} />
            </div>
            <div className="mlt-footer">
                <FooterLinks />
            </div>
        </div>
    );
}

export { App as default };
