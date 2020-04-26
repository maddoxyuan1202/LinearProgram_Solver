/**
 * On click the tab, show one content and hide another one
 * 点击分隔页时，仅显示LP-solver或者GLPK中的一个
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
 * Set the initial values of linear programming functions
 * Both GLPK and LP SOlver
 * Math Prog for GLPK is multi-lined
 */
function initialize() {
  document.getElementById("obj_1").value = 3;
  document.getElementById("obj_2").value = 1;
  document.getElementById("sub_1_1").value = 2;
  document.getElementById("sub_1_2").value = -1;
  document.getElementById("sub_1_3").value = 4;
  document.getElementById("sub_2_1").value = 2;
  document.getElementById("sub_2_2").value = 3;
  document.getElementById("sub_2_3").value = 12;
  document.getElementById("sub_3_1").value = 0;
  document.getElementById("sub_3_2").value = 1;
  document.getElementById("sub_3_3").value = 3;
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
  console.log("In submit!");

  // Set the mouse cursor to hourglass
  document.body.style.cursor = "wait";

  // Accessing the div that has random value
  let solution_lp = document.getElementById("solution_lp");

  solution_lp.innerHTML = "Please wait...";

  // Show the loader element (spinning wheels)
  let loader = document.getElementById("loader");
  loader.style.display = "inline-block";

  try {
    let obj_1 = document.getElementById("obj_1").value;
    let obj_2 = document.getElementById("obj_2").value;

    let sub_1_1 = document.getElementById("sub_1_1").value;
    let sub_1_2 = document.getElementById("sub_1_2").value;
    let sub_1_3 = document.getElementById("sub_1_3").value;
    let sub_1_op = document.getElementById("sub_1_op").value;
    let sub_2_1 = document.getElementById("sub_2_1").value;
    let sub_2_2 = document.getElementById("sub_2_2").value;
    let sub_2_3 = document.getElementById("sub_2_3").value;
    let sub_2_op = document.getElementById("sub_2_op").value;
    let sub_3_1 = document.getElementById("sub_3_1").value;
    let sub_3_2 = document.getElementById("sub_3_2").value;
    let sub_3_3 = document.getElementById("sub_3_3").value;
    let sub_3_op = document.getElementById("sub_3_op").value;
    let sub_4_1 = document.getElementById("sub_4_1").value;
    let sub_4_2 = document.getElementById("sub_4_2").value;
    let sub_4_3 = document.getElementById("sub_4_3").value;
    let sub_4_op = document.getElementById("sub_4_op").value;
    let sub_5_1 = document.getElementById("sub_5_1").value;
    let sub_5_2 = document.getElementById("sub_5_2").value;
    let sub_5_3 = document.getElementById("sub_5_3").value;
    let sub_5_op = document.getElementById("sub_5_op").value;

    let max_or_min = document.getElementById("optimize").value;
    let integer = document.getElementById("integer_solution").checked;
    let input_json = {};
    input_json.opType = max_or_min;
    input_json.optimize = "z";
    input_json.constraints = {
      c1: { [sub_1_op]: sub_1_3 },
      c2: { [sub_2_op]: sub_2_3 },
      c3: { [sub_3_op]: sub_3_3 },
      c4: { [sub_4_op]: sub_4_3 },
      c5: { [sub_5_op]: sub_5_3 },
    };
    input_json.variables = {
      x: {
        z: obj_1,
        c1: sub_1_1,
        c2: sub_2_1,
        c3: sub_3_1,
        c4: sub_4_1,
        c5: sub_5_1,
      },
      y: {
        z: obj_2,
        c1: sub_1_2,
        c2: sub_2_2,
        c3: sub_3_2,
        c4: sub_4_2,
        c5: sub_5_2,
      },
    };
    if (integer === true) {
      input_json.ints = { x: 1, y: 1 };
    }
    input_json = JSON.stringify(input_json);


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

    document.getElementById("submit_glpk").onclick = null;
    setTimeout(() => {
      document.getElementById("submit_glpk").onclick = function () {
        submit_glpk();
      };
    }, 2000);

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
