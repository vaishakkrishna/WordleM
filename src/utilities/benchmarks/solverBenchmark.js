import {patternOfWordGivenSolution, produceGuess} from '../solverUtils.js'
import {SolutionSetAfterGuess} from '../stringUtils.js'
import { allSolutionsList, allWordsList } from '../wordLists.js'

// return the average guesses and time taken to solve words from wordList.
export function runBenchmarkOnWordList(wordList) {
    let totalGuesses = 0;
    const startTime = Date.now();
    // loop through all words in the word list
    for (let i = 0; i < wordList.length; i++) {
        const word = wordList[i];
        totalGuesses += guessesGivenSolution(word)[0];
    }
    const endTime = Date.now();
    //total solve time for the list in seconds
    const totalSolveTime = (endTime - startTime)/1000;
    const averageGuesses = totalGuesses / wordList.length;
    const averageSolveTime = totalSolveTime / wordList.length;
    return [averageGuesses, averageSolveTime];
}

// return the number of guesses and time the solver would take to solve the given word
export function guessesGivenSolution(solution, printProgress = false){
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