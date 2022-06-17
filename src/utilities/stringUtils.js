export function isAlphabetic(str) {
    return /^[a-zA-Z]*$/.test(str);
  }

export function generateEmptyBoard(width, height) {
  return Array(height).fill("-").map(x => Array(width).fill("-"))
}

export function isValidWord(word){
  return true
}