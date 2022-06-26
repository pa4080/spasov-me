import React from "react";
import './cell1x3.css';

function Cell1x3(props) {
    const {
        from, to, country, city, office, at, description
    } = props.data;
    const toYear = to === 'now' ? new Date().getFullYear() : to;

    return (
        <div className="mlt-table-unit-2x2-grid">
            <div className="mlt-table-unit-2x2-period-location">
                <p className="mlt-table-unit-2x2-period" >
                    <span>{from} - {toYear}</span>
                </p>
                <p className="mlt-table-unit-2x2-location">
                    { country ? <span>{city}, {country}</span> : null}
                </p>
            </div>
            <div className="mlt-table-unit-2x2-office-at-description">
                <p className="mlt-table-unit-2x2-office-at">
                    {office ? <span className="mlt-table-unit-2x2-office">{office}</span> : null}
                    {office && at ? " at " : null}
                    {at ? <span className="mlt-table-unit-2x2-at">{at}.</span> : "."}
                </p>
                {description ? <p className="mlt-table-unit-2x2-description">{description}.</p> : null}

            </div>
        </div>
    )
}

export default Cell1x3;