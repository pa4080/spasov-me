import React, { useState, useEffect } from "react";
import "./title.css";

function Title(props) {
    return (
        <div className="mlt-resume-leading-section-grid mlt-resume-section">
            <div className="mlt-resume-leading-section-row-1">
                <div>{props.data.title}</div>
            </div>
            <div className="mlt-resume-photo-container">
                <div className="mlt-resume-photo-wrapper">
                    <img src={props.photo} alt="Illustration of this section." className="mlt-resume-photo-img" width="260" height="260" />
                </div>
            </div>
            <div className="mlt-resume-leading-section-row-2">
                <p>
                    {props.data.subtitle}
                </p>
            </div>
        </div>
    );
}

export default Title;