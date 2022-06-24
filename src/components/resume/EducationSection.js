import React, { useState } from "react";
import Button from "../button/Button";
import TableUnit2x2 from "./TableUnit2x2";
import "./educationSection.css";


function TextSection(props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const expandSection = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);
    }

    return (
        <div className="mlt-resume-education-section-grid mlt-resume-section">
            <h1>Education</h1>
            {isExpanded
                ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                : <Button text="Read more" onClick={expandSection} btnType="read-more" />
            }

            <TableUnit2x2 />
        </div>
    );
}

export default TextSection;