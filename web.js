
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
var photo_ids = []

function fetch_data() {
	request({
		method: 'GET',
		url: URL
	}, function (err, res, body) {
			var data = JSON.parse(body)['photos']
			for (var i in data) {
				if (photo_ids.indexOf(data[i]['id']) <= -1 && data[i]['nsfw'] == false) {
					if (photo_ids.length > 50)
						photo_ids.pop();
					photo_ids.unshift(data[i]['id'])
					if (photos.length > ARRAY_SIZE)
						photos.pop()
					var new_photo = { id: data[i]['id'],
									 url: data[i]['images'][0]['url'] }
					photos.unshift(new_photo)
					io.sockets.emit('fresh_today', new_photo)
				}
			}
	})
}
