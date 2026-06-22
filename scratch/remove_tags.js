const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../public/data/skills');
const allSkillsPath = path.join(__dirname, '../public/data/all_skills.json');

// HTMLタグを除去する関数
function removeHtmlTags(text) {
  if (!text) return text;
  // <br> 系のタグを実際の改行（\n）に変換
  let plain = text.replace(/<br\s*\/?>/gi, '\n');
  // <span> などの残りのHTMLタグをすべて削除
  plain = plain.replace(/<[^>]+>/g, '');
  return plain;
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Processing ${path.basename(filePath)}...`);
  
  const rawData = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (e) {
    console.error(`Failed to parse JSON: ${filePath}`);
    return;
  }

  // チャンピオンごとのスキルをループ
  for (const champName in data) {
    const skills = data[champName];
    if (Array.isArray(skills)) {
      for (const skill of skills) {
        if (skill.description) {
          skill.description = removeHtmlTags(skill.description);
        }
      }
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 1. 各言語のJSONファイルを処理
if (fs.existsSync(skillsDir)) {
  const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    processFile(path.join(skillsDir, file));
  }
}

// 2. メインの all_skills.json も処理
if (fs.existsSync(allSkillsPath)) {
  processFile(allSkillsPath);
}

console.log('すべてのファイルからHTMLタグの除去が完了しました！');
