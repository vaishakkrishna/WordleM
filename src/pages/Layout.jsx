import React from "react";

import { Outlet } from "react-router-dom";
import MyNavbar from "../Navbar";

import "./styles.css";

const Layout = () => {
	return (
		<div>
			<MyNavbar/>

			<Outlet />
		</div>
	);
};

export default Layout;
