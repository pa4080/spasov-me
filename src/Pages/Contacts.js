import BusinessCard from "../components/contacts-sections/BusinessCard";

import "./contacts.css";

function About({ data, contactsTitleImage }) {
    return (
        <div className="mlt-contacts-container">
            <BusinessCard image={contactsTitleImage} data={data} />
            <p>&nbsp;</p>
        </div>
    );
}

export default About;