"use client";

import { Fragment, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ListNotes } from "@/components/ListNotes";
import Image from "next/image";
import { Zap, Clock, Search, Users } from "lucide-react";
import spellsData from "@/data/hok_spells.json";
import { SPELL_GUIDE } from "@/content/spellGuide";
import { Dropdown, type DropdownOption } from "@/components/common/Dropdown";
import { LaneIcon, RoleIcon } from "@/components/icons/GameIcons";

// サーバー側（spells/page.tsx）で skills/ja.json から作った逆引きの1件分。
// 大元の JSON をここで import するとクライアントに 1.6MB 載るため、props で受け取る
export interface SpellUser {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  image: string;
}
/** キーは hok_spells.json の japanese_name（正式名） */
export type SpellUserMap = Record<string, SpellUser[]>;

// フラッシュは70体超が該当するので、畳んだときはここまでしか出さない
const USERS_COLLAPSED_COUNT = 12;

/** 推奨ロールの図柄。hok_spells.json の値はロール6種と Jungle で、Jungle だけはレーンの図柄を使う */
function RoleMark({ role, className }: { role: string; className: string }) {
  return role.toLowerCase() === "jungle"
    ? <LaneIcon lane="JUNGLE" className={`${className} text-slate-500`} />
    : <RoleIcon role={role} className={className} />;
}

