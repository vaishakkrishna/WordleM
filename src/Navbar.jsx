import React from "react";
import Nav from "react-bootstrap/Nav";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar-custom">
      <Nav variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <Nav.Link className="navbar-custom" href="/">
            Home
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link className="navbar-custom" href="/Solver">
            Solver
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="navbar-custom" href="/Helper">
            Helper
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="navbar-custom" href="/Scorer">
            Scorer
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default Navbar;
