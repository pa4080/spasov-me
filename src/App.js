/* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, createContext } from "react";
// import React, { useState, useEffect } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Logo from "./Components/Pages/Home";
import Error from "./Components/Pages/Error";
import Resume from "./Components/Pages/Resume";

import FooterLinks from "./Components/Footer/FooterLinks";
import TopMenu from "./Components/Header/TopMenu";
// import FooterLinks from "./Components/Footer/FooterLinks";
import "./App.css";

// The main class of the application.
function App(props) {
    return (
        <div className="mlt-flex-container">
            <Router>
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
