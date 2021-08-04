let videoplayer = document.querySelector("video");
let mediaRecorder;
let chunks = [];
let isrecording = false;//it tells that browser is already recording or not so that we can proceed further
let recordbtn = document.querySelector("#record");
let capturebtn = document.querySelector("#capture");
let body = document.querySelector("body");
let allFilters = document.querySelectorAll(".filter");
let filter = "";// to store the color of filter that is applied so that we can use it on canvas to see this filter effect on our downloaded pic
let zoomIn = document.querySelector(".in");
let zoomOut = document.querySelector(".out");
let currZoom = 1//minnimum will be 1 and max will be 3;




for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", function (e) {
        console.log("hii in filter")
        let previouFilter = document.querySelector(".filter-div")//checking is alreay a filter exist  
        if (previouFilter) previouFilter.remove();//if exist than remove so that we can apply new filter
        //we can also apply our new filter on existing one but after 2 or 3 filter our camera view will get blocked

        let color = e.currentTarget.style.backgroundColor;
        filter = color;
        let div = document.createElement("div")//this div is created to see the colour effect on ui we will place it on our video tag to see effect by css
        div.classList.add("filter-div");//filter-div is a class that is that place this div on video
        div.style.backgroundColor = color;
        body.append(div);
        console.log("hii in filter appended")

    })
}
 zoomIn.addEventListener("click",function()
 {
     currZoom=currZoom+0.1;
     if(currZoom>3){currZoom=3};
     videoplayer.style.transform=`scale(${currZoom})`;
     console.log(currZoom);
 })

 zoomOut.addEventListener("click",function()
 {
     currZoom=currZoom-0.1;
     if(currZoom<1){currZoom=1};
     videoplayer.style.transform=`scale(${currZoom})`;
     console.log(currZoom);
 })

//event listener on record button 
recordbtn.addEventListener("click", function (e) {
    let span = recordbtn.querySelector("span");

    let previouFilter = document.querySelector(".filter-div")//checking is alreay a filter exist  

    if (previouFilter) {
        previouFilter.remove();

        filter = "";
    }
    if (isrecording == true) {   //if recording is in progress

        isrecording = false;
        span.classList.remove("record-animation");
        mediaRecorder.stop()//call stop event of media recorder
    }
    else {   //if recording is not in progress
        mediaRecorder.start();//call start event of media recorder that will start recording
        span.classList.add("record-animation");
        isrecording = true;

    }
})


//navigator object given by object
//media devices is a child object of navigator and provies the acces  of camera and mic and other media input
//getusermedia is a function that ask for permission and turns on the camera and mic and returns the mediastream object contains
//continuos input of camera and mic 
let promiseToUseCamera = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
promiseToUseCamera.then(function (mediaStream) {
    videoplayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);//creating object of mediarecorder it provides the functunality to record and passing it mediastrem because it have input of camera and mic

    //overall this download the recorded video
    mediaRecorder.addEventListener("dataavailabel", function (e)//to start recording 
    {
        chunks.push(e.data);//pushing chunks of audion of video in a array called chunks

    })

    mediaRecorder.addEventListener("stop", function (e) {//it stop recording 
        let blob = new Blob(chunks, { type: "video/mp4" });//combining all chunks in blob
        chunks = [];
        let link = URL.createObjectURL(blob);//creating link of blob so that we can provide in anchor tag to download
        let a = document.createElement("a");
        a.href = link;
        a.download = "record.mp4";
        a.click();//clicking anchor tag so that video will get download on stoping recording
    })

    capturebtn.addEventListener("click", function () {

        let canvas = document.createElement("canvas");
        let span = capturebtn.querySelector("span");
        span.classList.add("capture-animation");
        setTimeout(function () {
            span.classList.remove("capture-animation");//we are removing this class after 1 second beacause the duration
            //of animation is only of 1 sec and if class is added then we can't reassign it 
        }, 1000)
        canvas.height = videoplayer.videoHeight
        canvas.width = videoplayer.videoWidth;
        
        let tool = canvas.getContext("2d");
         tool.translate(canvas.width/2,canvas.height/2);//shifting top-left corner of canvas to center 
         tool.scale(currZoom,currZoom);//strachting the canvas paper to currzoomvalue to zoomit
         tool.translate(-canvas.width/2,-canvas.height/2);//shifting top-left corner of canvas to again its originaln value

        tool.drawImage(videoplayer, 0, 0);//it drwas the image on canvas we can provide theimag as well as image tag here 
        //in case of video tag it will draw the frame of the video at that instance
        if (filter != "") {
            //to see effect on downloaded photo we will create a translucent rectangle of canvas height and width on canvas
            tool.fillStyle = filter;
            tool.fillRect(0, 0, canvas.width, canvas.height);
        }

        let url = canvas.toDataURL();//convert the canvas drawing into url
        canvas.remove();//we are removing because no longer we need it
        let a = document.createElement("a");//creating the a tag so that we can provide it link  which is genrated by todataurl and download attribute to download the picture
        a.href = url;
        a.download = "image.png";
        a.click();
        a.remove();//we are removing because no longer we need it beacuse the purpose has been fulfilled

    });
})
    .catch(function () {
        console.log("access denied")
    })
