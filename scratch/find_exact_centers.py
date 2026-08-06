import cv2
import numpy as np

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

path = r'C:\Users\81901\Pictures\Screenshots\スクリーンショット (3738).png'
img = read_img_unicode(path)

# Draw red dots on candidate centers to inspect visually
# Test x centers: 765, 825, 885, 945, 1005, 1065
# y centers: row1=490, row2=715

img_marked = img.copy()

x_test = [765, 825, 885, 945, 1005, 1065]
for x in x_test:
    cv2.circle(img_marked, (x, 490), 5, (0, 0, 255), -1)
    cv2.circle(img_marked, (x, 715), 5, (0, 0, 255), -1)

# Also test another set of x centers: 780, 855, 930, 1005, 1080, 1155
x_test2 = [780, 855, 930, 1005, 1080, 1155]
for x in x_test2:
    cv2.circle(img_marked, (x, 490), 5, (0, 255, 0), -1)
    cv2.circle(img_marked, (x, 715), 5, (0, 255, 0), -1)

crop_marked = img_marked[430:780, 700:1250]
cv2.imwrite(r'C:\Users\81901\.gemini\antigravity\brain\a68a100b-b7ec-493a-b0f7-9b8c6e2445bd\marked_centers.png', crop_marked)

print("Saved marked_centers.png!")
