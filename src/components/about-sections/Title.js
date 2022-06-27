import "./title.css";

function Title(props) {
    return (
        <div className="mlt-about-leading-section-grid mlt-about-section">
            <div className="mlt-about-leading-section-row-1">
                <div>{props.data.title}</div>
            </div>
            <div className="mlt-about-photo-container">
                <div className="mlt-about-photo-wrapper">
                    <img src={props.photo} alt="Illustration of this section." className="mlt-about-photo-img" width="260" height="260" />
                </div>
            </div>
            <div className="mlt-about-leading-section-row-2">
                <p>
                    {props.data.subtitle}
                </p>
            </div>
        </div>
    );
}

export default Title;