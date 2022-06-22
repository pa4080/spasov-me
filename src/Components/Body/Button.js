import "./button.css";

function Button(props) {
    return (
        <button className="mlt-read-more-button" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default Button;