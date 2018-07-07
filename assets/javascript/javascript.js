var artistArr = [];
var genres = [];
var moods = [];
var randomTracks = [];
var spotify_access_token;
var client_id = 'cf8c0eb349a54b93b25dfb1eaabbf17b'
var client_secret = '4702fa19b63940e7aefb634fa83392de';
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
    addToDataBase();

    //                       //
    // Spotify Function Call //
    //                       //
    function playMusic(tracks) {


        var data = tracks.tracks.items.filter(track => track.preview_url);

        console.log(data);
        console.log(data[0].preview_url);



        for (var i = 0; i < data.length; i++) {
            playList.push(data[i].preview_url);
          trackList.push(data[i].name);

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

})

//                   //
// FireBase Maddness //
//                   //

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCvvA5iRDT9MSKcez4MowbTU1-gb-fRArQ",
    authDomain: "music-project-1-58914.firebaseapp.com",
    databaseURL: "https://music-project-1-58914.firebaseio.com",
    projectId: "music-project-1-58914",
    storageBucket: "music-project-1-58914.appspot.com",
    messagingSenderId: "1004850795390"
};
firebase.initializeApp(config);

var database = firebase.database();

function addToDataBase() {
    $(document.body).on("click", "#addToDB", function (event) {
        event.preventDefault();
        console.log("YOU CLICKED MEEEEEEE");

        // var artist = $('#artistName').val();
        // var artists = snapshot.val();
        // artists[artist] = true;
        // database.ref('artists').set(artists);

        var artistName = $('#artistName').val().toLowerCase();

        database.ref("/artists").push({
            artistName: artistName
        });
    })
};

var ref = firebase.database().ref("artists");

ref.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var artist = childData.artistName;
        //console.log(childData);
        //console.log(artist);
        artistArr.push(artist);
        //console.log(artistArr);
        // return(artistArr);
        //var randomArtist = artistArr[Math.floor(Math.random() * artistArr.length)];
        //console.log(randomArtist);
        // return(randomArtist);
    });
    var randomArtist = artistArr[Math.floor(Math.random() * artistArr.length)];
    console.log(randomArtist);
    console.log(artistArr)
    for (var i = 0; i < artistArr.length; i++) {
        var dbArtists = $("<div>");
        dbArtists.text(artistArr[i]);
        $("#artistsDiv").append(dbArtists);
    }

    $("#musicArtistName").html(spart.join(' ') + ' ' + '<i class="far fa-play-circle" id="play"></i>');
})


console.log(artistArr);

$("#random").on("click", function (event) {
    event.preventDefault();

    randomArtist = artist;
    //make an everything function????


})

// var randomArtist = artistArr[Math.floor(Math.random() * artistArr.length)];
// console.log(randomArtist);

// var ref = new Firebase('https://music-project-1-58914.firebaseio.com');
// var artistsRef = ref.child("artists");

// var artistKey = artistsRef.key();
// console.log(artistKey);

