const fs = require('fs');
const path = require('path');

const imgDir = 'C:\\Users\\81901\\Pictures\\Screenshots';
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.png'));

const BATCH_SIZE = 10;
const payloads = [];

for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const batchFiles = files.slice(i, i + BATCH_SIZE);
  const fileList = batchFiles.join(', ');
  
  const prompt = `あなたは画像認識・抽出アシスタントです。指定された複数のスクリーンショットを順番に確認し、写っているヒーローの統計データをJSON形式で抽出してください。

画像フォルダ: 'C:\\Users\\81901\\Pictures\\Screenshots'
担当ファイル群: ${fileList}

画像にはヒーローの大きな名前（例：「アーサー」）と、4つの統計数値（人気(A, T0, T1など), 勝率(XX.XX%), 出現率(XX.XX%), ban率(XX.XX%)）が書かれています。
勝率、出現率、ban率については数値（％を除いたFloat値）として出力してください。

出力フォーマット（必ず \`\`\`json と \`\`\` で囲んでください）:
{
  "アーサー": {
    "tier": "A",
    "win_rate": 50.09,
    "pick_rate": 1.42,
    "ban_rate": 0.14
  },
  "別のヒーロー名": { ... }
}
`;

  payloads.push({
    TypeName: "vision_extractor",
    Role: `Stats Extractor ${payloads.length + 1}`,
    Prompt: prompt,
    Workspace: "inherit"
  });
}

fs.writeFileSync('scratch/stats_subagents_payload.json', JSON.stringify({ Subagents: payloads }, null, 2));
console.log('Generated payload for', payloads.length, 'subagents.');
