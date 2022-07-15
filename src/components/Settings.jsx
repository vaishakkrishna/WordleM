import React from "react";
import { useState } from "react";
import { settings, getSettingsState } from "../assets/settings.js";
import "./Settings.css"
/**
 * Settings component. Uses settings from external file, displays them in an overlay.
 */
function Settings() {
    const [settingsState, setSettingsState] = useState(
		getSettingsState(settings)
	);
	//handles changing of a checkbox, updates the local storage accordingly.
	const handleSettingsChange = (settingName) => {
		const newSettingsStates = { ...settingsState };
		newSettingsStates[settingName] = !newSettingsStates[settingName];
		setSettingsState(newSettingsStates);
		localStorage.setItem(settingName, newSettingsStates[settingName]);
		console.log(settingName);
	};
    

	return (
		<div className="settings-overlay center">
			<h1>Settings</h1>
			<div className="settings-list">
				{settings.map((elem) => (
					<label key={elem}>
						<input
							type="checkbox"
							checked={settingsState[elem]}
							onChange={() => handleSettingsChange(elem)}
							key="elem"
						/>
						{elem}
					</label>
				))}
			</div>
		</div>
	);
}
export default Settings;
