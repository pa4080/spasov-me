// import mltLogoText from "../assets/images/SVG/mlt.logo.text.svg";
import Logo from "../components/home-sections/Logo";
import "./home.css";

function Home(props) {
    return (
        <>
            <Logo leadingText={props.leadingText} logoFull={props.logoFull} logoSmall={props.logoSmall} />
        </>
    );
}

export default Home;