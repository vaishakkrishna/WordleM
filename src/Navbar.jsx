import React from "react";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css";
import { Container, Navbar } from "react-bootstrap";

function MyNavbar() {
	return (
		<Navbar bg="dark" variant="dark">
			<Container className="my-2">
				<Navbar.Brand href="/">Navbar</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link href="/">Wordle</Nav.Link>
					<Nav.Link href="/freeplay">Freeplay</Nav.Link>
					<Nav.Link href="/about">About</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
		// <div className="navbar-custom">
		// 	<Nav variant="tabs" defaultActiveKey="/">
		// 		<Nav.Item>
		// 			<Nav.Link className="navbar-custom" href="/">
		// 				Wordle
		// 			</Nav.Link>
		// 		</Nav.Item>
		// 		<Nav.Item>
		// 			<Nav.Link className="navbar-custom" href="/Freeplay">
		// 				Freeplay
		// 			</Nav.Link>
		// 		</Nav.Item>
		// 		<Nav.Item>
		// 			<Nav.Link className="navbar-custom" href="/about">
		// 				About
		// 			</Nav.Link>
		// 		</Nav.Item>

		// 		{/* <Nav.Item>
		//   <Nav.Link className="navbar-custom" href="/Scorer">
		//     Scorer
		//   </Nav.Link>
		// </Nav.Item> */}
		// 	</Nav>
		// </div>
	);
}

export default MyNavbar;
