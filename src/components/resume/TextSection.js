import React, { useState, useEffect, useRef } from "react";
import Button from "../button/Button";
import "./textSection.css";

import resumeTextFile from "../../assets/data/resume.txt";

function TextSection(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [resumeText, setResumeText] = useState([]);

    const leadingParagraphs = 1;
    const section = useRef(null);

    const expandSection = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);
    };

    const scrollToSection = () => {
        setTimeout(()=>{section.current.scrollIntoView({ behavior: "smooth", block: "start" })}, 1);
    };

    async function fetchData(file, type = "json") {
        const res = await fetch(file);
        return res[type](); // res.json(); res.text(); ...
    }

    async function processResumeData() {
        if (resumeText.length === 0) {
            const text = await fetchData(resumeTextFile, 'text');
            setResumeText(text.split('\n'));
        }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { processResumeData(); }, []);

    return (
        <div className="mlt-resume-text-section-grid mlt-resume-section"  ref={section}>
            <h1>Resume</h1>
            {isExpanded
                ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                : <Button text="Read more" onClick={expandSection} btnType="read-more" />
            }
            <div className="mlt-resume-text-section-wrapper">
                {resumeText
                    .slice(0, leadingParagraphs)
                    .map((paragraph, index) =>
                        <p key={`resume-text-${index}`}>{paragraph}</p>
                    )
                }

                {isExpanded ?
                    <>
                        {resumeText
                            .slice(leadingParagraphs)
                            .map((paragraph, index) =>
                            <p key={`resume-text-${index + leadingParagraphs}`}>{paragraph}</p>
                            )
                        }
                        {scrollToSection()}
                    </>
                    : null}
            </div>
        </div>
    );
}

export default TextSection;