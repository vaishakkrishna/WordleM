import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  isAlphabetic,
  generateEmptyBoard,
  isValidWord,
  getColorsFromGuess,
  getNextGuessFromGrid,
  SolutionSetAfterGuess,
} from "../utilities/stringUtils";
import { allWordsList } from "../utilities/wordLists";

function Grid(props) {
  /**
   * STATE VARIABLES
   **/
  const [currectActiveWordRow, setCurrentActiveWordRow] = useState(0);
  const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
  const [wordRows, setWordRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [colorRows, setColorRows] = useState(
    generateEmptyBoard(parseInt(props.width), parseInt(props.height))
  );
  const [solved, setSolved] = useState(false);
  const [solutionSet, setSolutionSet] = useState([...allWordsList]);

  /**
   * HELPER FUNCTIONS FOR KEY PRESSES AND API CALLS
   **/
  const fillInWord = (wordAsString) => {
    if (currectActiveWordRow >= wordRows.length) {
      console.log("Attempting to fill in word after end of grid!");
      return;
    }
    const newWordRows = JSON.parse(JSON.stringify(wordRows));
    newWordRows[currectActiveWordRow] = wordAsString.split("");
    setWordRows(newWordRows);
    setCurrentActiveWordRow(currectActiveWordRow + 1);
  };

  // function to fill in current letter
  const fillInLetter = (letter) => {
    const newWordRows = JSON.parse(JSON.stringify(wordRows));
    newWordRows[currectActiveWordRow][currentActiveLetter] =
      letter.toUpperCase();
    setCurrentActiveLetter(currentActiveLetter + 1);
    setWordRows(newWordRows);
  };

  // Fills in colors of the previous row when it was completed
  const updateCompletedRow = () => {
    const newColorRows = JSON.parse(JSON.stringify(colorRows));
    getColorsFromGuess(wordRows[currectActiveWordRow - 1])
      .then((colors) => {
        if (colors === "ggggg") {
          setSolved(true);
        }
        newColorRows[currectActiveWordRow - 1] = colors.split("");
      })
      .then(() => {
        setColorRows(newColorRows);
      })
      .catch((err) => {});
  };

  const deleteLastLetter = () => {
    if (currentActiveLetter > 0) {
      const newWordRows = JSON.parse(JSON.stringify(wordRows));
      newWordRows[currectActiveWordRow][currentActiveLetter - 1] = "-";
      setCurrentActiveLetter(currentActiveLetter - 1);
      setWordRows(newWordRows);
    }
  };

  //Handle button presses
  function handleNextGuessClicked(e) {
    // get the next guess from api
    getNextGuessFromGrid(wordRows, currectActiveWordRow).then((nextGuess) => {
      // fill in the next guess
      fillInWord(nextGuess);
    });
  }

  function handleShareClicked(e) {
    var shareText = "Wordle 001: " + currectActiveWordRow.toString() + "/6\n";
    for (var i = 0; i < colorRows.length; i++) {
      for (var j = 0; j < colorRows[i].length; j++) {
        switch (colorRows[i][j]) {
          case "g":
            shareText += "🟩";
            break;
          case "r":
            shareText += "⬜️";
            break;
          case "y":
            shareText += "🟨";
            break;
          default:
            shareText += "";
        }
      }
      shareText += "\n";
    }
    navigator.clipboard.writeText(shareText);
  }

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
      } else if (
        event.key === "Enter" &&
        currentActiveLetter === 5 &&
        currectActiveWordRow < 6 &&
        isValidWord(wordRows[currectActiveWordRow])
      ) {
        setCurrentActiveLetter(0);
        setCurrentActiveWordRow(currectActiveWordRow + 1);
      }
    }
  };

  useEffect(() => {
    if (currectActiveWordRow > 0) {
      updateCompletedRow();
    }
  }, [currectActiveWordRow]);

  useEffect(() => {
    if (currectActiveWordRow > 0) {
      const newSolSet = SolutionSetAfterGuess(
        solutionSet,
        wordRows[currectActiveWordRow - 1].join(""),
        colorRows[currectActiveWordRow - 1].join("")
      );

      setSolutionSet(newSolSet);
    }
  }, [colorRows]);

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
      {props.type === "helper" && (
        <Button
          className="my-5 justify-content-center btn-success"
          onClick={handleNextGuessClicked}
        >
          Click on me to reveal the best next guess!
        </Button>
      )}
      {solved && (
        <Button
          className="my-5 justify-content-center btn-primary"
          onClick={handleShareClicked}
        >
          Share your grid!
        </Button>
      )}
    </div>
  );
}
export default Grid;
