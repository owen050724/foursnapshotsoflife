let photoCount = 0;

const camera = document.getElementById('camera');
const photoGallery = document.getElementById('photoGallery');
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
    const photo = document.createElement('canvas');
    const context = photo.getContext('2d');
    photo.width = camera.videoWidth;
    photo.height = camera.videoHeight;
    context.drawImage(camera, 0, 0, photo.width, photo.height);

    // Add photo to gallery
    photoCount++;
    const photoContainer = document.createElement('div');
    photoContainer.classList.add('photo-container');

    const img = document.createElement('img');
    img.src = photo.toDataURL('image/png');
    img.classList.add('photo');
    photoContainer.appendChild(img);

    const downloadButton = document.createElement('a');
    downloadButton.textContent = 'Download Photo';
    downloadButton.href = photo.toDataURL('image/png');
    downloadButton.download = `photo_${photoCount}.png`;
    downloadButton.classList.add('download-button');
    photoContainer.appendChild(downloadButton);

    photoGallery.appendChild(photoContainer);
});