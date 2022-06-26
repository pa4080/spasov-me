import React, { useState, useEffect, useRef } from "react";
import Button from "../button/Button";
import Cell2x2 from "./Cell2x2";
import Cell1x1Text from "./Cell1x1Text";
import "./section.css";

function ComponentIf({ component, data }) {
    return (
        <>
            {(() => {
                if (component === "Cell2x2") {
                    return <Cell2x2 data={data} />;
                } else if (component === "Cell1x1Text") {
                    return <Cell1x1Text paragraph={data} />;
                }
            })()}
        </>
    );
};

function Table2x2(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [tableData, setTableData] = useState([]);

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
        if (tableData.length === 0) {
            setTableData(props.data);
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
                {tableData
                    .slice(0, leadingParagraphs)
                    .map((entry, index) =>
                        <ComponentIf component={props.component} key={`${props.title}-entry-${index}`} data={entry} />
                    )
                }

                {isExpanded ?
                    <>
                        {tableData
                            .slice(leadingParagraphs)
                            .map((entry, index) =>
                                <ComponentIf component={props.component} key={`${props.title}-entry-${index + leadingParagraphs}`} data={entry} />
                            )
                        }
                        {scrollToSection()}
                    </>
                    : null}

            </div>
        </div>
    );
}

export default Table2x2;