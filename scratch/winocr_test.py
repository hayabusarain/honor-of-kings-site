import asyncio
import glob
import os

try:
    import winsdk.windows.media.ocr as ocr
    import winsdk.windows.graphics.imaging as imaging
    import winsdk.windows.storage as storage

    async def run_ocr(path):
        file = await storage.StorageFile.get_file_from_path_async(os.path.abspath(path))
        stream = await file.open_async(storage.FileAccessMode.read)
        decoder = await imaging.BitmapDecoder.create_async(stream)
        bitmap = await decoder.get_software_bitmap_async()
        engine = ocr.OcrEngine.try_create_from_user_profile_languages()
        result = await engine.recognize_async(bitmap)
        print("OCR Text:", result.text)

    files = sorted(glob.glob(r"C:\Users\81901\Pictures\Screenshots\*.png"))
    if files:
        print("Running WinSDK OCR on:", files[0])
        asyncio.run(run_ocr(files[0]))
except Exception as e:
    print("WinSDK error:", e)
