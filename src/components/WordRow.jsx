import React from "react";

import WordBox from "./WordBox";

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
		<div className="d-flex justify-content-center my-1">
 			<h3 style={{ fontSize: "10px" }}>
				Skill: {Math.round(props.skill * 100) / 100}
			</h3>

			{row}
		</div>
	);
}

export default WordRow;
