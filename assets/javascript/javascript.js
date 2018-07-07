var genres = [];
var moods = [];
var randomTracks = [];
var spotify_access_token;
var client_id = 'cf8c0eb349a54b93b25dfb1eaabbf17b'
var client_secret = '4702fa19b63940e7aefb634fa83392de';
var audioElement = document.createElement("audio");


function capitalize() {
    var artistName = $('#artistName').val();
    var spart = artistName.split(' ');
    for (var i = 0; i < spart.length; i++) {
        var j = spart[i].charAt(0).toUpperCase();
        spart[i] = j + spart[i].substr(1);
    }
    $("#musicArtistName").html(spart.join(' ') + ' ' + '<i class="far fa-pause-circle" id="play"></i>');
}

function playPause() {
    if (audioElement.paused) {
        $("#play").html("<i class='far fa-pause-circle'></i>");
        audioElement.play();
    } else if (audioElement.play) {
        $("#play").html("<i class='far fa-play-circle'></i>");
        audioElement.pause();
    }
}

$(document.body).on("click", '#play', function (event) {
    event.preventDefault;
    playPause();
})


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


//         //
// Spotify //
//         //
function getArtist(artist, cb) {
    console.log(cb);
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


$(document.body).on("click", '#submit', function (event) {
    event.preventDefault();
    var artist = $("#artistName").val().trim();
    capitalize();
    var playList = [];
    var trackList = [];
    var playList_Index = 0;
    
   
 
    //                       //
    // Spotify Function Call //
    //                       //
    function playMusic(tracks) {
        console.log(tracks);
        
        
        
        for (var i=0; i < tracks.tracks.items.length; i++) {
            playList.push(tracks.tracks.items[i].preview_url);
            trackList.push(tracks.tracks.items[i].name);
        }
        console.log(playList);


        //  
            audioElement.setAttribute('src', playList[playList_Index]);
            
                audioElement.play();
      
            if (playList_Index < playList.length) {
               
                    audioElement.load();
                    audioElement.play();
                    $(".track-info").html("Now Playing: " + trackList[playList_Index]);
                    audioElement.addEventListener('ended', function() {
                        playList_Index++;
                        playMusic(tracks);
                    })
                
            }

            

    }
    getArtist(artist, playMusic);
   
    //       //
    // Vimeo //
    //       //
    var vimeoAccessToken = '275bb5cff8e3ae3639a860dd4c0976cf'
    var vimeoQueryURL = `https://api.vimeo.com/videos?query="${artist}"&access_token=${vimeoAccessToken}&per_page=1`;
    // Get rid of this if using catagories &page=1&per_page=15

    $.ajax({
        url: vimeoQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        console.log(response.data.filter(e => e.categories.some(x => x.name === 'Music')));
        console.log(response.data.filter(e => e.categories.some(x => x.name === 'Music'))[0]);

        var vimeoResults = response.data;
        console.log(vimeoResults[0].uri.match(/\d+/)[0]);
        console.log($("#backVid"));
        $("#backVid").attr("src", 'https://player.vimeo.com/video/' + vimeoResults[0].uri.match(/\d+/)[0] + '?autoplay=1&loop=1&muted=1#t=40s');
    })

    //         //
    // Last.Fm //
    //         //
 
    var lastfmAPIKey = "628ffbed5ecc1259d740e1b19182a0bb";
    var lastfmQueryURL1 = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artist + "&api_key=" + lastfmAPIKey + "&format=json"

    $.ajax({
            url: lastfmQueryURL1,
            method: "GET"
        })
        .then(function (response) {
            var lastfmResults = response.artist;
            console.log(response);
            $("#artistInfo").html(lastfmResults.bio.summary);
        });

    var lastfmQueryURL2 = "http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=rj&artist=" + artist + "&api_key=" + lastfmAPIKey + "&format=json"

    $.ajax({
        url: lastfmQueryURL2,
        method: "GET"
    })
    .then(function (response) {
        var lastfmResults = response.artist;
        console.log(response);
        // $("#artistInfo").html(lastfmResults.bio.summary);
    });









})

