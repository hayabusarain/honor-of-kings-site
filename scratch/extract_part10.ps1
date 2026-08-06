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

$baseDir = "C:\Users\81901\Pictures\Screenshots"
$results = @()

for ($i = 100; $i -le 113; $i++) {
    $folderPrefix = "Set_$i"
    $folders = Get-ChildItem -Path $baseDir -Filter "$folderPrefix*" -Directory
    if ($folders.Count -eq 0) { continue }
    $folderPath = $folders[0].FullName
    $files = Get-ChildItem -Path $folderPath -Filter "*.png" | Sort-Object Name
    
    $folderResults = @()
    foreach ($file in $files) {
        try {
            $text = [OcrHelper]::Recognize($file.FullName)
            $cleanText = $text.Replace("`r", " ").Replace("`n", " ")
            $folderResults += [PSCustomObject]@{
                filename = $file.Name
                text = $cleanText
            }
        } catch {
            Write-Host "Error on $($file.Name): $_"
        }
    }
    
    $results += [PSCustomObject]@{
        dir = $folders[0].Name
        images = $folderResults
    }
    Write-Host "Processed $($folders[0].Name)"
}

$jsonPath = "C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\ocr_part10_raw.json"
$results | ConvertTo-Json -Depth 5 | Set-Content -Path $jsonPath -Encoding UTF8
Write-Host "Done!"
