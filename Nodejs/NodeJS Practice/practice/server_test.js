var http = require("http");
var fs = require("fs");
var url = require("url");

// create the server
http
  .createServer(function (request, response) {
    // parsing the directory/file name behind the URL
    var pathname = url.parse(request.url).pathname;

    console.log("Request for " + pathname + " received.");

    // if file name is empty, set the index.html
    if (pathname == "/") {
      pathname = "/index.html";
    }

    // read the file
    fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
        console.log(err);
        // do not found the page
        // HTTP status : 404 : Not Found
        // Content Type : test/plain
        response.writeHead(404, { "Content-Type": "text/html" });
      } else {
        // found the page
        // HTTP status : 200 : OK
        // Content Type : text/plain
        response.writeHead(200, { "Content-Type": "text/html" });

        // write into the responsebody
        response.write(data.toString());
      }
      // send the responsebody
      response.end();
    });
  })
  .listen(8081);

console.log("Server running at http://127.0.0.1:8081/");
