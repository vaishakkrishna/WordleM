import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import MyNavbar from "../Navbar";
import Button from "react-bootstrap/Button";
import "./styles.css";
import Settings from "../components/Settings";
const Layout = () => {
	const [showSettings, setShowSettings] = useState(true);

	return (
		<div>
			<MyNavbar />
			<Button
				className="settings-icon btn-secondary"
				onClick={(e) => setShowSettings(!showSettings)}
			>
				⚙
			</Button>
			{
				showSettings && (<Settings />)
			}
			
			<Outlet />

			
		</div>
	);
};

export default Layout;
