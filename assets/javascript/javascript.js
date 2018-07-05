$(function () {
    var access_token = '275bb5cff8e3ae3639a860dd4c0976cf'

    $(document.body).on("click", '#submit', function () {
        var artist = $("#artistName").val().trim();
        var url = `https://api.vimeo.com/videos?query=${artist}&access_token=${access_token}&per_page=1`

        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            //event.preventDefault();
            console.log(response);

            var results = response.data;
        })

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