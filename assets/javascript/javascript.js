$(function () {
    var access_token = '275bb5cff8e3ae3639a860dd4c0976cf'

    $(document.body).on("click", '#submit', function () {
        var artist = $("#artistName").val().trim();
        var url = `https://api.vimeo.com/videos?query=${artist}&access_token=${access_token}`

        $.ajax({
            url: url,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            //event.preventDefault();
            console.log(response);

            var results = response.data;
        })


    })



})