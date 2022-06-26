import React, { useState, useEffect, useRef } from "react";
import Button from "../button/Button";
import TableCell from "./Cell1x3";
import "./languages.css";

import languagesEntriesFile from "../../assets/data/resume-languages.json";

function LanguagesSection(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [languagesEntries, setLanguagesEntries] = useState([]);

    const leadingParagraphs = 1;
    const section = useRef(null);

    const expandSection = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);
    };

    const scrollToSection = () => {
        setTimeout(() => {
            section.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1);
    };

    useEffect(() => {
        if (languagesEntries.length === 0) {
            setLanguagesEntries(languagesEntriesFile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mlt-resume-languages-section-grid mlt-resume-section" ref={section}>
            {isExpanded
                ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                : <Button text="Read more" onClick={expandSection} btnType="read-more" />
            }
            <h1>Education</h1>
            <div className="mlt-resume-education-section-wrapper">
                {languagesEntries
                    .slice(0, leadingParagraphs)
                    .map((entry, index) =>
                        <TableCell key={`education-entry-${index}`} data={entry} />
                    )
                }

                {isExpanded ?
                    <>
                        {languagesEntries
                            .slice(leadingParagraphs)
                            .map((entry, index) =>
                                <TableCell key={`education-entry-${index + leadingParagraphs}`} data={entry} />
                            )
                        }
                        {scrollToSection()}
                    </>
                    : null}

            </div>
        </div>
    );
}

export default LanguagesSection;