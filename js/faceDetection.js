const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    videoElement.srcObject = stream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      startFaceMesh();
    };
  })
  .catch((error) => {
    console.log('Error accessing camera:', error);
});

function startFaceMesh() {
  const faceMesh = new FaceMesh({ locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
  }});

  function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                      {color: '#C0C0C070', lineWidth: 1});
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
        drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
      }
    }
    canvasCtx.restore();
  }

faceMesh.setOptions({
  maxNumFaces: 2,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  runtime: 'cpu'
});
faceMesh.onResults(onResults);
function processVideo() {
  faceMesh.send({ image: videoElement })
    .then(() => {
      requestAnimationFrame(processVideo);
    })
    .catch((error) => {
      console.log('Error processing video:', error);
    });
}

processVideo();

}