import React from "react";
import Button from "react-bootstrap/Button";
import "./styles.css";
function Home() {
	return (
		<div className="home">
			<div className="container">
				<div className="col-lg-5">
					<h1 className="font-weight-heavy title">Better Wordle.</h1>
					<p className="description">
						This is a Wordle client + solver that gives you more
						customizatability and control over your Wordle Experience. See how
						well you did by toggling the skill button, or even sync with the
						Wordle website and keep track of progress on both.
					</p>
				</div>
				<div className="buttons">
					<Button className="solve-button" variant="success" href="/">
						Solve Today's Wordle
					</Button>
					<Button className ="freeplay-button" variant="info" href="/freeplay">
						Freeplay
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Home;
