baseUrl = "https://freemusicarchive.org/file/";
imageNotFound = "./images/image-not-found.png";

//Once the document has been loaded
$(document).ready(function() {
	//Query FMA for featured tracks
	$.getJSON('https://freemusicarchive.org/featured.json', function(results){
		let track = results.aTracks[0];

		let trackImageUrl = baseUrl + track.track_image_file;

		if(track.track_image_file === "") {
			trackImageUrl = imageNotFound;
		}

		let image = getImage(trackImageUrl);

		let info = getTrackInfo(track);
		let player = getTrackPlayer(track.track_id);

		appendToTag('#featured-track', image, info, player);
	});


});

//Filter songs
$('#search').keyup(event, function() {

	//Empty previous results
	$('#results').empty();

	var filter = $('#search').val();
	var results = [];
	var tracks = [];
	//console.log(genre);

	//Get filtered results
	$.getJSON('https://freemusicarchive.org/api/trackSearch?q=' + filter + '&limit=10', function(data) {

		results = data.aRows;

	}).then(function() {

		//Add each result to the search prompt (data list)
		$.each(results, function(index, result) {
			$('#results').append(
				"<option value='" + result + "'>"
			);
		});
	});

});

//Search
$('#search-button').click(function() {

	$('#result').empty();

	let isArtist = false;
	let isAlbum = false;
	let isTrack = false;

	//Between parenthesis
	let regExpTrack = /\(([0-9]+)\)/;
	let matchesTrack = regExpTrack.exec($('#search').val());

	//After bracket
	let regExpAlbum = /\](.*)/;
	let matchesAlbum = regExpAlbum.exec($('#search').val());

	//Between brackets
	let regExpArtist = /\[(.*?)\]/;
	let matchesArtist = regExpArtist.exec($('#search').val());

	let dataset = "artists";
	let format = ".json";
	let key = "?api_key=1EU4KQAAPH2T1GUO";
	let id = "&track_id=";
	let match = "";

	//if not undefined
	if(matchesTrack) {
		isTrack = true;

		dataset = "tracks";
		id = "&track_id=";
		match = matchesTrack[1];
	}
	else if(matchesAlbum) {
		isAlbum = true;

		dataset = "albums";
		id = "&album_name=";
		match = matchesAlbum[1];
	}
	else if(matchesArtist) {
		isArtist = true;

		dataset = "albums";
		id = "&artist_handle=";
		match = matchesArtist[1];
	}
	else {
		console.log('no matches found');
		return;
	}

	//console.log("match " + match);


	//Append results
	$.getJSON('https://freemusicarchive.org/api/get/' + dataset + format + format + key + id + match, function(matchResults){
		if(isTrack) {
			let track = matchResults.dataset[0];

			let trackImageUrl = track.track_image_file;

			if(track.track_image_file === "") {
				trackImageUrl = imageNotFound;
			}

			let trackImage = getImage(trackImageUrl);

			let trackInfo = getTrackInfo(track);
			let trackPlayer = getTrackPlayer(track.track_id);

			appendToTag('#result', trackImage, trackInfo, trackPlayer);
		}

		if(isAlbum) {
			$.each(matchResults.dataset, function(index, album) {
				console.log(album);
				let albumImageUrl = album.album_image_file;
				
				if(album.album_image_file === "") {
					albumImageUrl = imageNotFound;
				}

				let albumImage = getImage(albumImageUrl);
				
				let albumInfo = getAlbumInfo(album);
				let albumPlayer = getAlbumPlayer(album.album_id);

				appendToTag('#result', albumImage, albumInfo, albumPlayer);
			});
		}

		if(isArtist) {

			let artistImage = getImage();
			let artistInfo = getArtistInfo();
			let artistPlayer = getArtistPlayer();

			appendToTag('#result', artistImage, artistInfo, artistPlayer);
		}
	});
});

var appendToTag = function(tagToAppendTo, picture, info, player) {
	console.log(player);

	//Create featured track of the week
	$(tagToAppendTo).append(
		picture +
		info +	
		player
	);
}

var getAlbumInfo = function(album) {
	return	"<div class='track-info col-5'>" +
				"<p><strong>Album:</strong> " + album.album_title + "</p>" +
				"<p><strong>Artist:</strong> " + album.artist_name + "</p>" +
				"<a href='" + album.artist_url + "' target='_blank'>Artist Website: " + album.artist_url + "</p></a>" +
				"<p><strong>Favorites:</strong> " + album.favorites + "</p>" +
				"<p><strong>Listens:</strong> " + album.album_listens + "</p>" +
			"</div>";
}

var getAlbumPlayer = function(albumId) {
	return	"<div class='track-info sound col-4'>" +
				'<object width="300" height="220">' + 
					'<param name="movie" value="https://freemusicarchive.org/swf/playlistplayer.swf"/>' + 
					'<param name="flashvars" value="playlist=https://freemusicarchive.org/services/playlists/embed/album/' + 
						albumId + '.xml' + '"/>' + 
					'<param name="allowscriptaccess" value="sameDomain"/>' + 
					'<embed type="application/x-shockwave-flash" src="https://freemusicarchive.org/swf/playlistplayer.swf" width="300" height="220" flashvars="playlist=https://freemusicarchive.org/services/playlists/embed/album/' + 
						albumId + '.xml' + '" allowscriptaccess="sameDomain" />' + 
				'</object>' +
			"</div>";	
}

