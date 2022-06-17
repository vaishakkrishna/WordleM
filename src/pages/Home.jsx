import React from "react";
import Button from "react-bootstrap/Button";

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="my-5">
          <div className="col-lg-5">
            <h1 className="font-weight-heavy">Vaishak's Wordle Wizard</h1>
            <p>
              How it works: Lorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div className="my-5">
            <Button variant="success" href="/Solver">
              See it solve today's Wordle!
            </Button>{" "}
            <Button variant="info" href="/Scorer">
              See how I did instead
            </Button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
