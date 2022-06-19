import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import {
  isAlphabetic,
  generateEmptyBoard,
  isValidWord,
} from "../utilities/stringUtils";

function Grid(props) {
  const [currectActiveWordRow, setCurrentActiveWordRow] = useState(0);
  const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
  const [wordRows, setWordRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );

  // Handle Key presses
  const keyDownHandler = (event) => {
    if (event.key === "Backspace" && currentActiveLetter > 0) {
      const newWordRows = JSON.parse(JSON.stringify(wordRows));
      newWordRows[currectActiveWordRow][currentActiveLetter - 1] = "-";
      setCurrentActiveLetter(currentActiveLetter - 1);
      setWordRows(newWordRows);
    } else if (
      isAlphabetic(event.key) &&
      currentActiveLetter < 5 &&
      event.key.length === 1
    ) {
      const newWordRows = JSON.parse(JSON.stringify(wordRows));
      newWordRows[currectActiveWordRow][currentActiveLetter] =
        event.key.toUpperCase();
      setCurrentActiveLetter(currentActiveLetter + 1);
      setWordRows(newWordRows);
    } else if (
      event.key == "Enter" &&
      currentActiveLetter === 5 &&
      currectActiveWordRow < 6 &&
      isValidWord(wordRows[i])
    ) {
      setCurrentActiveWordRow(currectActiveWordRow + 1);
      setCurrentActiveLetter(0);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return function cleanup() {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  var rows = [];

  for (var i = 0; i < 6; i++) {
    rows.push(<WordRow key={i} wordRowValue={wordRows[i]} />);
  }

  return <div>{rows}</div>;
}
export default Grid;
