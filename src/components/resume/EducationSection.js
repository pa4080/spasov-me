import React, { useState, useEffect, useRef } from "react";
import Button from "../button/Button";
import TableUnit2x2 from "./TableUnit2x2";
import "./educationSection.css";

import educationEntriesFile from "../../assets/data/education.json";

function EducationSection(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [educationEntries, setEducationEntries] = useState([]);

    const leadingParagraphs = 1;
    const section = useRef(null);

    const expandSection = () => {
        if (isExpanded) {
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
            setTimeout(()=>{section.current.scrollIntoView({ behavior: "smooth", block: "start" })}, 100);
        }
    }

    async function processResumeData() {
        if (educationEntries.length === 0) {
            setEducationEntries(educationEntriesFile);
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { processResumeData(); }, []);

    return (
        <div className="mlt-resume-education-section-grid mlt-resume-section" ref={section}>
            <h1>Education</h1>
            {isExpanded
                ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                : <Button text="Read more" onClick={expandSection} btnType="read-more" />
            }
            <div className="mlt-resume-education-section-wrapper">
                {educationEntries
                    .slice(0, leadingParagraphs)
                    .map((entry, index) =>
                        <TableUnit2x2 key={`education-entry-${index}`} data={entry} />
                    )
                }

                {isExpanded ?
                    <>
                        {educationEntries
                            .slice(leadingParagraphs)
                            .map((entry, index) =>
                                <TableUnit2x2 key={`education-entry-${index + leadingParagraphs}`} data={entry} />
                            )
                        }
                        {/* {setTimeout(()=>{section.current.scrollIntoView({ behavior: "smooth", block: "start" })}, 100)} */}
                    </>
                    : null}

            </div>
        </div>
    );
}

export default EducationSection;