'use strict'
/* List of json keys
  name
  cook_time
  ingredients[]
  type
*/

let recipes = [];
let ings2rec = {};
//Function to store page state in local storage
let Storage = {
  set: function(key, value) {
    localStorage[key] = JSON.stringify(value);
  },
  get: function(key) {
    return localStorage[key] ? JSON.parse(localStorage[key]) : null;
  }
};


$(document).ready(function(e){
  //Retrieve info from local storage
  let defaultValue = {selection: '*',checked: 0 },
    myObj = Storage.get('myObj') || defaultValue;


  $.getJSON('./recipes', function(data, err){
    recipes = data;
    //build an object of ingredients to recipes
    buildIngs(data);
    if(myObj.selection !== '*'){
      let newData = selChange(myObj.selection);
      buildIt(newData);
    }
    else{
      buildIt(data);
    }
    $("#selection").val(myObj.selection);
  });

  //Event listener for the dropdown menu
  $("#selection").change(function(){
    myObj.selection = $("#selection option:selected").text();
    var tempData = selChange(myObj.selection);
    Storage.set('myObj', myObj);
    buildIt(tempData);
  });
});
//function to change the selection and update DOM
function selChange(selected){
  //get list of ids to create new array
  let ids = ings2rec[selected];
  let tempData = [];
  ids.forEach(a => {
    tempData.push(recipes[a]);
  });
  return tempData;
}

function buildIngs(data){
  //temporary ingredient holder
  let temp = {};
  for(let key in data){
    data[key].ingredients.forEach( a => {
      //Check if ingredients are in the object, if not add them
      if(!temp[a]){
        temp[a] = [];
        temp[a].push(key);
      }
      //otherwise append array of recipes
      else{
        temp[a].push(key);
      }
    });
  }
  //Add all selector
  temp["*"] = Object.keys(recipes);
  //Sort list of ingredients
  Object.keys(temp).sort().forEach(function(key) {
    ings2rec[key] = temp[key];
  });
  dropDown();
}

function dropDown(){
  //Populate dropdown menu
  for(let item in ings2rec){
    $("#selection").append(`<option value="${item}">${item}</option>`);
  }

}

function buildIt(data){
  let myObj = Storage.get('myObj') || null;
  //null out recipe_names
  $("#recipe_names").html("")
  //Populate list with checkboxes
  for(let key in data){
    //set id to key for easy access
    $("#recipe_names").append(`<label ><input type='checkbox' id='${key}'/> ${data[key].name}</label>`);
    //Check to see if items have been checked in local storage, and then recheck them
    if(myObj.checked){
      if(myObj.checked.indexOf(key) > -1){
        $(`#${key}`).prop("checked", true);
      }
    }
  }
  //update ingredients immediately in case we had checked ones
  updateIngredients();
  //when a checkbox is ticked, update the ingredients list
  $( "input[type=checkbox]" ).on( "click", updateIngredients );

}

function updateIngredients(){
  let ingredients = [];
  let stateIDs = [];
  let defaultValue = {selection: '*',checked: 0 },
    myObj = Storage.get('myObj') || defaultValue;
  $("input[type=checkbox]:checked").each(function(){
    // Make it easier to access json keys by assigning to variable
    let keyIngs = recipes[this.id].ingredients;
    stateIDs.push(this.id);
    //Lodash union to prevent repeats and then sort to keep alphabetized
    ingredients = _.union(ingredients, keyIngs).sort();
  });
  //set checkbox states
  myObj.checked = stateIDs;
  Storage.set('myObj', myObj);
  //Put the ingredients in the recipe details
  $("#recipe_details").html(ingredients.join(', '));
}
