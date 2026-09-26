import { Fragment } from 'react';

/**
 * 装備名の日本語に、語の切れ目でだけ折れる位置（<wbr>）を入れる。
 * 呼ぶ側で word-break: keep-all（break-keep）を付けると、ここで入れた位置でしか折れなくなる。
 *
 * 装備一覧は名前を14pxで2行まで出すが、ブラウザはカタカナの複合語の切れ目を知らないので、
 * 「トワイライ｜トストーム」「グレートブ｜レイカー」「ガーディア｜ン・救済」のように語の途中で折れていた
 * （390px幅で約15件、2026-09-26 実測）。Intl.Segmenter も「エン|ドレス|ブ|レ|ード」と切り、使えなかった。
 * そこで、装備名に出てくるカタカナ語を並べて区切る。
 *
 * 区切る位置は「・」と「の」の後ろ、それとカタカナ語の切れ目。
 * 表に無い語を含む名前は切らずにそのまま返す。そのときは今までどおり、ブラウザが任意の位置で折る。
 * 装備が増えたら、2語以上がつながったカタカナ名の語をここに足す（1語だけの名前は要らない）。
 * 7字の語（ドゥームズデイ・ジャッジメント）は、スマホの1行（6〜7字）に入らないので、
 * 語の成り立ち（Dooms｜day、Judg｜ment）で2つに分けてある。
 */
const KANA_WORDS = [
  'アゲート', 'アックス', 'アーマー', 'アロー', 'インベイド', 'ヴァンプ', 'ヴォイド', 'エッジ', 'エンチャント',
  'エンドレス', 'クロース', 'グランド', 'グリード', 'グリモア', 'グレート', 'ケープ', 'サファイア', 'サンセット',
  'サンダー', 'サンライズ', 'ジャッジ', 'シャドー', 'シャドウ', 'シールド', 'ショック', 'スタッフ', 'ストーム',
  'スノー', 'スパイク', 'スパーク', 'セイバー', 'ソード', 'ダガー', 'チェイサー', 'チェイス', 'ディープ', 'デイ',
  'ドゥームズ', 'トワイライト', 'ドラゴン', 'バイト', 'バックラー', 'パワー', 'ハンター', 'フェザー', 'フォージ',
  'ブラッド', 'ブルー', 'ブレイカー', 'ブレス', 'ブレード', 'フロスト', 'フローズン', 'ベルト', 'マスター', 'ミラー',
  'ムーンライト', 'メノウ', 'メント', 'ルーン', 'レイジ', 'レッド', 'ロアー',
];

const KANA_RUN = /[ァ-ヴー]+/g;

/** カタカナの連なりを表の語だけで埋める。埋められなければ切らない */
function splitKana(run: string): string[] {
  const best: (string[] | null)[] = Array(run.length + 1).fill(null);
  best[0] = [];
  for (let i = 0; i < run.length; i++) {
    const head = best[i];
    if (!head) continue;
    for (const w of KANA_WORDS) {
      if (!run.startsWith(w, i)) continue;
      const j = i + w.length;
      const next = best[j];
      if (!next || next.length > head.length + 1) best[j] = [...head, w];
    }
  }
  return best[run.length] ?? [run];
}

/** 名前を、間で折ってよい塊に分ける。英語名はそのまま1つで返る */
export function splitItemName(name: string): string[] {
  const chunks = name.match(/[^・の]*[・の]|[^・の]+$/g) ?? [name];
  const out: string[] = [];
  for (const chunk of chunks) {
    let buf = '';
    let last = 0;
    for (const m of chunk.matchAll(KANA_RUN)) {
      const [first, ...rest] = splitKana(m[0]);
      buf += chunk.slice(last, m.index) + first;
      for (const s of rest) {
        out.push(buf);
        buf = s;
      }
      last = m.index + m[0].length;
    }
    out.push(buf + chunk.slice(last));
  }
  return out;
}

/** 装備名。塊の間に <wbr> を置く。文字そのもの（読み上げ・検索・コピー）は変わらない */
export function ItemNameText({ name }: { name: string }) {
  const parts = splitItemName(name);
  return (
    <>
      {parts.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {s}
        </Fragment>
      ))}
    </>
  );
}
