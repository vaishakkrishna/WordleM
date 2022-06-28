import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import {
  isAlphabetic,
  generateEmptyBoard,
  isValidWord,
  getColorsFromGuess,
} from "../utilities/stringUtils";

function Grid(props) {
  const [currectActiveWordRow, setCurrentActiveWordRow] = useState(0);
  const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
  const [wordRows, setWordRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [colorRows, setColorRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [solved, setSolved] = useState(false);
  // function to fill in the current row of the grid with a word
  const fillInWord = (wordAsString) => {
    const newWordRows = JSON.parse(JSON.stringify(wordRows));
    newWordRows[currectActiveWordRow] = wordAsString.split();

    getColorsFromGuess(wordAsString)
      .then((colors) => {
        const newColorRows = JSON.parse(JSON.stringify(colorRows));
        newColorRows[currectActiveWordRow] = colors;
        setColorRows(newColorRows);
        setWordRows(newWordRows);
        setCurrentActiveLetter(0);
        setCurrentActiveWordRow(currectActiveWordRow + 1);
      })
      .catch((err) => {});
  };

  // function to fill in current letter
  const fillInLetter = (letter) => {
    const newWordRows = JSON.parse(JSON.stringify(wordRows));
    newWordRows[currectActiveWordRow][currentActiveLetter] =
      letter.toUpperCase();
    setCurrentActiveLetter(currentActiveLetter + 1);
    setWordRows(newWordRows);
  };

  const updateCompletedRow = () => {
    if (
      currentActiveLetter === 5 &&
      currectActiveWordRow < 6 &&
      isValidWord(wordRows[currectActiveWordRow])
    ) {
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
    }
    //fill in the previous color row with colors
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

  return <div>{rows}</div>;
}
export default Grid;
