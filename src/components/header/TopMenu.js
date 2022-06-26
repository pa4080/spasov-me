/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./topMenu.css";

function TopMenu(props) {
    const state = {
        home: {
            label: "home",
            active: false
        },
        resume: {
            label: "about",
            active: false
        },
        contacts: {
            label: "contacts",
            active: false
        },
        switch(label) {
            for (const member in this) {
                if (typeof (this[member]) === "object") {
                    if (this[member].label === label) {
                        this[member].active = true;
                    } else {
                        this[member].active = false;
                    }
                }
            }
            setMenuItem({ ...this });
        }
    }
    const [menuItems, setMenuItem] = useState(state);

    useEffect(() => {
        const uriPath = window.location.pathname.replace("/", "") || "home";
        state.switch(uriPath)
    }, []);

    return (
        <nav className="mlt-header-top-container">
            <Link
                className={`mlt-header-top-item ${menuItems.home.active ? "mlt-header-top-link-active" : ""}`}
                onClick={() => { state.switch(menuItems.home.label) }}
                to={menuItems.home.label}
            >
                {menuItems.home.label}
            </Link>
            <Link
                className={`mlt-header-top-item ${menuItems.resume.active ? "mlt-header-top-link-active" : ""}`}
                onClick={() => { state.switch(menuItems.resume.label) }}
                to={menuItems.resume.label}
            >
                {menuItems.resume.label}
            </Link>
            <Link
                className={`mlt-header-top-item ${menuItems.contacts.active ? "mlt-header-top-link-active" : ""}`}
                onClick={() => { state.switch(menuItems.contacts.label) }}
                to={menuItems.contacts.label}
            >
                {menuItems.contacts.label}
            </Link>
        </nav>
    )
}

export default TopMenu;