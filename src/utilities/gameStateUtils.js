
import { allSolutionsList } from "./wordLists";
export function getSolutionFromOffset(){
    const doe = getDayOfTheYear();
    const offset = 195;

    const res = allSolutionsList[(offset + doe) % allSolutionsList.length];

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