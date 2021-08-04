let galleryContainer = document.querySelector(".gallery-container");
let req = indexedDB.open("gallery", 2);
let database;

req.addEventListener("success", function () {
    database = req.result;

})

req.addEventListener("upgradeneeded", function () {
    database = req.result;
    database.createObjectStore("media", { keyPath: "mid" });

})

req.addEventListener("error", function () {

})

let toCameraBtn=document.querySelector("#to-camera");
toCameraBtn.addEventListener("click",function(){
    location.assign("index.html");
})

function saveMedia(media) {
    if (database) {
        let transaction = database.transaction("media", "readwrite");
        let acces = transaction.objectStore("media");
        let mediaObj = {
            mid: Date.now(),
            mediaData: media,
        }
        acces.add(mediaObj);
    }
}

function viewMedia() {
    if (database) {
        let medianumber=0;
        let transaction = database.transaction("media", "readwrite");
        let acces = transaction.objectStore("media");
        let req = acces.openCursor();
      
        req.addEventListener("success", function () {
            let cursor = req.result;
            if (cursor) {
              medianumber++;
              let mediaContainer = document.createElement("div");
                mediaContainer.classList.add("media-container");
                mediaContainer.innerHTML = `
                <div class="actual-media"></div>
                <div class="media-buttons">
                    <div class="download">download</div>
                    <div data-id="${cursor.value.mid}"class="delete">delete</div>
                </div>
            </div>`
                galleryContainer.append(mediaContainer);

                let actualMedia = mediaContainer.querySelector(".actual-media");
                let downloadbtn = mediaContainer.querySelector(".download");
                let deletebtn = mediaContainer.querySelector(".delete");

                let data = cursor.value.mediaData;

                deletebtn.addEventListener("click", function (e) {
                    deleteMedia(Number(deletebtn.getAttribute("data-id")));
                    e.currentTarget.parentElement.parentElement.remove();

                })
                if (typeof (data) == "string") {
                    downloadbtn.addEventListener("click", function () {
                        downloadMedia(data, "image");
                    })
                    let image = document.createElement("img");
                    image.src = data;

                    actualMedia.append(image);
                }
                else if (typeof (data) == "object") {
                    let url = URL.createObjectURL(data);
                    downloadbtn.addEventListener("click", function () {
                        downloadMedia(url, "video");
                    })
                    console.log(data)
                    console.log(url)
                    let video = document.createElement("video");
                    video.src = url;
                    video.autoplay = true;
                    video.controls = true;
                    video.muted = true;
                    video.loop = true;
                    actualMedia.append(video);
                }
                cursor.continue();

            }
            else if(medianumber==0)
            {
                console.log(medianumber);
                
                galleryContainer.innerHTML=`<h1>no media exist</h1>;`
            }
            
        })
    }
}

function downloadMedia(data, type) {
    let anchor = document.createElement("a");
    anchor.href = data;
    if (type == "image") {
        anchor.download = "image.png";

    }
    else if (type == "video") {
        anchor.download = "video.mp4";

    }
    anchor.click();
    anchor.remove();


}

function deleteMedia(mid) {
    let transaction = database.transaction("media", "readwrite");
    let acces = transaction.objectStore("media");
    acces.delete(mid);
}