import './tapToShow.css';

function TapToShow({ expandSection, isExpanded }) {
    return (
        <div className="mlt-tapToShow-wrapper">
            <div
                className={`mlt-tapToShow-button noSelect mlt-tapToShow-${isExpanded ? "active" : "disabled"}`}
                onClick={expandSection}
            >
                <i className="icon i-fingerprint" />
            </div>
        </div>
    );
}

export default TapToShow;