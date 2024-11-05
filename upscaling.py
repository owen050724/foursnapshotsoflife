import cv2
from cv2 import dnn_superres

def upscale_image(input_path, output_path):
    target_image = cv2.imread(input_path)

    sr = dnn_superres.DnnSuperResImpl_create()
    path = 'EDSR_x3.pb'
    sr.readModel(path)
    sr.setModel('edsr', 3)
    upscaled = sr.upsample(target_image)
    cv2.imwrite(output_path, upscaled)