from flask import Flask, request, jsonify, send_file, render_template
import os
from upscaling import upscale_image

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
RESULT_FOLDER = 'results'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULT_FOLDER'] = RESULT_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    photos = []
    for i in range(1, 5):
        photo = request.files.get(f'photo{i}')
        if photo:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], photo.filename)
            photo.save(filepath)
            photos.append(filepath)

    # Perform upscaling on the uploaded photos
    result_files = []
    for i, photo_path in enumerate(photos):
        result_path = os.path.join(app.config['RESULT_FOLDER'], f'upscaled_photo_{i + 1}.png')
        upscale_image(photo_path, result_path)
        result_files.append(result_path)

    return jsonify({'message': 'Files processed successfully', 'result_files': result_files}), 200

@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    path = os.path.join(app.config['RESULT_FOLDER'], filename)
    return send_file(path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)