import { allWordsList, allWordsSet } from "./wordLists";
export function isAlphabetic(str) {
  return /^[a-zA-Z]*$/.test(str);
}

export function generateEmptyBoard(width, height) {
  return Array(height).fill("-").map(x => Array(width).fill("-"))
}

export function isValidWord(word){
  word = word.join("").toLowerCase()
  return allWordsSet.has(word);
}

export function getColorsFromGuess(guess){
  const api_url = "http://127.0.0.1:8000/wordleWizard/color-guess/?guess=" + guess.join("")
  return new Promise((resolve, reject) => {
    fetch(api_url).then(res => res.text()).then(result => resolve(result))
  })
}

export function getNextGuessFromGrid(grid, currentActiveWordRow){
  const prev_guesses = []
  for(let i = 0; i < currentActiveWordRow; i++){
    prev_guesses.push(grid[i].join(""))
  }
  const api_url = "http://127.0.0.1:8000/wordleWizard/next-guess/?guesses=" + "[" + prev_guesses.join(", ") + "]" 
  return new Promise((resolve, reject) => {
    fetch(api_url).then(res => res.text()).then(result => resolve(result))
  })

}

// Function to narrow down list of valid solutions
// guess -> string
// colors -> string

export function SolutionSetAfterGuess(currentSolutionSet, guess, colors){
  let newSolutionSet = []
  let colorsMatch = produceMatchFunc(guess, colors)
  for(let i = 0; i < currentSolutionSet.length; i++){
    if (colorsMatch(currentSolutionSet[i])){
      newSolutionSet.push(currentSolutionSet[i])
    }
  }
  return newSolutionSet
}

const produceMatchFunc = (guess, colors) =>{
  let greenIndices = []
  let greyIndices = []
  let yellowIndices = []
  guess = guess.toLowerCase().split("")
  for (let i = 0; i < colors.length; i++){
    switch (colors[i].toUpperCase()){
    case "G":
      greenIndices.push(i);
      break;
    case "Y": 
      yellowIndices.push(i);
      break;
    case "R":
      greyIndices.push(i);
      break;
    default:
      greyIndices.push(i);
    }
  }
 let traversalOrder = [].concat(greenIndices, yellowIndices, greyIndices)
  const func =  (word) => {
  word = word.split("")  
  for (const i of traversalOrder){
    switch (colors[i].toUpperCase()) {

      case "G":
        if (word[i] !== guess[i]){
          return false;
        }
        word[i] = "_";
        break

      case "Y":
        let index = word.indexOf(guess[i])
        if (index === -1){
          return false;
        }
        word[index] = "_";
        break;

      case "R":
        if (word.includes(guess[i])){
          return false;
        }
        break;
      default: 
        return false; 
    }
  }
   
    return true;
  }

  return func;
}
  


export function createAllPatterns(){
  const patternMap = {0: "r", 1: "y", 2: "g"}
  const allPatterns = []
  for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
      for (let k = 0; k < 3; k++){
        for (let l = 0; l < 3; l++){
          for (let m = 0; m < 3; m++){
            allPatterns.push([patternMap[i], patternMap[j], patternMap[k], patternMap[l], patternMap[m]].join(""))
          }
        }
      }
    }
  }
}