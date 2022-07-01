import React from "react";
import "./WordBox.css";
import classNames from "classnames";

function WordBox(props) {
	function isLetter(str) {
		return str.length === 1 && str.match(/[a-z]/i);
	}
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
				{ "bg-color-grey": props.color === "r" },
        { "flip-animation": props.color === "g" || props.color === "y" || props.color === "r" }
			)}
		>
			{isLetter(props.value) ? props.value : " "}
		</p>
	);
}
export default WordBox;
