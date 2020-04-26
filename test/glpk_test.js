const assert = require("assert");
const myLib = require("../backend/app.js");
const fs = require("fs");

try {
  const data = fs.readFileSync("../backend/temp.txt", "utf8");
  output_lp = data;
} catch (err) {
  output_lp = "MathProg model processing error";
}
// Testing FindMax
describe("glpk Test with Mocha", () => {
  it("should work", () => {
    assert.equal(myLib.output_lp_glpk(), output_lp);
  });
});
