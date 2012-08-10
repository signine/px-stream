require 'redis'
require 'httparty'
require 'json'

BASE_URL = "https://api.500px.com/v1/photos?feature=fresh_today&consumer_key=iGjydYfQtArfIFm9exTam4X07eE26GfPaDTgAqi6"
KEY = "iGjydYfQtArfIFm9exTam4X07eE26GfPaDTgAqi6"
ARRAY_SIZE = 30

#features = ['popular', 'upcoming', 'editors', 'fresh_today', 'fresh_yesterday', 'fresh_week']
features = ['fresh_today']
puts 'i am alive'

features.each do |f|
	
	photos = Array.new(30)
	loop do 
		data = JSON.parse(HTTParty.get(BASE_URL + "?feature=#{f}&consumer_key=" + KEY).body)['photos']
		data.each do |photo|
			next if photos.include?(photo['id']) || photo['nsfw']
			photos.shift if photos.length > ARRAY_SIZE
			photos.push photo['id']
			#puts HTTParty.get("http://px-stream.herokuapp.com/input" + "?feature=#{f}&url=" + photo['images'][0]['url'])
			HTTParty.get("http://localhost:3000/input" + "?feature=#{f}&url=" + photo['images'][0]['url'] + "&id=" + photo['id'].to_s)
		end
		sleep(1)
	end
	
end