# LinearProgram_Solver
A compact and simple website for linear programming with 2 sources: LP-solver and GLPK.

Designed by 3 USC EE students.

## Linear Programming Introduction
A technique for the optimization of a linear objective function, subject to linear equality and linear inequality constraints
![LP-example](/LP_example.png)
## Highlighted features

* Two different sources: javescript-lp-solver and GLPK
* Develop frontend webpages by bootstrap4, html, css, containing collapse, tab and IO user interfaces
* Relying on Javscript-LP-sovler to generate solution, using Express library to send HTTP Get request from frontend to backend, by parsing input into a JSON
* Generate dynamic input for LP-solver webpage, which enables users to choose up to 4 variables for a linear program
* Wrapped GLPK, a GNU based library, into Node.js backend, and use Express library to send HTTP Post request via async function 
* Save input written in Mathprog, a linear programming language
* Block Generate Button after a single click, to prevent multi-sending request to backend when it's working.
* Send daily webpage usage email to webpage admin, in order to fully monitor the website
![Screenshot1](/screenshot1.png)
Input for GLPK

![Screenshot2](/screenshot2.png)
Input for LP-solver, 2 variables, 3 constraints

![Screenshot3](/screenshot3.png)
Input for LP-solver, 4 variables, 2 constraints

![Screenshot4](/daily_email.png)
Daily report for webpage users

## Tools we use 
* Frontend: Bootstrap4, Html, Css, Jquery
* Backend: Node.js
* Libraries: express, javascript-lp-solver, GLPK, morgan, nodemailer, fs, shelljs, body-parser
## Overview of implementation
### Frontend
* Jquery library: Create append and delete functions to dynamicaly allocate input field.
* ShowDiv function to hide and reveal the number of variables selected by the user
* Bootstrap and Javascript: generate collapse and tab for webpage
### Backend
* Express Library: HTTP Get Request to listen input_json from localhost:3000, return output to frontend
* Express Library: HTTP Post Request to receive MathProg, save as text file and call GLPK using shell.js, then return output file to frontend
* Daily user Statistic: use global variables to collect daily number of users, send email to host by nodemailer
## Group members
Wenhao Cui: wenhaocu@usc.edu <br>
Tieming Sun: tiemings@usc.edu <br>
Jiaao Zhu: jiaaozhu@usc.edu
## Link to video
[click here](https://youtu.be/nOh51QsuuGI)
## More about our backend sources
### Javasrcipt-lp-solver
A Node.js based Linear Programming package for real world. [Learn more on LP-solver](https://www.npmjs.com/package/javascript-lp-solver)
### GLPK
An open Source Library written in C, which is a GNU based library dealing with Linear Programs, we wrapped it into our Node.js backend [Learn more on GLPK](https://www.gnu.org/software/glpk/)

## Simple steps to run this repo
Clone this repo into your computer.
```
git clone https://github.com/suntietie/LinearProgram_Solver.git
cd LinearProgram_Solver
npm install
```
Install Homebrew if you don't: [Homebrew](https://brew.sh/)<br>
Install GLPK
```
brew install glpk
```
Open frontend and backend
```
cd frontend/
node app.js
cd backend/
node app.js
```
Last, open your browser to enjoy this website! http://localhost:3000
## Future work
* Add online database for user log-in / log-out to check Linear Programming function history
* Deploy the website on [Heroku](https://www.heroku.com/) server
