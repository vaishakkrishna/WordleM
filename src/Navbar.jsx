import React from "react";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css";
import { Container, Navbar } from "react-bootstrap";

function MyNavbar() {
	return (
		<Navbar bg="dark" variant="dark">
			<Container className="my-2">
				<Navbar.Brand href="/">Home</Navbar.Brand>
				
				<Nav className="me-auto">
					<Nav.Link href="/">Wordle</Nav.Link>
					<Nav.Link href="/freeplay">Freeplay</Nav.Link>
					<Nav.Link href="/about">About</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default MyNavbar;
