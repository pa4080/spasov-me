import BusinessCard from "../components/contacts-sections/BusinessCard";

import "./contacts.css";

function About({ data, contactsTitleImage, cvPdf }) {
    return (
        <div className="mlt-contacts-container">
            <BusinessCard image={contactsTitleImage} data={data} cvPdf={cvPdf} />
            {/* <p>&nbsp;</p> */}
        </div>
    );
}

export default About;