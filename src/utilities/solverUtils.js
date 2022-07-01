import { allWordsList } from "./wordLists";
export function produceGuess(solutionSet) {
    // loop through all possible valid guesses and pick the one with highest entropy
    let bestGuess = "";
    let bestEntropy = 0;
    for (let i = 0; i < allWordsList.length; i++) {
        let entropy = getEntropy(word, solutionSet);
        if (entropy > bestEntropy) {
            bestGuess = word;
            bestEntropy = entropy;
        }
    }
}

// Return E[information] for a given word (guess) and solution set
function getEntropy(word, solutionSet){
    return 0;
}
