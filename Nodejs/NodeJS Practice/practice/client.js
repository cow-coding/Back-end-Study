var http = require("http");

// HTTPRequest's option setting
var options = {
  host: "localhost",
  port: "8081",
  path: "/index.html",
};

// Get response for callback function
var callback = function (response) {
  // if detect the response event, data set to body
  var body = "";

  response.on("data", function (data) {
    body += data;
  });

  // if detect the end event, end the data get and print the content
  response.on("end", function () {
    // success the data receive
    console.log(body);
  });
};

// post the HTTP request to server
var req = http.request(options, callback);
req.end();
