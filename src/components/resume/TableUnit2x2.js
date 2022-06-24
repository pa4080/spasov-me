import React from "react";
import './tableUnit2x2.css';

function TableUnit2x2(props) {
    const {
        from, to, country, city, office, at, description
    } = props.data;


    return (
        <div className="mlt-table-unit-2x2-grid">
            <div className="mlt-table-unit-2x2-period-location">
                <p className="mlt-table-unit-2x2-period" >
                    <span>{from} - {to}</span>
                </p>
                <p className="mlt-table-unit-2x2-location">
                    { country ? <span>{city}, {country}</span> : null}
                </p>
            </div>
            <div className="mlt-table-unit-2x2-office-at-description">
                <p className="mlt-table-unit-2x2-office-at">
                    {office ? <span className="mlt-table-unit-2x2-office">{office}</span> : null}
                    {at ? <span className="mlt-table-unit-2x2-at"> {at}.</span> : "."}
                </p>
                {description ? <p className="mlt-table-unit-2x2-description">{description}.</p> : null}

            </div>
        </div>
    )
}

export default TableUnit2x2;