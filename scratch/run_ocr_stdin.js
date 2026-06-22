const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawDir = path.join(__dirname, '../public/images/items/raw');
let files = [];
try {
    files = fs.readdirSync(rawDir).filter(f => f.endsWith('.png'));
} catch (e) {
    console.error('Failed to read raw directory:', e);
}

if (files.length === 0) {
    console.error('No PNG files found in', rawDir);
    process.exit(1);
}

const targetImage = path.join(rawDir, files[0]);
console.log('Target image for OCR test:', targetImage);

const psScript = `
try {
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    [Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime] | Out-Null
    [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime] | Out-Null
    [Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType=WindowsRuntime] | Out-Null
    [Windows.Globalization.Language, Windows.Globalization, ContentType=WindowsRuntime] | Out-Null

    $extType = [System.WindowsRuntimeSystemExtensions]
    $asTaskMethod = ($extType.GetMethods() | Where-Object { 
        $_.Name -eq 'AsTask' -and 
        $_.GetParameters().Count -eq 1 -and 
        $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' 
    })[0]

    function Await-WinRT($winRtTask, [Type]$resultType) {
        $genericMethod = $asTaskMethod.MakeGenericMethod($resultType)
        $netTask = $genericMethod.Invoke($null, @($winRtTask))
        $netTask.Wait(-1) | Out-Null
        return $netTask.Result
    }

    $imagePath = "${targetImage.replace(/\\/g, '\\\\')}"
    
    $asyncFile = [Windows.Storage.StorageFile]::GetFileFromPathAsync($imagePath)
    $storageFile = Await-WinRT $asyncFile ([Windows.Storage.StorageFile])

    $asyncStream = $storageFile.OpenAsync([Windows.Storage.FileAccessMode]::Read)
    $stream = Await-WinRT $asyncStream ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])

    $asyncDecoder = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
    $decoder = Await-WinRT $asyncDecoder ([Windows.Graphics.Imaging.BitmapDecoder])

    $asyncBitmap = $decoder.GetSoftwareBitmapAsync()
    $bitmap = Await-WinRT $asyncBitmap ([Windows.Graphics.Imaging.SoftwareBitmap])

    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new('ja-JP'))
    if ($null -eq $engine) {
        $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
    }
    $asyncResult = $engine.RecognizeAsync($bitmap)
    $result = Await-WinRT $asyncResult ([Windows.Media.Ocr.OcrResult])

    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Write-Output "===OCR_RESULT_START==="
    Write-Output $result.Text
    Write-Output "===OCR_RESULT_END==="
} catch {
    Write-Error $_
}
`;

const child = spawn('powershell', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-Command', '-'
], {
    shell: false
});

let stdoutData = '';
let stderrData = '';

child.stdout.on('data', (data) => {
    stdoutData += data.toString('utf8');
});

child.stderr.on('data', (data) => {
    stderrData += data.toString('utf8');
});

child.on('close', (code) => {
    console.log(`PowerShell process exited with code ${code}`);
    console.log('--- STDOUT ---');
    console.log(stdoutData);
    console.log('--- STDERR ---');
    console.log(stderrData);
});

child.stdin.write(psScript, 'utf8');
child.stdin.end();
