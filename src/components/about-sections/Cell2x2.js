import React, { useState } from "react";
import TapToShow from "./TapToShow";
import "./cell2x2.css";

function Cell2x2(props) {
  const { from, to, country, city, position, at, office, description } =
    props.data;
  const toYear = to.match(/(now|present)/) ? new Date().getFullYear() : to;

  const [isExpanded, setIsExpanded] = useState(false);

  const expandSection = () => {
    isExpanded ? setIsExpanded(false) : setIsExpanded(true);
  };

  return (
    <div
      className={`mlt-cell-2x2-grid ${props.tapToShow ? "mlt-tapToShow" : ""}`}
    >
      <div className="mlt-cell-2x2-col-1">
        <p className="mlt-cell-2x2-col-1-row-1">
          <span>
            {from} - {toYear}
          </span>
        </p>
        <p className="mlt-cell-2x2-col-1-row-2">
          {country ? (
            <span>
              {city}, {country}
            </span>
          ) : null}
        </p>
        {props.tapToShow && description ? (
          <TapToShow expandSection={expandSection} isExpanded={isExpanded} />
        ) : null}
      </div>
      <div className="mlt-cell-2x2-col-2">
        <p className="mlt-cell-2x2-col-2-row-1">
          {position ? (
            <span className="mlt-cell-2x2-col-2-row-1-position">
              {position}
            </span>
          ) : null}
          {position && office && at ? <span>{at}</span> : null}
          {office ? (
            <span className="mlt-cell-2x2-col-2-row-1-position-at">
              {office}.
            </span>
          ) : (
            "."
          )}
        </p>

        {description
          ? description.map((line, index) => (
              <p
                key={`${line.length}.${index}`}
                className={`mlt-cell-2x2-col-2-row-2 mlt-tapToShow-${
                  isExpanded ? "expanded" : "collapsed"
                }`}
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default Cell2x2;
