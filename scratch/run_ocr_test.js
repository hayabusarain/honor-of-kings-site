const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, 'ocr_test_native.ps1');

// spawn を使い、shell: false にすることで CreateProcessW を介して Unicode パスを正しく渡す
const child = spawn('powershell', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath
], {
    shell: false
});

child.stdout.on('data', (data) => {
    // Windows PowerShell の出力は通常 CP932 (Shift-JIS) なので、
    // ここでバッファをそのまま流すか、必要ならデコードする。
    // 日本語表示のため、ここでは console.log を通す
    process.stdout.write(data);
});

child.stderr.on('data', (data) => {
    process.stderr.write(data);
});

child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});
