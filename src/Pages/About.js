// import { useEffect, useState } from "react";

import Title from "../components/resume-sections/Title";
import Section from "../components/resume-sections/Section"

import "./about.css";

import dataResume from "../assets/data/resume-text.json";
import dataEducation from "../assets/data/resume-education.json";
import dataEmpHistory from "../assets/data/resume-emp-history.json";

function Logo(props) {
    return (
        <div className="mlt-resume-container">
            <Title />
            <Section title="Resume" data={dataResume} component="Cell1x1Text" />
            <Section title="Education" data={dataEducation} component="Cell2x2" />
            <Section title="Employment history" data={dataEmpHistory} component="Cell2x2" />
        </div>
    );
}

export default Logo;