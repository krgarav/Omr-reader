from flask import Flask, request, jsonify
import cv2
import numpy as np
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/process-omr", methods=["POST"])

@app.route("/process-omr", methods=["POST"])
def process_omr():
    data = request.get_json()
    if not data or "fileName" not in data:
        return jsonify({"error": "No filename provided"}), 400

    file_name = data["fileName"]
    filepath = os.path.join(UPLOAD_FOLDER, file_name)

    try:
        # Load image
        image = cv2.imread(filepath)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Apply threshold (match JS threshold value)
        _, binary = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        filled_bubbles = []

        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)

            if 10 < w < 50 and 10 < h < 50:  # Match JS filtering
                roi = binary[y:y+h, x:x+w]  # Extract bubble region
                white_pixels = cv2.countNonZero(roi)  # Count filled (white) pixels
                total_pixels = w * h
                fill_ratio = white_pixels / total_pixels  # Calculate fill percentage

                if fill_ratio > 0.5:  # Consider it "filled" if more than 50% pixels are white
                    filled_bubbles.append({"x": x, "y": y, "width": w, "height": h})

                    # Debug: Draw detected filled bubbles
                    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Green for filled

        # Save debug image (optional)
        debug_path = os.path.join(UPLOAD_FOLDER, "debug_" + file_name)
        cv2.imwrite(debug_path, image)

        return jsonify({"success": True, "bubbles": filled_bubbles, "debug_image": debug_path})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
