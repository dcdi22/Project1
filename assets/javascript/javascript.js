$(function () {
    var genres = [];
    var moods = [];
    var randomTracks = [];
    var access_token = '275bb5cff8e3ae3639a860dd4c0976cf'

    $(document.body).on("click", '#submit', function () {
        var artist = $("#artistName").val().trim();
        var vimeoQueryURL = `https://api.vimeo.com/videos?query=${artist}&access_token=${access_token}&per_page=1`
        
        $.ajax({
            url: vimeoQueryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            //event.preventDefault();
            console.log(response);

            var vimeoResults = response.data;
        })
        var lastfmAPIKey = "628ffbed5ecc1259d740e1b19182a0bb";
        var lastfmQueryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + lastfmAPIKey + "&format=json"

        $.ajax({
            url: lastfmQueryURL,
            method: "GET"
           })
            .then(function(response) {
              var lastfmResults = response.data;
              console.log(response);

        var spotify_access_token = 'BQARYU9ooGoLM9_vEkwvVy4irCuV9AdhSHtriUArhTPVSrg5fiMVLJMkWYuWsTMxzFhBnSbd-kqudvjQT2k';

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
        }).then(function(res) {
            console.log(res);
        }).catch(function(err) {
            console.error(err);
        });
    });

 })

})