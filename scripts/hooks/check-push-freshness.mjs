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
 *   ただし押すものが開発用のファイルだけなら、日付を上げるほうが嘘になる。
 *   読者に届くファイルが入っているときだけ止める（下の pushedFiles を見ること）。
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
import { execFileSync } from 'node:child_process';

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

/**
 * push を実行しようとしているコマンドか。
 *
 * git と push のあいだに入ってよいのはオプションだけ。値を取るオプション
 * （-C、-c、--git-dir、--work-tree、--namespace、--exec-path）は次の語も飲む。
 * こうしないと `git commit -m "push した話"` のように、本文に push という語が
 * 入っただけのコマンドまで止めてしまう（2026-09-09 に実際に起きた）。
 */
const PUSH_COMMAND =
  /\bgit\s+(?:(?:-C|-c|--git-dir|--work-tree|--namespace|--exec-path)\s+\S+\s+|--?[\w-]+\s+)*push\b/;

/**
 * Git Bash の `/c/Users/...` を Windows の `c:/Users/...` に直す。
 *
 * これをやらないと path.resolve が `/c/...` を相対パスとして扱い、
 * `c:\c\Users\...` に化ける。自分のリポジトリへの push でも不一致になり、
 * 検査が丸ごと素通りしていた（2026-09-10 に実測して判明）。
 */
function toWindowsPath(p) {
  return p.replace(/^\/([A-Za-z])(?=\/|$)/, '$1:');
}

/**
 * その操作が「このリポジトリ」に対するものか。
 *
 * 行き先の決め方は2つ。`git -C <path> push` なら -C の値、そうでなければ
 * **push より前にある** cd の最後のもの（`cd a && cd b && push` なら b）。
 * どちらも無ければ、いまのリポジトリ。
 *
 * push より前だけを見るのは、`git push && cd ..` の後ろの cd を
 * 行き先と誤認しないため。誤認すると検査が素通りする。
 *
 * Windows は大文字小文字を区別しないので、比較の前に揃える。
 * 解釈できない書き方（pushd、変数展開、コマンド置換）は検査する側に倒す。
 */
function targetsThisRepo(command) {
  const norm = (p) => path.resolve(toWindowsPath(p)).replace(/[\\/]+$/, '').toLowerCase();

  // push の位置。ここより後ろの cd は「押したあとの移動」なので見ない
  const at = command.search(/\bgit\b[^|;&]*?\bpush\b/);
  const head = at >= 0 ? command.slice(0, at) : command;

  // `git -C <path> push` は cd より優先する。移動せずに別のリポジトリを押せる書き方
  const dashC = command.match(/\bgit\s+(?:[^|;&]*?\s)?-C\s+(?:"([^"]+)"|'([^']+)'|([^\s&;|]+))[^|;&]*?\bpush\b/);
  if (dashC) {
    const dest = dashC[1] ?? dashC[2] ?? dashC[3];
    try {
      return norm(dest) === norm(ROOT);
    } catch {
      return true;
    }
  }

  const cds = [...head.matchAll(/(?:^|&&|;|\|\|)\s*cd\s+(?:"([^"]+)"|'([^']+)'|([^\s&;|]+))/g)];
  if (cds.length === 0) return true;
  const last = cds[cds.length - 1];
  const dest = last[1] ?? last[2] ?? last[3];
  try {
    return norm(dest) === norm(ROOT);
  } catch {
    return true; // 解釈できないときは従来どおり検査する。素通りさせるより安全
  }
}

/**
 * 読者に届かないファイル。ここに挙げたものだけの push なら日付を上げなくてよい。
 *
 * 判断のしかたは「Vercel のビルド出力に混ざるか」の一点。混ざるものは
 * 書いていない。src/ と messages/ と public/ は当然として、package.json と
 * tsconfig.json も外してある（依存やコンパイル設定が変われば出力も変わりうる）。
 * 迷ったら足さないこと。足さなければ従来どおり日付を確認するだけで、実害は無い。
 */
const DEV_ONLY = [
  /^scripts\//,
  /^docs\//,
  /^\.claude\//,
  /^\.github\//,
  /^\.vscode\//,
  /^scratch\//,
  /^[^/]+\.md$/, // README.md、CLAUDE.md などリポジトリ直下のメモ
  /^\.gitignore$/,
  /^\.editorconfig$/,
];

const isDevOnly = (file) => DEV_ONLY.some((re) => re.test(file));

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

/**
 * scripts/ をビルドが呼んでいないか。
 *
 * prebuild や postinstall から生成スクリプトを回すサイトでは、
 * スクリプトを変えるだけで本番の出力が変わりうる。そういうサイトでは
 * scripts/ を開発だけのファイルとは見なさない。
 * 2026-09-11 時点では3サイトとも build は `next build` だけ。
 */
function buildTouchesScripts() {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).scripts ?? {};
    return ['prebuild', 'build', 'postbuild', 'postinstall'].some((k) => /scripts[/\\]/.test(s[k] ?? ''));
  } catch {
    return true; // 読めないときは検査する側に倒す
  }
}

