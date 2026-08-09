# 認証情報の置き場所

このディレクトリに Google サービスアカウントの鍵ファイルなどを置く。
**中身は `.gitignore` で除外されており、このREADME以外はコミットされない。**

## 経緯

以前はリポジトリ直下に `key.json` / `client_secret.json` を置いており、
公開リポジトリにコミットされて漏洩した（2026-08-09に対応済み）。
同じ事故を防ぐため、認証情報は必ずこのディレクトリに置くこと。

## 使い方

1. Google Cloud コンソールでサービスアカウント鍵（JSON）を発行する
2. このディレクトリに配置する（例: `config/credentials/vertex-key.json`）
3. 環境変数でパスを指定する

```bash
export GOOGLE_APPLICATION_CREDENTIALS=config/credentials/vertex-key.json
python scripts/vertex_gemini_ocr.py 0 10 out.json
```

Windows の PowerShell の場合:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "config/credentials/vertex-key.json"
python scripts/vertex_gemini_ocr.py 0 10 out.json
```

## 参照しているスクリプト

- `scripts/vertex_gemini_ocr.py`
- `scripts/run_title_ocr.py`

どちらも環境変数が未設定なら、その旨を表示して停止する。
