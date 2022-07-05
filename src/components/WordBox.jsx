import React from "react";
import "./WordBox.css";
import classNames from "classnames";

function WordBox(props) {
	function isLetter(str) {
		return str.length === 1 && str.match(/[a-z]/i);
	}
	return (
		<div
			className={classNames(
				"lighter-border",
				"rounded-sm",
				"word-box-container",
				"wordBox",
				{ "bg-color-green": props.color === "g" },
				{ "bg-color-yellow": props.color === "y" },
				{ "bg-color-grey": props.color === "r" || props.color === "" },
				{
					"flip-animation":
						props.color === "g" || props.color === "y" || props.color === "r",
				},
				{ "computing-animation": props.animate }
			)}
		>
			<p className="p3">{isLetter(props.value) ? props.value : " "}</p>
		</div>
	);
}
export default WordBox;
