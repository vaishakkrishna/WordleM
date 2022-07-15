/**
 * IMPORTS
 */
import WordRow from "./WordRow";
import "./Grid.css";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
	isAlphabetic,
	generateEmptyBoard,
	isValidWord,
	SolutionSetAfterGuess,
} from "../utilities/stringUtils";
import { allSolutionsList } from "../utilities/wordLists";
import {
	patternOfWordGivenSolution,
	getEntropy,
} from "../utilities/solverUtils";
import WorkerBuilder from "../utilities/worker/worker-builder";
import Worker from "../utilities/worker/guess-generate-worker";
import {
	getSolutionFromOffset,
	getWordRowsFromStorage,
	getColorRowsFromStorage,
} from "../utilities/gameStateUtils";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useRef } from "react";
import { condensedLayout } from "../assets/keyboardLayouts";
import { checkboxes, getCheckboxStates } from "../assets/checkboxes";
import Settings from "./Settings";

/**
 * GRID COMPONENT START
 */
function Grid(props) {
	// Web Worker for background computation
	const myWorker = new WorkerBuilder(Worker);

	/**
	 * STATE VARIABLES
	 **/
	const keyboard = useRef();
	const [currentActiveWordRow, setCurrentActiveWordRow] = useState(0);
	const [currentActiveLetter, setCurrentActiveLetter] = useState(0);
	const [wordRows, setWordRows] = useState(
		getWordRowsFromStorage() ||
			generateEmptyBoard(parseInt(props.width), parseInt(props.height))
	);
	const [colorRows, setColorRows] = useState(
		getColorRowsFromStorage() ||
			generateEmptyBoard(parseInt(props.width), parseInt(props.height))
	);
	const [solved, setSolved] = useState(false);
	const [solutionSet, setSolutionSet] = useState([...allSolutionsList]);
	const [isComputing, setIsComputing] = useState(false);
	const [syncWithWordle, setSyncWithWordle] = useState(false);
	const [skillScores, setSkillScores] = useState([]);
	const [backgroundComputing, setBackgroundComputing] = useState(false);
	//in the form [[solutionSet, rowToCalculate]...]
	const [workerStack, setWorkerStack] = useState([]);
	// Solution to the game
	const [solution, setSolution] = useState(
		props.type === "freeplay"
			? randomElementFromArray(allSolutionsList)
			: getSolutionFromOffset()
	);

	// Show banner upon completion
	const [showSolved, setShowSolved] = useState(false);

	//check if user uses all the guesses
	const [guessesDepleted, setGuessesDepleted] = useState(false);

	// in the form [["crane", 5.43, 1.23], ["louts", 6.23, 0.34]...]
	const [optimalGuesses, setOptimalGuesses] = useState([
		["TRACE", 5.85, 0],
		["", 0, 0],
		["", 0, 0],
		["", 0, 0],
		["", 0, 0],
		["", 0, 0],
	]);

	//check if share content is copied to clipboard
	const [copied, setCopied] = useState(false);

	//check for invalid word input for animation purposes
	const [invalidWordEntered, setInvalidWordEntered] = useState(false);

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
		const updateFunction = (colors) => {
			if (colors === "ggggg") {
				setSolved(true);
				setShowSolved(true);
				setTimeout(() => {
					setShowSolved(false);
				}, 3000);
			}
			newColorRows[currentActiveWordRow - 1] = colors.split("");
			// Sets colors of prev. row
			setColorRows(newColorRows);

			// Computes and sets the new solution set
			const newSolSet = SolutionSetAfterGuess(
				solutionSet,
				wordRows[currentActiveWordRow - 1].join(""),
				newColorRows[currentActiveWordRow - 1].join("")
			);
			console.log(newSolSet);

			// Computes and sets the skill scores
			const newSkillScores = [...skillScores];

			const bestEntropy = optimalGuesses[currentActiveWordRow - 1][1];

			const worstEntropy = optimalGuesses[currentActiveWordRow - 1][2];

			const actualEntropy = getEntropy(
				wordRows[currentActiveWordRow - 1].join("").toLowerCase(),
				solutionSet
			);
			const skillScore =
				bestEntropy === 0
					? 100
					: Math.round(
							((actualEntropy - worstEntropy) / (bestEntropy - worstEntropy)) *
								100
					  );
			newSkillScores[currentActiveWordRow - 1] = skillScore;
			setSkillScores(newSkillScores);

			// figure out the next best guess in the background

			if (
				currentActiveWordRow < 6 &&
				optimalGuesses[currentActiveWordRow][0] === ""
			) {
				console.log("Computing next best guess");
				const newWS = [...workerStack];
				newWS.push([newSolSet, currentActiveWordRow]);
				setWorkerStack(newWS);
			}
			setSolutionSet(newSolSet);
		};
		const word = wordRows[currentActiveWordRow - 1].join("").toLowerCase();
		const colors = patternOfWordGivenSolution(word, solution).toLowerCase();
		updateFunction(colors);
	};

	const deleteLastLetter = () => {
		if (currentActiveLetter > 0) {
			const newWordRows = JSON.parse(JSON.stringify(wordRows));
			newWordRows[currentActiveWordRow][currentActiveLetter - 1] = "-";
			setCurrentActiveLetter(currentActiveLetter - 1);
			setWordRows(newWordRows);
		}
	};

	/**
	 * UTILITY FUNCTIONS
	 */
	function randomElementFromArray(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 *
	 * INPUT HANDLING FUNCTIONS
	 */
	const keyDownHandler = (input, isString = false) => {
		var key;
		if (isString) {
			key = input === "⌫" ? "Backspace" : input;
			key = input === "ENTER" ? "Enter" : key;
		} else {
			key = input.key;
		}

		if (!solved) {
			// check if the key is backspace
			if (key === "Backspace") {
				deleteLastLetter();
			} else if (
				//check if a letter is entered
				!isComputing &&
				isAlphabetic(key) &&
				currentActiveLetter < 5 &&
				key.length === 1
			) {
				const letter = key;
				fillInLetter(letter);
				// check if Row is completed
			} else if (
				!backgroundComputing &&
				key === "Enter" &&
				currentActiveLetter === 5 &&
				currentActiveWordRow < 6
			) {
				if (isValidWord(wordRows[currentActiveWordRow])) {
					setCurrentActiveLetter(0);
					setCurrentActiveWordRow(currentActiveWordRow + 1);
				} else {
					setInvalidWordEntered(true);
					setTimeout(() => {
						setInvalidWordEntered(false);
					}, 500);
				}
			}
		}
	};

	const onKeyPress = (button) => {
		console.log("Button pressed", button);
		keyDownHandler(button, true);
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
		if (optimalGuesses[currentActiveWordRow][0] !== "") {
			// fill in word
			console.log(optimalGuesses[currentActiveWordRow[0]]);
			fillInWord(optimalGuesses[currentActiveWordRow][0]);
			return;
		}
		// Worker is computing the next best guess
		setIsComputing(true);
	}

	// Share button handler
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
		shareText += `Skill: ${
			Math.round(
				(skillScores.reduce((a, b) => a + b) / skillScores.length) * 100
			) / 100
		}`;
		if (navigator.share) {
			navigator.share({ text: shareText }).catch((error) => {
				console.log("Share failed");
			});
		} else {
			setCopied(true);
			setShowSolved(false);
			setTimeout(() => {
				setCopied(false);
			}, 3000);
			navigator.clipboard.writeText(shareText);
		}
	}

	/**
	 *
	 * SECTION FOR HOOKS
	 *
	 */

	//Hook on startup
	useEffect(() => {
		// Event listener for keyboard events
		document.addEventListener("keydown", keyDownHandler);

		//recieve result from worker
		myWorker.onmessage = (e) => {
			let newOptimalGuesses = [...optimalGuesses];
			newOptimalGuesses[e.data[1]] = e.data[0];
			setOptimalGuesses(newOptimalGuesses);
			console.log(newOptimalGuesses);
			setBackgroundComputing(false);
		};

		return function cleanup() {
			document.removeEventListener("keydown", keyDownHandler);
		};
	});

	// Update state of the game when a guess is entered
	useEffect(() => {
		if (currentActiveWordRow > 0 && currentActiveWordRow < 7) {
			updateCompletedRow();
			if (currentActiveWordRow === 6) {
				setGuessesDepleted(true);
			}
		}
	}, [currentActiveWordRow]);

	// Add a task to the worker
	useEffect(() => {
		if (workerStack.length > 0) {
			myWorker.postMessage(workerStack.pop());
			setBackgroundComputing(true);
		}
	}, [workerStack]);

	// Update ability to enter letters or fill in guess if needed
	useEffect(() => {
		if (isComputing && optimalGuesses[currentActiveWordRow][0] !== "") {
			fillInWord(optimalGuesses[currentActiveWordRow][0]);
			setIsComputing(false);
		}
	}, [optimalGuesses, isComputing]);

	/**
	 *
	 *
	 * Render the grid and all related components
	 *
	 */
	var rows = [];
	var skills = [];

	for (var i = 0; i < 6; i++) {
		rows.push(
			<WordRow
				key={i}
				wordRowValue={wordRows[i]}
				colorRowValue={colorRows[i]}
				animateComputation={isComputing && i === currentActiveWordRow}
				animateInvalidWord={invalidWordEntered && i === currentActiveWordRow}
				skill={skillScores[i]}
			/>
		);
		skills.push(
			<div key={i} className="skills">
				{skillScores[i] > 0 ? "Skill: " + skillScores[i] : ""}
			</div>
		);
	}

	return (
		<div className="center">
			{guessesDepleted && (
				<div className="completion-banner">
					Nice Try :( Today's word was {solution.toUpperCase()}
				</div>
			)}
			{solved && showSolved && (
				<div className="completion-banner">Well Done! Share your results!</div>
			)}
			{copied && <div className="completion-banner">Copied to clipboard!</div>}

			<div className="button-container">
				{props.settingsState["Show Solver Assistant"] && (
					<button
						className="button-default bg-primary"
						onClick={handleNextGuessClicked}
					>
						Produce guess
					</button>
				)}
				{props.type === "freeplay" && (
					<button
						className="button-default bg-danger"
						onClick={() => window.location.reload()}
					>
						Different Word
					</button>
				)}
				{solved && (
					<button
						className="button-default bg-success"
						onClick={handleShareClicked}
					>
						Share your grid!
					</button>
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
				{backgroundComputing && currentActiveWordRow < 2 && (
					<div className="completion-banner">Computing, please wait</div>
				)}
			</div>
			<div className="grid-container">
				<div className="grid">{rows}</div>
			</div>

			<div className="board">
				<Keyboard
					keyboardRef={(r) => (keyboard.current = r)}
					layout={condensedLayout}
					layoutName="default"
					onKeyPress={onKeyPress}
					theme="hg-theme-default myTheme"
				/>
			</div>
		</div>
	);
}
export default Grid;
