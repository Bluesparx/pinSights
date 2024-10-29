from flask import Flask, request, jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration
import requests
from PIL import Image
from io import BytesIO
import threading

app = Flask(__name__)


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

lock = threading.Lock()

def process_image(image_url):
    response = requests.get(image_url, stream=True)
    image = Image.open(response.raw)

    with lock:
        inputs = processor(image, return_tensors="pt")
        out = model.generate(**inputs)
    
    description = processor.decode(out[0], skip_special_tokens=True)
    
    return description

@app.route('/process-images', methods=['POST'])
def process_images():
    data = request.json
    image_urls = data.get('imageUrls', [])
    descriptions = []

    for url in image_urls:
        description = process_image(url)
        descriptions.append(description)

    return jsonify(descriptions)

if __name__ == '__main__':
    app.run(port=5000)
