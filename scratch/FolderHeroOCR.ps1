[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

$baseFolder = "C:\Users\81901\Pictures\Screenshots"
$subdirs = Get-ChildItem -Path $baseFolder -Directory | Where-Object { $_.Name -like "Set_*" } | Sort-Object Name
$heroData = Get-Content "src\data\hok_heroes.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Use Windows Media OCR via PowerShell async wrapper
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asyncNoResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' }
$asyncWithResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -like 'IAsyncOperation*' }[0]

function Await($asyncOp) {
    $task = $asyncWithResult.MakeGenericMethod($asyncOp.GetType().GetInterfaces()[0].GetGenericArguments()[0]).Invoke($null, @($asyncOp))
    $task.Wait()
    return $task.Result
}

$ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("ja-JP"))
if (-not $ocrEngine) {
    $ocrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new("en-US"))
}

$renamePlan = @()

foreach ($dir in $subdirs) {
    $firstFile = Get-ChildItem -Path $dir.FullName -Filter "*.png" | Sort-Object Name | Select-Object -First 1
    if ($firstFile) {
        $file = Await([Windows.Storage.StorageFile]::GetFileFromPathAsync($firstFile.FullName))
        $stream = Await($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
        $decoder = Await([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
        $bitmap = Await($decoder.GetSoftwareBitmapAsync())
        $ocrResult = Await($ocrEngine.RecognizeAsync($bitmap))
        
        $text = $ocrResult.Text
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
