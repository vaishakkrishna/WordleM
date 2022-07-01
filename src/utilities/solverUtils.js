import { allWordsList } from "./wordLists";
export function produceGuess(solutionSet) {
    return new Promise((resolve, reject) => {
        let bestGuess = "";
        let bestEntropy = 0;
        for (let i = 0; i < allWordsList.length; i++) {
            const word = allWordsList[i];
            let entropy = getEntropy(word, solutionSet);
            if (entropy > bestEntropy) {
                bestGuess = word;
                
                bestEntropy = entropy;
            }
        }
        resolve(bestGuess)
    });
}

// Return E[information] for a given word (guess) and solution set
function getEntropy(word, solutionSet){

    //initialize result
    var result = 0;

    // calculate the probability distribution of patterns
    console.log(word, solutionSet);
    const patternDist = getPatternDistribution(word, solutionSet);
    console.log(patternDist)
    for (let pattern in patternDist){
        result += patternDist[pattern] * Math.log2(patternDist[pattern]);
    }

    return result
}

//Returns probability distribution of patterns in a solution set given the word
function getPatternDistribution(word, solutionSet){
    // loop through words in solution set, produce a pattern with the given word, and add to the distribution
    let patternDist = {};
    const individualProbability = 1/solutionSet.length;
    for (let solution of solutionSet) {

        let pattern = patternOfWordGivenSolution(word, solution);
        
        if (!(pattern in patternDist)){
            patternDist[patternOfWordGivenSolution(word, solution)] = individualProbability;
        }
        else{
            patternDist[patternOfWordGivenSolution(word, solution)] += individualProbability;
        }
    }

    return patternDist;
    
}

function patternOfWordGivenSolution(word, solution){
    //initialize solution, word, and result
    solution = solution.split("");
    word = word.split("");
    const result = Array.from('x'.repeat(word.length));

    //Calculate the frequency of each letter in the solution
    const frequencies = {};
    for (let i = 0; i < word.length; i++){
        if (solution[i] in frequencies){
            frequencies[solution[i]] += 1;
        }
        else{
            frequencies[solution[i]] = 1;
        }
    }

    for (let i = 0; i < word.length; i++){
        if (solution[i] === word[i]){
            result[i] = "g";
            frequencies[solution[i]] -= 1;
        }
    }

    for (let i = 0; i < word.length; i++){

            if (solution.includes(word[i]) && frequencies[word[i]] > 0){
                result[i] = "y";
            }
            else if (result[i] === "x") {
                result[i] = "r";
            }
        
    }
    return result.join("");
}
