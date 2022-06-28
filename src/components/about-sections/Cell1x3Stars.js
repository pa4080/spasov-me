import React, { useState } from "react";
import TapToShow from "./TapToShow";
import './cell1x3Stars.css';

function Cell1x3Stars(props) {
    const {
        name, points, description
    } = props.data;

    const [isExpanded, setIsExpanded] = useState(false);

    const expandSection = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);
    };

    const stars = (function drawStars(points) {
        const stars = [];
        const singleStarWeight = 10;
        const maxStars = 5;
        const fullStars = Math.floor(points / singleStarWeight);
        const halfStars = (points % singleStarWeight > 0) ? 1 : 0;
        const emptyStars = maxStars - fullStars - halfStars;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i className="icon i-full-star i-default-bg" key={`${name}-star-${i}`} />);
        }
        for (let i = fullStars; i < (fullStars + halfStars); i++) {
            stars.push(<i className="icon i-half-star i-default-bg" key={`${name}-star-${i}`} />);
        }
        for (let i = (fullStars + halfStars); i < (fullStars + halfStars + emptyStars); i++) {
            stars.push(<i className="icon i-empty-star i-default-bg" key={`${name}-star-${i}`} />);
        }

        return stars;
    })(points);

    return (
        <div className={`mlt-cell-1x3-grid ${props.tapToShow ? "mlt-tapToShow" : ""}`}>
            <div className="mlt-cell-1x3-col-1">
                <p className="mlt-cell-1x3-col-1-row-1">
                    {name}
                </p>
            </div>
            <div className="mlt-cell-1x3-col-2">
                <p className="mlt-cell-1x3-col-2-row-1">
                    {stars}
                </p>
            </div>
            {(props.tapToShow && description) 
                ? <TapToShow expandSection={expandSection} isExpanded={isExpanded} />
                : null
            }
            <div className={`mlt-cell-1x3-col-3 mlt-tapToShow-${isExpanded ? "expanded" : "collapsed"}`}>
                <p className="mlt-cell-1x3-col-3-row-1">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default Cell1x3Stars;
