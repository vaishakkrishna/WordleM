import React from "react";

import { settings } from "../assets/settings";
import "./Settings.css";
/**
 * Settings component. Uses settings from external file, displays them in an overlay.
 */

function Settings(props) {
	//handles changing of a checkbox, updates the local storage accordingly.
	const handleSettingsChange = (settingName) => {
		const newSettingsStates = { ...props.settingsState };
		newSettingsStates[settingName] = !newSettingsStates[settingName];
		props.updateSettingsState(newSettingsStates);
		localStorage.setItem(settingName, newSettingsStates[settingName]);
	};

	return (
		<>
			<div className="blurred-bg" />
			<div className="settings-overlay center">
				<h1 className="p-4">Settings</h1>
				<div className="settings-list">
					{settings.map((elem) => (
						<label key={elem}>
							<input
								type="checkbox"
								checked={props.settingsState[elem]}
								onChange={() => handleSettingsChange(elem)}
								key="elem"
							/>
							{elem}
						</label>
					))}
				</div>
			</div>
		</>
	);
}
export default Settings;
