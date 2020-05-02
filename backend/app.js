"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const solver = require("javascript-lp-solver");
const bodyparser = require("body-parser");
// We need cors middleware to bypass CORS security in browsers.
const cors = require("cors");
const morgan = require("morgan");
const moment = require("moment");

require("shelljs/global");
const fs = require("fs");
const FileSaver = require("file-saver");

const nodemailer = require("nodemailer");

// define a global varibale to get number of users who use LP-solver
var users_lpsolver = 0;
// define a global varibale to get number of users who use GLPK
var users_glpk = 0;
// define a global varibale to get number of users who caught error
var users_error = 0;

// Sync call to exec()
const version = exec("node --version", { silent: true }).output;

//enable file uploaded
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.static("static"));
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
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
const delay = function (t) {
  return new Promise((resolve) => setTimeout(resolve, t));
};

/**
 * The default path is for http get method,
 * sending message by url
 * For LP-solver
 */
app.get("/", async function (req, res) {
  if (req.query && Object.keys(req.query).length > 0) {
    console.log("I got a query!");
    handleGet(res, res, req.query);
  }
});

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
  // If there was a query (a query string was sent)
  if (query !== undefined && query.model !== undefined) {
    //console.log(model_get);
    let model_get = JSON.parse(query.model);

    // Use NPM Package here
    output_lp = await LinearProgramming(model_get, solver);
    console.log("Via http get method, output is: ", output_lp);
    users_lpsolver += 1;
  } else {
    error = "ERROR: input not provided";
    users_error += 1;
  }

  // Generate the output
  let output = {
    output_lp: output_lp,
    error: error,
  };

  // Convert output to string
  let outputString = JSON.stringify(output, null, 2);
  console.log("outputString: ", outputString);
  
  // Let's generate some artificial delay!
  await delay(1000);
  // Send it back to the frontend.
  res.send(outputString);
}
//-----------------------------------------------------------------------------

/**
 * The /glpk path is using http post method,
 * sending message to the frontend
 * For another source -- GLPK
 */
app.post("/glpk", async function (req, res) {
  let error = "NO_ERROR";
  let output_lp;
  let output;

  let model_post = req.body;
  console.log("model_post", typeof model_post);

  console.log("model_post is ", model_post);

  let input = Object.values(model_post) + "";
  // decoding '+' into %2B and replace it as '+'
  let replac_str = "%2B";
  input = input.split(replac_str).join("+");
  console.log("input:", input);

  fs.writeFile("test.txt", input, (err, data) => {
    if (err) throw err;
  });

  await delay(100);

  // Async call to exec(), script to call GLPK using shell.js
  exec("glpsol -m test.txt -o temp.txt");

  try {
    if (!req.body) {
      res.send({
        status: false,
        message: "No file is uploaded",
      });
    } else {
      if (req.body !== undefined) {
        try {
          const data = fs.readFileSync("temp.txt", "utf8");
          output_lp = data;
        } catch (err) {
          output_lp = "MathProg model processing error";
          users_error += 1;
        }
      }

      output = {
        status: true,
        message: "File is uploaded",
        output_lp: output_lp,
        error: error,
      };

      let outputString = JSON.stringify(output, null, 2);
      console.log("outputString: ", outputString);

      await delay(1000);
      // get statistic for how many clicks
      users_glpk += 1;
      res.send(output);
    }
  } catch (err) {
    res.status(404).send(err);
    console.log("error in app post:", err);
  }
});

/**
 * This function is used for backend testing
 * read temp.txt
 */
function output_lp_glpk() {
  try {
    const data = fs.readFileSync("temp.txt", "utf8");
    output_lp = data;
  } catch (err) {
    output_lp = "MathProg model processing error";
  }
  return output_lp;
}


/**
 * by defalut, listen to localhost:5000
 */
app.listen(port, (err) => {
  console.log(`Listening on port: ${port}`);
});



/*
 * Set an email every day so that admin could monitor 
 * write an Object using global variables
 */
function analyze(){
  let data = {};
  data.all = users_lpsolver + users_glpk + users_error;
  data.lpsolver = users_lpsolver;
  data.glpk = users_glpk;
  data.error = users_error;
  return data;
}
// change to password if use the email service
let pw = "XXXXXXXXX";
let spec = `smtps://tiemingsun96@gmail.com:${pw}@smtp.gmail.com`;

// // Sends an email using gmail account
function SendMail(mailOptions) {
  var transporter = nodemailer.createTransport(spec);
  return transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log("Error in sending email: ", error);
      try {
        if (/quota/.test(error)) {
          console.log("We failed because of email quota!");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
}

async function sendNotification() {
  let data = analyze();
  console.log(data);
  // write email in HTML documentation
  let date = moment().format("MMMM Do YYYY, h:mm:ss a");
  let body = `<pre>`;
  body += date + "\n";
  body += "There are overall " + data.all + "clicks since the last 24 hours" + "\n";
  body += "they use LP-solver " + data.lpsolver + " times and use GLPK " + data.glpk + " times" + "\n";
  body += "Found error " + data.error + " times";
  body += `</pre>`;
  

  let mailOptions = {
    from: '"Linear Programming Solver" <tiemingsun96@gmail.com>', // sender address
    to: "tiemingsun@hotmail.com", // list of receivers
    subject: "Today's website report", // Subject line
    text: "", // plaintext body
    html: body
  };
  SendMail(mailOptions);

  // set these global variables back to zero
  users_error = 0;
  users_glpk = 0;
  users_lpsolver = 0;

}
/**
 * Set interval for a day to receive email
 */
setInterval( sendNotification, 86400000);

/**
 * export 2 functions for test cases
 */
module.exports = {
  output_lp_glpk: output_lp_glpk,
  LinearProgramming: LinearProgramming,
};