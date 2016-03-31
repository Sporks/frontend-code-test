'use strict'
/* List of json keys
  name
  cook_time
  ingredients[]
  type
*/

var recipes = {};

$(document).ready(function(e){
  $.getJSON('./recipes', function(data, err){
    recipes = data;
    buildIt(data);
  });
})

function buildIt(data){
  //Populate list with checkboxes
  for(let key in recipes){
    //set id to key for easy access
    $("#recipe_names").append(`<label ><input type='checkbox' id='${key}'/> ${recipes[key].name}</label>`);
  }
  //when a checkbox is ticked, update the ingredients list
  $( "input[type=checkbox]" ).on( "click", updateIngredients );
}

function updateIngredients(){
  let ingredients = {}

  $("input[type=checkbox]:checked").each(function(){
    // Make it easier to access json keys by assigning to variable
    let keyIngs = recipes[this.id].ingredients;
    //Lodash union to prevent repeats and then sort to keep alphabetized
    ingredients = _.union(ingredients, keyIngs).sort();
  });
  //Put the ingredients in the recipe details
  $("#recipe_details").html(ingredients.join(', '));

}
