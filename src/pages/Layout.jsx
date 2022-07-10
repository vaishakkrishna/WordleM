import React from "react";
import { Outlet } from "react-router-dom";
import MyNavbar from "../Navbar";
const Layout = () => {
	return (
		<div>
			<MyNavbar/>
			<div className="center mt-5" style={{fontSize: 'x-small'}} >
				(Scroll for more options)
			</div>
			<Outlet />
			
		</div>
	);
};

export default Layout;
