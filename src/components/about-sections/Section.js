import React, { useState, useRef } from "react";
import Button from "../button/Button";
import Cell2x2 from "./Cell2x2";
import Cell1x1Text from "./Cell1x1Text";
import Cell1x3Stars from "./Cell1x3Stars";
import "./section.css";

function ComponentIf({ component, data, tapToShow }) {
    /**
     * The 'tapToShow' options enables auto hide of the description on small screens
     */
    return (
        <>
            {(() => {
                if (component === "Cell2x2") {
                    return <Cell2x2 data={data} tapToShow={tapToShow} />;
                } else if (component === "Cell1x1Text") {
                    return <Cell1x1Text data={data} tapToShow={tapToShow} />;
                } else if (component === "Cell1x3Stars") {
                    return <Cell1x3Stars data={data} tapToShow={tapToShow} />;
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

    const calculateKey = (index = 0) => {
        return `${props.title.toLowerCase().replace(/\s+/g, "-")}-entry-${index}`
    };

    const generateId = (title = 'Default Title') => {
        return `mlt-${title.toLowerCase().replace(/(\u00AD|\u200B)/gi, '').replace(/\s+/g, "-")}-section`
    };

    return (
        <div id={generateId(props.title)}
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
                        key={calculateKey(index)}
                        tapToShow={props.tapToShow}
                        component={props.component}
                        data={entry}
                    />
                )}
                {(props.staticRows < props.data.length) ?
                    isExpanded ?
                        <>
                            {props.data.slice(props.staticRows).map((entry, index) =>
                                <ComponentIf
                                    key={calculateKey(index + props.staticRows)}
                                    tapToShow={props.tapToShow}
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