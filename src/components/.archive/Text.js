import React, { useState, useEffect, useRef } from "react";
import Button from "../button/Button";
import "./text.css";


function Text(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [resumeText, setResumeText] = useState([]);

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
        if (resumeText.length === 0) {
            setResumeText(props.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`mlt-${props.title.toLowerCase()}-section-grid mlt-resume-section`} ref={section}>
            {isExpanded
                ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                : <Button text="Read more" onClick={expandSection} btnType="read-more" />
            }
            <h1>{props.title}</h1>
            <div className={`mlt-${props.title.toLowerCase()}-section-wrapper`}>
                {resumeText
                    .slice(0, leadingParagraphs)
                    .map((paragraph, index) =>
                        <p key={`${props.title}-entry-${index}`}>{paragraph}</p>
                    )
                }

                {isExpanded ?
                    <>
                        {resumeText
                            .slice(leadingParagraphs)
                            .map((paragraph, index) =>
                                <p key={`${props.title}-entry-${index + leadingParagraphs}`}>{paragraph}</p>
                            )
                        }
                        {scrollToSection()}
                    </>
                    : null}
            </div>
        </div>
    );
}

export default Text;