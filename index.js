'use strict';

const express = require( 'express' );
const path = require( 'path' );
const app = express();


app.use( express.static( path.join( __dirname, './client' ) ) );

app.get('/recipes', function(req, res){
  var recipies = path.resolve(__dirname+"/json/recipes.json");
  res.sendFile(recipies);
});

app.listen( 3000, function () {
	console.log( "Server is listening on port 3000" );
} );
