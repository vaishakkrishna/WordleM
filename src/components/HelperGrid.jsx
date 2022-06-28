import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import {
  isAlphabetic,
  generateEmptyBoard,
  isValidWord,
  getColorsFromGuess,
} from "../utilities/stringUtils";
import Button from "react-bootstrap/Button";

function HelperGrid(props) {
  function handleNextGuessClicked(e) {
     

  }
  const [currectActiveWordRow, setCurrentActiveWordRow] = useState(0);
  const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
  const [wordRows, setWordRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [colorRows, setColorRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [solved, setSolved] = useState(false);

  // Handle Key presses
  const keyDownHandler = (event) => {
    if (!solved) {
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
        event.key === "Enter" &&
        currentActiveLetter === 5 &&
        currectActiveWordRow < 6 &&
        isValidWord(wordRows[currectActiveWordRow])
      ) {
        //fill in the previous color row with colors
        const newColorRows = JSON.parse(JSON.stringify(colorRows));
        var newSolved = false;
        getColorsFromGuess(wordRows[currectActiveWordRow])
          .then((colors) => {
            if (colors === "ggggg") {
              newSolved = true;
              setSolved(true);
            }
            newColorRows[currectActiveWordRow] = colors;
          })
          .then(() => {
            setColorRows(newColorRows);
          });

        setCurrentActiveWordRow(currectActiveWordRow + 1);
        setCurrentActiveLetter(0);
      }
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
    rows.push(
      <WordRow
        key={i}
        wordRowValue={wordRows[i]}
        colorRowValue={colorRows[i]}
      />
    );
  }

  return (
    <div>
      {rows}
      <Button
        className="my-5 justify-content-center btn-success"
        onClick={handleNextGuessClicked}
      >
        Click on me to reveal the best next guess!
      </Button>
    </div>
  );
}
export default HelperGrid;
