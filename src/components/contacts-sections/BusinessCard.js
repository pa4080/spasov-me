import Button from '../button/Button';
import "./businessCard.css";

function BusinessCard(props) {
    const takeSnapShot = () => {
        console.log('takeSnapShot');
    };

    return (
        <div className="mlt-contacts-section">
            <div className="mlt-business-card-section-grid">
                <div className="mlt-business-card-section-row-1">
                    <div>{props.data.title}</div>
                </div>
                <div className="mlt-business-card-image-container">
                    <div className="mlt-business-card-image-wrapper">
                        <img
                            alt="Illustration of this section." width="260" height="260"
                            src={props.image}
                            className="mlt-business-card-image"
                        />
                    </div>
                </div>
                <div className="mlt-business-card-section-row-2">
                    <p>
                        {props.data.email}
                    </p>
                    <p>
                        {props.data.location}
                    </p>
                </div>
                <div className="mlt-business-card-section-row-3">
                    <Button text="Contact us" onClick={takeSnapShot} />
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;