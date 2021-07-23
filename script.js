let videoplayer=document.querySelector("video");
let mediaRecorder;
let chunks=[];
let isrecording=false;//it tells that browser is already recording or not so that we can proceed further
let recordbtn=document.querySelector("#button");

//event listener on record button 
recordbtn.addEventListener("click",function(e){
    console.log("inrecordbtn")
   
    if(isrecording==true)
    {   //if recording is in progress
       
        isrecording=false;
        mediaRecorder.stop()//call stop event of media recorder
    }
    else
    {   //if recording is not in progress
        mediaRecorder.start();//call start event of media recorder that will start recording
        isrecording=true;
       
    }
})
//navigator object given by object
//media devices is a child object of navigator and provies the acces  of camera and mic and other media input
//getusermedia is a function that ask for permission and turns on the camera and mic and returns the mediastream object contains
//continuos input of camera and mic 
let promiseToUseCamera=navigator.mediaDevices.getUserMedia({video:true,audio:true});
promiseToUseCamera.then(function(mediaStream){
   
videoplayer.srcObject=mediaStream;

mediaRecorder=new MediaRecorder(mediaStream);//creating object of mediarecorder it provides the functunality to record and passing it mediastrem because it have input of camera and mic

//overall this download the recorded video
mediaRecorder.addEventListener("dataavailabel",function(e)//to start recording 
{
  chunks.push(e.data);//pushing chunks of audion of video in a array called chunks

})
mediaRecorder.addEventListener("stop",function(e){//it stop recording 
    let blob=new Blob(chunks,{type:"video/mp4"});//combining all chunks in blob
    chunks=[];
let link=URL.createObjectURL(blob);//creating link of blob so that we can provide in anchor tag to download
let a=document.createElement("a");
a.href=link;
a.download="record.mp4";
a.click();//clicking anchor tag so that video will get download on stoping recording
})
})
.catch(function(){
console.log("access denied")
})