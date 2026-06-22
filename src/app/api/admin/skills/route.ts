import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const SKILLS_DIR = path.join(process.cwd(), 'public', 'data', 'skills');

export async function GET() {
  try {
    const jaPath = path.join(SKILLS_DIR, 'ja.json');
    if (!fs.existsSync(jaPath)) {
      return NextResponse.json({ error: 'Japanese skill data not found' }, { status: 404 });
    }
    const data = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// HTMLタグを保護するためのプレースホルダー処理
function protectTags(text: string) {
  const tags: string[] = [];
  const protectedText = text.replace(/<[^>]+>/g, (match) => {
    tags.push(match);
    return `[TAG${tags.length - 1}]`;
  });
  return { protectedText, tags };
}

function restoreTags(text: string, tags: string[]) {
  return text.replace(/\[TAG(\d+)\]/g, (match, p1) => {
    return tags[parseInt(p1)] || match;
  });
}

async function translateText(text: string, targetLang: string) {
  if (!text) return text;
  
  // APIに渡すための言語コード
  let lang = targetLang;
  if (targetLang === 'zh-TW') lang = 'zh-TW';
  
  try {
    const { protectedText, tags } = protectTags(text);
    const res = await translate(protectedText, { to: lang, forceTo: true });
    return restoreTags(res.text, tags);
  } catch (error: any) {
    console.error(`Translation Error for [${targetLang}]:`, error.message);
    return text;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, heroId, updatedSkills } = body;

    // 開発環境（ローカル）の場合はパスワードチェックをスキップする
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: '認証に失敗しました。パスワードが間違っています。' }, { status: 401 });
    }

    if (!heroId || !updatedSkills || !Array.isArray(updatedSkills)) {
      return NextResponse.json({ error: '不正なデータ形式です。' }, { status: 400 });
    }

    // 1. 日本語のJSONを上書き
    const jaPath = path.join(SKILLS_DIR, 'ja.json');
    let jaData: Record<string, any[]> = {};
    if (fs.existsSync(jaPath)) {
      jaData = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));
    }
    
    // 日本語データを更新
    jaData[heroId] = updatedSkills;
    fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2));

    // 大元の all_skills.json も更新する（先祖返り防止）
    const allSkillsPath = path.join(process.cwd(), 'public', 'data', 'all_skills.json');
    if (fs.existsSync(allSkillsPath)) {
      const allSkillsData = JSON.parse(fs.readFileSync(allSkillsPath, 'utf-8'));
      allSkillsData[heroId] = updatedSkills;
      fs.writeFileSync(allSkillsPath, JSON.stringify(allSkillsData, null, 2));
    }

    // 2. 他言語へ自動翻訳して保存
    const targetLocales = ['en', 'ko', 'vi', 'zh-TW'];
    
    // 並列処理だと翻訳APIのレート制限に引っかかる可能性があるため、言語ごとに直列で処理
    for (const locale of targetLocales) {
      const localePath = path.join(SKILLS_DIR, `${locale}.json`);
      let localeData: Record<string, any[]> = {};
      
      if (fs.existsSync(localePath)) {
        localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
      }

      // 日本語のデータ構造をディープコピーしてベースにする（画像やテーブルなどを引き継ぐため）
      const translatedSkills = JSON.parse(JSON.stringify(updatedSkills));

      for (let i = 0; i < translatedSkills.length; i++) {
        const skill = translatedSkills[i];
        
        // 名前を翻訳
        if (skill.name) {
          skill.name = await translateText(skill.name, locale);
        }
        
        // 説明文を翻訳
        if (skill.description) {
          skill.description = await translateText(skill.description, locale);
        }
      }

      // 翻訳結果を対象言語のデータに上書き
      localeData[heroId] = translatedSkills;
      fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2));
    }

    return NextResponse.json({ success: true, message: '日本語を保存し、全言語への自動翻訳・反映が完了しました。' });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
