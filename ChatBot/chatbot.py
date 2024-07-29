from flask import Flask, render_template, request, jsonify
import requests
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    response = generate_response(user_input)
    if response:
        generated_text = response[0].get('generated_text', 'No response text available.')
        return jsonify({'response': generated_text})
    else:
        return jsonify({'response': "Sorry, an error occurred."}), 500

def generate_response(input_text):
    API_KEY = "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"
    MODEL_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": input_text,
        "parameters": {
            "max_length": 100,
            "num_return_sequences": 1,
            "temperature": 0.7,
            "top_p": 0.9
        }
    }
    try:
        response = requests.post(MODEL_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return result
        else:
            return [{'generated_text': 'No response text available.'}]
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return [{'generated_text': 'Sorry, an error occurred.'}]


if __name__ == '__main__':
    app.run(debug=True)
