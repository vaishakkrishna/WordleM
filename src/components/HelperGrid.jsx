import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import {
  isAlphabetic,
  generateEmptyBoard,
  isValidWord,
  getColorsFromGuess,
  getNextGuessFromGrid,
} from "../utilities/stringUtils";
import Button from "react-bootstrap/Button";

function HelperGrid(props) {
  const [currectActiveWordRow, setCurrentActiveWordRow] = useState(0);
  const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
  const [wordRows, setWordRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [colorRows, setColorRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [solved, setSolved] = useState(false);

  // Handle Button press
  function handleNextGuessClicked(e) {
    // get the next guess from api
    getNextGuessFromGrid(wordRows, currectActiveWordRow).then((nextGuess) => {
      // fill in the next guess
      fillInWord(nextGuess);
    });
  }
  // Update the row if it is completed (updates the colors, moves to next row)
  const updateCompletedRow = () => {
    //fill in the previous color row with colors
    const newColorRows = JSON.parse(JSON.stringify(colorRows));
    getColorsFromGuess(wordRows[currectActiveWordRow])
      .then((colors) => {
        if (colors === "ggggg") {
          setSolved(true);
        }
        newColorRows[currectActiveWordRow] = colors;
      })
      .then(() => {
        setColorRows(newColorRows);
      })
      .catch((err) => {});
    setCurrentActiveWordRow(currectActiveWordRow + 1);
    setCurrentActiveLetter(0);
  };

  // function to fill in the current row of the grid with a word
  const fillInWord = (wordAsString) => {
    const newWordRows = JSON.parse(JSON.stringify(wordRows));
    newWordRows[currectActiveWordRow] = wordAsString.split();
    setWordRows(newWordRows);
  };

  // function to fill in current letter
  const fillInLetter = (letter) => {
    const newWordRows = JSON.parse(JSON.stringify(wordRows));
    newWordRows[currectActiveWordRow][currentActiveLetter] =
      letter.toUpperCase();
    setCurrentActiveLetter(currentActiveLetter + 1);
    setWordRows(newWordRows);
  };

  const deleteLastLetter = () => {
    if (currentActiveLetter > 0) {
      const newWordRows = JSON.parse(JSON.stringify(wordRows));
      newWordRows[currectActiveWordRow][currentActiveLetter - 1] = "-";
      setCurrentActiveLetter(currentActiveLetter - 1);
      setWordRows(newWordRows);
    }
  };

  // Handle Key presses
  const keyDownHandler = (event) => {
    if (!solved) {
      // check if the key is backspace
      if (event.key === "Backspace") {
        deleteLastLetter();
      } else if (
        //check if a letter is entered
        isAlphabetic(event.key) &&
        currentActiveLetter < 5 &&
        event.key.length === 1
      ) {
        const letter = event.key;
        fillInLetter(letter);
        // check if Row is completed
      } else if (event.key === "Enter") {
        updateCompletedRow();
      }
    }
  };

  // Handles event of a complete valid word being entered
  useEffect(() => {
    updateCompletedRow();
  }, [currectActiveWordRow]);

  // Adds/cleans up key event listener
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return function cleanup() {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  // Render the Grid
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
