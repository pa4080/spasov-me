import React from "react";
import './cell1x3Stars.css';

function Cell1x3Stars(props) {
    const {
        name, points, description
    } = props.data;

    const stars = [];

    (function drawStars() {
        const maxStars = 5;
        const fullStars = Math.floor(points / 10);
        const halfStars = (points % 10 > 0) ? 1 : 0;
        const emptyStars = maxStars - fullStars - halfStars;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i className="icon-stars icon-full-stars icon-background" key={`${name}-star-${i}`} />);
        }
        for (let i = 0; i < halfStars; i++) {
            stars.push(<i className="icon-stars icon-half-stars icon-background" key={`${name}-star-${i}`} />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i className="icon-stars icon-empty-stars icon-background" key={`${name}-star-${i}`} />);
        }
    })();

    return (
        <div className="mlt-cell-1x3-grid">
            <div className="mlt-cell-1x3-col-1">
                <span className="mlt-cell-1x3-col-1-row-1">
                    {name}
                </span>
            </div>
            <div className="mlt-cell-1x3-col-2">
                <span className="mlt-cell-1x3-col-2-row-1">
                    {stars.map((star, index) => <span>{star}</span>)}
                </span>
            </div>
            <div className="mlt-cell-1x3-col-3">
                <span className="mlt-cell-1x3-col-3-row-1">
                    {description}
                </span>
            </div>
        </div>
    )
}

export default Cell1x3Stars;
