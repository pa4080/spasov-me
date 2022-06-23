import "./button.css";

function Button(props) {
    return (
        <button className={`mlt-button-${props.btnType}`} onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default Button;