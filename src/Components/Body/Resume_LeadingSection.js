import szsPhoto from "../../assets/images/Photos/spas-z-spasov-7-photo.square.jpg";
import "./resume_LeadingSection.css";

function LeadingSection(props) {
    return (
        <>
            <link rel="preload" as="image" href={szsPhoto} />
            <div className="mlt-resume-leading-section-grid mlt-resume-section">
                <div className="mlt-resume-leading-section-row-1">
                    <p>Spas Zdravkov Spasov</p>
                </div>
                <div className="mlt-resume-photo-container">
                    <img src={szsPhoto} alt="metalevel.tech logo" className="mlt-resume-photo-img" width="260" height="260" />
                </div>
                <div className="mlt-resume-leading-section-row-2">
                    <p>Computers and computer science in general have been my hobby since I was eight years old. Last year I decided to follow my dreams and turn this hobby into a new professional career.</p>
                </div>
            </div>

        </>
    );
}

export default LeadingSection;