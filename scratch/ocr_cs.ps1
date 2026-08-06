[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$code = @"
using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Media.Ocr;
using Windows.Graphics.Imaging;
using Windows.Storage;

public class OcrHelper {
    public static string Recognize(string path) {
        return Task.Run(async () => {
            StorageFile file = await StorageFile.GetFileFromPathAsync(path);
            using (var stream = await file.OpenAsync(FileAccessMode.Read)) {
                BitmapDecoder decoder = await BitmapDecoder.CreateAsync(stream);
                SoftwareBitmap bitmap = await decoder.GetSoftwareBitmapAsync();
                OcrEngine engine = OcrEngine.TryCreateFromLanguage(new Windows.Globalization.Language("ja-JP"));
                if (engine == null) engine = OcrEngine.TryCreateFromUserProfileLanguages();
                OcrResult result = await engine.RecognizeAsync(bitmap);
                return result.Text;
            }
        }).GetAwaiter().GetResult();
    }
}
"@

Add-Type -TypeDefinition $code -Language CSharp -CompilerOptions "/reference:C:\Windows\System32\WinMetadata\Windows.Foundation.winmd /reference:C:\Windows\System32\WinMetadata\Windows.Media.winmd /reference:C:\Windows\System32\WinMetadata\Windows.Graphics.winmd /reference:C:\Windows\System32\WinMetadata\Windows.Storage.winmd"

$folder = "C:\Users\81901\Pictures\Screenshots"
$files = Get-ChildItem -Path $folder -Filter "*.png" | Sort-Object Name

$results = @()
$count = 0

foreach ($file in $files) {
    try {
        $text = [OcrHelper]::Recognize($file.FullName)
        $cleanText = $text.Replace("`r", " ").Replace("`n", " ")
        $results += [PSCustomObject]@{
            filename = $file.Name
            text = $cleanText
        }
        $count++
        if ($count % 20 -eq 0) {
            Write-Host "Processed $count / $($files.Count) files..."
        }
    } catch {
        Write-Host "Error on $($file.Name): $_"
    }
}

$jsonPath = "$PSScriptRoot\all_screenshots_ocr.json"
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "SUCCESS: Saved $count OCR results to $jsonPath"
