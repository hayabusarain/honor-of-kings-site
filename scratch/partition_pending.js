const fs = require('fs');
const path = require('path');

const pendingPath = path.join(__dirname, 'pending_ocr.json');
if (!fs.existsSync(pendingPath)) {
  console.error('pending_ocr.json not found. Run determine_pending_ocr.js first.');
  process.exit(1);
}

const pending = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
console.log(`Loaded ${pending.length} pending images.`);

const numGroups = 6;
const groups = Array.from({ length: numGroups }, () => []);

pending.forEach((item, index) => {
  groups[index % numGroups].push(item.image);
});

const subagents = [];

groups.forEach((group, index) => {
  if (group.length === 0) return;
  
  const prompt = `【お願い】
カレントディレクトリ: c:\\Users\\81901\\Desktop\\ワイリフサイト
下記のアイテム画像（スクリーンショット）を、\`view_file\` ツールを呼び出して1枚ずつ読み取り、表示されている「アイテム名」「ゴールド価格」「ステータス」「パッシブ・発動効果説明文」を日本語で文字起こししてください。

【厳守ルール】
1. PC版LoLの情報を絶対に含めないでください。画像に表示されているテキストだけを抽出してください。
2. 「ゴールド価格」（数値のみ）、「アイテム名」（日本語）、「ステータス」（配列）、「パッシブ・発動効果説明文」（配列）を抽出してください。
3. 抽出結果は、それぞれの画像名に対応するJSONファイルとして \`scratch/extracted_items/<画像名>.json\` に保存してください。
   例: \`public/images/items/raw/スクリーンショット (81).png\` は \`scratch/extracted_items/スクリーンショット (81).json\` に保存。
   ファイルが既に存在する場合は、\`gold\` フィールドを追加・修正して上書き（またはマージ）してください。

【保存JSONの形式】
\`\`\`json
{
  "item_name": "アイテム名",
  "gold": 3000,
  "stats": [
    "+40 攻撃力",
    "+20% クリティカル率"
  ],
  "passives": [
    {
      "name": "パッシブ名",
      "description": "効果説明文..."
    }
  ]
}
\`\`\`

【あなたが担当する画像リスト（計 ${group.length} 枚）】
${group.map((img, i) => `${i + 1}. public/images/items/raw/${img}`).join('\n')}
`;

  subagents.push({
    TypeName: 'self',
    Role: `OCR Item Processor Group ${index + 1}`,
    Prompt: prompt,
    Workspace: 'inherit'
  });
});

fs.writeFileSync(path.join(__dirname, 'subagent_invocations.json'), JSON.stringify({ Subagents: subagents }, null, 2), 'utf8');
console.log('Successfully generated subagent invocations JSON in scratch/subagent_invocations.json');
