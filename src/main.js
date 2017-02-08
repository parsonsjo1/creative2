//Once the document has been loaded
$(document).ready(function() {
	var tracks = [];
	//Query FMA for featured tracks
	$.getJSON('https://freemusicarchive.org/featured.json', function(results){
		tracks = results.aTracks;
	}).then(function() {
		loadFeaturedTracks(tracks, 1)
	});


});

var loadFeaturedTracks = function(tracks, numberOfTracksToLoad) {
	
	for(i = 0; i < numberOfTracksToLoad; i++) {

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

		//console.log(albumImageUrl);


		//Create featured track of the week
		$('#featured-track').append(
			"<div class='track-picture col-4'>" +
				"<a href='" + "" + "'>" +
					"<img src='" + albumImageUrl + "' alt='track image" + "'>" +
				"</a>" +
			"</div>" +
			"<div class='track-info col-8'" +
				"<p>Album: " + albumTitle + "</p>" +
				"<p>Artist: " + artistName + "</p>" +
				"<a href='" + artistWebsite + "'>Artist Website: " + artistWebsite + "</p></a>" +
				"<p>Track: " + trackTitle + "</p>" +
				"<p># Downloads: " + trackDownloads + "</p>" +
				"<a href='#' id='track-file'>" + trackFileUrl + "</a>" +
				"<p># Listens: " + trackListens + "</p>" +
			"</div>"
		)
	}
}

//Filter songs
$('#search').keyup(event, function() {

	//Empty previous results
	$('#results').empty();
	$('#result').empty();

	var search = $('#search').val();
	var results = [];
	var tracks = [];
	//console.log(genre);
	$.getJSON('https://freemusicarchive.org/api/trackSearch?q=' + search + '&limit=10', function(data) {

		results = data.aRows;

	}).then(function() {

		var matchList = [];
		$.each(results, function(index, result) {
			$('#results').append(
				"<option value='" + result + "'>"
			);

			var regExp = /\(([0-9]+)\)/;
			var matches = regExp.exec(result);
			matchList.push(matches[1]);
		});

		$.each(matchList, function(index, match) {
			$.ajaxSetup({
				async: false
			});
			$.getJSON('https://freemusicarchive.org/api/get/tracks.json?api_key=1EU4KQAAPH2T1GUO&track_id=' + match, function(matchResults){
				//Save track in a variable
				track = matchResults.dataset[0];
				console.log(track);
				//Grab desired data from json results
				let baseUrl = "https://freemusicarchive.org/file/";
				//let albumImageUrl = baseUrl + result.album_image_file;
				let albumTitle = track.album_title;
				
				let artistName = track.artist_name;
				let artistWebsite = track.artist_website;

				//let trackDownloads = result.track_downloads;
				let trackFileUrl = baseUrl + track.track_file;
				let trackImageUrl = track.track_image_file;
				let trackListens = track.track_listens;
				let trackTitle = track.track_title;

				//console.log(trackFileUrl);

				$('#result').append(
					"<div class='track-picture col-4'>" +
						"<a href='" + "" + "'>" +
							"<img src='" + trackImageUrl + "' alt='track image" + "'>" +
						"</a>" +
					"</div>" +
					"<div class='track-info col-8'" +
						"<p>Album Title: " + albumTitle + "</p>" +
						"<p>Artist Name: " + artistName + "</p>" +
						"<p>Artist Website: " + artistWebsite + "</p>" +

						"<p>Title: " + trackTitle + "</p>" +
						//"<p>Track Downloads: " + trackDownloads + "</p>" +
						"<i class='fa fa-play' data-track='" + trackFileUrl + "' aria-hidden='true'></i>" +
						"<i class='fa fa-stop' data-track='" + trackFileUrl + "' aria-hidden='true'></i>" +
						"<p>Track Listens: " + trackListens + "</p>" +
					"</div>"
				);	
			});	
		});
	});

});

//Play the song
$('body').on('click', '.fa-play', function() {
	event.preventDefault();
	let trackUrl = $(this).attr('data-track');
	//console.log("track: " + trackUrl);
	currentSong = new Audio(trackUrl);
	currentSong.play(); 
});


//Stop the song
$('body').on('click', '.fa-stop', function() {
	event.preventDefault();
	let trackUrl = $(this).attr('data-track');
	//console.log(trackUrl);
	currentSong.pause(); 
});