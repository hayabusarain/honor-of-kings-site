import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini APIのキーを設定してください
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// 翻訳タスクに適したモデルを指定（gemini-1.5-flashなど）
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Geminiを使ってテキストを翻訳する関数
async function translateWithGemini(text, targetLang) {
  if (!text) return text;
  
  const prompt = `
You are a professional game translator specializing in League of Legends: Wild Rift.
Translate the following skill description from Japanese to ${targetLang}.

RULES:
1. Preserve all HTML tags and CSS classes EXACTLY as they are (e.g., <span class="text-emerald-500 font-bold">, <br>).
2. Preserve all numerical values and math formulas EXACTLY as they are.
3. Keep the translation natural and concise.
4. Output ONLY the translated text without any markdown blocks or explanation.

Source Text:
${text}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let translated = response.text().trim();
    
    // Markdownコードブロック（```）が混入した場合に取り除く
    if (translated.startsWith('```')) {
      translated = translated.replace(/^```[a-z]*\n/g, '').replace(/\n```$/g, '');
    }
    
    return translated;
  } catch (error) {
    console.error(`Gemini Translation Error for [${targetLang}]:`, error);
    // エラー時は元のテキストを返す
    return text;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillsFilePath = path.join(__dirname, '../public/data/all_skills.json');
const outputDir = path.join(__dirname, '../public/data/skills');

const targetLocales = ['en', 'ko', 'vi', 'zh-TW'];

// APIのレートリミット対策のためのウェイト関数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.error('エラー: GEMINI_API_KEY を設定してください。');
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('読み込み中: all_skills.json');
  const rawData = fs.readFileSync(skillsFilePath, 'utf8');
  const skillsData = JSON.parse(rawData);
  
  // 元の日本語データを保存
  fs.writeFileSync(path.join(outputDir, 'ja.json'), JSON.stringify(skillsData, null, 2));

  for (const locale of targetLocales) {
    console.log(`\n============================`);
    console.log(`翻訳開始: ${locale}...`);
    console.log(`============================`);
    const translatedData = {};
    
    let champCount = 0;
    for (const [champName, skills] of Object.entries(skillsData)) {
      translatedData[champName] = [];
      
      console.log(`Translating: ${champName} -> ${locale}`);
      
      for (const skill of skills) {
        // レートリミット回避のための1秒待機
        await delay(1000);
        
        const transName = await translateWithGemini(skill.name, locale);
        
        let transDesc = skill.description;
        if (skill.description) {
          // 説明文が長い場合はさらに待機
          await delay(1000);
          transDesc = await translateWithGemini(skill.description, locale);
        }
        
        translatedData[champName].push({
          ...skill,
          name: transName,
          description: transDesc
        });
      }
      champCount++;
      console.log(`Progress: ${champCount} / ${Object.keys(skillsData).length} champions processed`);
    }

    const outputPath = path.join(outputDir, `${locale}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2));
    console.log(`保存完了: ${locale}.json`);
  }
  
  console.log('\nすべての翻訳プロセスが完了しました！');
}

main().catch(console.error);
