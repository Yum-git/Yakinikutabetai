from flask import Flask, request, render_template
from flask_cors import CORS
import random

from base64 import b64encode, b64decode

import json
import requests


import os
"""
from dotenv import load_dotenv
load_dotenv('.env') 
APIKEY = os.environ.get("GCPAPIKEY")
"""

"""
#Test用
from PIL import Image
from io import BytesIO
"""

api = Flask(__name__)
CORS(api)

@api.route('/')
def index():
    return 'Hello world'

@api.route('/randomword', methods=["GET", "POST"])
def randomword():
    baseword = ['Refrigerator', 
                'Microwave', 
                'Television', 
                'Gas stove', 
                'rice cooker',
                'Remote controller',
                'Pen',
                'Eraser',
                'Book',
                'Clock']
    
    len_number = len(baseword)
    number = int(random.random() * len_number)
    returnstring = baseword[number]
    
    return returnstring


@api.route('/object_auth', methods=["GET", "POST"])
def auth_run():
    ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
    
    api_key = os.environ['API_KEY']
    
    img_request = []
    
    b64txt = request.form["img"]
    
    dec_data = b64decode(b64txt.split(',')[1])
    b64txt = b64encode(dec_data).decode()
    
    """
    with open('test.txt', 'w') as f:
        f.write(b64txt)
    """
    
    img_request.append({
        'image': {'content': b64txt},
        'features': [{
            'type': 'LABEL_DETECTION',
            'maxResults': 5
        }]
    })
    
    try:
        response = requests.post(ENDPOINT_URL,
                                 data=json.dumps({"requests": img_request}).encode(),
                                 params={'key': api_key},
                                 headers={'Content-Type': 'application/json'})
    
        data = response.json()
    
        jsonbase = []
        for dataout in data['responses'][0]['labelAnnotations']:
            dic = {}
            dic['name'] = dataout['description']
            dic['score'] = dataout['score']
        
            jsonbase.append(dic)
    
        return json.dumps({'response':jsonbase}, indent=4)       
    except Exception:
        jsonbase = [{
                'name': 'None',
                'score': 0
        }]
        
        return json.dumps({'response':jsonbase}, indent=4)  
    


@api.route('/alarm')
def alarmhtml():
    return render_template('alarm.html')


@api.route('/camera')
def camera():
    return render_template('camera_cap.html')


if __name__ == '__main__':
    api.run(host='0.0.0.0', port=4000, debug=True)


