# LinearProgram_Solver
An Everything Website for linear programming. Designed by 3 USC EE students.

## Linear Programming Introduction
A technique for the optimization of a linear objective function, subject to linear equality and linear inequality constraints
![LP-example](../LP_example.png)
## What we have done
![Webpage](../webpage.png)
* Implement the backend by solving linear programs in two different sources: javescript-lp-solver and GLPK
* Develop frontend webpages by bootstrap4, html, css, containing ellipse, tab and IO user interfaces
* Relying on Javscript-LP-sovler to generate solution, using Express library to send HTTP Get request from frontend to backend, by parsing input into a JSON
* Generate dynamic input for LP-solver webpage, which enables users to choose up to 5 variables for a linear program
* Wrapped GLPK, a GNU based library, into Node.js backend, and use Express library to send HTTP Post request via async function 
* Save input written in Mathprog, a linear programming language, and solution as text files in backend, then send back to the frontend
* Block Generate Button after a single click, to prevent multi-sending request to backend
* Send daily webpage usage email to webpage admin, in order to fully monitor the website

## Tools we use 
* Frontend: Bootstrap4, Html, Css, Jquery
* Backend: Node.js
* Libraries: express, javascript-lp-solver, GLPK, morgan, nodemailer, file-saver, shelljs, body-parser

## Group members
Wenhao Cui: wenhaocu@usc.edu <br>
Tieming Sun: tiemings@usc.edu <br>
Jiaao Zhu: jiaaozhu@usc.edu

## More about our backend sources
### Javasrcipt-lp-solver
A Node.js based Linear Programming package for real world. [Learn more on LP-solver](https://www.npmjs.com/package/javascript-lp-solver)
### GLPK
An open Source Library written in C, which is a GNU based library dealing with Linear Programs, we wrapped it into our Node.js backend [Learn more on LP-solver](https://www.gnu.org/software/glpk/)
