# 認証情報の置き場所

このディレクトリに Google サービスアカウントの鍵ファイルなどを置く。
**中身は `.gitignore` で除外されており、このREADME以外はコミットされない。**

## 経緯

以前はリポジトリ直下に `key.json` / `client_secret.json` を置いており、
公開リポジトリにコミットされて漏洩した（2026-08-09に対応済み）。
同じ事故を防ぐため、認証情報は必ずこのディレクトリに置くこと。

Supabase（プロジェクト `cmlhfnaftwvcnlreuplp`）はサイトから撤去済み。
2026-08-31 の実測で、`src` と `scripts` に参照は0件、`package.json` にも依存は無い。
`src/types/database.ts` に残っていた型定義も同日に削除した。

ただし `.env.local` には `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` /
`ADMIN_PASSWORD` の3つが残っている。**ローカルのファイルから消しても鍵は無効にならない。**
実際に効くのは次の2つで、どちらもダッシュボードでの操作になる。

- 鍵の無効化 … Supabase のプロジェクト設定で API キーを再発行する
- 配信の停止 … Vercel の Environment Variables から同じ3つを削除する

この2つが済むまで、`.env.local` は消さずに残しておくこと（何が設定されていたかの記録になる）。

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
