import React, { useState, useEffect} from "react";
import photo from "../../assets/images/Photos/spas-z-spasov-7-photo.square.small.webp";
import "./title.css";

import titleEntriesFile from "../../assets/data/resume-title.json";

function Title(props) {
    const [titleEntries, setTitleEntries] = useState({});


    useEffect(() => {
        if (!titleEntries.length) {
            setTitleEntries(titleEntriesFile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* <link rel="preload" as="image" href={szsPhoto} /> */}
            <div className="mlt-resume-leading-section-grid mlt-resume-section">
                <div className="mlt-resume-leading-section-row-1">
                    <div>{titleEntries.title}</div>
                </div>
                <div className="mlt-resume-photo-container">
                    <div className="mlt-resume-photo-wrapper">
                        <img src={photo} alt="metalevel.tech logo" className="mlt-resume-photo-img" width="260" height="260" />
                    </div>
                </div>
                <div className="mlt-resume-leading-section-row-2">
                    <p>
                    {titleEntries.subtitle}
                    </p>
                </div>
            </div>

        </>
    );
}

export default Title;