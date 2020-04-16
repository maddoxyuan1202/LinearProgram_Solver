"use strict";
const solver = require("javascript-lp-solver");
/**
 * Solve the model by jsLPSolver
 * @param {Object} model 
 */
function LinearProgramming(model, solver) {
    return solver.Solve(model);
  }
  // find the max of 3x + y
  // 
  let model = {
    "optimize": "maximize",
    "opType": "max",
    "constraints": {
        "c1": {"max": 4},
        "c2": {"max": 12},
        "c3": {"max": 3}
    },
    "variables": {
        "x": {
            "maximize": 3,
            "c1": 2,
            "c2": 2,
            "c3": 0
        },
        "y": {
            "maximize": 1,
            "c1": -1,
            "c2": 3,
            "c3": 1
        }
    }
}
  let output = LinearProgramming(model, solver);
  let outputString = JSON.stringify(output, null, 2);
  
  console.log("output is: ", outputString);
  console.log("json: ", JSON.stringify(model));