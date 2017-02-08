//Once the document has been loaded
$(document).ready(function() {

	//Query FMA for featured tracks
	$.getJSON('https://freemusicarchive.org/featured.json', function(results){
		
		//Save tracks in a variable
		var tracks = results.aTracks;
		console.log(tracks);

		for(i = 0; i < 1; i++) {

			//Grab desired data from json results
			let baseUrl = "https://freemusicarchive.org/file/";
			let albumImageUrl = baseUrl + tracks[i].album_image_file;
			let albumTitle = tracks[i].album_title;
			
			let artistName = tracks[i].artist_name;
			let artistWebsite = tracks[i].artist_website;

			let trackDownloads = tracks[i].track_downloads;
			let trackFileUrl = tracks[i].track_file_url;
			let trackImageUrl = tracks[i].track_image_file;
			let trackListens = tracks[i].track_listens;
			let trackTitle = tracks[i].track_title;

			console.log(albumImageUrl);


			//Create featured track of the week
			$('#featured-track').append(
				"<div class='track col-4'>" +
					"<a href='" + "" + "'>" +
						"<img src='" + albumImageUrl + "' alt='track image" + "'>" +
					"</a>" +
				"</div>" +
				"<div class='track-info col-8'" +
					"<p>Album Title: " + albumTitle + "</p>" +
					"<p>Artist Name: " + artistName + "</p>" +
					"<p>Artist Website: " + artistWebsite + "</p>" +

					"<p>Track Title: " + trackTitle + "</p>" +
					"<p>Track Downloads: " + trackDownloads + "</p>" +
					"<a href='#' id='track-file'>" + trackFileUrl + "</a>" +
					"<p>Track Listens: " + trackListens + "</p>" +
				"</div>"
			)
		}

	});

});

$('body').on('click', '#track-file', function() {
		event.preventDefault();
		let trackUrl = $('#track-file').text();
		console.log(trackUrl);
		new Audio(trackUrl).play(); 
});
