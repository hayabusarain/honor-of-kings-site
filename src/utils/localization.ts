import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 辞書データのキャッシュ（リクエストごとに毎回フェッチしないようにするための簡易キャッシュ）
let dictionaryCache: Record<string, any> | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5分キャッシュ

/**
 * 辞書データをSupabaseから取得し、キャッシュする
 */
export async function getDictionary() {
  const now = Date.now();
  if (dictionaryCache && now - lastFetchTime < CACHE_TTL) {
    return dictionaryCache;
  }

  try {
    const { data, error } = await supabase
      .from('localization_dictionary')
      .select('*');

    if (error) {
      console.error('Failed to fetch localization dictionary:', error);
      return {};
    }

    const dict: Record<string, any> = {};
    if (data) {
      data.forEach(row => {
        dict[row.key_id] = row;
      });
    }

    dictionaryCache = dict;
    lastFetchTime = now;
    return dict;
  } catch (err) {
    console.error('Error fetching localization dictionary:', err);
    return {};
  }
}

/**
 * テキスト内の [key_id] を探し、現在のロケールに応じたマスタデータに置換する
 * 例: "攻撃力が 10 上がる。 [item_bf_sword] を買うべし。" 
 * => "攻撃力が 10 上がる。 B.F.ソード を買うべし。"
 */
export async function parseLocalizedText(text: string, locale: string): Promise<string> {
  if (!text) return text;

  // [xxx] の形式を抽出する正規表現
  const regex = /\[([^\]]+)\]/g;
  
  // マッチするIDが存在しない場合はそのまま返す
  if (!regex.test(text)) return text;
  
  // 辞書を取得
  const dict = await getDictionary();

  // マッピング用のロケールキー (ja_JP, en_US などから ja, en に変換)
  const langKey = locale.split('_')[0]; // 'ja', 'en', 'ko', 'vi'

  // テキストの置換処理
  return text.replace(/\[([^\]]+)\]/g, (match, key_id) => {
    const entry = dict[key_id];
    if (entry) {
      // 指定された言語のテキストがあればそれを、なければフォールバックで英語を、それもなければ元の [key_id] を返す
      return entry[langKey] || entry['en'] || match;
    }
    return match; // 辞書に存在しない場合はそのまま
  });
}

/**
 * テキスト内の {variable_name} を探し、variables オブジェクトから値を引き当てて置換する
 * 例: "体力が {heal_amount} 回復する。" + { heal_amount: "50/75/100" } 
 * => "体力が 50/75/100 回復する。"
 */
export function parseVariables(text: string, variables: Record<string, string>): string {
  if (!text || !variables) return text;

  // {xxx} の形式を抽出する正規表現
  const regex = /\{([^\}]+)\}/g;
  
  if (!regex.test(text)) return text;
  
  return text.replace(/\{([^\}]+)\}/g, (match, varName) => {
    const value = variables[varName];
    // 変数が存在すればその値を、存在しなければ元の {varName} をそのまま返す
    return value !== undefined ? value : match;
  });
}

/**
 * Escapes characters for safe usage inside a regular expression
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Parses skill description text to apply HTML styling spans for specific terms.
 * This preserves the raw text but styles terms at render time.
 */
export function formatSkillDescription(text: string): string {
  if (!text) return '';

  // 1. Escape HTML characters to prevent XSS
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // 2. Define keyword mappings with Tailwind CSS styling
  const colorMappings = [
    // AD, 物理ダメージ -> Orange
    {
      words: ['AD', '物理ダメージ', '物理攻撃'],
      className: 'text-orange-500 font-bold'
    },
    // AP, 魔法ダメージ -> Purple
    {
      words: ['AP', '魔法ダメージ', '魔法攻撃'],
      className: 'text-purple-500 font-bold'
    },
    // 攻撃速度 -> Yellow
    {
      words: ['攻撃速度'],
      className: 'text-yellow-500 font-bold'
    },
    // クリティカル -> Red
    {
      words: ['クリティカル', 'クリティカル率', 'クリティカルダメージ'],
      className: 'text-red-500 font-bold'
    },
    // 状態異常 -> Pink
    {
      words: ['状態異常', 'スタン', 'スロウ', 'ノックアップ', 'バインド', 'サイレンス', '挑発', '恐怖', 'チャーム', '睡眠', '束縛'],
      className: 'text-pink-500 font-bold'
    },
    // 体力・回復 -> Green
    {
      words: ['体力', '最大体力', '現在体力', '減少体力', '回復', 'HP'],
      className: 'text-emerald-500 font-bold'
    },
    // リソース -> Blue
    {
      words: ['マナ', 'マナコスト', 'エネルギー'],
      className: 'text-sky-500 font-bold'
    },
    // 範囲・機動 -> Cyan
    {
      words: ['射程', '移動速度', '射程距離'],
      className: 'text-cyan-500 font-bold'
    }
  ];

  // 3. Perform regex replacements for all mapped words
  for (const map of colorMappings) {
    // Sort words by length descending to match longer phrases first (e.g., "物理ダメージ" before "物理")
    const sortedWords = [...map.words].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${sortedWords.map(w => escapeRegExp(w)).join('|')})`, 'g');
    escaped = escaped.replace(pattern, `<span class="${map.className}">$1</span>`);
  }

  return escaped;
}
