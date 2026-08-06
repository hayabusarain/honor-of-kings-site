Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\81901\Pictures\Screenshots\スクリーンショット (3425).png"
if (-not (Test-Path $imgPath)) {
    Write-Output "Image file not found: $imgPath"
    exit
}

[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$asyncOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath)
while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$file = $asyncOp.GetResults()

$asyncOp = $file.OpenAsync([Windows.Storage.FileAccessMode]::Read)
while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$stream = $asyncOp.GetResults()

$asyncOp = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$decoder = $asyncOp.GetResults()

$asyncOp = $decoder.GetSoftwareBitmapAsync()
while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$bitmap = $asyncOp.GetResults()

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("ja-JP"))
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
}

$asyncOp = $engine.RecognizeAsync($bitmap)
while ($asyncOp.Status -eq 'Started') { Start-Sleep -Milliseconds 10 }
$ocrResult = $asyncOp.GetResults()

Write-Output "OCR Result Text:"
Write-Output $ocrResult.Text
