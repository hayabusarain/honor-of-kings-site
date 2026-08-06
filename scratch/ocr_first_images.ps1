Add-Type -AssemblyName System.Runtime.WindowsRuntime

$assem = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("ja-JP"))

if ($null -eq $ocrEngine) {
    $ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
}

function Get-OcrText($imagePath) {
    $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath).AsTask().Result
    $stream = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read).AsTask().Result
    $decoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream).AsTask().Result
    $softwareBitmap = $decoder.GetSoftwareBitmapAsync().AsTask().Result
    $ocrResult = $ocrEngine.RecognizeAsync($softwareBitmap).AsTask().Result
    return $ocrResult.Text
}

$base = "C:\Users\81901\Pictures\Screenshots"
$dirs = Get-ChildItem -Path $base -Directory | Where-Object { $_.Name -like "Set_*" } | Sort-Object Name

foreach ($d in $dirs[0..9]) {
    $firstFile = Get-ChildItem -Path $d.FullName -Filter "*.png" | Sort-Object Name | Select-Object -First 1
    if ($firstFile) {
        $text = Get-OcrText $firstFile.FullName
        Write-Host "$($d.Name) -> $($firstFile.Name):"
        Write-Host "  OCR: $text"
    }
}
