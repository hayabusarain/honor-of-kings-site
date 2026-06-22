const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fileToBase64(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const bitmap = fs.readFileSync(filePath);
  return Buffer.from(bitmap).toString('base64');
}

async function parseSkill(id, skillId, textFile, tableFile) {
  const textBase64 = fileToBase64(textFile);
  const tableBase64 = fileToBase64(tableFile);

  if (!textBase64) return null;

  const content = [
    {
      type: "text",
      text: `画像からスキルの情報を読み取り、指定のJSON形式で出力してください。
【厳守ルール】
1. 画像のテキスト・数値をそのまま書き写すこと（PC版知識はNG）。
2. table.rows は { "label": "...", "values": ["..."] } の形式で保存すること。テーブルがない場合は table: null にすること。
3. パッシブのクールタイム等を cooldown_text に記載すること（スキルにクールダウンがある場合は記載、無ければnull）。
4. 属性やタグ（[物理]、[バフ]など）はtags配列に入れること。
5. 余計な説明なしでJSONのみ出力すること。
6. skillIdは "${skillId}" にすること。

出力フォーマット例:
{
  "id": "${skillId}",
  "name": "スキル名",
  "tags": ["自動効果", "バフ"],
  "cooldown_text": "9秒",
  "description": "スキルの説明文。<br>のように改行をタグで表現して下さい。またテキストの色などの表現は不要です（そのままプレーンテキストでOKです、画像通りに）。",
  "table": {
    "headers": ["LV 1", "LV 2", "LV 3", "LV 4"],
    "rows": [
      {
        "label": "クールダウン",
        "values": ["13", "12", "11", "10"]
      }
    ]
  }
}`
    },
    {
      type: "image_url",
      image_url: { url: `data:image/png;base64,${textBase64}` }
    }
  ];

  if (tableBase64) {
    content.push({
      type: "image_url",
      image_url: { url: `data:image/png;base64,${tableBase64}` }
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: content }
    ],
    temperature: 0,
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

async function processChampion(champNumStr) {
  const basePath = path.join(__dirname, 'screenshots');
  const skills = [];

  console.log(`Processing Champion ${champNumStr}...`);

  const skillMappings = [
    { id: "P", text: `champ_${champNumStr}_passive_text.png`, table: null },
    { id: "Q", text: `champ_${champNumStr}_skill1_text.png`, table: `champ_${champNumStr}_skill1_table.png` },
    { id: "W", text: `champ_${champNumStr}_skill2_text.png`, table: `champ_${champNumStr}_skill2_table.png` },
    { id: "E", text: `champ_${champNumStr}_skill3_text.png`, table: `champ_${champNumStr}_skill3_table.png` },
    { id: "R", text: `champ_${champNumStr}_ult_text.png`, table: `champ_${champNumStr}_ult_table.png` },
  ];

  for (const mapping of skillMappings) {
    console.log(`  Parsing skill ${mapping.id}...`);
    const textFile = path.join(basePath, mapping.text);
    const tableFile = mapping.table ? path.join(basePath, mapping.table) : null;
    
    if (fs.existsSync(textFile)) {
      const parsed = await parseSkill(champNumStr, mapping.id, textFile, tableFile);
      if (parsed) skills.push(parsed);
    } else {
      console.log(`  File missing: ${textFile}`);
    }
  }

  if (skills.length > 0) {
    const jsonPath = path.join(__dirname, `../src/data/parsed_skills/champ_${champNumStr}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({ skills }, null, 2), 'utf8');
    console.log(`Saved ${jsonPath}`);
  }
}

async function main() {
  for (let i = 57; i <= 66; i++) {
    const champNumStr = String(i).padStart(3, '0');
    await processChampion(champNumStr);
  }
  console.log("Done!");
}

main().catch(console.error);
