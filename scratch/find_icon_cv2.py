import cv2
import numpy as np

img = cv2.imread(r"C:\Users\81901\Desktop\screenshots\hero_059_passive.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(blurred, 50, 150)

contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

possible_icons = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    # Skill icons are roughly square, size between 80 and 160
    if 80 <= w <= 160 and 80 <= h <= 160:
        aspect_ratio = float(w)/h
        if 0.9 <= aspect_ratio <= 1.1:
            possible_icons.append((x, y, w, h))

# Sort by x coordinate, then y coordinate
possible_icons.sort(key=lambda x: (x[0], x[1]))
print("Found potential icon bounds (x, y, w, h):")
for p in possible_icons:
    print(p)
