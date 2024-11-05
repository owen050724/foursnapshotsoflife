let photoCount = 0;
let frameIndex = 0;
const frameElements = [
    document.getElementById('frame1'),
    document.getElementById('frame2'),
    document.getElementById('frame3'),
    document.getElementById('frame4')
];

const camera = document.getElementById('camera');
const photoGallery = document.getElementById('photoGallery');
const captureButton = document.getElementById('captureButton');
const sendButton = document.getElementById('sendButton');

const selectedImages = [null, null, null, null];

// Show alert message before starting
alert('최대 8장의 사진을 촬영할 수 있으며 그 중 4장을 골라주세요.');

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
    if (photoCount >= 8) {
        alert('You can only capture up to 8 photos.');
        return;
    }

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

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select Photo';
    selectButton.classList.add('select-button');
    selectButton.addEventListener('click', () => {
        selectedImages[frameIndex] = img.src;
        frameElements[frameIndex].style.backgroundImage = `url(${img.src})`;
        frameElements[frameIndex].style.backgroundSize = 'contain';
        frameElements[frameIndex].style.backgroundRepeat = 'no-repeat';
        frameElements[frameIndex].style.backgroundPosition = 'center';
        frameIndex = (frameIndex + 1) % frameElements.length;
    });
    photoContainer.appendChild(selectButton);

    photoGallery.appendChild(photoContainer);
});

// Send selected photos to the server
sendButton.addEventListener('click', () => {
    alert("image sent!");
    const formData = new FormData();
    selectedImages.forEach((image, index) => {
        if (image) {
            const blob = dataURLtoBlob(image);
            formData.append(`photo${index + 1}`, blob, `photo${index + 1}.png`);
        }
    });

    // Send the selected photos to the server via POST request
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Photos uploaded successfully:', data);
    })
    .catch(error => {
        console.error('Error uploading photos:', error);
    });
});

// Helper function to convert dataURL to Blob
function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}