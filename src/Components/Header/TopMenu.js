import { Link } from 'react-router-dom';
import "./topMenu.css";

function TopMenu(props) {
    return (
        <nav className="mlt-header-top-container">
            <Link to="/home" className="mlt-header-top-item">Home</Link>
            <Link to="/resume" className="mlt-header-top-item">Resume</Link>
        </nav>
    )
}

export default TopMenu;