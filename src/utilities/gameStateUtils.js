
import { allSolutionsList } from "./wordLists";
export function getOffset(){
    const doe = getDayOfTheYear();
    const offset = 195;
    return offset + doe;
}
export function getSolutionFromOffset(){
    

    const res = allSolutionsList[(getOffset()) % allSolutionsList.length];

    return res;
}

function getDayOfTheYear(){
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day
}

// Get the board state for today's wordle from local storage, or generate a new one if it doesn't exist
export function getWordRowsFromStorage() {

    const wordRows = localStorage.getItem("wordRows");
    if (wordRows){
        return JSON.parse(wordRows);
    }
    return null;
}

export function getColorRowsFromStorage() {
    const wordRows = localStorage.getItem("wordRows");
    if (wordRows){
        return JSON.parse(wordRows);
    }
    return null;
}

export function getSkillScoresFromStorage(){
    
}

export const getSettingsState = (settings) =>
{
    let settingsState = {};
    settings.map(setting => {
        return settingsState[setting] = localStorage.getItem(setting) === "true";
    });
    return settingsState;
}