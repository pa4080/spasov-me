/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, createContext } from "react";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/helpers/ScrollToTop";
import calculateHWUnits from "./components/helpers/CalcHWUnits";

import TopMenu from "./components/header/TopMenu";
import Home from "./Pages/Home";
import Error from "./Pages/Error";
import About from "./Pages/About";
import FooterLinks from "./components/footer/FooterLinks";

import mltLogoTextWide from "./assets/images/SVG/mlt.logo.text.svg";
import mltLogoTextSmall from "./assets/images/SVG/mlt.logo.text.small.svg";

import aboutTitleImage from "./assets/images/Photos/spas-z-spasov-7-photo.square.small.webp";
import data from "./assets/data/about.json";

import "./App.css";

// The main class of the application.
function App(props) {
    useEffect(() => {
        // Calculate the real height of the client window (for mobile devices).
        calculateHWUnits();
        window.addEventListener("resize", calculateHWUnits);

        // unsubscribe "onComponentDestroy"
        return () => {
            window.removeEventListener("resize", calculateHWUnits);
        };
    }, []);

    return (
        <div className="mlt-flex-container">
            <link rel="preload" as="image" href={mltLogoTextWide} />
            <link rel="preload" as="image" href={mltLogoTextSmall} />
            <link rel="preload" as="image" href={aboutTitleImage} />
            <Router>
                <ScrollToTop />
                <div className="mlt-header">
                    <TopMenu />
                </div>

                <div className="mlt-pages">
                    <Routes>
                        <Route path="/" element={<Home leadingText="by Spas Z. Spasov" logoFull={mltLogoTextWide} logoSmall={mltLogoTextSmall} />} />
                        <Route path="/home" element={<Home leadingText="by Spas Z. Spasov" logoFull={mltLogoTextWide} logoSmall={mltLogoTextSmall} />} />
                        <Route path="/about" element={<About data={data} aboutTitleImage={aboutTitleImage} />} />
                        <Route path="*" element={<Error number="404" desc="Page not found" />} />
                    </Routes>
                </div>
            </Router>

            <div className="mlt-footer">
                <FooterLinks />
            </div>
        </div>
    );
}

export { App as default };
