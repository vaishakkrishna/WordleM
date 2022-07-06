import React from "react";
import Grid from "../components/Grid";
import "./styles.css"
function Helper() {
  return (
    <div >
      <h1 className="my-5 center">Better Wordle.</h1>
      <Grid width="5" height="6" type="helper" />
    </div>
  );
}

export default Helper;
