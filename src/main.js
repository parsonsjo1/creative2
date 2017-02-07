//Once the document has been loaded
$(document).ready(function() {

	//Query FMA for featured tracks
	$.getJSON('https://freemusicarchive.org/featured.json', function(results){
		
		//Save tracks in a variable
		var tracks = results.aTracks;
		console.log(tracks);

		for(i = 0; i < 4; i++) {

			//Grab desired data from json results
			var baseUrl = "https://freemusicarchive.org/file/";
			var albumImageUrl = baseUrl + tracks[i].album_image_file;
			var albumTitle = tracks[i].album_title;
			
			var artistName = tracks[i].artist_name;
			var artistWebsite = tracks[i].artist_website;

			var trackDownloads = tracks[i].track_downloads;
			var trackFileUrl = tracks[i].track_file_url;
			var trackImageUrl = tracks[i].track_image_file;
			var trackListens = tracks[i].track_listens;
			var trackTitle = tracks[i].track_title;

			console.log(albumImageUrl);


			//Create featured track
			$('#featured-tracks').append(
				"<div class='track col-6 col-lg-4'>" +
					"<a href='" + "" + "'>" +
						"<img src='" + albumImageUrl + "' alt='track image" + "'" +
					"</a>" +
					
				"</div>"
				//"<div class='track-info col-6'" +

				//"</div>"
			)
		}

	});
})