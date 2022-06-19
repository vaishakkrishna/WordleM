import React from "react";
import "./WordBox.css";
function WordBox(props) {
  return (
    <p className="border border-dark rounded-sm py-3 px-4 mx-1 p3 bg-dark">
      {props.value === "-" ? " " : props.value}
    </p>
  );
}
export default WordBox;
