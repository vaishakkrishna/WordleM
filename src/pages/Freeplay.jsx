import React from "react";
import Grid from "../components/Grid";
import "./styles.css"
function Helper() {
  return (
    <div className="page">
      <h1 className="my-5 center">Freeplay.</h1>
      <Grid width="5" height="6" type="freeplay" />
    </div>
  );
}

export default Helper;
