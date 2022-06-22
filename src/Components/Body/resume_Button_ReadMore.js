function ReadMoreButton(props) {
    return (
        <button className="mlt-read-more-button" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default ReadMoreButton;