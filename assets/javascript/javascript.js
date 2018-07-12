$( document ).ready(function() {
    

//#region variables

var artist;
var artistArr = [];
var audioElement = document.createElement('audio');
var client_id = 'cf8c0eb349a54b93b25dfb1eaabbf17b';
var client_secret = '4702fa19b63940e7aefb634fa83392de';
var databaseButton = '<button class="btn btn-dark btn-outline-light px-1 py-1" title="Add Artist to Database" data-toggle="tooltip" id="addToDB"><i class="fas fa-plus"></i></button>';
var genres = [];
var globalCounter = 0;
var moods = [];
var playList = [];
var playList_Index = 0;
var randomTracks = [];
var spotify_access_token;
var trackList = [];

//#endregion variables

$('#mainContentContainer').hide();

// this is my array of genres

// var genre = ["musical theatre", "rock", "pop", "hip hop", "jazz", "folk", "classical", "country",
// "blues", "electronic dance", "rhythm and blues", "heavy metal", "reggae", "punk rock", "funk",
// "alternative rock", "disco", "techno", "soul", "house music","dance music", "rap", "opera", "instrumental",
//  "indie rock", "dubstep", "ambient music", "trance music", "grunge", "industrial music", "new wave",
//   "progrssiv rock", "hardcore punk", "orchestra", "gospel", "black metal", "vocal music", "dum and bass",
//   "electro", "pop rock", "bluegrass", "death metal", "ballad", "blues rock", "dub", "reggaeton"];

// this is my array for different moods
// var mood = ["amused", "blissful", "calm", "cheerful", "content", "dreamy", "ecstatic", "energetic", "excited", "flirty", "giddy",
// "good", "happy", "joyful", "loving", "mellow", "optimistic", "peaceful", "silly", "sympathetic", "angry", "annoyed", "apathetic",
//  "bad", "cranky", "depressed", "envious", "frustrated", "gloomy", "grumpy", "guilty", "indifferent", "irritated", "melancholy",
//  "pessimistic", "rejected", "restless", "sad", "stressed", "weird"];

function capitalize() {
    var artistName = $('#artistName').val();
    var spart = artistName.split(' ');
    for (var i = 0; i < spart.length; i++) {
        var j = spart[i].charAt(0).toUpperCase();
        spart[i] = j + spart[i].substr(1);
    }
    $('#musicArtistName').html(
        spart.join(' ') + ' ' + '<i class="far fa-pause-circle" id="play"></i>' + ' ' + databaseButton
    );
    $('[data-toggle="tooltip"]').tooltip();
}

function playPause() {
    if (audioElement.paused) {
        $('#play').html("<i class='far fa-pause-circle'></i>");
        audioElement.play();
    } else if (audioElement.play) {
        $('#play').html("<i class='far fa-play-circle'></i>");
        audioElement.pause();
    }
}

function nextTrack() {
    if (audioElement.paused) {
        $('#play').html("<i class='far fa-pause-circle'></i>");
        playList_Index++;
        audioElement.setAttribute('src', playList[playList_Index]);
        $('#ePlay').attr('src', 'https://open.spotify.com/embed?uri=' + trackList[playList_Index]);
        if (playList_Index < playList.length) {
            audioElement.load();
            audioElement.play();
        }
    } else if (audioElement.play) {
        audioElement.pause();
        playList_Index++;
        audioElement.setAttribute('src', playList[playList_Index]);
        $('#ePlay').attr('src', 'https://open.spotify.com/embed?uri=' + trackList[playList_Index]);
        if (playList_Index < playList.length) {
            audioElement.load();
            audioElement.play();
        }
    }
}

//#region Event Handlers

$(document.body).on('click', '#addToDB', function(event) {
    event.preventDefault();
    var artistName = $('#artistName').val().toLowerCase();

    if (artistArr.includes(artistName)) {
        $('#dbAlert').modal();
        $('.dbAlertContent').text('Sorry, it seems' + ' ' + artistName + ' ' + 'is already in our database');
    } else {
        database.ref('/artists').push({
            artistName: artistName
        });
    }
});

$(document.body).on('click', '#play', function(event) {
    event.preventDefault;
    playPause();
});

$(document.body).on('click', '#skip', function(event) {
    event.preventDefault;
    nextTrack();
});

$('#input-form').on('submit', function(event) {
    event.preventDefault();
    $('#mainContentContainer').slideDown();
    artist = $('#artistName').val().trim();

    capitalize();
    playList_Index = 0;
    getArtist(artist, spotifyApiCall);
    vimeoApiCall(artist);
    lastFmApiCall(artist);
});

//#endregion Event Handlers

//#region Last.FM
function lastFmApiCall(artist) {
    $.ajax({
        url: 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo',
        method: 'GET',
        data: {
            artist: artist,
            api_key: '628ffbed5ecc1259d740e1b19182a0bb',
            format: 'json'
        }
    }).then(function(response) {
        var lastfmResults = response.artist;
        console.log(response);
        // if(lastfmResults.bio.summary.startsWith("Incorrect tag for ")) {
        //     var newArtistMath1 = lastfmResults.bio.summary.length;
        //     var newArtist = [];
        //     for ()
        // }
        $('#artistInfo').html(lastfmResults.bio.summary);
    });
}
//#endregion Last.FM

//#region Spotify

function generateSpotifyAccessToken(cb) {
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token',
        method: 'POST',
        data: {
            grant_type: 'client_credentials'
        },
        headers: {
            Authorization: 'Basic ' + btoa(client_id + ':' + client_secret)
        }
    })
        .then(res => {
            spotify_access_token = res.access_token;
            cb();
        })
        .catch(err => console.error(err));
}

