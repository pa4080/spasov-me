import Title from "../components/about-sections/Title";
import Section from "../components/about-sections/Section"

import "./about.css";

function About({ data, aboutTitleImage }) {
    return (
        <div className="mlt-about-container">
            <Title photo={aboutTitleImage} data={data.identity} />
            <Section title="Resume" data={data.resume} component="Cell1x1Text" staticRows={2} />
            <Section title="Edu­cation" data={data.education} component="Cell2x2" staticRows={2} tapToShow={true} />
            <Section title="Employ­ment History" data={data.employmentHistory} component="Cell2x2" staticRows={2} tapToShow={true} />
            <Section title="Spo­ken Lang­uag­es" data={data.languages} component="Cell1x3Stars" staticRows={data.languages.length} />
            <Section title="IT Skills and Expe­rien­ce" data={data.skills} component="Cell1x3Stars" staticRows={6} tapToShow={true} />
            {/* <p>&nbsp;</p> */}
        </div>
    );
}

export default About;