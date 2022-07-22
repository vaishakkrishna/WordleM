import React from "react";
import Grid from "../components/Grid";
import "./styles.css";
import Settings from "../components/Settings";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { getSettingsState } from "../utilities/gameStateUtils";
import { settings } from "../assets/settings";
import { useEffect } from "react";
import settingsIcon from "../assets/settings.jpg";
function PlayView(props) {
	const [showSettings, setShowSettings] = useState(false);
	const [settingsState, setSettingsState] = useState(
		getSettingsState(settings)
	);

	useEffect(() => {
		// function handlePageClick(e) {
		// 	let settingsBox = document.getElementById("settings-page");
		// 	console.log(settingsBox);
		// 	if (
		// 		!(
		// 			e.pageX < settingsBox.right &&
		// 			e.pageX > settingsBox.left &&
		// 			e.pageY < settingsBox.bottom &&
		// 			e.pageY > settingsBox.top
		// 		) ||
		// 	) {
		// 		setShowSettings(false);
		// 	}
		// }
		// document.addEventListener("click", handlePageClick);
	});
	return (
		<div className="page">
			<div onClick={(e) => setShowSettings(!showSettings)}>
				<img src={settingsIcon} alt="⚙" className="settings-icon" />
			</div>
			{showSettings && (
				<Settings
					settingsState={settingsState}
					updateSettingsState={setSettingsState}
				/>
			)}
			<Grid
				width="5"
				height="6"
				type={props.type}
				settingsState={settingsState}
			/>
		</div>
	);
}

export default PlayView;
