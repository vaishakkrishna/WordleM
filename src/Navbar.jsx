import React from "react";
import Nav from "react-bootstrap/Nav";
import { BrowserRouter, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <Nav variant="tabs" defaultActiveKey="/Home" className="bg-brown">
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Solver">Solver</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Helper">Helper</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Scorer">Scorer</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar;
