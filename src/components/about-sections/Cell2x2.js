import React from "react";
import './cell2x2.css';

function Cell2x2(props) {
    const {
        from, to, country, city, position, at, office, description
    } = props.data;
    const toYear = to === 'now' ? new Date().getFullYear() : to;

    return (
        <div className="mlt-cell-2x2-grid">
            <div className="mlt-cell-2x2-col-1">
                <p className="mlt-cell-2x2-col-1-row-1" >
                    <span>{from} - {toYear}</span>
                </p>
                <p className="mlt-cell-2x2-col-1-row-2">
                    { country ? <span>{city}, {country}</span> : null}
                </p>
            </div>
            <div className="mlt-cell-2x2-col-2">
                <p className="mlt-cell-2x2-col-2-row-1">
                    {position ? <span className="mlt-cell-2x2-col-2-row-1-position">{position}</span> : null}
                    {position && office && at ? <span>{at}</span> : null}
                    {office ? <span className="mlt-cell-2x2-col-2-row-1-position-at">{office}.</span> : "."}
                </p>
                {description ? <p className="mlt-cell-2x2-col-2-row-2">{description}.</p> : null}

            </div>
        </div>
    )
}

export default Cell2x2;