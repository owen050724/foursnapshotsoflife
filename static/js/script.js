const camera = document.getElementById('camera');
const photo = document.getElementById('photo');
const captureButton = document.getElementById('captureButton');

// Get access to the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        camera.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing camera: ', error);
    });

// Capture photo from the video stream
captureButton.addEventListener('click', () => {
    const context = photo.getContext('2d');
    photo.width = camera.videoWidth;
    photo.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, photo.width, photo.height);

    // Display the captured image
    photo.style.display = 'block';
});