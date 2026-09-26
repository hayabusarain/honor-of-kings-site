/**
 * アルカナの効果文（「物理攻撃 +2.5, 物理ライフスティール +0.5%」）を、効果ごとに区切って出す。
 * アルカナ一覧・ロール別構成・計算機の3か所で使う。サーバー部品からもクライアント部品からも使える。
 *
 * 文字を14pxに上げたら（2026-09-26、夜の配色）、効果文をそのまま流す組み方では
 * 「クリティカ／ル率」「物理ライフスティ／ール」のように効果名の途中で折れた。
 * 区切りを「効果と効果の間」と「効果名と数値の間」だけにする（word-break: keep-all）。
 * 効果名の最長は「物理ライフスティール」（14px の太字で約140px）、英語は「Physical Lifesteal」。
 * 掲載30種・日英60本の効果文はすべて「, 」区切りで、各断片は「効果名 +数値」の形になっている（全件で確認）。
 */

type Effect = { label: string; value: string };

/** HTML の断片を落として、効果ごとに「効果名」と「+数値」に分ける。数値が読めない断片は名前だけにする */
export function splitEffects(stats: string): Effect[] {
  const text = String(stats || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  return text
    .split(/,\s*/)
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const m = part.match(/^(.*?)\s*([+\-−]\s*[\d.]+%?)$/);
      return m ? { label: m[1], value: m[2] } : { label: part, value: '' };
    });
}

type Props = {
  stats: string;
  /**
   * lines … 1効果1行。名前は左、数値は右端に寄せる（一覧のカード。見比べるのは数値なので列を揃える）
   * inline … 効果を横に流し、効果の間でだけ折り返す（計算機の行。30行並ぶので高さを抑える）
   */
  layout?: 'lines' | 'inline';
  className?: string;
};

export function ArcanaEffects({ stats, layout = 'lines', className = '' }: Props) {
  const effects = splitEffects(stats);

  if (layout === 'inline') {
    return (
      <p className={`text-sm font-bold leading-snug text-slate-600 ${className}`}>
        {effects.map((e, i) => (
          <span key={i}>
            {/* 1効果を1つの塊にする。入らない行では塊ごと次の行へ送り、塊が行より長いときだけ名前と数値の間で折る */}
            <span className="inline-block max-w-full break-keep">
              {e.label}
              {e.value && <>{' '}<span className="tabular-nums text-slate-800">{e.value}</span></>}
              {i < effects.length - 1 && ','}
            </span>
            {i < effects.length - 1 && ' '}
          </span>
        ))}
      </p>
    );
  }

  return (
    <ul className={`space-y-0.5 text-sm font-bold leading-snug ${className}`}>
      {effects.map((e, i) => (
        // 名前と数値が1行に入らない幅では、数値だけを次の行の右端へ送る（名前の途中では折らない）
        <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-2 break-keep">
          <span className="text-slate-600">{e.label}</span>
          {e.value && <span className="ml-auto font-black tabular-nums text-slate-900">{e.value}</span>}
        </li>
      ))}
    </ul>
  );
}