export default function SpellsClient({ spellUsers = {} }: { spellUsers?: SpellUserMap }) {
  const locale = useLocale();
  const r = useTranslations("Role");
  // hok_spells.json の recommended_roles は Fighter/Tank/… という英語のまま。
  // 日本語ページでもそのまま出ていたので、ヒーロー一覧やTier表と同じ対訳に通す。
  // Jungle だけはレーン用のキーで「ジャングル (Jungle)」と原語が付くので、括弧を落とす
  // （採用率ページの切り口名と同じ処理。messages 側の併記は Tier表のレーン名がそのまま使っている）
  const roleLabel = (role: string) => {
    const key = String(role || '').toLowerCase();
    return ['fighter', 'tank', 'mage', 'assassin', 'marksman', 'support', 'jungle'].includes(key)
      ? r(key).replace(/\s*\(.+\)$/, '')
      : role;
  };
  const isJa = locale === "ja";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  // スペルごとの「ほか○体」の開閉状態。キーは spell.id
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  const rolesList = ["All", "Fighter", "Mage", "Marksman", "Assassin", "Tank", "Support"];
  // ロールの絞り込みはプルダウン1つ。チップ7つの横並びは 390px で3.5個しか見えず、
  // 選択中の塗りもサイトで1か所だけ橙だった。
  // 候補にはヒーロー一覧と同じロールの図柄を付ける（選んだロールの図柄がボタンにも出る）
  const roleOptions: DropdownOption<string>[] = rolesList.map((role) => ({
    value: role,
    label: role === "All" ? (isJa ? "すべてのロール" : "All roles") : roleLabel(role),
    icon: role === "All" ? undefined : <RoleIcon role={role} className="h-[18px] w-[18px]" />,
  }));

  const filteredSpells = spellsData.filter((spell) => {
    const guide = SPELL_GUIDE[spell.id]?.[isJa ? "ja" : "en"];
    // 表示言語の説明文と使いどころも検索対象に入れる。
    // 英語UIで english_description を見ておらず、"slow" や "shield" で引けなかった
    const haystack = [
      spell.japanese_name,
      spell.english_name,
      spell.japanese_description,
      spell.english_description,
      guide?.when,
      guide?.detail,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const nameMatch = haystack.includes(searchQuery.toLowerCase());

    const roleMatch =
      selectedRole === "All" ||
      spell.recommended_roles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()));

    return nameMatch && roleMatch;
  });

  return (
    <div className="w-full">
      {/* 題名の帯。page-hero は夜の配色の冒頭の帯（globals.css）で、ヒーロー一覧・Tier表と揃える。
          帯は画面の幅いっぱいに敷き、中身だけを本文と同じ max-w-7xl に収める。
          左右の余白は本文・FAQ と同じく max-w-7xl の内側に置く。外側に置いていたら、
          1600px幅で8px、1920px幅で32px、題名が本文より左へずれた（1280px以下ではそろう） */}
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 pt-6 pb-5 sm:px-6 lg:px-8">
          <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Zap size={20} className="fill-current" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {isJa ? "サモナースペル一覧" : "Summoner Spells"}
            </h1>
            {/* auto-phrase は文節で折る（Chrome。ほかのページの冒頭の説明と同じ指定）。360px で「クールダ／ウン」「おすすめロ／ール」と語の途中で折れていた */}
            <p className="mt-1 text-sm font-bold text-slate-600 [word-break:auto-phrase]">
              {isJa
                ? "全サモナースペルの詳細効果・クールダウン（CD）・解放条件・おすすめロール"
                : "Complete Summoner Spells database with cooldowns and recommended roles"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      {/* 検索・ロールの絞り込み・目次 */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            {/* スマホの文字は globals.css が16pxに上げる（iPhone は16px未満の入力欄を押すと画面を拡大する） */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isJa ? "スペル名や効果で検索..." : "Search spells..."}
              aria-label={isJa ? "スペル名や効果で検索" : "Search spells"}
              className="h-11 w-full rounded-xl border border-transparent bg-slate-100 pl-10 pr-4 text-sm font-bold text-slate-800 placeholder-slate-500 outline-none transition-colors focus:border-slate-300 focus:bg-white"
            />
          </div>
          <Dropdown
            className="w-full md:w-60"
            label={isJa ? "ロールで絞り込む" : "Filter by role"}
            icon={<Users className="h-[18px] w-[18px] text-slate-500" aria-hidden="true" />}
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            defaultValue="All"
          />
        </div>

        {/* 目次。スペル1枚がスマホでほぼ1画面あり、全11種で11画面を超える。
            各カードの id（横断検索の着地点）へ1回で飛べるようにする */}
        {filteredSpells.length > 0 ? (
          <nav aria-label={isJa ? "スペルの目次" : "Spells on this page"} className="mt-3 border-t border-slate-100 pt-3">
            {/* 1マスの幅は「ターミネート」など6文字の名前が14pxで1行に入る84px以上（360px 幅でも3列）。
                4列固定だと 390px で1マス69pxになり、「ターミネ／ート」「フラッシ／ュ」と折れていた */}
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(5.25rem,1fr))] gap-1.5">
              {filteredSpells.map((spell) => (
                <li key={spell.id}>
                  <a
                    href={`#spell-${spell.id}`}
                    className="flex h-full flex-col items-center gap-1.5 rounded-xl py-1.5 text-center transition-colors hover:bg-slate-50"
                  >
                    {/* 画像の裏地。以前の墨の塗り（slate-900）は夜の配色では明るい面になるので、暗い面の slate-100 にする */}
                    <Image
                      src={spell.icon || `/images/summoners/${spell.summoner_id}.webp`}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 object-cover"
                    />
                    <span className="line-clamp-2 text-sm font-bold leading-tight text-slate-700">
                      {isJa ? spell.japanese_name : spell.english_name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <p className="mt-4 text-sm font-bold text-slate-500">
            {isJa ? "条件に合うスペルはありません。" : "No matching spells."}
          </p>
        )}
      </div>

      {/* Spells Grid。影は暗い地でほぼ見えないので、区切りは線で出す。
          列数はカード1枚18rem以上で幅から決める。md:grid-cols-2・lg:grid-cols-3 の固定だと、サイドバーの出る
          768px・1024px でカードが約220pxになり、名前の横の欄が約80px、14px の「このスペルが向いているヒーロー」（210px）が
          カードの外へはみ出した。いまは 768px で1列、1024px で2列、1280px 以上で3列（1280px 以上は以前と同じ） */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(18rem,100%),1fr))] gap-4 lg:gap-6">
        {filteredSpells.map((spell) => (
          <div
            key={spell.id}
            /* 横断検索から /spells#spell-<id> で着地する。
               scroll-mt は固定ヘッダー（AppBar 56px）ぶんの逃げ */
            id={`spell-${spell.id}`}
            className="group relative flex scroll-mt-24 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 sm:p-6"
          >
            <div>
              {/* Header Info */}
              <div className="mb-4 flex items-start gap-3 sm:gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-slate-100 transition-transform group-hover:scale-105">
                  <Image
                    src={spell.icon || `/images/summoners/${spell.summoner_id}.webp`}
                    alt={isJa ? spell.japanese_name : spell.english_name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 外部CDNへのフォールバックは廃止し、自前の画像だけで完結させる
                      const target = e.currentTarget as HTMLImageElement;
                      target.srcset = '';
                      target.src = '/images/heroes/default.webp';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  {/* 名前と CD の札が1行に入らない幅では、札を次の行へ送る。
                      札を14pxにしたら1280px幅の3列（名前と札に使える幅は約168px）で札が約90pxになり、
                      名前を truncate していたため「ダッ…」「スマ…」と切れた */}
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <h3 className="text-lg font-black text-slate-900 break-keep">
                      {isJa ? spell.japanese_name : spell.english_name}
                    </h3>
                    <span className="flex shrink-0 items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-sm font-black tabular-nums text-amber-700">
                      <Clock size={14} aria-hidden="true" />
                      {spell.cooldown}s CD
                    </span>
                  </div>
                  {/* unlock_level はアカウントレベル。試合中のヒーローレベルと取り違えられるため
                      「Lv.3」とだけ出さず、何のレベルかを書く（値には17・19があり、
                      試合中のヒーローレベルとしては成立しない） */}
                  {/* 英語名は日本語ページだけに添える。英語ページでは見出しと同じ語が2回並んでいた */}
                  {/* 項目ごとに1つの塊（inline-block）にし、入らない行では塊ごと次の行へ送る。360px では「アカウントLv17で解／放」、
                      1280px の3列では文節で折っても「アカウント／Lv1で解放」と割れていた。
                      1024px の3列は文字の欄が約100pxしかなく塊が入らないので、そのときだけ塊の中を文節で折る */}
                  <div className="mt-0.5 text-sm font-bold text-slate-500">
                    {[
                      isJa ? spell.english_name : null,
                      spell.unlock_level
                        ? isJa
                          ? `アカウントLv${spell.unlock_level}で解放`
                          : `Unlocks at account Lv.${spell.unlock_level}`
                        : null,
                    ]
                      .filter(Boolean)
                      .map((text, i) => (
                        <Fragment key={i}>
                          {i > 0 && " • "}
                          <span className="inline-block max-w-full [word-break:auto-phrase]">{text}</span>
                        </Fragment>
                      ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mb-4 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-sm font-medium leading-relaxed text-slate-600">
                {isJa ? spell.japanese_description : spell.english_description}
              </p>

              {/* 使いどころ。ゲーム内の効果文とは別に、当サイトが書いた選択の指針 */}
              {(() => {
                const guide = SPELL_GUIDE[spell.id]?.[isJa ? "ja" : "en"];
                if (!guide) return null;
                return (
                  <div className="mb-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3.5">
                    {/* 文字は透過させない（amber-700/80 にすると地の色が透けて比が落ちる） */}
                    <div className="text-sm font-black uppercase tracking-wider text-amber-700">
                      {isJa ? "使いどころ" : "When to take it"}
                    </div>
                    {/* 見出し扱いの1行なので文節で折る（auto-phrase）。360px で「ジャ／ングラー」と割れていた */}
                    <p className="mt-1 text-base font-black leading-snug text-amber-900 [word-break:auto-phrase]">
                      {guide.when}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                      {guide.detail}
                    </p>
                  </div>
                );
              })()}

              {/* このスペルが向いているヒーロー。skills データの逆引きで、詳細ページへの入口を兼ねる */}
              {(() => {
                const users = spellUsers[spell.japanese_name];
                if (!users || users.length === 0) return null;
                const expanded = !!expandedUsers[spell.id];
                const shown = expanded ? users : users.slice(0, USERS_COLLAPSED_COUNT);
                const hiddenCount = users.length - shown.length;
                // 畳める体数を超えるときだけトグルを出す。以前は「ほか○体」と「閉じる」が
                // 別々の button で、押した瞬間に押した方が消えてフォーカスが body に落ちていた
                const canToggle = users.length > USERS_COLLAPSED_COUNT;
                const chipsId = `spell-users-${spell.id}`;
                return (
                  <div className="mb-4">
                    {/* keep-all で「（2体）」の括弧の中では折らない（1280px幅で「（2／体）」と割れていた） */}
                    <div className="mb-2 text-sm font-black text-slate-500 break-keep">
                      {isJa
                        ? `このスペルが向いているヒーロー（${users.length}体）`
                        : `Heroes that take this spell (${users.length})`}
                    </div>
                    {/* 名前は14px。チップの中で折れないよう nowrap にし、入らないチップは丸ごと次の行へ送る */}
                    <div id={chipsId} className="flex flex-wrap gap-1.5">
                      {shown.map((hero) => (
                        <Link
                          key={hero.id}
                          href={`/heroes/${hero.slug}`}
                          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 transition-colors hover:border-brand-300 hover:bg-brand-50"
                        >
                          <Image
                            src={hero.image}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full bg-slate-200 object-cover"
                          />
                          <span className="whitespace-nowrap text-sm font-bold text-slate-700">
                            {isJa ? hero.name : hero.name_en}
                          </span>
                        </Link>
                      ))}
                      {canToggle && (
                        <button
                          type="button"
                          onClick={() => setExpandedUsers((prev) => ({ ...prev, [spell.id]: !expanded }))}
                          aria-expanded={expanded}
                          aria-controls={chipsId}
                          className="whitespace-nowrap rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-500 transition-colors hover:border-brand-400 hover:text-brand-700"
                        >
                          {expanded
                            ? (isJa ? "閉じる" : "Show less")
                            : (isJa ? `ほか${hiddenCount}体` : `+${hiddenCount} more`)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recommended Roles。ロールの札は金の淡い塗り（選択中の見え方と同じ）をやめ、
                中立の面にロールの図柄を添える。金の淡い塗りは「選んでいる」印に取っておく。
                札が見出しの横に入らない幅では、札の列ごと見出しの下へ回る */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-100 pt-3">
              <span className="shrink-0 whitespace-nowrap text-sm font-black text-slate-500">
                {isJa ? "推奨ロール" : "Recommended"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {spell.recommended_roles.map((role, rIdx) => (
                  <span
                    key={rIdx}
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-bold text-slate-700"
                  >
                    <RoleMark role={role} className="h-4 w-4" />
                    {roleLabel(role)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ListNotes page="spells" locale={locale} />
      </div>
    </div>
  );
}
