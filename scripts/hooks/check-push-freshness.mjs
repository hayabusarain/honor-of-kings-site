/**
 * git push の直前に、掲載データの最終更新日が今日になっているかを検査する PreToolUse フック。
 *
 * 動かし方:
 *   フックとして      … Claude Code が stdin に {"tool_input":{"command":"git push ..."}} を渡す
 *   手で確かめるとき  … node scripts/hooks/check-push-freshness.mjs --check
 *
 * なぜ必要か:
 *   src/data/data_freshness.json の site.lastUpdated は、トップページの「最終更新」と
 *   sitemap の lastmod、Article の dateModified が参照している。ここを上げ忘れたまま
 *   push すると、中身は変わっているのに検索エンジンにもユーザーにも
 *   「更新されていないサイト」に見える。人が覚えておくのではなく機械で止める。
 *
 * 日付は必ず日本時間で比べる。toISOString() は UTC を返すため、深夜0時から朝9時の
 * あいだ、正しく更新していても前日と判定されてしまう。実行環境のローカル時刻に
 * 頼るのも駄目で、CI（UTC）が JST の当日日付を「未来」と判定して落ちたことがある
 * （モバレサイト、2026-08-21）。
 *
 * このファイルは Desktop/hub-game-rules/shared/hooks から配られている。
 * 手で編集せず、正本を直して node sync.mjs を実行すること。
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const FRESHNESS = path.join(ROOT, 'src', 'data', 'data_freshness.json');

/**
 * サイトの「今日」（日本時間の YYYY-MM-DD）。
 *
 * scripts/site_date.mjs があるサイトは、そちらを正とする。
 * npm run touch:updated が書く日付と audit が検証する日付が同じ関数から出ていないと、
 * 書いた直後に落ちるようなずれ方をする。無いサイトでは同じ規則で自前に計算する。
 */
let siteToday;
try {
  ({ siteToday } = await import('../site_date.mjs'));
} catch {
  siteToday = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
}
const today = () => siteToday();

/** 検査結果。ok が false のときだけ push を止める */
function check() {
  if (!fs.existsSync(FRESHNESS)) {
    return { ok: false, reason: `${path.relative(ROOT, FRESHNESS)} が見つかりません。` };
  }
  let lastUpdated;
  try {
    lastUpdated = JSON.parse(fs.readFileSync(FRESHNESS, 'utf8'))?.site?.lastUpdated;
  } catch (err) {
    return { ok: false, reason: `data_freshness.json を読めません: ${err.message}` };
  }
  const now = today();
  if (lastUpdated === now) return { ok: true, lastUpdated, now };
  return {
    ok: false,
    lastUpdated,
    now,
    reason:
      `push を止めました。src/data/data_freshness.json の site.lastUpdated が "${lastUpdated}" のままです。\n` +
      `今日は ${now} です。中身を変えたなら "${now}" に直してから push してください。\n` +
      `（コード以外を触っていない場合でも、この値はサイトの最終更新日として表示されます）`,
  };
}

// --check: 人が手で確かめるとき。結果を出して終わる
if (process.argv.includes('--check')) {
  const r = check();
  console.log(r.ok ? `OK: site.lastUpdated = ${r.lastUpdated}（今日）` : r.reason);
  process.exit(r.ok ? 0 : 1);
}

// フックとして呼ばれたとき。stdin の JSON から実行しようとしているコマンドを読む
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  let command = '';
  try {
    command = JSON.parse(input || '{}')?.tool_input?.command ?? '';
  } catch {
    // 解析できないときは何もしない。関係のないコマンドを巻き込まない
  }
  // `cd foo && git push origin main` のような複合コマンドも拾う。
  // `git push --help` のような無害なものまで止めるが、実害はない
  if (!/\bgit\s+push\b/.test(command)) process.exit(0);

  const r = check();
  if (r.ok) process.exit(0);

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: r.reason,
      },
    })
  );
  process.exit(0);
});
