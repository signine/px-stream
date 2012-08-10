require 'redis'
require 'httparty'
require 'json'

BASE_URL = "https://api.500px.com/v1/photos?feature=fresh_today&consumer_key=iGjydYfQtArfIFm9exTam4X07eE26GfPaDTgAqi6"
KEY = "iGjydYfQtArfIFm9exTam4X07eE26GfPaDTgAqi6"

features = ['popular', 'upcoming', 'editors', 'fresh_today', 'fresh_yesterday', 'fresh_week']
puts 'i am alive'

features.each do |f|
	fork do 
		photos = []

		data = JSON.parse(HTTParty.get(BASE_URL + "?feature=#{f}&consumer_key=" + KEY).body)['photos']
		data.each do |photo|
			next if photos.include?(photo['id']) || photo['nsfw']
			photos.push photo['id']
			HTTParty.get("http://px-stream.herokuapp.com/" + "?feature=#{f}&photo=" + photo['images'][0]['url'])
			puts photo['images'][0]['url']
		end
	end
end