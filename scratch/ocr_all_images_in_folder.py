import json
import os
import subprocess

base_folder = r'C:\Users\81901\Pictures\Screenshots'
folder_001 = os.path.join(base_folder, 'Set_001_UNKNOWN_3957-3967')

files = sorted([f for f in os.listdir(folder_001) if f.endswith('.png')])

print(f"Set 001 contains {len(files)} files: {files}")

# Run winocr script on each image in Set 001 using r""" ... """
for fname in files:
    fpath = os.path.abspath(os.path.join(folder_001, fname))
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
    $file = Await([Windows.Storage.StorageFile]::GetFileFromPathAsync('""" + fpath + r"""'))
    $stream = Await($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
    $decoder = Await([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
    $bitmap = Await($decoder.GetSoftwareBitmapAsync())
    $res = Await($engine.RecognizeAsync($bitmap))
    Write-Host $res.Text
    """
    
    try:
        proc = subprocess.run(['powershell', '-ExecutionPolicy', 'Bypass', '-Command', ps_cmd], capture_output=True, text=True, encoding='utf-8')
        out_txt = proc.stdout.strip().replace("\n", " ").replace("\r", " ")
        print(f"File {fname} OCR -> {out_txt[:100]}...")
    except Exception as e:
        print(f"Error {fname}: {e}")
