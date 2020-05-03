/*global variables*/
var VarNum = 2; //variable number
var ConNum = 1; //constraint number
var buffer;  //buffer
var newC; //constraint name
var i;   //counter

/* unblock the chosen division*/
function showDiv(select) {
  document.getElementById("hidden_div2").style.display =
    select.value == 2 ? "block" : "none";
  document.getElementById("hidden_div3").style.display =
    select.value == 3 ? "block" : "none";
  document.getElementById("hidden_div4").style.display =
    select.value == 4 ? "block" : "none";
  document.getElementById("hidden_div5").style.display =
    select.value == 5 ? "block" : "none";
  document.getElementById("hidden_div6").style.display =
    select.value == 6 ? "block" : "none";
}
/**
 * On click the tab, show one content and hide another one
 */
function openLP(evt, choose_solver) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(choose_solver).style.display = "block";
  evt.currentTarget.className += " active";
}

/**
 * Set the initial values of linear programming functions for GLPK
 * Math Prog for GLPK is multi-lined
 */
function initialize() {
  document.getElementById("input_glpk").value =
    "var x1;\nvar x2;\nmaximize obj: 0.6 * x1 + 0.5 * x2;\ns.t. c1: x1 + 2 * x2 <= 1;\ns.t. c2: 3 * x1 + x2 <= 2;\nsolve;\ndisplay x1, x2;\nend;";

  let loader = document.getElementById("loader");
  loader.style.display = "none";
}

initialize();

/**
 * Handle the click event on Submit (Generate) button
 */
document.getElementById("submit_lp").onclick = function () {
  submit_lpsolver();
};

document.getElementById("submit_glpk").onclick = function () {
  submit_glpk();
};

/**
 * An async function to send the request to the backend.
 * Dealt data By LP-solver, which is a popular npm package
 * As a package, it requires a JSON as the final input and return an output JSON
 * https://www.npmjs.com/package/javascript-lp-solver
 */
