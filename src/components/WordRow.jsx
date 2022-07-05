import React from "react";

import WordBox from "./WordBox";
import "./WordRow.css";

function WordRow(props) {
	var row = [];
	for (var i = 0; i < 5; i++) {
		row.push(
			<WordBox
				key={i}
				value={props.wordRowValue[i]}
				color={props.colorRowValue[i]}
				animate={props.animate}
			/>
		);
	}
	return (
		<div className="cont">
			<h3 style={{ fontSize: "10px" }}>
				Skill: {isNaN(props.skill) ? 0 : Math.round(props.skill * 100) / 100}
			</h3>

			<div className="d-flex justify-content-center my-1">{row}</div>
		</div>
	);
}

export default WordRow;
