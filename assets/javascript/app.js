//jack's weird jquery stuff so we can access $(this)
            // var jqueryAudioElement = $("track-" + playList_Index);
            // jqueryAudioElement.on('ended', function() {
            //     if (playList_Index < playList.length) {
            //         debugger;
            //         // switchTrack();
            //         playList_Index++;
            //         $(this).load();
            //         $(this).setAttribute('src', playList[playList_Index])
            //         $(this).play();          
            //         if (playList_Index < plaList.length) {
            //             setNextTrack(jqueryAudio, playList, playList_Index);        
            //         }     
            //     }
            // });
            //end jack's weird jquery stuff

 //wrap the adding of an event listener in a function that will continue to call itself when each song ends until we are through the entire playlist
    // function setNextTrack (audioJqueryElement, playlistArray, playlistIndex) {
    //     debugger;
    //     audioJqueryElement.on('ended', function() {

    //             // switchTrack();
    //             playlistIndex++;
    //             $(this).load();
    //             $(this).setAttribute('src', playlistArray[playlistIndex]);
    //             $(this).play();;
    //             if (playlistIndex < playlistArray.length) {
    //                 setNextTrack(audioJqueryElement, playlistArray, playlistIndex);    
    //             }               
    //     });
    // }  

       // function switchTrack() {
    //     // if(playList_Index == (playList.length - 1)){
    //     //     playList_Index = 0;
    //     // } else {
    //         playList_Index++;
    //     // }
    // }



    
        // var video = response.data.filter(e => e.categories.some(x => x.name === 'Music'))[0];

        // $('#backVid').attr('src', 'https://player.vimeo.com/video/' + video.uri.match(/\d+/) + '?autoplay=1&loop=1&muted=1#t=40s');



 // var video = response.data.filter(video => video.tags.some(tag => /music/i.test(tag.name)))[0];

        // // console.log(video.uri.match(/\d+/));
        // // console.log($("#backVid"));

        // $('#backVid').attr('src', 'https://player.vimeo.com/video/' + video.uri.match(/\d+/) + '?autoplay=1&loop=1&muted=1#t=40s')