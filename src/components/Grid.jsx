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
import { allWordsList, allSolutionsList } from "../utilities/wordLists";
import {
	patternOfWordGivenSolution,
	getEntropy,
} from "../utilities/solverUtils";
import WorkerBuilder from "../utilities/worker/worker-builder";
import Worker from "../utilities/worker/guess-generate-worker";
import { getSolutionFromOffset } from "../utilities/gameStateUtils";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useRef } from "react";
import { condensedLayout } from "../assets/keyboardLayouts";
import { checkboxes, getCheckboxStates } from "../assets/checkboxes";

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
		generateEmptyBoard(parseInt(props.width), parseInt(props.height))
	);
	const [colorRows, setColorRows] = useState(
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

	// State of the checkboxes
	const [checkboxStates, setCheckboxStates] = useState(
		getCheckboxStates(checkboxes)
	);

	//check if user uses all the guesses
	const [guessesDepleted, setGuessesDepleted] = useState(false);

	// in the form [["crane", 5.43, 1.23], ["louts", 6.23, 0.34]...]
	const [optimalGuesses, setOptimalGuesses] = useState([
		["TRACE", 5.75, 0],
		["", 0, 0],
		["", 0, 0],
		["", 0, 0],
		["", 0, 0],
		["", 0, 0],
	]);

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
				currentActiveWordRow < 6 &&
				isValidWord(wordRows[currentActiveWordRow])
			) {
				setCurrentActiveLetter(0);
				setCurrentActiveWordRow(currentActiveWordRow + 1);
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
		navigator.share(shareText);
		navigator.clipboard.writeText(shareText);
	}

	//handles changing of a checkbox
	const handleCheckboxChange = (boxName) => {
		const newCheckboxStates = { ...checkboxStates };
		newCheckboxStates[boxName] = !newCheckboxStates[boxName];
		setCheckboxStates(newCheckboxStates);
		localStorage.setItem(boxName, newCheckboxStates[boxName]);
		console.log(boxName);
	};

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
		// instantiate checkBoxes if they don't exist
		if (localStorage.getItem("checkbox_1") === null) {
			localStorage.setItem("checkbox_1", false);
		}

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
				animate={isComputing && i === currentActiveWordRow}
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
			{!guessesDepleted && !solved && (
				<div className="center" style={{ fontSize: "x-small" }}>
					(Scroll for more options)
				</div>
			)}

			{guessesDepleted && (
				<div className="completion-banner">
					Nice Try! Today's word was {solution.toUpperCase()}
				</div>
			)}
			{solved && (
				<div className="completion-banner">
					Well Done! Scroll down to share your results!
				</div>
			)}

			<div className="grid-container">
				<div className="grid">{rows}</div>
			</div>

			<div className="buttons">
				{checkboxStates["Show Solver Assistant"] && (
					<Button
						className="my-5 justify-content-center btn-success"
						onClick={handleNextGuessClicked}
					>
						Click on me to reveal the best next guess!
					</Button>
				)}
				{props.type === "freeplay" && (
					<Button
						className="my-5 justify-content-center btn-danger"
						onClick={() => window.location.reload()}
					>
						Give me a different Word!
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
				{backgroundComputing && <p>Computing, please wait</p>}
			</div>

			<div className="options">
				{checkboxes.map((elem) => (
					<label key={elem}>
						<input
							type="checkbox"
							checked={checkboxStates[elem]}
							onChange={() => handleCheckboxChange(elem)}
							key="elem"
						/>
						{elem}
					</label>
				))}
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
