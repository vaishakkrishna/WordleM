import {patternOfWordGivenSolution, produceGuess} from '../solverUtils.js'
import {SolutionSetAfterGuess} from '../stringUtils.js'
import { allSolutionsList, allWordsList } from '../wordLists.js'


export function runBenchmarkOnWordList(wordList) {
    let totalGuesses = 0;
    let totalSolveTime = 0;
    // loop through all words in the word list
    for (let i = 0; i < wordList.length; i++) {
        const word = wordList[i];
        totalGuesses += guessesAndTimeGivenSolution(word)[0];
        totalSolveTime += guessesAndTimeGivenSolution(word)[1];
    }
}

// return the number of guesses and time the solver would take to solve the given word
function guessesAndTimeGivenSolution(solution, printProgress = false){
    let guessNumber = 1;
    let currentSolutionSet = allSolutionsList;
    while (guessNumber < 7) { 
        // get the guess
        let currentGuess = produceGuess(currentSolutionSet, guessNumber===0)[0];
        console.log(currentGuess)
        // check the color, if it is "ggggg" then we have found the solution
        let colors = patternOfWordGivenSolution(currentGuess, solution);
        if (colors === "ggggg"){
            return guessNumber;
        }
        // update the solution set
        currentSolutionSet = SolutionSetAfterGuess(currentSolutionSet, currentGuess, colors);
        guessNumber++;
    }
    return guessNumber;
}

function main(){
    runBenchmarkOnWordList(["hello"]);
}