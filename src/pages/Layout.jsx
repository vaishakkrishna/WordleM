import React from "react";
import { Outlet } from "react-router-dom";
import MyNavbar from "../Navbar";
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
const Layout = () => {
	return (
		<div>
			<MyNavbar />
			<Outlet />
			
		</div>
	);
};

export default Layout;
