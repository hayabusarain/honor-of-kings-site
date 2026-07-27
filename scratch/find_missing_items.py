import os
import cv2
import easyocr
import shutil
import numpy as np

TARGETS = {
    "11110": "エンチャントフェザー",
    "11211": "フォージセイバー",
    "1218": "元流の結晶"
}

DIRS = [
    r"C:\Users\81901\Desktop\おなきんあいてむ",
    r"C:\Users\81901\Desktop\あいてむみきれ"
]

OUT_DIR = r"C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\missing_items_raw"

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print("Initializing EasyOCR...")
    reader = easyocr.Reader(['ja', 'en'], gpu=False)
    
    found = {k: False for k in TARGETS.keys()}
    
    for d in DIRS:
        if not os.path.exists(d): continue
        for fname in os.listdir(d):
            if not fname.lower().endswith(('.png', '.jpg', '.jpeg')): continue
            
            fpath = os.path.join(d, fname)
            print(f"Scanning {fname}...")
            
            try:
                img = cv2.imread(fpath)
                if img is None: continue
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                
                results = reader.readtext(rgb)
                
                for bbox, text, prob in results:
                    text = text.replace(" ", "")
                    
                    for tid, tname in TARGETS.items():
                        if not found[tid] and (tname in text or text in tname):
                            print(f"Found {tname} in {fname}!")
                            
                            out_path = os.path.join(OUT_DIR, f"{tid}_full.png")
                            shutil.copy(fpath, out_path)
                            
                            # Also save a crop of the top part of the image for easier analysis
                            h, w = img.shape[:2]
                            crop = img[0:int(h/2), 0:w]
                            cv2.imwrite(os.path.join(OUT_DIR, f"{tid}_top.png"), crop)
                            
                            found[tid] = True
                            break
                            
                if all(found.values()):
                    print("Found all items!")
                    return
            except Exception as e:
                print(f"Error processing {fname}: {e}")

if __name__ == "__main__":
    main()
