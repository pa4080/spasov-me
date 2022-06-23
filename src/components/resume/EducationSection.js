import React, { useState } from "react";
import Button from "../button/Button";
import "./educationSection.css";


function TextSection(props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const expandSection = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);
    }

    return (
        <>
            <div className="mlt-resume-education-section-grid mlt-resume-section">
                <h1>Education</h1>
                <div style={{width: '100%'}} >12 12 12 12 1</div>
            </div>

        </>
    );
}

export default TextSection;