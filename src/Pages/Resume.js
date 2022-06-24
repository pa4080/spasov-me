import LeadingSection from "../components/resume/LeadingSection";
import TextSection from "../components/resume/TextSection"
import EducationSection from "../components/resume/EducationSection"
import szsPhoto from "../assets/images/Photos/spas-z-spasov-7-photo.square.small.jpg";
import "./resume.css";
import { useEffect } from "react";

function Logo(props) {

    // Get the data
    async function fetchDataFrom(file) {
        const request = {
            url: file,
            init: { method: "GET" }
        };

        return fetch(request.url, request.init)
            .then(response => {
                console.log(response);
                if (response.ok) {
                    console.log(response.json());

                    // return response.json();
                }
                throw new Error(`Network response was not ok: ${response.status}`);
            })
            .catch(error => { console.log(`Trouble at task get: ${error}`); });
    }

    useEffect(() => {
        const response = fetchDataFrom("../../data/data.json");
        // console.log(response);  
    }, []);

    return (
        <>
            <link rel="preload" as="image" href={szsPhoto} />
            <div className="mlt-resume-container">
                <LeadingSection />
                <TextSection />
                <EducationSection />

            </div>
        </>
    );
}

export default Logo;