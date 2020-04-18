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
  document.getElementById("objective_func").value = "3x + y";
  document.getElementById("subject_to_1").value = "2x - y <= 4";
  document.getElementById("subject_to_2").value = "2x + 3y <= 12";
  document.getElementById("subject_to_3").value = "y <= 3";
  document.getElementById("varibales").value = "x y";
  document.getElementById("input_glpk").value = 
  "var x1;\nvar x2;\nmaximize obj: 0.6 * x1 + 0.5 * x2;\ns.t. c1: x1 + 2 * x2 <= 1;\ns.t. c2: 3 * x1 + x2 <= 2;\nsolve;\ndisplay x1, x2;\nend;";

  let loader = document.getElementById("loader");
  loader.style.display = "none";

}

initialize();

/**
 * 通过正则表达式
 * 检查输入格式，返回JSON或者false，用在LP-solver中
 * This Function is used in submit_lp
 * Check whether the input is legal or not
 * if all inputs are legal, translate parameters into a JSON,
 * or return false
 */
function input_to_json(variables, obj, sub1, sub2, sub3, sub4, sub5, sub6, max_or_min, integer){

  return input_json;
}


/**
 * Handle the click event on Submit (Generate) button
 */
document.getElementById("submit_lp").onclick = function() {
  submit_lpsolver();
};

document.getElementById("submit_lpsolver").onclick = function(){
  submit_glpk();
}

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
  let solution_lp = document.getElementById("result_by_lp_solver");

  solution_lp.innerHTML = "Please wait...";
  
  // Show the loader element (spinning wheels)
  let loader = document.getElementById("loader");
  loader.style.display = "inline-block";

  try {
    let variables = document.getElementById("varibales").value;
    let obj = document.getElementById("objective_func").value;
    let sub1 = document.getElementById("subject_to_1").value;
    let sub2 = document.getElementById("subject_to_2").value;
    let sub3 = document.getElementById("subject_to_3").value;
    let sub4 = document.getElementById("subject_to_4").value;
    let sub5 = document.getElementById("subject_to_5").value;
    let sub6 = document.getElementById("subject_to_6").value;
    let max_or_min = document.getElementById("optimize").value;
    let integer = document.getElementById("integer_solution").value;


    // an example of input_json
    let input_json = {
      optimize: 'maximize',
      opType: 'max',
      constraints: { c1: { max: 4 }, c2: { max: 12 }, c3: { max: 3 } },
      variables: {
        x: { maximize: 3, c1: 2, c2: 2, c3: 0 },
        y: { maximize: 1, c1: -1, c2: 3, c3: 1 }
      }
    };
    input_json = JSON.stringify(input_json);
    //let request_get = `http://127.0.0.1:5000/?model=${input_json}`;
    //console.log("request via HTTP GET method: ", request_get);
    let request_post = `http://127.0.0.1:5000/upload`;
    console.log("request via HTTP POST method: ", request_post);


    // Send an HTTP GET request to the backend
    //const data = await axios.get(request_get);
    //console.log(data);

    // Send an HTTP Post request to the backend
    const data1 = await axios.post(request_post, input_json);
    console.log(data1);
    solution_lp.innerHTML = "Here is your solution: " + JSON.stringify(data1.data.output_lp);
    
  } catch (error) {
    console.log("error: ", error);
  }

  // Set the cursor back to default
  document.body.style.cursor = "default";

  // Hide loader animation
  loader.style.display = "none";
}
