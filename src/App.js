/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, createContext } from "react";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/helpers/ScrollToTop";
import calculateHWUnits from "./components/helpers/CalcHWUnits";

import Logo from "./Pages/Home";
import Error from "./Pages/Error";
import Resume from "./Pages/Resume";
import FooterLinks from "./components/footer/FooterLinks";
import TopMenu from "./components/header/TopMenu";
import "./App.css";

// The main class of the application.
function App(props) {
    useEffect(() => {
        calculateHWUnits();
        window.addEventListener("resize", calculateHWUnits);
    }, []);

    return (
        <div className="mlt-flex-container">
            <Router>
                <ScrollToTop />
                <div className="mlt-header">
                    <TopMenu />
                </div>

                <div className="mlt-pages">
                    <Routes>
                        <Route path="/" element={<Logo leadingText="by Spas Z. Spasov" />} />
                        <Route path="/home" element={<Logo leadingText="by Spas Z. Spasov" />} />
                        <Route path="/resume" element={<Resume />} />
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