var getImage = function(imageUrl) {
	return 	"<div class='track-picture col-3 '>" +
				"<a href='" + "" + "'>" +
					"<img class='img-fluid img-thumbnail' src='" + imageUrl + "' alt='track image" + "'>" +
				"</a>" +
			"</div>";
}

var getTrackInfo = function(track) {
	return	"<div class='track-info col-5'>" +
				"<p><strong>Album:</strong> " + track.album_title + "</p>" +
				"<p><strong>Artist:</strong> " + track.artist_name + "</p>" +
				"<a href='" + track.artist_website + "' target='_blank'>Artist Website: " + track.artist_website + "</p></a>" +
				"<p><strong>Track:</strong> " + track.track_title + "</p>" +
				"<p><strong>Favorites:</strong> " + track.favorites + "</p>" +
				"<p><strong>Listens:</strong> " + track.track_listens + "</p>" +
			"</div>";
}

var getTrackPlayer = function(trackId) {
	return	"<div class='track-info sound col-4'>" +
				'<object width="300" height="50">' + 
					'<param name="movie" value="https://freemusicarchive.org/swf/trackplayer.swf"/>' + 
					'<param name="flashvars" value="track=https://freemusicarchive.org/services/playlists/embed/track/' + 
						trackId + '.xml' + '"/>' + 
					'<param name="allowscriptaccess" value="sameDomain"/>' + 
					'<embed type="application/x-shockwave-flash" src="https://freemusicarchive.org/swf/trackplayer.swf" width="300" height="50" flashvars="track=https://freemusicarchive.org/services/playlists/embed/track/' + 
						trackId + '.xml' + '" allowscriptaccess="sameDomain" />' + 
				'</object>' +
			"</div>";	
}

// var loadTracks = function(tracks, numberOfTracksToLoad, tagToAppendTo) {


// 		console.log(tracks[0]);
// 	for(i = 0; i < numberOfTracksToLoad; i++) {

// 		//Grab desired data from json results
// 		let albumImageUrl = tracks[i].album_image_file;
// 		let albumTitle = tracks[i].album_title;
		
// 		let artistName = tracks[i].artist_name;
// 		let artistWebsite = tracks[i].artist_website;

// 		let trackDownloads = tracks[i].track_downloads;
// 		let trackFileUrl = tracks[i].track_file_url;
// 		let trackFile = tracks[i].track_file;
// 		let trackImageUrl = tracks[i].track_image_file;
// 		let trackListens = tracks[i].track_listens;
// 		let trackTitle = tracks[i].track_title;
// 		let trackId = tracks[i].track_id;

// 		//console.log(albumImageUrl);

// 		let imageUrl = getImageUrl(albumImageUrl, trackImageUrl);
// 		let trackUrl = getTrackUrl(trackFileUrl, trackFile);


// 		//Create featured track of the week
// 		$(tagToAppendTo).append(
	
// 		)
// 	}
// }

// var getImageUrl = function(albumImageUrl, fileImageUrl) {
// 	let baseUrl = "https://freemusicarchive.org/file/";
// 	let imageUrl = baseUrl + albumImageUrl;

// 	//console.log(albumImageUrl);
// 	//console.log(fileImageUrl);

// 	//If there is no album image url then use the file image url
// 	if(albumImageUrl === undefined || albumImageUrl === "") {
// 		imageUrl = fileImageUrl;
		
// 		if(fileImageUrl === undefined || fileImageUrl === "") {
// 			imageUrl = './images/image-not-found.png';
// 		}
// 	}

// 	//console.log(imageUrl);

// 	return imageUrl;
// }

// var getTrackUrl = function(trackFileUrl, trackFile) {
// 	let baseUrl = "https://freemusicarchive.org/";
// 	let trackUrl = trackFileUrl;

// 	console.log(trackFileUrl);
// 	console.log(trackFile);

// 	//If there is no album image url then use the file image url
// 	if(!trackUrl) {
// 		trackUrl = baseUrl + trackFile;
// 		console.log("here");

// 		if(!trackFile) {
// 			trackUrl = '';
// 		}
// 	}

// 	console.log(trackUrl);

// 	return trackUrl;
// }

// //Play the song
// $('body').on('click', '.fa-play', function(e) {
// 	event.preventDefault();
// 	trackUrl = $(this).attr('data-track');
// 	console.log("track: " + trackUrl);
// 	if(trackUrl != null) {
// 		console.log("track: " + trackUrl);
// 		currentSong = new Audio(trackUrl);
// 		currentSong.play(); 
// 	}
// });


// //Stop the song
// $('body').on('click', '.fa-stop', function() {
// 	event.preventDefault();
// 	//console.log(trackUrl);
// 	if(trackUrl != null) {
// 		let trackUrl = $(this).attr('data-track');
// 		currentSong.pause(); 
// 	}
// });