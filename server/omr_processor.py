from flask import Flask, request, jsonify
import cv2
import numpy as np
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/process-omr", methods=["POST"])
def process_omr():
    
   
    data = request.get_json()  # Ensure we extract JSON properly
    if not data or "fileName" not in data:
        return jsonify({"error": "No filename provided"}), 400

    file_name = data["fileName"]
    filepath = os.path.join(UPLOAD_FOLDER, file_name)
   

    try:
        # Load image
        image = cv2.imread(filepath)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        threshold = cv2.threshold(blurred, 100, 255, cv2.THRESH_BINARY_INV)[1]

        # Find contours (bubbles)
        contours, _ = cv2.findContours(threshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        bubbles = []

        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            if 15 < w < 50 and 15 < h < 50:  # Filter small/large objects
                bubbles.append({"x": x, "y": y, "width": w, "height": h})

        # Sort bubbles by row and column
        bubbles = sorted(bubbles, key=lambda b: (b["y"], b["x"]))

        return jsonify({"success": True, "bubbles": bubbles})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
