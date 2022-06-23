import szsPhoto from "../../assets/images/Photos/spas-z-spasov-7-photo.square.small.webp";
import "./leadingSection.css";

function LeadingSection(props) {
    return (
        <>
            <link rel="preload" as="image" href={szsPhoto} />
            <div className="mlt-resume-leading-section-grid mlt-resume-section">
                <div className="mlt-resume-leading-section-row-1">
                    <p>Spas Zdravkov Spasov</p>
                </div>
                <div className="mlt-resume-photo-container">
                    <div className="mlt-resume-photo-wrapper">
                        <img src={szsPhoto} alt="metalevel.tech logo" className="mlt-resume-photo-img" width="260" height="260" />
                    </div>
                </div>
                <div className="mlt-resume-leading-section-row-2">
                    <p>
                        Computers and computer science in general have been my hobby since I was eight years old when I wrote my first program in Basic.
                    </p>
                </div>
            </div>

        </>
    );
}

export default LeadingSection;