async function submit_lpsolver() {
  //check the number of variables
  buffer = document.getElementById("VaribleNum");
  VarNum = buffer.options[buffer.selectedIndex].value;
  //check maximize or minimize
  let max_or_min = document.getElementById("optimize").value;
  //check if require integer solution
  let integer = document.getElementById("integer_solution").checked;
  //initialize input
  let input_json = {};
 
  //try to read input constraint
  try {
    if (VarNum == 2) {
      //read objective function constraint
      let obj_1_1 = document.getElementById("obj_1_1").value;
      let obj_2_1 = document.getElementById("obj_2_1").value;
      //read data from dynamic field and put them into an array
      let sub_1_1 = $(".sub_1_1")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_1_2 = $(".sub_1_2")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_1_3 = $(".sub_1_3")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_1_op = $(".sub_1_op")
        .map(function () {
          return this.value;
        })
        .get();
      // get length of the array
      ConNum = sub_1_1.length;
      //initialize
      input_json.opType = max_or_min;
      input_json.optimize = "z";
      input_json.variables = {
        x1: {
          z: obj_1_1,
        },
        x2: {
          z: obj_2_1,
        },
      };
      input_json.constraints = {};
      //set interger result  
      if (integer === true) {
        input_json.ints = { x1: 1, x2: 1 };
      }
      //read the constraint and group them into standard jason form
      for (i = 1; i <= ConNum; i++) {
        newC = "c" + i;
        input_json.constraints[newC] = {};
        input_json.constraints[newC][sub_1_op[i - 1]] = sub_1_3[i - 1];
        console.log(input_json);

        input_json.variables.x1[newC] = sub_1_1[i - 1];
        input_json.variables.x2[newC] = sub_1_2[i - 1];
      }
      // three variable case
    } else if (VarNum == 3) {
      let obj_1_2 = document.getElementById("obj_1_2").value;
      let obj_2_2 = document.getElementById("obj_2_2").value;
      let obj_3_2 = document.getElementById("obj_3_2").value;
      let sub_2_1 = $(".sub_2_1")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_2_2 = $(".sub_2_2")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_2_3 = $(".sub_2_3")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_2_4 = $(".sub_2_4")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_2_op = $(".sub_2_op")
        .map(function () {
          return this.value;
        })
        .get();
      ConNum = sub_2_1.length;
      input_json.opType = max_or_min;
      input_json.optimize = "z";
      input_json.variables = {
        x1: {
          z: obj_1_2,
        },
        x2: {
          z: obj_2_2,
        },
        x3: {
          z: obj_3_2,
        },
      };
      input_json.constraints = {};
      if (integer === true) {
        input_json.ints = { x1: 1, x2: 1, x3: 1 };
      }

      for (i = 1; i <= ConNum; i++) {
        newC = "c" + i;
        input_json.constraints[newC] = {};

        input_json.constraints[newC][sub_2_op[i - 1]] = sub_2_4[i - 1];
        input_json.variables.x1[newC] = sub_2_1[i - 1];
        input_json.variables.x2[newC] = sub_2_2[i - 1];
        input_json.variables.x3[newC] = sub_2_3[i - 1];
      }
      // four variable case
    } else {
      let obj_1_3 = document.getElementById("obj_1_3").value;
      let obj_2_3 = document.getElementById("obj_2_3").value;
      let obj_3_3 = document.getElementById("obj_3_3").value;
      let obj_4_3 = document.getElementById("obj_4_3").value;
      let sub_3_1 = $(".sub_3_1")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_3_2 = $(".sub_3_2")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_3_3 = $(".sub_3_3")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_3_4 = $(".sub_3_4")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_3_5 = $(".sub_3_5")
        .map(function () {
          return this.value;
        })
        .get();
      let sub_3_op = $(".sub_3_op")
        .map(function () {
          return this.value;
        })
        .get();
      ConNum = sub_3_1.length;
      input_json.opType = max_or_min;
      input_json.optimize = "z";
      input_json.variables = {
        x1: {
          z: obj_1_3,
        },
        x2: {
          z: obj_2_3,
        },
        x3: {
          z: obj_3_3,
        },
        x4: {
          z: obj_4_3,
        },
      };
      input_json.constraints = {};
      if (integer === true) {
        input_json.ints = { x1: 1, x2: 1, x3: 1, x4: 1 };
      }

      for (i = 1; i <= ConNum; i++) {
        newC = "c" + i;
        input_json.constraints[newC] = {};

        input_json.constraints[newC][sub_3_op[i - 1]] = sub_3_5[i - 1];
        input_json.variables.x1[newC] = sub_3_1[i - 1];
        input_json.variables.x2[newC] = sub_3_2[i - 1];
        input_json.variables.x3[newC] = sub_3_3[i - 1];
        input_json.variables.x4[newC] = sub_3_4[i - 1];
      }
    }
    // stringify the jason file
    input_json = JSON.stringify(input_json);

    console.log(input_json);

    let request_get = `http://127.0.0.1:5000/?model=${input_json}`;
    console.log("request via HTTP GET method: ", request_get);
    //let request_post = `http://127.0.0.1:5000/upload`;
    //console.log("request via HTTP POST method: ", request_post);

    // Send an HTTP GET request to the backend
    const data = await axios.get(request_get);
    console.log(data);

    // Send an HTTP Post request to the backend
    //const data1 = await axios.post(request_post, input_json);
    //console.log(data1);
    console.log(data.data.output_lp);
    if (data.data.output_lp.feasible === true) {
      solution_lp.innerHTML =
        "Congratulations! We can find a feasible solution. :)" + "<br /><br />";
    } else {
      solution_lp.innerHTML =
        "Sorry, We cannot find a feasible solution. :(" + "<br /><br />";
    }

    for (var p in data.data.output_lp) {
      solution_lp.innerHTML += p + " is " + data.data.output_lp[p] + "<br />";
    }
  } catch (error) {
    console.log("error: ", error);
  }

  // Set the cursor back to default
  document.body.style.cursor = "default";

  // Hide loader animation
  loader.style.display = "none";
}
//---------------------------------------------------
/**
 * This async function is to send the math program from text area to the backend
 */
async function submit_glpk() {
  console.log("In submit!");

  // Set the mouse cursor to hourglass
  document.body.style.cursor = "wait";

  // Accessing the div that has random value
  let solution_glpk = document.getElementById("solution_glpk");

  solution_glpk.innerHTML = "Please wait...";

  // Show the loader element (spinning wheels)
  let loader = document.getElementById("loader");
  loader.style.display = "inline-block";

  try {
    let content = {
      input_1: document.getElementById("input_glpk").value,
    };

    console.log("input_glpk:" + content);

    let request_post = `http://127.0.0.1:5000/glpk`;
    console.log("request via HTTP POST method: ", request_post);

    //Before get the solution from the backend, we let this button does not 
    //work in order to prevent the Send HTTP Post to many times.
    document.getElementById("submit_glpk").onclick = null;

    //After 1 seconds (similar we set the delay time in backend) 
    // we let the button work again.
    setTimeout(() => {
      document.getElementById("submit_glpk").onclick = function () {
        submit_glpk();
      };
    }, 1000);

    // Send an HTTP Post request to the backend
    const data1 = await axios.post(request_post, content);
    console.log(data1);
    solution_glpk.innerHTML = data1.data.output_lp;
  } catch (error) {
    console.log("error: ", error);
  }
  // Set the cursor back to default
  document.body.style.cursor = "default";

  // Hide loader animation

  loader.style.display = "none";
}