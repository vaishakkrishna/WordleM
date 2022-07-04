import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
	isAlphabetic,
	generateEmptyBoard,
	isValidWord,
	getColorsFromGuess,
	SolutionSetAfterGuess,
} from "../utilities/stringUtils";
import { allWordsList } from "../utilities/wordLists";
import { produceGuess, getEntropy } from "../utilities/solverUtils";
import WorkerBuilder from "../utilities/worker/worker-builder";
import Worker from "../utilities/worker/guess-generate-worker";

function Grid(props) {
	//WebWorker
	const myWorker = new WorkerBuilder(Worker);
	/**
	 * STATE VARIABLES
	 **/
	const [currentActiveWordRow, setCurrentActiveWordRow] = useState(0);
	const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
	const [wordRows, setWordRows] = useState(
		generateEmptyBoard(parseInt(props.width), parseInt(props.height))
	);
	const [colorRows, setColorRows] = useState(
		generateEmptyBoard(parseInt(props.width), parseInt(props.height))
	);
	const [solved, setSolved] = useState(false);
	const [solutionSet, setSolutionSet] = useState([...allWordsList]);
	const [isComputing, setIsComputing] = useState(false);
	const [syncWithWordle, setSyncWithWordle] = useState(false);
	const [skillScores, setSkillScores] = useState([]);

	// in the form [["crane", 5.43], ["louts", 6.23]...]
	const [optimalGuesses, setOptimalGuesses] = useState(["CRANE"]);

	myWorker.onmessage = (e) => {
		let newOptimalGuesses = [...optimalGuesses];
		newOptimalGuesses.push(e.data);
		setOptimalGuesses(newOptimalGuesses);
	};
	/**
	 * HELPER FUNCTIONS FOR KEY PRESSES AND API CALLS
	 **/
	const fillInWord = (wordAsString) => {
		if (currentActiveWordRow >= wordRows.length) {
			console.log("Attempting to fill in word after end of grid!");
			return;
		}
		const newWordRows = JSON.parse(JSON.stringify(wordRows));
		newWordRows[currentActiveWordRow] = wordAsString.split("");
		setWordRows(newWordRows);
		setCurrentActiveWordRow(currentActiveWordRow + 1);
	};

	// function to fill in current letter
	const fillInLetter = (letter) => {
		const newWordRows = JSON.parse(JSON.stringify(wordRows));
		newWordRows[currentActiveWordRow][currentActiveLetter] =
			letter.toUpperCase();
		setCurrentActiveLetter(currentActiveLetter + 1);
		setWordRows(newWordRows);
	};

	// Fills in colors of the previous row when it was completed
	const updateCompletedRow = () => {
		const newColorRows = JSON.parse(JSON.stringify(colorRows));
		getColorsFromGuess(wordRows[currentActiveWordRow - 1])
			.then((colors) => {
				if (colors === "ggggg") {
					setSolved(true);
				}
				newColorRows[currentActiveWordRow - 1] = colors.split("");
			})
			.then(() => {
				setColorRows(newColorRows);
				const newSolSet = SolutionSetAfterGuess(
					solutionSet,
					wordRows[currentActiveWordRow - 1].join(""),
					newColorRows[currentActiveWordRow - 1].join("")
				);
				console.log(newSolSet);
				setSolutionSet(newSolSet);
				const newSkillScores = [...skillScores];
				newSkillScores[currentActiveWordRow - 1] = getEntropy(
					wordRows[currentActiveWordRow - 1].join("").toLowerCase(),
					solutionSet
				);

				setSkillScores(newSkillScores);
				// figure out the next best guess in the background
				if (currentActiveWordRow < wordRows.length) {
					myWorker.postMessage([solutionSet, currentActiveWordRow === 0]);
				}
			})
			.catch((err) => {});
	};

	const deleteLastLetter = () => {
		if (currentActiveLetter > 0) {
			const newWordRows = JSON.parse(JSON.stringify(wordRows));
			newWordRows[currentActiveWordRow][currentActiveLetter - 1] = "-";
			setCurrentActiveLetter(currentActiveLetter - 1);
			setWordRows(newWordRows);
		}
	};

	//Handle button presses for next guess
	function handleNextGuessClicked(e) {
		if (solved) {
			alert("You have already solved this puzzle!");
			return;
		}
		if (isComputing) {
			alert("Please wait for the solver to finish computing!");
			return;
		}
		// Worker has computed the next best guess
		if (optimalGuesses.length - 1 === currentActiveWordRow) {
			// fill in word
			fillInWord(optimalGuesses[currentActiveWordRow]);

			return;
		}
		// Worker is computing the next best guess
		setIsComputing(true);
	}

	function handleShareClicked(e) {
		var shareText = "Wordle 001: " + currentActiveWordRow.toString() + "/6\n";
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
				currentActiveWordRow < 6 &&
				isValidWord(wordRows[currentActiveWordRow])
			) {
				setCurrentActiveLetter(0);
				setCurrentActiveWordRow(currentActiveWordRow + 1);
			}
		}
	};

	/**
	 *
	 * SECTION FOR HOOKS
	 *
	 */
	useEffect(() => {
		if (currentActiveWordRow > 0) {
			updateCompletedRow();
		}
	}, [currentActiveWordRow]);

	useEffect(() => {
		document.addEventListener("keydown", keyDownHandler);
		// myWorker.postMessage([solutionSet, currentActiveWordRow === 0]);
		return function cleanup() {
			document.removeEventListener("keydown", keyDownHandler);
		};
	});

	useEffect(() => {
		if (isComputing && optimalGuesses.length === currentActiveWordRow + 1) {
			fillInWord(optimalGuesses[currentActiveWordRow]);
			setIsComputing(false);
			// produceGuess(solutionSet, currentActiveWordRow === 0).then(
			// 	(nextGuess) => {
			// 		// fill in the next guess
			//
			// 	}
			// );
		}
	}, [optimalGuesses, isComputing]);
	var rows = [];

	for (var i = 0; i < 6; i++) {
		rows.push(
			<WordRow
				key={i}
				wordRowValue={wordRows[i]}
				colorRowValue={colorRows[i]}
				animate={isComputing && i === currentActiveWordRow}
				skill={skillScores[i]}
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
			{syncWithWordle && (
				<div className="align-content-center">
					<iframe
						src="https://www.nytimes.com/games/wordle/index.html"
						height="400px"
						width="400px"
					/>
				</div>
			)}
		</div>
	);
}
export default Grid;
