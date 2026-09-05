import itemsData from '@/data/hok_items.json';
import { ItemsClient, type Item } from './ItemsClient';

/**
 * 装備一覧。表示と操作は ItemsClient（'use client'）が持ち、
 * データを読むのはこのサーバー部品の仕事にしてある。
 *
 * 以前は page.tsx 自体が 'use client' で hok_items.json（105KB）を import していた。
 * クライアント部品が import した JSON はクライアントの共有チャンクに入るため、
 * この装備ページを開いていない訪問者にも配られていた。2026-09-05 の実測では
 * ヒーロー詳細232ページ・トップ・初心者向け・アルカナ・パッチ・スペルの6ページが、
 * 一度も参照しないこの105KB（brotli後 13.6KB）を積んでいた。
 *
 * データ自体は絞れない。検索はパッシブと発動効果まで見るし、
 * 「全アイテムの効果一覧」は 13,000 字を超える全文を初期HTMLに出している。
 * だから中身を削るのではなく、置き場所をサーバーへ移して配布先を1ページに閉じた。
 *
 * metadata は layout.tsx にある（このルートは以前 'use client' だった名残）。
 * OGP画像も layout.tsx の generateMetadata を見ているので、ここは触らなくてよい。
 */
export default function ItemsPage() {
  return <ItemsClient items={itemsData as unknown as Item[]} />;
}
