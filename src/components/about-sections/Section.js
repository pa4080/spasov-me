import React, { useState, useRef } from "react";
import Button from "../button/Button";
import Cell2x2 from "./Cell2x2";
import Cell1x1Text from "./Cell1x1Text";
import Cell1x3Stars from "./Cell1x3Stars";
import "./section.css";

function ComponentIf({ component, data }) {
    return (
        <>
            {(() => {
                if (component === "Cell2x2") {
                    return <Cell2x2 data={data} />;
                } else if (component === "Cell1x1Text") {
                    return <Cell1x1Text data={data} />;
                } else if (component === "Cell1x3Stars") {
                    return <Cell1x3Stars data={data} />;
                }
            })()}
        </>
    );
};

function Table2x2(props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const section = useRef(null);

    const expandSection = () => {
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);
    };

    const scrollToSection = () => {
        setTimeout(() => {
            section.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1);
    };

    return (
        <div id={`mlt-${props.title.toLowerCase().replace(/(\u00AD|\u200B)/gi, '').replace(/\s+/g, "-")}-section`}
            className={`mlt-about-section mlt-${props.component}-section-grid`} ref={section}>
            <div>
                {(props.staticRows < props.data.length) ?
                    isExpanded
                        ? <Button text="Show less" onClick={expandSection} btnType="show-less" />
                        : <Button text="Read more" onClick={expandSection} btnType="read-more" />
                    : null
                }
                <h1>
                    {props.title}
                </h1>
            </div>
            <div className={`mlt-${props.component}-section-wrapper`}>
                {props.data.slice(0, props.staticRows).map((entry, index) =>
                    <ComponentIf
                        key={`${props.title.toLowerCase().replace(/\s+/g, "-")}-entry-${index}`}
                        component={props.component}
                        data={entry}
                    />
                )}
                {(props.staticRows < props.data.length) ?
                    isExpanded ?
                        <>
                            {props.data.slice(props.staticRows).map((entry, index) =>
                                <ComponentIf
                                    key={`${props.title.toLowerCase().replace(/\s+/g, "-")}-entry-${index + props.staticRows}`}
                                    component={props.component}
                                    data={entry}
                                />
                            )}
                            {scrollToSection()}
                        </>
                        : null
                    : null
                }

            </div>
        </div>
    );
}

export default Table2x2;