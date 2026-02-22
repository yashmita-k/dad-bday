const video = document.getElementById("video");

//Candle light is there
document.getElementById('bday-cake-1').classList.remove('hidden')

//Reset button
document.getElementById('reset').addEventListener("click", () =>{
    document.body.classList.remove("mouth-open");
    document.getElementById('bday-cake-1').classList.remove('hidden');
    triggered=false;
});

// Load face-api models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => console.error("Camera error:", err));
}
let triggered=false; // the trigger is false if mouth is closed

// Detect mouth every 100ms
video.addEventListener("play", () => {

  setInterval(async () => {

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (detection) {
      const mouth = detection.landmarks.getMouth();

      const topLip = mouth[13];
      const bottomLip = mouth[19];

      const distance = Math.abs(topLip.y - bottomLip.y);

      // Toggle class if mouth is open
      if (distance > 10) {
        document.body.classList.add("mouth-open");
        document.getElementById('bday-cake-1').classList.add('hidden');
        triggered=true;
      } 
    }

  }, 100);

});

//bday song button
const button = document.getElementById("play-audio");
const audio = document.getElementById("audio");

button.addEventListener("click", () => {
  audio.currentTime = 0; // restart if already playing
  audio.play();
});