function getArtist(artist, cb) {
    // console.log(cb);
    $.ajax({
        method: 'GET',
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: artist,
            type: 'track'
        },
        headers: {
            Authorization: 'Bearer ' + spotify_access_token
        }
    })
        .then(cb)
        .catch(() => generateSpotifyAccessToken(() => getArtist(artist, cb)));
}

function spotifyApiCall(tracks) {
    trackList = [];
    playList = [];
    var data = tracks.tracks.items.filter(track => track.preview_url);
    globalCounter++;
    if (globalCounter === 1) {
        $('#myModal').modal();
    }
    for (var i = 0; i < data.length; i++) {
        playList.push(data[i].preview_url);
        trackList.push(data[i].uri);
    }
    $('#ePlay').attr('src', 'https://open.spotify.com/embed?uri=' + trackList[playList_Index]);
    audioElement.setAttribute('src', playList[playList_Index]);
    audioElement.play();
    if (playList_Index < playList.length) {
        audioElement.load();
        audioElement.play();
        audioElement.addEventListener('ended', function() {
            playList_Index++;
            spotifyApiCall(tracks);
        });
    }
}
//#endregion Spotify

//#region Vimeo
function vimeoApiCall(artist) {
    var vimeoAccessToken = '275bb5cff8e3ae3639a860dd4c0976cf';
    var vimeoQueryURL = `https://api.vimeo.com/videos?query="${artist}"&access_token=${vimeoAccessToken}&per_page=1`;
    // Get rid of this if using catagories &page=1&per_page=15

    $.ajax({
        url: vimeoQueryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response);

        var vimeoResults = response.data;
        console.log(vimeoResults[0].uri.match(/\d+/)[0]);
        console.log($('#backVid'));
        $('#backVid').attr(
            'src',
            'https://player.vimeo.com/video/' + vimeoResults[0].uri.match(/\d+/)[0] + '?autoplay=1&loop=1&muted=1#t=40s'
        );
    });
}
//#endregion Vimeo

//#region FireBase Maddness

var config = {
    apiKey: 'AIzaSyCvvA5iRDT9MSKcez4MowbTU1-gb-fRArQ',
    authDomain: 'music-project-1-58914.firebaseapp.com',
    databaseURL: 'https://music-project-1-58914.firebaseio.com',
    projectId: 'music-project-1-58914',
    storageBucket: 'music-project-1-58914.appspot.com',
    messagingSenderId: '1004850795390'
};

firebase.initializeApp(config);

var database = firebase.database();

var ref = firebase.database().ref('artists');

ref.on('value', function(snapshot) {
    artistArr = [];
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        var artist = childData.artistName;
        // console.log(childData);
        // console.log(artist);
        artistArr.push(artist);
        // console.log(artistArr);
        // return(artistArr);
        //var randomArtist = artistArr[Math.floor(Math.random() * artistArr.length)];
        // console.log(randomArtist);
        // return(randomArtist);
    });
    var randomArtist = artistArr[Math.floor(Math.random() * artistArr.length)];
    console.log(randomArtist);
    $('#random').on('click', function(event) {
        event.preventDefault();
        $('#mainContentContainer').slideDown();

        artist = randomArtist;
        //make an everything function????
        artistName = artist;
        var spart = artistName.split(' ');
        for (var i = 0; i < spart.length; i++) {
            var j = spart[i].charAt(0).toUpperCase();
            spart[i] = j + spart[i].substr(1);
        }
        $('#musicArtistName').html(
            spart.join(' ') + ' ' + '<i class="far fa-pause-circle" id="play"></i>' + ' ' + databaseButton
        );
        $('[data-toggle="tooltip"]').tooltip();

        playList_Index = 0;
        // trackList = [];
        // playList = [];
        getArtist(artist, spotifyApiCall);
        vimeoApiCall(artist);
        lastFmApiCall(artist);
        randomArtist = artistArr[Math.floor(Math.random() * artistArr.length)];
    });
    //return(randomArtist);
    // console.log(artistArr);
    // $('#artistsDiv').empty();
    $('#artistsDiv').empty();
    for (var i = 0; i < artistArr.length; i++) {
        var dbArtists = $('<div>');
        dbArtists.text(artistArr[i]);
        $('#artistsDiv').prepend(dbArtists);
    }

    // $('#musicArtistName').html(spart.join(' ') + ' ' + '<i class="far fa-play-circle" id="play"></i>');
});
//$('#artistsDiv').empty();
//console.log(randomArtist);
//#endregion FireBase Maddness
});