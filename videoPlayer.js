let suggestedVideos = document.getElementById('suggestedVideos')


// let API_kEY = "AIzaSyCxe6mfIZU8hWdd9vh_fkoCWHG7tvUzpJM"; //1
// let API_kEY = "AIzaSyBsrwhNQYjwiangQNczdJpRCBZYB0dyanE"; //2
// let API_kEY = "AIzaSyD88BLih4aU2iYAjZvM16B9KeXulJlh8yA"; //3
let API_kEY = "AIzaSyAHByvpyunb-S_hjrXgDuQ_-eqUvdMs5Js"; //4
// let API_kEY="AIzaSyCu84T6TkQEWujC66c6-taGfS_YIxG--fs"; //5
// let API_kEY = "AIzaSyDzJb_0sCY3wvUPlTLV44YkUUhG2aUhnUg"; //6
let baseURL = "https://www.googleapis.com/youtube/v3";

let videoId = JSON.parse(localStorage.getItem("videoId"))
window.addEventListener("load", () => {
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
        height: "600",
        width: "1200",
        videoId,
        events: {
          onReady: function (e) {
            e.target.playVideo();
          },
        },
      });
    }
  });

  // ______________________________________
  
  async function fetchChannelData(channelId) {
    try {
      let response = await fetch(
        baseURL +
          "/channels" +
          `?key=${API_kEY}` +
          "&part=snippet" +
          `&id=${channelId}`
      );
      let data = await response.json();
      return data.items[0];
      // return data.items[0].snippet.thumbnails.default.url;
    } catch (e) {
      console.log(e);
    }
  }


  // ---------------------------------
  //not just for comments 
  // this also contains title,channelicon,buttons,likecounts etc
  async function  displayComments(data){
    console.log(data)
    const commentSection = document.getElementById('commentSection');
    //from this channelData we can find title, channelLogo
    let channelDataPath = data.items[0].snippet.topLevelComment.snippet.channelId
    let channelData = await fetchChannelData(channelDataPath)
    console.log(channelData)
    const channelLogo = channelData.snippet.thumbnails.default.url
    let channelTitle = JSON.parse(localStorage.getItem("videoTitle"))
    console.log(channelTitle)
    console.log(channelData)

    //calling likeCount function
    const statistics = await fetchVideoState(videoId,"statistics")
    const likeCount = statistics.items[0].statistics.likeCount //--------->from here i need to start checking about likeCount
    console.log(likeCount)
    const topContainer = document.createElement("div") 
    topContainer.innerHTML = `
    <span>
    <h2>${channelTitle}</h2>
     <div class="videoTitleAndDetails">

     <div class="leftSide">
     <span><img class="videoChannelLogo" src="${channelLogo}" alt=""></span>
     <button>Subscribe</button>
     </div>

     <div class="rightSide">
     <span>LikeCount: ${likeCount}</span>
     <button>Share{icon}</button>
     <button>Download</button>
     <button>{icon ...}</button>
     </div>

     </div>
     </span>
     <h2 class="top-comment">Top-Comments</h2>
    `
    //displaying comment
    for(let i=0; i<(data.items).length; i++){
      const channelIdURL = data.items[i].snippet.channelId;
      const authorImage = data.items[i].snippet.topLevelComment.snippet.authorProfileImageUrl
      const authorUserName = data.items[i].snippet.topLevelComment.snippet.authorDisplayName
      const comment = document.createElement('p')
      comment.classList.add('comments')
      comment.innerHTML = `
  
     <div class="author-container">
     <span><img class="author-image" src="${authorImage}" alt=""></span>
    <div>
    <h4>${authorUserName}}</h4>
    <span class="author-comment-text"> ${data.items[i].snippet.topLevelComment.snippet.textDisplay}</span>
    </div>
     </div>
      `
      commentSection.prepend(topContainer)
      commentSection.append(comment)
    }

  }
  // -------------------------------------
  // channel id
  async function fetchChannelId(channelId) {
    try {
      let response = await fetch(
        baseURL +
          "/channels" +
          `?key=${API_kEY}` +
          "&part=snippet" +
          `&id=${channelId}`
      );
      let data = await response.json();
      return data.items[0].snippet.thumbnails.default.url;
    } catch (e) {
      console.log(e);
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

fetchvideos("All", 30);



// -------------------------------------------

async function render(data) {
  // videowrapper.innerHTML = "";
  for (let i = 0; i < data.items.length; i++) {
    // const channelIdURL = data.items[i].snippet.channelId;
    // let channelLogo = await fetchChannelLogo(channelIdURL);
    // console.log(channelLogo)
    // -----------------------------------
    //fetching videoID
    const videoDetails = await fetchVideoState(data.items[i].id.videoId,"contentDetails"); // contentDetails

    console.log(videoDetails)
    // const durationISO = videoDetails.items[0].contentDetails.duration;
    // console.log(durationISO)

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

      // window.open("/videoPlayer.html"); // to open in a new tab
      window.location.href = "/videoPlayer.html"
    });


    videos.className = "video";
    
    let thumbnail = data.items[i].snippet.thumbnails.high.url;

    videos.innerHTML = `<div class="insuggestion-video-content">  
              <img src='${thumbnail}' alt="thumbnail" class="insuggestion-thumbnail" />
                <div class="insuggestion-detail">
                  <h5 class="insuggestion-title">${data.items[i].snippet.title}</h5>
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
//directly finding like count
console.log(data)
return (data)
    // return (data.items[0].statistics.likeCount)
  } catch (e) {
    return(e);
  }
}


// ----------------------------------
// async function fetchChannelLogo(channelId) {
//   try {
//     let response = await fetch(
//       baseURL +
//         "/channels" +
//         `?key=${API_kEY}` +
//         "&part=snippet" +
//         `&id=${channelId}`
//     );
//     let data = await response.json();
//     // return data.items[0];
//     return data.items[0].snippet.thumbnails.default.url;
//   } catch (e) {
//     console.log(e);
//   }
// }
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
