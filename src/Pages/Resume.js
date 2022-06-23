import LeadingSection from "../components/resume/LeadingSection";
import TextSection from "../components/resume/TextSection"
import EducationSection from "../components/resume/EducationSection"
import szsPhoto from "../assets/images/Photos/spas-z-spasov-7-photo.square.small.jpg";
import "./resume.css";

function Logo(props) {
    
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