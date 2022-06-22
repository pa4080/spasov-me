import LeadingSection from "../Body/Resume_LeadingSection";
import TextSection from "../Body/Resume_TextSection"
import szsPhoto from "../../assets/images/Photos/spas-z-spasov-7-photo.square.small.jpg";
import "./resume.css";

function Logo(props) {
    return (
        <>
            <link rel="preload" as="image" href={szsPhoto} />
            <div className="mlt-resume-container">
                <LeadingSection />
                <TextSection />
                {/* <TextSection /> */}

            </div>
        </>
    );
}

export default Logo;