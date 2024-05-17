const video = document.getElementById('video')

//Loading all the models (promise), then invoking the startVideo() func.
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]).then(startVideo)

function startVideo() {
    //getUserMedia method returns a promise, so it needs to be handled with .then() and .catch() -- learn about promises!
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing the camera: ', err)
        });
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    //async func because it's an async library
    //doing that multiple times (with setInterval)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, 
        //I have almost no idea of these below, I think they are from the faceapi lib...
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        //console.log(detections)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        //clear the canvas every drawing
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
        //draw face detection
        faceapi.draw.drawDetections(canvas, resizedDetections)
        //draw face landmarks
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        //draw emotion detection
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})
