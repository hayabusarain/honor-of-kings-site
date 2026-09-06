import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/**
 * AGENTS.md の共通ブロックと権限設定が、正本とずれていないかを見る。
 *
 * 共通ルールは Desktop/hub-game-rules に正本があり、各サイトへ実体として
 * 配られている。配った先を手で直すと、次に配ったときに黙って戻る。
 * それを見つけられるように、npm run audit から呼ぶ。
 *
 * 正本のフォルダが見つからない環境（別のマシン、CI）では何もせず通す。
 * ここで落とすと、ルールの同期という本題と関係のないところでビルドが止まる。
 *
 * このファイルは Desktop/hub-game-rules/shared/scripts から配られている。
 * 手で編集せず、正本を直して node sync.mjs を実行すること。
 */

const ROOT = path.resolve(import.meta.dirname, '..');
const CANONICAL = path.resolve(ROOT, '..', 'hub-game-rules', 'sync.mjs');

if (!fs.existsSync(CANONICAL)) {
  console.log('[共通ルール] 正本が見つからないので検査を飛ばしました（hub-game-rules が隣にある環境でだけ動きます）');
  process.exit(0);
}

const r = spawnSync(process.execPath, [CANONICAL, '--check'], { encoding: 'utf8' });
process.stdout.write(r.stdout ?? '');
process.stderr.write(r.stderr ?? '');
process.exit(r.status ?? 0);
