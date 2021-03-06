baseUrl = "https://freemusicarchive.org/file/";
imageNotFound = "./images/image-not-found.png";

//Once the document has been loaded
$(document).ready(function() {



	//Query FMA for featured tracks
	$.getJSON('https://freemusicarchive.org/featured.json', function(results){
		let track = results.aTracks[0];

		console.log(track);
		let trackImageUrl = baseUrl + track.album_image_file;

		if(track.album_image_file === "") {
			trackImageUrl = imageNotFound;
		}

		let image = getImage(trackImageUrl);

		let info = getTrackInfo(track);
		let player = getTrackPlayer(track.track_id);

		appendToTag('#featured-track', image, info, player);
	});


});

$('#home').click(function() {
	$('#result').empty();
});

$('#browse').click(function() {
	$('#result').empty();

	$.getJSON('https://freemusicarchive.org/featured.json', function(data) {	
		console.log(data.aTracks.length);
		for(i = 0; i < 51; i++) {
			track = data.aTracks[i];
			let trackImageUrl = baseUrl + track.album_image_file;
			
			if(track.album_image_file === "") {
				trackImageUrl = imageNotFound;
			}

			let trackImage = getImage(trackImageUrl);
			
			let trackInfo = getTrackInfo(track);
			let trackPlayer = getTrackPlayer(track.track_id);

			appendToTag('#result', trackImage, trackInfo, trackPlayer);
		};
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

	//Default to album search
	let regExpAlbum = /(\]\s)(.*)/;
	let matchesAlbum = regExpAlbum.exec($('#search').val());
	//console.log("reg");
	//console.log(matchesAlbum);

	//Between brackets
	let regExpArtist = /\[(.*)\]/;
	let matchesArtist = regExpArtist.exec($('#search').val());

	//After bracket
	let regExp = /[^()[\]]([a-zA-Z0-9]+)/;
	let matches = regExp.exec($('#search').val());
	//console.log("reg");
	//console.log(matches[0]);

	let dataset = "artists";
	let format = ".json";
	let key = "?api_key=1EU4KQAAPH2T1GUO";
	let id = "&track_id=";
	let match = "";

	//if not undefined
	if(matchesTrack) {
		console.log("matchesTrack");
		isTrack = true;

		dataset = "tracks";
		id = "&track_id=";
		match = matchesTrack[1];
	}
	else if(matchesAlbum) {
		console.log("matchesAlbum");
		isAlbum = true;

		dataset = "albums";
		id = "&album_title=";
		match = matchesAlbum[2];
	}
	else if(matchesArtist) {
		console.log("matchesArtist");
		isArtist = true;

		dataset = "albums";
		id = "&artist_handle=";
		match = matchesArtist[1];
		console.log(matchesArtist);
	}
	else if(matches) {
		console.log("matchesAlbum");
		isAlbum = true;

		dataset = "albums";
		id = "&album_title=";
		match = matches[0];
	}
	else {
		console.log('no matches found');
		return;
	}
	match = match.trim();
	console.log("match " + match);

	//Append results
	$.getJSON('https://freemusicarchive.org/api/get/' + dataset + format + key + id + match, function(matchResults){
		if(isTrack) {
			let track = matchResults.dataset[0];
			console.log(track);
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
				console.log("here");
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
			$.each(matchResults.dataset, function(index, album) {
				console.log("here");
				let albumImageUrl = album.album_image_file;
				
				if(album.album_image_file === "") {
					albumImageUrl = imageNotFound;
				}

				let albumImage = getImage(albumImageUrl);
				
				let albumInfo = getAlbumInfo(album);
				let albumPlayer = getAlbumPlayer(album.album_id);

				appendToTag('#result', albumImage, albumInfo, albumPlayer);
			});
			// let artistImage = getImage();
			// let artistInfo = getArtistInfo();
			// let artistPlayer = getArtistPlayer();

			// appendToTag('#result', artistImage, artistInfo, artistPlayer);
		}
	});
});

var appendToTag = function(tagToAppendTo, picture, info, player) {

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
				"<p><strong>Favorites:</strong> " + album.album_favorites + "</p>" +
				"<p><strong>Listens:</strong> " + album.album_listens + "</p>" +
			"</div>";
}

var getAlbumPlayer = function(albumId) {
	return	"<div class='track-info sound col-4'>" +
				'<object width="100%" height="220">' + 
					'<param name="movie" value="https://freemusicarchive.org/swf/playlistplayer.swf"/>' + 
					'<param name="flashvars" value="playlist=https://freemusicarchive.org/services/playlists/embed/album/' + 
						albumId + '.xml' + '"/>' + 
					'<param name="allowscriptaccess" value="sameDomain"/>' + 
					'<embed type="application/x-shockwave-flash" src="https://freemusicarchive.org/swf/playlistplayer.swf" height="220" flashvars="playlist=https://freemusicarchive.org/services/playlists/embed/album/' + 
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
				"<a href='" + track.artist_website + "' target='_blank'>Website: " + track.artist_website + "</p></a>" +
				"<p><strong>Track:</strong> " + track.track_title + "</p>" +
				"<p><strong>Favorites:</strong> " + track.track_favorites + "</p>" +
				"<p><strong>Listens:</strong> " + track.track_listens + "</p>" +
			"</div>";
}

var getTrackPlayer = function(trackId) {
	return	"<div class='track-info sound col-4'>" +
				'<object width="100%" height="50">' + 
					'<param name="movie" value="https://freemusicarchive.org/swf/trackplayer.swf"/>' + 
					'<param name="flashvars" value="track=https://freemusicarchive.org/services/playlists/embed/track/' + 
						trackId + '.xml' + '"/>' + 
					'<param name="allowscriptaccess" value="sameDomain"/>' + 
					'<embed type="application/x-shockwave-flash" src="https://freemusicarchive.org/swf/trackplayer.swf" height="50" flashvars="track=https://freemusicarchive.org/services/playlists/embed/track/' + 
						trackId + '.xml' + '" allowscriptaccess="sameDomain" />' + 
				'</object>' +
			"</div>";	
}