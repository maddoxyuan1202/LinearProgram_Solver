// unused functions or tests, will delete later
"use strict";
const solver = require("javascript-lp-solver");
/**
 * Solve the model by jsLPSolver
 * @param {Object} model 
 */
function LinearProgramming(model, solver) {
    return solver.Solve(model);
  }
  // find the max of 3x + y
  // 
  let model = {
    "optimize": "maximize",
    "opType": "max",
    "constraints": {
        "c1": {"max": 4},
        "c2": {"max": 12},
        "c3": {"max": 3},
        "c4": {"max": 0}
    },
    "variables": {
        "x": {
            "maximize": 3,
            "c1": 2,
            "c2": 2,
            "c3": 0,
            "c4": 0
        },
        "y": {
            "maximize": 1,
            "c1": -1,
            "c2": 3,
            "c3": 1,
            "c4": 0
        }
    }
}
  let output = LinearProgramming(model, solver);
  let outputString = JSON.stringify(output, null, 2);
  
  console.log("output is: ", outputString);
  console.log("json: ", JSON.stringify(model));

  // let max_or_min = "max";
  // let input_json = {};
  // input_json.opType = max_or_min;
  // if(max_or_min === 'max'){
  //   input_json.optimize = "Maximize";
  // }
  // else{
  //   input_json.optimize = "Minimize";
  // }

  // function check_string(string, variables, input_json){
  //   string = string.replace(/\s/g, '');
  //   let temp = variables.replace(/\s/g, '`');
  //   variables = temp.split('`');
    
  
  //   if("" === string){
  //     return "empty";
  //   }
  //   //错误情况，运算符连续
  //   if( /[\+\-\*\/]{2,}/.test(string) ){
  //     return false;
  //   }
  //   //错误情况，括号不配对
  //   let stack = [];
  //   for(let i = 0, item; i < string.length; i++){
  //     item = string.charAt(i);
  //     if('(' === item){
  //       stack.push('(');
  //     }else if(')' === item){
  //       if(stack.length > 0){
  //         stack.pop();
  //       }else{
  //         return false;
  //       }
  //     }
  //   }
  //   if(0 !== stack.length){
  //     return false;
  //   }
  //   //错误情况，变量没有来自“待选公式变量”
  //   let tmpStr = string.replace(/[\(\)\+\-\*\/]{1,}/g, '`');
  //   let array = tmpStr.split('`');
  //   let without_number = string.replace(/[A-Z]{1,}/gi, '`');
  //   console.log(without_number);
  //   console.log(array);
  //   console.log(variables);
  //   for(var i = 0, item; i < array.length; i++){
  //     item = array[i];
	// 		if(/[A-Z]/i.test(item) === false){
	// 			return false;
	// 		}
	// 	}

  //   return string;
  
  
  // }
  // let string = "3x + y";
  // let variables = "x y";
  // console.log(check_string(string, variables, input_json));

  // console.log(input_json);




  // function input_to_json(variables, obj, sub1, sub2, sub3, sub4, sub5, sub6, max_or_min, integer){

  //   let obj = check_string(obj, variables);
  //   let sub1 = check_string(sub1, variables);
  //   let sub2 = check_string(sub2, variables);
  //   let sub3 = check_string(sub3, variables);
  //   let sub4 = check_string(sub4, variables);
  //   let sub5 = check_string(sub5, variables);
  //   let sub6 = check_string(sub6, variables);
  //   let name = [variables, obj, sub1, sub2, sub3, sub4, sub5, sub6];
    
  //   //write JSON
  //   let input_json = {};
  //   input_json.opType = max_or_min;
  //   if(max_or_min === 'max'){
  //     input_json.optimize = "Maximize";
  //   }
  //   else{
  //     input_json.optimize = "Minimize"
  //   }
  
  //   return input_json;
  // }