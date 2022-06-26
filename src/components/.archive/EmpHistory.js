import React, { useState, useEffect, useRef } from "react";
import Button from "../../components/button/Button";
import TableUnit2x2 from "../../components/resume-sections/Table_2x2_Cell";
import "./empHistory.css";

import empHistEntriesFile from "../../assets/data/resume-emp-history.json";

function EmpHistSection(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [empHistEntries, setEmpHistEntries] = useState([]);

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
        if (empHistEntries.length === 0) {
            setEmpHistEntries(empHistEntriesFile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mlt-resume-emp-hist-section-grid mlt-resume-section" ref={section}>
            {isExpanded
                ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                : <Button text="Read more" onClick={expandSection} btnType="read-more" />
            }
            <h1>Employment history</h1>
            <div className="mlt-resume-emp-hist-section-wrapper">
                {empHistEntries
                    .slice(0, leadingParagraphs)
                    .map((entry, index) =>
                        <TableUnit2x2 key={`emp-hist-entry-${index}`} data={entry} />
                    )
                }

                {isExpanded ?
                    <>
                        {empHistEntries
                            .slice(leadingParagraphs)
                            .map((entry, index) =>
                                <TableUnit2x2 key={`emp-hist-entry-${index + leadingParagraphs}`} data={entry} />
                            )
                        }
                        {scrollToSection()}
                    </>
                    : null}

            </div>
        </div>
    );
}

export default EmpHistSection;