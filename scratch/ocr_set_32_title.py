import cv2
import numpy as np
import os
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

base = r'C:\Users\81901\Pictures\Screenshots'
s32 = [d for d in os.listdir(base) if 'Set_032' in d][0]
s83 = [d for d in os.listdir(base) if 'Set_083' in d][0]

for name, sdir in [("Set 032", s32), ("Set 083", s83)]:
    sd_p = os.path.join(base, sdir)
    files = sorted([f for f in os.listdir(sd_p) if f.endswith('.png')])
    for f in files[:3]:
        fp = os.path.join(sd_p, f)
        img = read_img_unicode(fp)
        if img is None: continue
        h, w, _ = img.shape
        if w != 1920 or h != 1080:
            img = cv2.resize(img, (1920, 1080))
            
        # Try upper right title banner (y: 140 to 230, x: 1100 to 1450)
        crop1 = img[140:230, 1100:1450]
        cv2.imwrite("scratch/crop_check.png", crop1)
        proc1 = subprocess.run(['scratch\\winocr.exe', os.path.abspath("scratch/crop_check.png")], capture_output=True, text=True, encoding='utf-8')
        t1 = proc1.stdout.strip().replace("\n", " ").replace("SUCCESS!", "").strip()
        
        print(f"{name} ({f}) Top Right OCR -> '{t1}'")
