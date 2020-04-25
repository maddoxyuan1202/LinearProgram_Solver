"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const solver = require("javascript-lp-solver");
const bodyparser = require("body-parser")
// We need cors middleware to bypass CORS security in browsers.
const cors = require("cors");
const morgan = require("morgan");

require('shelljs/global');
const fs = require('fs')
var FileSaver = require('file-saver'); 




// Sync call to exec()
var version = exec('node --version', {silent:true}).output;

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


const port = 5000;

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
  console.log("req", req);

// 上传文档时的写法，已放弃
  //console.log("req.samplefile:", req.files.sampleFile);
  //console.log(JSON.parse(req.files.sampleFile.data));
//   try{
//     if(!req.files){
//       res.send({
//         status: false,
//         message: "No file is uploaded"
//       });
//     }else{
//       if(req.files !== undefined){
        
//         let model_post = req.files.sampleFile;
//         model_post.mv("./uploads/" + model_post.name);
//         let input = JSON.parse(model_post.data);
//         //const input_json = require(`../backend/uploads/${model_post.name}`);
//         output_lp = LinearProgramming(input, solver);
//         console.log(output_lp);
//       }else{error = "ERROR: uploaded file isn't in JSON type";}

//       output = {
//         status: true,
//         message: "File is uploaded",
//         output_lp: output_lp,
//         error: error
//       };
      
//       let outputString = JSON.stringify(output, null, 2);
//       console.log("outputString: ", outputString);

//       await delay(1000);
      
//       res.send(output);
//     }
//   }catch(err){
//     res.status(404).send(err);
//     console.log("error in app post:", err);
//   }
// })
try{  
    if(req.body !== undefined){
      
      let model_post = req.body;
      console.log("model_post", typeof model_post);
      // Store user history to local envirnoment 
      
      //model_post.mv("./uploads/" + model_post.name);
      console.log("model_post is ", model_post);
      let input = JSON.parse(Object.keys(model_post));
      console.log("input", input);
      //const input_json = require(`../backend/uploads/${model_post.name}`);
      output_lp = LinearProgramming(input, solver);
      console.log(output_lp);
    }else{error = "ERROR: uploaded INFO isn't in JSON type";}

    output = {
      status: true,
      message: "JSON is uploaded",
      output_lp: output_lp,
      error: error
    };
    
    let outputString = JSON.stringify(output, null, 2);
    console.log("outputString: ", outputString);

    await delay(1000);
    
    res.send(output);

}catch(err){
  res.status(404).send(err);
  console.log("error in app post:", err);
}
})


app.post("/glpk", async function(req, res){

  let error = "NO_ERROR";
  let output_lp;
  let output;

  let model_post = req.body;
  console.log("model_post", typeof model_post);

  console.log("model_post is ", model_post);

  let input =  Object.values(model_post)+"";
  let replac_str = "%2B";
  input = input.split(replac_str).join("+");
  console.log("input:", input);


  fs.writeFile("test.txt", input, (err, data) => {
    if (err) throw err;
  })

  await delay(100);

  // Async call to exec()
  exec('glpsol -m test.txt -o temp.txt');



  try{
    if(!req.body){
      res.send({
        status: false,
        message: "No file is uploaded"
      });
    }else{
      if(req.body !== undefined){

  //       let model_post = req.files.solution;
  //       model_post.mv("./uploads/" + model_post.name);
        try {
          const data = fs.readFileSync('temp.txt', 'utf8');
          output_lp = data;
        } catch (err) {
          console.error(err);
        }
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
  //console.log(query.model);
  // If there was a query (a query string was sent)
  if (
    query !== undefined &&
    query.model !== undefined
  ) {
    //console.log(model_get);
    // Convert min_value and max_value from String to integer
    let model_get = JSON.parse(query.model);
    
    // Generate a random number
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
  // console.log(typeof outputString);
  // Let's generate some artificial delay!
  await delay(1000);
  // Send it back to the frontend.
  res.send(outputString);
}


require('shelljs/global');

// Sync call to exec()
var version = exec('node --version', {silent:true}).output;

// Async call to exec()
exec('glpsol --cuts --fpump --mipgap 0.001 --model glpk_example/problem.mod -o glpk_example/temp.txt', function(status, output) {
  console.log('Exit status:', status);
  console.log('Program output:', output);
});