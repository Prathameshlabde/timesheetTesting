var express = require("express");
var app = express();

app.get("/", function(req, res) {
  // res.send('Hello !');
  res.sendFile(__dirname + "/public/" + "index.html");
});

var server = app.listen(newFunction());
function newFunction() {
  return 8899;
}
