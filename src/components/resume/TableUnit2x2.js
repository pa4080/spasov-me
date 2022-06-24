import React from "react";
import './tableUnit2x2.css';

function TableUnit2x2({ data }) {
    return (
        <div className="mlt-table-unit-2x2-grid">
            <div className="mlt-table-unit-2x2-period-location">
                <p className="mlt-table-unit-2x2-period" >
                    <span>2019</span> - <span>2021</span>
                </p>
                <p className="mlt-table-unit-2x2-location">
                    <span>Sofia</span>, <span>Bulgaria</span>
                </p>
            </div>
            <div className="mlt-table-unit-2x2-office-at-description">
                <p className="mlt-table-unit-2x2-office-at">
                    <span className="mlt-table-unit-2x2-office">Management consultant</span>{' '}
                    <span className="mlt-table-unit-2x2-at">at Somewhere...</span>.
                </p>
                <p className="mlt-table-unit-2x2-description">
                    Positions and activities: ... Positions and activities: ... Positions and activities: ... Positions and activities: ... Positions and activities: ... Positions and activities: ...
                </p>

            </div>
        </div>
    )
}

export default TableUnit2x2;