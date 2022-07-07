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
	return <div className="row">{row}</div>;
}

export default WordRow;
