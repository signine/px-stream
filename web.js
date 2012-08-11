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
var request = require('request')


var photos = []

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.listen( process.env.PORT || 3000)

app.get('/', function (req, res) {
	res.render('index.ejs',{ layout:false, 
							 locals: {  host: process.env.PORT ? 'http://px-stream.herokuapp.com' : 'http://localhost:3000', 
							 		    data: JSON.stringify(photos)  }})
});


setInterval(fetch_data, 1000)

var URL = BASE_URL = "https://api.500px.com/v1/photos?tags=1&feature=fresh_today&consumer_key=iGjydYfQtArfIFm9exTam4X07eE26GfPaDTgAqi6"

var ARRAY_SIZE = 20
var last_id = 0

function fetch_data() {
	request({
		method: 'GET',
		url: URL
	}, function (err, res, body) {
			var data = JSON.parse(body)['photos'].reverse()
			for (var i in data) {
				if (data[i]['id'] > last_id) {
					last_id = data[i]['id']
					if (photos.length > ARRAY_SIZE)
						photos.pop()
					var new_photo = { id: last_id,
									 url: data[i]['images'][0]['url'] }
					photos.unshift(new_photo)
					io.sockets.emit('fresh_today', new_photo)
				}
			}
	})
}
