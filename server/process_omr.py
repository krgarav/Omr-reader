import sys
import cv2
import numpy as np
import json
import os

UPLOAD_FOLDER = "uploads"

def process_omr(file_name):
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

        # Return JSON result
        result = {"success": True, "bubbles": filled_bubbles}
        print(json.dumps(result))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No filename provided"}))
    else:
        process_omr(sys.argv[1])
