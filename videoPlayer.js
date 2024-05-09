let suggestedVideos = document.getElementById('suggestedVideos')


let API_kEY = "AIzaSyCxe6mfIZU8hWdd9vh_fkoCWHG7tvUzpJM"; //1
// let API_kEY = "AIzaSyBsrwhNQYjwiangQNczdJpRCBZYB0dyanE"; //2
// let API_kEY = "AIzaSyD88BLih4aU2iYAjZvM16B9KeXulJlh8yA"; //3
let baseURL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("load", () => {
   let videoId = JSON.parse(localStorage.getItem("videoId"))
   async function getComments(videoId) {
    try{
    let response = await fetch(
      baseURL +
        "/commentThreads" +
        `?key=${API_kEY}` +
        `&videoId=${videoId}` +
        "&maxResults=25&part=snippet"
    );
    let data = await response.json();
    console.log(data)
    displayComments(data)
  }
  catch(e){
    console.log(e)
  }
   
  }
  console.log(videoId)
  getComments(videoId);
    console.log(videoId)
    // localStorage.getItem('videoId')
    // YT is the class given to us by -> https://www.youtube.com/iframe_api
    if (YT) {
      // it takes 2 things
      // 1st is the div id
      // in which you want to render your video
      // 2nd is the object which has styles of your div
      new YT.Player("video-player", {
        height: "500",
        width: "1000",
        videoId,
        events: {
          onReady: function (e) {
            e.target.playVideo();
          },
        },
      });
    }
  });
  
  
  function displayComments(data){
    console.log(data)
    const commentSection = document.getElementById('commentSection');
    for(let i=0; i<(data.items).length; i++){
      const comment = document.createElement('p')
      comment.innerHTML = `${data.items[i].snippet.topLevelComment.snippet.textDisplay}`
      commentSection.append(comment)
    }

  }
  
  // ----------------------------------------
    // bringing suggested videos in right corner with played video
    // contecting with #suggestedVideos

// -------------------------------------

async function fetchvideos(searchQuery, maxResults) {
  try {
    let response = await fetch(
      baseURL +
        "/search" +
        `?key=${API_kEY}` +
        "&part=snippet" +
        `&q=${searchQuery}` +
        `&maxResults=${maxResults}`
    );
    let data = await response.json();
    console.log(data);
    render(data);
  } catch (e) {
    console.log(e);
  }
}

fetchvideos("All", 20);



// -------------------------------------------

async function render(data) {
  // videowrapper.innerHTML = "";
  for (let i = 0; i < data.items.length; i++) {
    // const channelIdURL = data.items[i].snippet.channelId;
    // let channelLogo = await fetchChannelLogo(channelIdURL);
    // -----------------------------------
    //fetching videoID
    const videoDetails = await fetchVideoState(data.items[i].id.videoId,"contentDetails"); // contentDetails

    console.log(videoDetails)
    const durationISO = videoDetails.items[0].contentDetails.duration;
    console.log(durationISO)

    //fetching statistics:
    const statistics = await fetchVideoState(data.items[i].id.videoId,"statistics");
    console.log(statistics)
    let likeCount = statistics.items[0].statistics.likeCount
    console.log(likeCount)
    // let viewCount = statistics.items[0].statistics.viewCount
    // console.log(viewCount)
    let commentCount = statistics.items[0].statistics.commentCount
    console.log(commentCount)
    // ---------------------------------
      //fetching viewCount from statistics
      let viewCount = statistics.items[0].statistics.viewCount
        let views = viewCountFn(viewCount)

    // ---------------------------------
    // let durationString = await fetchVideoState()

    // converting duration string into time
  //   let duration = moment.duration(durationISO)
  //   let min =Math.floor(duration.asMinutes())
  //   let sec = Math.floor(duration.asSeconds()%60)
  // console.log(min)
  // console.log(sec)
  // console.log(`${min}:${sec<10 ? '0' : ''}${sec}`)
  // let timeStamp = (`${min}:${sec<10 ? '0' : ''}${sec}`)

  // -----------------------------------------------
    // days ago timestamp
    const daysAgoString =  data.items[i].snippet.publishTime
     let daysAgoTime =  formatDateAgo(daysAgoString)


  
// _____________________________________________

    let videos = document.createElement("div");
    
    videos.addEventListener("click", (e) => {
      let videoId = data.items[i].id.videoId;
     
      localStorage.setItem("videoId", JSON.stringify(videoId));

      window.open("/videoPlayer.html");
    });


    videos.className = "video";
    
    let thumbnail = data.items[i].snippet.thumbnails.high.url;

    videos.innerHTML = `<div class="insuggestion-video-content">  
              <img src='${thumbnail}' alt="thumbnail" class="insuggestion-thumbnail" />
                <div class="insuggestion-detail">
                  <h3 class="insuggestion-title">${data.items[i].snippet.title}</h3>
                  <div class="insuggestion-channel-name">${data.items[i].snippet.channelTitle}</div>
                 <div class="insuggestion-views-time">
                 
                 <div>${views}</div>
                 <div>${daysAgoTime}</div>
                 </div>
                </div>
              </div>`;
              suggestedVideos.append(videos);
  }
}

// --------------------------------

async function fetchVideoState(videoId,typeOfDetails) {
  try {
    const response = await fetch(
      baseURL +
        "/videos" +
        `?key=${API_kEY}` +
        `&id=${videoId}`+
        `&part=${typeOfDetails}`
    );
    const data = await response.json();

    return (data)
  } catch (e) {
    return(e);
  }
}


// ----------------------------------

// -----------------------------
//converting the days ago string into a readable format
//"2024-05-06T01:09:33Z"

function formatDateAgo(dateString){
  const currentDate  = new Date()
  const pastDate = new Date(dateString)

  const timeDifference = parseInt((currentDate-pastDate)/1000)

  if(timeDifference < 60) return `${timeDifference} secs ago`
  if(timeDifference < 3600) return `${parseInt(timeDifference/60)} mins ago`
  if(timeDifference < 86400) return `${parseInt(timeDifference/3600)} hrs ago`
  if(timeDifference < 604800) return `${parseInt(timeDifference/86400)} days ago`
  if(timeDifference < 2592000) return `${parseInt(timeDifference/604800)} weeks ago`
  if(timeDifference < 31104000) return `${parseInt(timeDifference/2592000)} months ago`
  return`${parseInt(timeDifference / 31104000)} years ago`
}

// ---------------------------
// converting likeCounts into k and M

function viewCountFn(value){
  if(value >= 100000000) return `${(value/100000000).toFixed(0)}B`
  if(value >= 1000000) return `${(value/1000000).toFixed(0)}M`
  if(value >=1000) return `${(value/1000).toFixed(0)}K`
  return `${value}`
}
