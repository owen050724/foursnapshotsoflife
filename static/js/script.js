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
        alert('최대 8장의 사진만 촬영 가능합니다.');
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
        frameElements[frameIndex].style.backgroundImage = `url(${img.src})`;
        frameElements[frameIndex].style.backgroundSize = 'contain';
        frameElements[frameIndex].style.backgroundRepeat = 'no-repeat';
        frameElements[frameIndex].style.backgroundPosition = 'center';
        frameIndex = (frameIndex + 1) % frameElements.length;
    });
    photoContainer.appendChild(selectButton);

    photoGallery.appendChild(photoContainer);
});