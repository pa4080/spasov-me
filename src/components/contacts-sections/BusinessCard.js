import React, { useRef } from 'react';

import domtoimage from 'dom-to-image';
import "./businessCard.css";

import iDownloadCv from "../../assets/icons/i-download-cv.svg";
import iSendEmail from "../../assets/icons/i-send-email.svg";
import iSaveBCard from "../../assets/icons/i-save-business-card.svg";

function BusinessCard(props) {
    const businessCardRef = useRef(null);



    const takeBCardSnapShot = () => {
        const node = businessCardRef.current;
        node.classList.add('mlt-business-card-print');

        const scale = 1;
        const style = {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: node.offsetWidth + "px",
            height: node.offsetHeight + "px"
        };
        const param = {
            height: node.offsetHeight * scale,
            width: node.offsetWidth * scale,
            quality: 1,
            style
        };

        domtoimage.toPng(node, param)
            .then(function (dataUrl) {
                node.classList.remove('mlt-business-card-print');
                // const img = new Image();
                // img.src = dataUrl;
                // document.body.appendChild(img);
                const imgDownloadLink = document.createElement("a");
                imgDownloadLink.href = dataUrl;
                document.body.appendChild(imgDownloadLink);
                imgDownloadLink.download = `${props.data.title.toLowerCase().replace(/\s+/g, "-")}.business-card.png`;
                imgDownloadLink.click();
            })
            .catch(function (error) {
                console.error('Something went wrong wit Dom-to-image!', error);
            });
    };

    return (
        <div className="mlt-contacts-section">
            <div className="mlt-business-card-section-grid" ref={businessCardRef}>
                <div className="mlt-business-card-section-row-1">
                    <div>{props.data.title}</div>
                </div>
                <div className="mlt-business-card-image-container">
                    <div className="mlt-business-card-image-wrapper">
                        <img
                            alt="Illustration of this section." width="260" height="260"
                            src={props.image}
                            className="mlt-business-card-image"
                        />
                    </div>
                </div>
                <div className="mlt-business-card-section-row-2">
                    <p>
                        {props.data.email}
                    </p>
                    <p>
                        {props.data.location}
                    </p>
                </div>
                <div className="mlt-business-card-section-row-3">
                    <span className="mlt-bc-img-icon" data-tooltip="Save a business card." onClick={takeBCardSnapShot}>
                        <img
                            alt="Save a business card." width="36" height="26"
                            src={iSaveBCard}
                        />
                        {/* <i className="icon i-save-business-card i-default-bg" /> */}
                    </span>
                    <span className="mlt-bc-img-icon" data-tooltip="Send an email.">
                        <a href={`mailto: ${props.data.email}`}>
                            <img
                                alt="Send an email." width="36" height="26"
                                src={iSendEmail}
                            />
                            {/* <i className="icon i-send-email i-default-bg"></i> */}
                        </a>
                    </span>
                    <span className="mlt-bc-img-icon" data-tooltip="Download a CV.">
                        <a href={props.cvPdf} target="_blank" rel="noreferrer" 
                           download={`${props.data.title.toLowerCase().replace(/\s+/g, "-")}.cv.pdf`}
                        >
                            <img
                                alt="Download a CV." width="36" height="26"
                                src={iDownloadCv}
                            />
                        </a>
                        {/* <i className="icon i-download-cv i-default-bg" /> */}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;