let videocontent = document.querySelector(".video-content");
let title = document.querySelector(".title");
let videowrapper = document.querySelector(".video-wrapper");

let API_kEY = "AIzaSyCxe6mfIZU8hWdd9vh_fkoCWHG7tvUzpJM"; //1
// let API_kEY = "AIzaSyBsrwhNQYjwiangQNczdJpRCBZYB0dyanE"; //2
// let API_kEY = "AIzaSyD88BLih4aU2iYAjZvM16B9KeXulJlh8yA"; //3
let baseURL = "https://www.googleapis.com/youtube/v3";

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


async function render(data) {
  videowrapper.innerHTML = "";
  for (let i = 0; i < data.items.length; i++) {
    const channelIdURL = data.items[i].snippet.channelId;
    let channelLogo = await fetchChannelLogo(channelIdURL);
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
    let duration = moment.duration(durationISO)
    let min =Math.floor(duration.asMinutes())
    let sec = Math.floor(duration.asSeconds()%60)
  console.log(min)
  console.log(sec)
  console.log(`${min}:${sec<10 ? '0' : ''}${sec}`)
  let timeStamp = (`${min}:${sec<10 ? '0' : ''}${sec}`)

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

    videos.innerHTML = `<div class="video-content">  
              <img src='${thumbnail}' alt="thumbnail" class="thumbnail" />
              </div>
              <div class="video-details">
                <div class="channel-logo">
                <img class="channelLogo" src="${channelLogo}" alt="icon" class="channel-icon" />
                </div>
                <div class="detail">
                  <h3 class="title">${data.items[i].snippet.title}</h3>
                  <div class="channel-name">${data.items[i].snippet.channelTitle}</div>
                  <div>${timeStamp}</div>
                  <div>${daysAgoTime}</div>
                  <div>${views}</div>
                </div>
              </div>`;
    videowrapper.append(videos);
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
//fetching channel logo

async function fetchChannelLogo(channelId) {
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
// -------------------------------

// ____________________________


//searchBar
let searchBar = document.getElementById('searchBar')
searchBar.addEventListener('change',(e)=>{
let input = e.target.value;
console.log(input)
fetchvideos(input, 5);
})


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
