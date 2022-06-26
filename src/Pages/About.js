// import { useEffect, useState } from "react";

import Title from "../components/about-sections/Title";
import Section from "../components/about-sections/Section"

import "./about.css";

import imageTitle from "../assets/images/Photos/spas-z-spasov-7-photo.square.small.webp";

import data from "../assets/data/about.json";

function Logo(props) {
    return (
        <>
            <link rel="preload" as="image" href={imageTitle} />
            <div className="mlt-resume-container">
                <Title   photo={imageTitle} data={data.title} />
                <Section title="Resume" data={data.resume} component="Cell1x1Text" />
                <Section title="Education" data={data.education} component="Cell2x2" />
                <Section title="Employment history" data={data.employmentHistory} component="Cell2x2" />
            </div>
        </>
    );
}

export default Logo;