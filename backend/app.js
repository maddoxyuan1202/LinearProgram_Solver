"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const solver = require("javascript-lp-solver");
const bodyparser = require("body-parser")
// We need cors middleware to bypass CORS security in browsers.
const cors = require("cors");
const morgan = require("morgan");


//enable file uploaded
app.use(
  fileUpload({
    createParentPath: true
  })
);

app.use(express.static("static"));
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan("dev"));


const port = process.env.PORT || 5000;

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
 * The default path is for http get method, 
 * sending message by url
 */
app.get("/", async function(req, res) {
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("I got a query!");
    handleGet(res, res, req.query);
  }
});

app.post("/upload", async function(req, res){

  let error = "NO_ERROR";
  let output_lp;
  let output;

  console.log("req.samplefile:", req.files.sampleFile);
  //console.log(JSON.parse(req.files.sampleFile.data));
  try{
    if(!req.files){
      res.send({
        status: false,
        message: "No file is uploaded"
      });
    }else{
      if(req.files !== undefined){
        
        let model_post = req.files.sampleFile;
        model_post.mv("./uploads/" + model_post.name);
        let input = JSON.parse(model_post.data);
        //const input_json = require(`../backend/uploads/${model_post.name}`);
        output_lp = LinearProgramming(input, solver);
        console.log(output_lp);
      }else{error = "ERROR: uploaded file isn't in JSON type";}

      output = {
        status: true,
        message: "File is uploaded",
        output_lp: output_lp,
        error: error
      };
      
      let outputString = JSON.stringify(output, null, 2);
      console.log("outputString: ", outputString);

      await delay(1000);
      
      res.send(output);
    }
  }catch(err){
    res.status(404).send(err);
    console.log("error in app post:", err);
  }
})

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

  console.log("query: ", query);
  console.log(JSON.stringify(query.model));
  // If there was a query (a query string was sent)
  if (
    query !== undefined &&
    query.model !== undefined
  ) {
    let model_get = JSON.parse(query.model);
    console.log(model_get);
    output_lp = LinearProgramming(model_get, solver);
    console.log("Via http get method, output is: ", output_lp);
  } else {
    error = "ERROR: input not provided";
  }

  // Generate the output
  let output = {
    output_lp: output_lp,
    error: error
  };
  // Convert output to string
  let outputString = JSON.stringify(output, null, 2);
  console.log("outputString: ", outputString);

  // Let's generate some artificial delay!
  await delay(1000);
  // Send it back to the frontend.
  res.send(outputString);
}
