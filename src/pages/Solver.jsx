import Grid from "../components/Grid";
import React from "react";
import { Container } from "react-bootstrap";

function Solver() {
  return (
    <div className="mx-5">
      <h1 className="my-5">Wordle Solver</h1>
      <Grid width="5" height="6" type="Solver"/>
    </div>
  );
}

export default Solver;
