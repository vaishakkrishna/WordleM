import React from "react";
import "./WordBox.css";
import classNames from "classnames";

function WordBox(props) {
  return (
    <p
      className={classNames(
        "border",
        "border-dark",
        "rounded-sm",
        "py-3",
        "px-4",
        "mx-1",
        "p3",
        { "bg-color-green": props.color === "g" },
        { "bg-color-yellow": props.color === "y" },
        { "bg-color-grey": props.color === "r" || props.color === "" }
      )}
    >
      {props.value === "-" ? " " : props.value}
    </p>
  );
}
export default WordBox;
