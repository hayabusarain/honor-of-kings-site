[System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null
Add-Type -AssemblyName System.Runtime.WindowsRuntime

$type1 = [Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime]
$type2 = [Windows.Storage.StorageFile, Windows.Foundation, ContentType = WindowsRuntime]
$type3 = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime]
$type4 = [Windows.Globalization.Language, Windows.Foundation, ContentType = WindowsRuntime]

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

$baseFolder = "C:\Users\81901\Pictures\Screenshots"
$subdirs = Get-ChildItem -Path $baseFolder -Directory | Sort-Object Name

$heroData = Get-Content "src\data\hok_heroes.json" -Raw -Encoding UTF8 | ConvertFrom-Json

$renamePlan = @()

foreach ($dir in $subdirs) {
    $titleImgPath = "C:\Users\81901\Desktop\オナーオブキングスサイト\scratch\title_$($dir.Name).png"
    if (Test-Path $titleImgPath) {
        $file = Await([Windows.Storage.StorageFile]::GetFileFromPathAsync($titleImgPath))
        $stream = Await($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
        $decoder = Await([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
        $bitmap = Await($decoder.GetSoftwareBitmapAsync())
        $ocrResult = Await($ocrEngine.RecognizeAsync($bitmap))
        
        $text = $ocrResult.Text
        if (-not $text) { $text = "" }

        # Clean text
        $cleanText = $text.Replace(" ", "").Replace("`n", "").Replace("`r", "")

        $matchedHero = $null
        foreach ($h in $heroData) {
            $hName = [string]$h.name
            $hNameEn = [string]$h.name_en
            if ($cleanText -and ($cleanText.Contains($hName) -or ($hNameEn -and $cleanText.ToLower().Contains($hNameEn.ToLower())))) {
                $matchedHero = $hName
                break
            }
        }

        if (-not $matchedHero) {
            # Check 2-character partial match
            foreach ($h in $heroData) {
                $hName = [string]$h.name
                if ($hName -and $hName.Length -ge 2 -and $cleanText.Contains($hName.Substring(0, 2))) {
                    $matchedHero = $hName
                    break
                }
            }
        }

        if (-not $matchedHero) {
            $matchedHero = if ($cleanText) { $cleanText } else { "UNKNOWN" }
        }

        # Format clean folder name: e.g. Set_001_アーサー_3957-3967
        $parts = $dir.Name.Split('_')
        $setNum = $parts[1]
        $rangeStr = $parts[-1]

        $newName = "Set_${setNum}_${matchedHero}_${rangeStr}"

        $renamePlan += [PSCustomObject]@{
            OldDir = $dir.Name
            NewDir = $newName
            HeroName = $matchedHero
            OcrText = $cleanText
        }

        Write-Host "$($dir.Name) -> $newName (OCR Raw: '$cleanText')"
    }
}

$renamePlan | ConvertTo-Json -Depth 3 | Out-File "scratch/correct_hero_rename_plan.json" -Encoding UTF8
Write-Host "Saved correct rename plan to scratch/correct_hero_rename_plan.json!"
