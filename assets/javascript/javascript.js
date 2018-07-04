
var genres = [];
var moods = [];
var randomTracks = [];
var spotify_access_token;
var client_id = 'cf8c0eb349a54b93b25dfb1eaabbf17b'
var client_secret = '4702fa19b63940e7aefb634fa83392de';
function generateSpotifyAccessToken(cb) {
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token',
        method: "POST",
        data: {
            grant_type: "client_credentials"
        },
        headers: {
            Authorization: "Basic " + btoa(client_id + ":" + client_secret)
        }
    }).then(res => {
        spotify_access_token = res.access_token;
        cb();
    }).catch(err => console.error(err));
}

function getArtist(artist, cb) {
    $.ajax({
        method: 'GET',
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: artist,
            type: 'track'
        },
        headers: {
            Authorization: "Bearer " + spotify_access_token
        }
    }).then(cb).catch(() => generateSpotifyAccessToken(() => getArtist(artist, cb)));
}

$(document.body).on("click", '#submit', function () {
    var artist = $("#artistName").val().trim();
    var vimeoAccessToken = '275bb5cff8e3ae3639a860dd4c0976cf'
    var vimeoQueryURL = `https://api.vimeo.com/videos?query=${artist}&access_token=${vimeoAccessToken}&per_page=1`;

    getArtist(artist, function(tracks) {
        console.log(tracks);
    });

    $.ajax({
        url: vimeoQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        //event.preventDefault();
        // console.log(response);

        var vimeoResults = response.data;
    })
    var lastfmAPIKey = "628ffbed5ecc1259d740e1b19182a0bb";
    var lastfmQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + lastfmAPIKey + "&format=json"

    $.ajax({
            url: lastfmQueryURL,
            method: "GET"
        })
        .then(function (response) {
            var lastfmResults = response.artist;
            console.log(response);
            $("#artistInfo").html(lastfmResults.bio.summary);
        });

})