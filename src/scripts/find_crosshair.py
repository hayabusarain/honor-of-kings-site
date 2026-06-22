import cv2
import numpy as np
import os
import glob
import json

def find_crosshair(image_path):
    # Read file with numpy to handle Japanese paths in OpenCV
    with open(image_path, "rb") as f:
        file_bytes = np.asarray(bytearray(f.read()), dtype=np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
    if img is None:
        return None
    
    # Convert to HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # The blue crosshair color in Android
    lower_blue = np.array([100, 150, 150])
    upper_blue = np.array([140, 255, 255])
    
    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    
    # Find the row and column with the maximum number of blue pixels
    row_sums = np.sum(mask, axis=1)
    col_sums = np.sum(mask, axis=0)
    
    y = int(np.argmax(row_sums))
    x = int(np.argmax(col_sums))
    
    return x, y

folder = r"C:\Users\81901\Desktop\オナーオブキングスサイト\スクショ撮影手順"
files = glob.glob(os.path.join(folder, "*.png"))
files.sort()

results = {}
mapping = {
    "①パッシブ.png": "① パッシブのアイコン",
    "②スキル１.png": "② スキル1のアイコン",
    "③スキル２.png": "③ スキル2のアイコン",
    "④スキル３.png": "④ スキル3のアイコン",
    "⑤スキル→ステータス選択画面切り替え.png": "⑤ ステータスを開くための右側タブ",
    "⑥ステータス.png": "⑥ ステータスボタン（タブを開いた後に出る）",
    "⑦ステータス画面、閉じるボタン.png": "⑦ ステータス画面の閉じる(X)ボタン",
    "⑧キャラ選択画面に戻る.png": "⑧ 左上の戻る(キャラ選択に戻る)ボタン"
}

for f in files:
    basename = os.path.basename(f)
    if basename in mapping:
        pt = find_crosshair(f)
        if pt:
            results[mapping[basename]] = {"x": pt[0], "y": pt[1]}
            print(f"{basename} -> {pt}")

# Save to screenshot_config.json
config_path = r"C:\Users\81901\Desktop\オナーオブキングスサイト\src\scripts\screenshot_config.json"
with open(config_path, "w", encoding="utf-8") as out:
    json.dump(results, out, ensure_ascii=False, indent=2)

print("Saved config to", config_path)
