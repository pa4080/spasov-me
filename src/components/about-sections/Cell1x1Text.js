import React from "react";
import "./cell1x1Text.css";

function Cell1x1Text(props) {
  return <p dangerouslySetInnerHTML={{ __html: props.data }} />;
}

export default Cell1x1Text;
