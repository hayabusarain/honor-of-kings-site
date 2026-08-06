Add-Type -AssemblyName System.Runtime.WindowsRuntime

$csCode = @"
using System;
using System.IO;
using System.Text;
using System.Threading;
using Windows.Foundation;
using Windows.Media.Ocr;
using Windows.Graphics.Imaging;
using Windows.Storage;

public class WinOcr {
    public static string Recognize(string path) {
        try {
            var engine = OcrEngine.TryCreateFromUserProfileLanguages();
            var file = AwaitOp(StorageFile.GetFileFromPathAsync(path));
            var stream = AwaitOp(file.OpenAsync(FileAccessMode.Read));
            var decoder = AwaitOp(BitmapDecoder.CreateAsync(stream));
            var bitmap = AwaitOp(decoder.GetSoftwareBitmapAsync());
            var result = AwaitOp(engine.RecognizeAsync(bitmap));
            return result.Text;
        } catch {
            return "";
        }
    }

    static T AwaitOp<T>(IAsyncOperation<T> op) {
        while (op.Status == AsyncStatus.Started) {
            Thread.Sleep(5);
        }
        return op.GetResults();
    }
}
"@

Add-Type -TypeDefinition $csCode -Language CSharp

$baseFolder = "C:\Users\81901\Pictures\Screenshots"
$subdirs = Get-ChildItem -Path $baseFolder -Directory | Where-Object { $_.Name -like "Set_*" } | Sort-Object Name

$heroData = Get-Content "src\data\hok_heroes.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$renamePlan = @()

foreach ($dir in $subdirs) {
    $firstFile = Get-ChildItem -Path $dir.FullName -Filter "*.png" | Sort-Object Name | Select-Object -First 1
    if ($firstFile) {
        $text = [WinOcr]::Recognize($firstFile.FullName)
        if (-not $text) { $text = "" }
        
        $matchedHero = $null
        foreach ($h in $heroData) {
            $hName = [string]$h.name
            $hNameEn = [string]$h.name_en
            if ($hName -and $text.Contains($hName)) {
                $matchedHero = $hName
                break
            }
            if ($hNameEn -and $text.ToLower().Contains($hNameEn.ToLower())) {
                $matchedHero = $hName
                break
            }
        }

        if (-not $matchedHero) {
            foreach ($h in $heroData) {
                $hName = [string]$h.name
                if ($hName -and $hName.Length -ge 2 -and $text.Contains($hName.Substring(0, 2))) {
                    $matchedHero = $hName
                    break
                }
            }
        }

        if (-not $matchedHero) {
            $matchedHero = "UNKNOWN"
        }

        $parts = $dir.Name.Split('_')
        $setNum = $parts[1]
        $rangeStr = $parts[2]

        $newName = "${setNum}_${matchedHero}_${rangeStr}"

        $renamePlan += [PSCustomObject]@{
            OldDir = $dir.Name
            NewDir = $newName
            HeroName = $matchedHero
            FirstFile = $firstFile.Name
            OcrText = $text
        }

        Write-Host "Parsed $($dir.Name) -> $newName (Matched: $matchedHero)"
    }
}

$renamePlan | ConvertTo-Json -Depth 3 | Out-File "scratch/hero_folder_rename_map.json" -Encoding UTF8
Write-Host "Saved rename map to scratch/hero_folder_rename_map.json!"
