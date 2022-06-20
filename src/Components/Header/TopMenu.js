import { useState } from "react";
import { Link } from 'react-router-dom';
import "./topMenu.css";

function TopMenu(props) {
    const state = {
        home: {
            label: "Home",
            link: "/home",
            active: true
        },
        resume: {
            label: "Resume",
            link: "/resume",
            active: false
        },
        switch(item) {
            for (const member in this) {
                if (typeof (this[member]) === "object") {
                    if (this[member].label === item.label) {
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


    return (
        <nav className="mlt-header-top-container">
            <Link
                className={`mlt-header-top-item ${menuItems.home.active ? "mlt-header-top-link-active" : ""}`}
                onClick={() => { state.switch(menuItems.home) }}
                to={menuItems.home.link}
            >
                {menuItems.home.label}
            </Link>
            <Link
                className={`mlt-header-top-item ${menuItems.resume.active ? "mlt-header-top-link-active" : ""}`}
                onClick={() => { state.switch(menuItems.resume) }}
                to={menuItems.resume.label}
            >
                {menuItems.resume.label}
            </Link>
        </nav>
    )
}

export default TopMenu;