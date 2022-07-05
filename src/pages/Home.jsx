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
							This is a Wordle client + solver that gives you more
							customizatability and control over your Wordle Experience. See How
							well you did by toggling the skill button, or even sync with the Wordle 
              website and keep track of progress on both.
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
