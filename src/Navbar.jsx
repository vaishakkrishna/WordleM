import React from "react";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css";
import { Container, Navbar } from "react-bootstrap";
import { useState } from "react";
import { Button } from "react-bootstrap";

function MyNavbar() {
	return (
		<Navbar bg="dark" variant="dark" className="my-nav">
			<Container className="my-2">
				<Navbar.Brand className="full-title" href="/">
					Better Wordle.
				</Navbar.Brand>
				<Navbar.Brand className="small-title" href="/">
					BW.
				</Navbar.Brand>
				<Nav className="me-auto justify-content-right">
					<Nav.Link className="full-title" href="/freeplay">
						Freeplay
					</Nav.Link>
					<Nav.Link className="small-title" href="/freeplay">
						FP
					</Nav.Link>
					<Nav.Link  href="/about">
						About
					</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	);
}

export default MyNavbar;
