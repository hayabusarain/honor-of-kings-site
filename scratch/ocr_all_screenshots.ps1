[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Drawing

[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("ja-JP"))
if ($null -eq $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
}

function Await-Task ($asyncOp) {
    return [System.WindowsRuntimeSystemExtensions]::AsTask($asyncOp).GetAwaiter().GetResult()
}

$folder = "C:\Users\81901\Pictures\Screenshots"
$files = Get-ChildItem -Path $folder -Filter "*.png" | Sort-Object Name

$results = @()
$count = 0

foreach ($file in $files) {
    try {
        $storageFile = Await-Task ([Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName))
        $stream = Await-Task ($storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read))
        $decoder = Await-Task ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
        $bitmap = Await-Task ($decoder.GetSoftwareBitmapAsync())
        $ocrResult = Await-Task ($engine.RecognizeAsync($bitmap))

        $text = $ocrResult.Text.Replace("`r", " ").Replace("`n", " ")

        $results += [PSCustomObject]@{
            filename = $file.Name
            text = $text
        }
        $count++
        if ($count % 20 -eq 0) {
            Write-Host "Processed $count / $($files.Count) files..."
        }
    } catch {
        Write-Host "Error parsing $($file.Name): $_"
    }
}

$jsonPath = "$PSScriptRoot\all_screenshots_ocr.json"
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "SUCCESS: Saved $count OCR results to $jsonPath"
