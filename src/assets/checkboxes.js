export const checkboxes = ["Show Solver Assistant"];

export const getCheckboxStates = (checkboxes) =>
{
    let checkboxStates = {};
    checkboxes.forEach(checkbox => {
        checkboxStates[checkbox] = localStorage.getItem(checkbox) === "true";
    });
    return checkboxStates;
}