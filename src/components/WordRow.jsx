import React from "react";
import WordBox from "./WordBox";

function WordRow(props) {
  var row = [];
  for (var i = 0; i < 5; i++) {
    row.push(<WordBox key={i} value={props.wordRowValue[i]} color={props.colorRowValue[i]}/>);
  }
  return <div className="d-flex justify-content-center my-1">{row}</div>;
}

export default WordRow;
