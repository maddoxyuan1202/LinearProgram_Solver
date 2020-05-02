const assert = require("assert");
const myLib = require("../backend/app.js");
const fs = require("fs");
const solver = require("javascript-lp-solver");
try {
  const data = fs.readFileSync("../test/test.txt", "utf8");
  output_lp = data;
} catch (err) {
  output_lp = "MathProg model processing error";
}

// Testing GLPK
describe("glpk Test with Mocha", () => {
  it("should work", () => {
    assert.equal(myLib.output_lp_glpk(), output_lp);
  });
});

// Testing LP-Solver
let model_1 = {
  optimize: "z",
  opType: "max",
  constraints: {
    c1: { max: 4 },
    c2: { max: 12 },
    c3: { max: 3 },
    c4: { max: 0 },
  },
  variables: {
    x: {
      z: 3,
      c1: 2,
      c2: 2,
      c3: 0,
      c4: 0,
    },
    y: {
      z: 1,
      c1: -1,
      c2: 3,
      c3: 1,
      c4: 0,
    },
  },
};
let output_1 = { feasible: true, result: 11, bounded: true, x: 3, y: 2 };
describe("lp-solver Feasible Test with Mocha", () => {
  it("should work", () => {
    assert.deepEqual(myLib.LinearProgramming(model_1, solver), output_1);
  });
});
