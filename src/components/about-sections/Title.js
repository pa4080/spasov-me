import "./title.css";

function Title(props) {
    return (
        <div className="mlt-about-title-section-grid mlt-about-section">
            <div className="mlt-about-title-section-row-1">
                <div>{props.data.title}</div>
            </div>
            <div className="mlt-about-photo-container">
                <div className="mlt-about-photo-wrapper">
                    <img
                        alt="Illustration of this section." width="260" height="260"
                        src={props.photo}
                        className="mlt-about-photo-img"
                    />
                </div>
            </div>
            <div className="mlt-about-title-section-row-2">
                <p>
                    {props.data.subtitle}
                </p>
            </div>
        </div>
    );
}

export default Title;