"use strict";

const express = require("express");
const app = express();
const solver = require("javascript-lp-solver");

// We need cors middleware to bypass CORS security in browsers.
const cors = require("cors");

app.use(express.static("static"));
app.use(cors());

let port = 5000;


/**
 * Solve the model by jsLPSolver
 * @param {Object} model 
 */
function LinearProgramming(model, solver) {
  return solver.Solve(model);
}
/**
 * A promise that resolves after t ms.
 * @param {Number} t 
 */
const delay = function(t) {
  return new Promise(resolve => setTimeout(resolve, t));
};


/**
 * The default path
 */
app.get("/", async function(req, res) {
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("I got a query!");
    handleGet(res, res, req.query);
  }
});

app.listen(port, err => {
  console.log(`Listening on port: ${port}`);
});
//-----------------------------------------------------------------------------
/**
 * Handles a Get request
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} query 
 */
async function handleGet(req, res, query) {
  let error = "NO_ERROR";
  let output_lp;
  let model;

  console.log("query: ", query);
  console.log(query.model);
  // If there was a query (a query string was sent)
  if (
    query !== undefined &&
    query.model !== undefined
  ) {
    // Convert min_value and max_value from String to integer
    let model_get = JSON.parse(query.model);
    
    // Generate a random number
    output_lp = LinearProgramming(model_get, solver);
    console.log("output is: ", output_lp);
  } else {
    error = "ERROR: input not provided";
  }

  // Generate the output
  let output = {
    output_lp: output_lp,
    error: error
  };

  // Convert output to JSON
  let outputString = JSON.stringify(output, null, 2);
  console.log("outputString: ", outputString);
  
  // Run an external 
  // output
  // Let's generate some artificial delay!
  await delay(2000);

  // Send it back to the frontend.
  res.send(outputString);
}
