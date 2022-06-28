// import { useEffect, useState } from "react";

import Title from "../components/about-sections/Title";
import Section from "../components/about-sections/Section"

import "./about.css";

// import aboutTitleImage from "../assets/images/Photos/spas-z-spasov-7-photo.square.small.webp";
// import data from "../assets/data/about.json";

function About({ data, aboutTitleImage }) {
    return (
        <>
            {/* <link rel="preload" as="image" href={aboutTitleImage} /> */}
            <div className="mlt-about-container">
                <Title photo={aboutTitleImage} data={data.title} />
                <Section title="Resume" data={data.resume} component="Cell1x1Text" staticRows={1} />
                <Section title="Edu­cation" data={data.education} component="Cell2x2" staticRows={1} />
                <Section title="Employ­ment History" data={data.employmentHistory} component="Cell2x2" staticRows={1} />
                <Section title="Spo­ken Lang­uag­es" data={data.languages} component="Cell1x3Stars" staticRows={data.languages.length} />
                <Section title="IT Skills and Expe­rien­ce" data={data.skills} component="Cell1x3Stars" staticRows={7} tapToShow={true} />
                <div>&nbsp;</div>
            </div>
        </>
    );
}

export default About;