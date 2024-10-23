import sys
from PIL import Image
import requests
from transformers import BlipProcessor, BlipForConditionalGeneration
from io import BytesIO
import json

def process_image(image_url):
    response = requests.get(image_url, stream=True)
    image = Image.open(response.raw)

    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

    inputs = processor(image, return_tensors="pt")

    out = model.generate(**inputs)

    description = processor.decode(out[0], skip_special_tokens=True)
    
    return description



def main():
    image_urls = json.loads(sys.argv[1])
    descriptions = []

    for url in image_urls:
        try:
            response = requests.get(url)
            img = Image.open(BytesIO(response.content))
            description = process_image(url)
            descriptions.append(description)
        except Exception as e:
            descriptions.append(f"Error processing {url}: {str(e)}")

    print(json.dumps(descriptions))

if __name__ == '__main__':
    main()