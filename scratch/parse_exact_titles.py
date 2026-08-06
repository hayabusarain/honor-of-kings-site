import cv2
import json
import numpy as np
import os
import subprocess

def read_img_unicode(path):
    return cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)

folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(folder) if os.path.isdir(os.path.join(folder, d))])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

rename_plan = []

for sd in subdirs:
    sd_path = os.path.join(folder, sd)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue
        
    first_path = os.path.join(sd_path, files[0])
    img = read_img_unicode(first_path)
    if img is None:
        continue
        
    h_img, w_img, _ = img.shape
    if w_img != 1920 or h_img != 1080:
        img = cv2.resize(img, (1920, 1080))
        
    # Crop hero name title region (y: 140 to 230, x: 1100 to 1450)
    title_crop = img[140:230, 1100:1450]
    crop_tmp_path = os.path.abspath(os.path.join('scratch', 'tmp_title.png'))
    cv2.imwrite(crop_tmp_path, title_crop)
    
    # Run winocr script via powershell for single image using raw string r""" ... """
    ps_cmd = r"""
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
    [Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
    [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
    [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

    $asyncWithResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -like 'IAsyncOperation*' }[0]

    function Await($asyncOp) {
        $task = $asyncWithResult.MakeGenericMethod($asyncOp.GetType().GetInterfaces()[0].GetGenericArguments()[0]).Invoke($null, @($asyncOp))
        $task.Wait()
        return $task.Result
    }

    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("ja-JP"))
    $file = Await([Windows.Storage.StorageFile]::GetFileFromPathAsync('C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\tmp_title.png'))
    $stream = Await($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
    $decoder = Await([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
    $bitmap = Await($decoder.GetSoftwareBitmapAsync())
    $res = Await($engine.RecognizeAsync($bitmap))
    Write-Host $res.Text
    """
    
    try:
        proc = subprocess.run(['powershell', '-ExecutionPolicy', 'Bypass', '-Command', ps_cmd], capture_output=True, text=True, encoding='utf-8')
        raw_ocr = proc.stdout.strip().replace(" ", "").replace("\n", "").replace("\r", "")
    except Exception as e:
        raw_ocr = ""
        
    matched_hero = None
    if raw_ocr:
        for h in heroes:
            hname = h['name']
            hname_en = h.get('name_en', '')
            if hname in raw_ocr or (hname_en and hname_en.lower() in raw_ocr.lower()):
                matched_hero = hname
                break
                
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in raw_ocr:
                    matched_hero = hname
                    break
                    
    final_hero_name = matched_hero if matched_hero else (raw_ocr if raw_ocr else "UNKNOWN")
    
    # Extract set index and range from old dir
    parts = sd.split('_')
    set_num = parts[1] # e.g. 001
    range_str = parts[-1] # e.g. 3957-3967
    
    new_dir_name = f"Set_{set_num}_{final_hero_name}_{range_str}"
    
    rename_plan.append({
        "old_dir": sd,
        "new_dir": new_dir_name,
        "hero_name": final_hero_name,
        "raw_ocr": raw_ocr,
        "first_file": files[0]
    })
    print(f"[{set_num}] {sd} -> {new_dir_name} (OCR: '{raw_ocr}')")

with open('scratch/exact_titles_rename_plan.json', 'w', encoding='utf-8') as f:
    json.dump(rename_plan, f, ensure_ascii=False, indent=2)

print("\nSaved exact title rename plan to scratch/exact_titles_rename_plan.json!")