/**
 * 押そうとしているコミットが触っているファイルの一覧。
 *
 * 判断できないときは null を返す。呼び出し側はそのとき従来どおり日付を検査する。
 * 素通りさせるほうの間違いは気づけないので、迷ったら null にすること。
 *
 * 上流が分からない（追跡ブランチ未設定、detached HEAD）、今いるブランチと違う
 * ブランチを押そうとしている、git が失敗した、のいずれも null。
 */
function pushedFiles(command) {
  try {
    const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
    if (!branch || branch === 'HEAD') return null;

    // `git push origin foo` のように別のブランチを指定されたら、手元の HEAD とは
    // 中身が違う。差分を数える意味が無いので判断を諦める
    const tail = command.match(/\bpush\b([^|;&]*)/);
    const words = (tail?.[1] ?? '').trim().split(/\s+/).filter((w) => w && !w.startsWith('-'));
    const ref = words[1];
    if (ref) {
      const local = (ref.includes(':') ? ref.split(':')[0] : ref).replace(/^\+/, '');
      if (local !== branch) return null;
    }

    const upstream = git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
    if (!upstream) return null;

    const out = git(['diff', '--name-only', `${upstream}..HEAD`]);
    return out ? out.split('\n').map((s) => s.trim()).filter(Boolean) : [];
  } catch {
    return null;
  }
}

/** 検査結果。ok が false のときだけ push を止める */
function check(command = '') {
  const files = pushedFiles(command);

  // 読者に届くファイルだけを残す。files が null（判断できなかった）ときは
  // 選り分けずに日付を検査する
  let offenders = null;
  if (files) {
    // 押すものが無いなら、日付を問う理由も無い
    if (files.length === 0) return { ok: true, skipped: '押す差分がありません' };

    const buildRunsScripts = buildTouchesScripts();
    const reachesReaders = (f) => {
      if (!isDevOnly(f)) return true;
      // scripts/ だけは、ビルドから呼ばれているサイトでは出力を変えうる
      return buildRunsScripts && f.startsWith('scripts/');
    };
    offenders = files.filter(reachesReaders);
    if (offenders.length === 0) {
      return { ok: true, skipped: `読者に届くファイルが入っていません（${files.length}件はすべて開発用）` };
    }
  }

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

  const list = offenders
    ? '\n読者に届くファイル: ' +
      offenders.slice(0, 5).join('、') +
      (offenders.length > 5 ? ` ほか${offenders.length - 5}件` : '')
    : '';
  return {
    ok: false,
    lastUpdated,
    now,
    reason:
      `push を止めました。src/data/data_freshness.json の site.lastUpdated が "${lastUpdated}" のままです。\n` +
      `今日は ${now} です。npm run touch:updated で "${now}" に直してから push してください。` +
      list,
  };
}

// --check: 人が手で確かめるとき。結果を出して終わる
if (process.argv.includes('--check')) {
  const r = check(process.argv.slice(2).filter((a) => a !== '--check').join(' '));
  if (r.ok) console.log(r.skipped ? `OK: ${r.skipped}` : `OK: site.lastUpdated = ${r.lastUpdated}（今日）`);
  else console.log(r.reason);
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
  // `git -C <path> push` や `git --no-pager push` のように、git と push のあいだに
  // オプションが挟まる形も拾う（`\bgit\s+push\b` だけだと素通りしていた）。
  // 挟めるのはオプションだけなので、`git commit -m "push した話"` のように
  // 別のサブコマンドや本文に push という語が出るだけのものは拾わない。
  // `git push --help` のような無害なものまで止めるが、実害はない
  if (!PUSH_COMMAND.test(command)) process.exit(0);

  // 別のリポジトリへ移動してから押すコマンドは素通りさせる（例: cd ../hub-game-portal && ...）。
  // このフックは自分のリポジトリの data_freshness.json しか見ないので、行き先が違えば
  // 判断材料が無い。それでも止めると、姉妹サイトやポータルを押すたびに、
  // 無関係なこちらの日付を上げろと迫ることになる。
  // 2026-09-09 に実際に起きた（HoK のセッションからポータルを押そうとして止まった）。
  if (!targetsThisRepo(command)) process.exit(0);

  const r = check(command);
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
