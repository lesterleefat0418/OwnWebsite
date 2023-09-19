import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
//const demosSection = document.getElementById("demos");
//const imageBlendShapes = document.getElementById("image-blend-shapes");
const videoBlendShapes = document.getElementById("video-blend-shapes");
let faceLandmarker;
let runningMode = "VIDEO";
let enableWebcamButton;
let webcamRunning = false;

let videoWidth, videoHeight;

// Check if webcam access is supported.
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

async function getSupportedResolutions() {
    try {
    // If webcam supported, add event listener to button for when user
    // wants to activate it.
        if (hasGetUserMedia()) {
            enableWebcamButton = document.getElementById("webcamButton");
            enableWebcamButton.addEventListener("click", enableCam);
        }
        else {
            console.warn("getUserMedia() is not supported by your browser");
        }
        const constraints = {
            video: true
          };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        const supportedResolutionsWidth = capabilities.width;
        const supportedResolutionsHeight = capabilities.height;
        console.log(supportedResolutionsWidth);
        console.log(supportedResolutionsHeight);

        console.log("screen.width: ", screen.width);
        console.log("screen.height: ", screen.height);
        if(screen.width < screen.height) {
            videoWidth = 720;
            videoHeight = 1280;
        }
        else {
            videoWidth = 1280;
            videoHeight = 720;
        }

        console.log("videoWidth: ", videoWidth);
        console.log("videoHeight: ", videoHeight);

    } catch (error) {
      console.error("Error accessing camera:", error);
    }
}
getSupportedResolutions();

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function createFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1
    });
    //demosSection.classList.remove("invisible");
}
createFaceLandmarker();


const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

let videoAspectRatio;

// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!faceLandmarker) {
        console.log("Wait! faceLandmarker not loaded yet.");
        return;
    }
     
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

let lastVideoTime = -1;
let results = undefined;
const drawingUtils = new DrawingUtils(canvasCtx);
async function predictWebcam() {
    videoAspectRatio = video.videoWidth / video.videoHeight;
    console.log("videoAspectRatio: ", videoAspectRatio);
    video.style.width = videoWidth + "px";
    video.style.height = videoHeight * videoAspectRatio + "px";
    canvasElement.style.width = videoWidth + "px";
    canvasElement.style.height = videoHeight * videoAspectRatio + "px";
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;


    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceLandmarker.setOptions({ runningMode: runningMode });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, startTimeMs);
    }
    
    if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
            drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
        }
    }
    drawBlendShapes(videoBlendShapes, results.faceBlendshapes);
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}
function drawBlendShapes(el, blendShapes) {
    if (!blendShapes.length) {
        return;
    }
   // console.log(blendShapes[0]);
}