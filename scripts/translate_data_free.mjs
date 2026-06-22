import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsFilePath = path.join(__dirname, '../public/data/all_skills.json');
const outputDir = path.join(__dirname, '../public/data/skills');

const targetLocales = ['en', 'ko', 'vi', 'zh-TW'];

// HTMLタグを保護するためのプレースホルダー処理
function protectTags(text) {
  const tags = [];
  const protectedText = text.replace(/<[^>]+>/g, (match) => {
    tags.push(match);
    return `[TAG${tags.length - 1}]`;
  });
  return { protectedText, tags };
}

function restoreTags(text, tags) {
  return text.replace(/\[TAG(\d+)\]/g, (match, p1) => {
    return tags[p1] || match;
  });
}

async function translateText(text, targetLang) {
  if (!text) return text;
  
  // APIに渡すための言語コード
  let lang = targetLang;
  if (targetLang === 'zh-TW') lang = 'zh-TW';
  
  try {
    const { protectedText, tags } = protectTags(text);
    const res = await translate(protectedText, { to: lang, forceTo: true });
    return restoreTags(res.text, tags);
  } catch (error) {
    console.error(`Translation Error for [${targetLang}]:`, error.message);
    return text;
  }
}

// 負荷軽減用のウェイト
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('読み込み中: all_skills.json');
  const rawData = fs.readFileSync(skillsFilePath, 'utf8');
  const skillsData = JSON.parse(rawData);
  
  fs.writeFileSync(path.join(outputDir, 'ja.json'), JSON.stringify(skillsData, null, 2));

  for (const locale of targetLocales) {
    const checkPath = path.join(outputDir, `${locale}.json`);
    if (fs.existsSync(checkPath)) {
      console.log(`\nスキップ: ${locale} (既にファイルが存在します)`);
      continue;
    }

    console.log(`\n============================`);
    console.log(`翻訳開始: ${locale}...`);
    console.log(`============================`);
    const translatedData = {};
    
    let champCount = 0;
    const allChamps = Object.keys(skillsData);
    
    for (const champName of allChamps) {
      translatedData[champName] = [];
      const skills = skillsData[champName];
      
      for (const skill of skills) {
        const transName = await translateText(skill.name, locale);
        let transDesc = skill.description;
        if (skill.description) {
          transDesc = await translateText(skill.description, locale);
        }
        
        translatedData[champName].push({
          ...skill,
          name: transName,
          description: transDesc
        });
      }
      champCount++;
      if (champCount % 10 === 0 || champCount === allChamps.length) {
        console.log(`Progress: ${champCount} / ${allChamps.length} champions processed for ${locale}`);
      }
      // APIリクエスト間の小休止
      await delay(200);
    }

    const outputPath = path.join(outputDir, `${locale}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2));
    console.log(`保存完了: ${locale}.json`);
  }
  
  console.log('\nすべての翻訳プロセスが完了しました！');
}

main().catch(console.error);
