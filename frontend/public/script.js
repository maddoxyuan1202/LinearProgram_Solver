/**
 * Set the initial values of linear programming functions
 */
function initialize() {
  document.getElementById("objective_func").value = "3x + y";
  document.getElementById("subject_to_1").value = "2x - y <= 4";
  document.getElementById("subject_to_2").value = "2x + 3y <= 12";
  document.getElementById("subject_to_3").value = "y <= 3";

  let loader = document.getElementById("loader");
  loader.style.display = "none";

}

initialize();

/**
 * Handle the click event on Submit (Generate) button
 */
document.getElementById("submit").onclick = function() {
  submit();
};

/**
 * An async function to send the request to the backend.
 */
async function submit() {
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
    // Get the min/max values from the user 
    //let min_value = document.getElementById("min_value").value;
    //let max_value = document.getElementById("max_value").value;
    
    let objective = document.getElementById("objective_func").value;
    let subject1 = document.getElementById("subject_to_1").value;
    let subject2 = document.getElementById("subject_to_2").value;
    let subject3 = document.getElementById("subject_to_3").value;
    let max_or_min = document.getElementById("optimize").value;
    let integer_solution = document.getElementById("integer_solution").value;

    //处理字符串 -> object


    //let request = `http://127.0.0.1:5000/?min_value=${min_value}&max_value=${max_value}`;
    let request = `http://127.0.0.1:5000/upload`
    console.log("request: ", request);
    // Send an HTTP GET request to the backend
  
    const data = await axios.get(request);

    console.log("data.data: ", JSON.stringify(data.data, null, 2));
    

    // Display the random value
    random_value_element.innerHTML = "Here is your random number: " + data.data.randomValue;
  } catch (error) {
    console.log("error: ", error);
  }

  // Set the cursor back to default
  document.body.style.cursor = "default";

  // Hide loader animation
  loader.style.display = "none";
}
