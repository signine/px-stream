/*
var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
})	
*/


var app = require('express').createServer()
var io = require('socket.io').listen(app)

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.listen( process.env.PORT || 3000)

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html')
});

app.get('/fresh_today', function (req, res) {
	res.sendfile(__dirname + '/fresh_today.html')
});



app.get('/input', function (req, res) {
	io.sockets.emit(req.query['feature'], {photo: req.query['url']})
	res.end()	
})

