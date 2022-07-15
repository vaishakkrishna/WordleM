export const settings = ["Show Solver Assistant"];

export const getSettingsState = (settings) =>
{
    let settingsState = {};
    settings.forEach(setting => {
        settingsState[setting] = localStorage.getItem(setting) === "true";
    });
    return settingsState;
}