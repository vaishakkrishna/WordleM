import React from "react";
import "./WordBox.css";
import classNames from "classnames";

function WordBox(props) {
	function isLetter(str) {
		return str.length === 1 && str.match(/[a-z]/i);
	}
	return (
		<div className="word-box-container">
			<div
				className={classNames(
					"lighter-border",
					"rounded-sm",
					"word-box",
					{ "bg-color-green": props.color === "g" },
					{ "bg-color-yellow": props.color === "y" },
					{ "bg-color-grey": props.color === "r" || props.color === "" },
					{
						"flip-animation":
							props.color === "g" || props.color === "y" || props.color === "r",
					},
					{ "computing-animation": props.animateComputing },
					{ "invalid-word-animation": props.animateInvalidWord }
				)}
			>
				{isLetter(props.value) ? props.value : " "}
			</div>
		</div>
	);
}
export default WordBox;
