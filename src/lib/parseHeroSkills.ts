/**
 * skills/{ja,en}.json のヒーローエントリを、HeroDetailClient が表示に使う
 * { skills, lore, strategy, meta, skins } 形式へ変換する。
 *
 * 元々 HeroDetailClient 内のクライアント fetch 後処理だったロジックを抽出したもの。
 * サーバーコンポーネント（ヒーロー詳細 page.tsx）から呼んで初期HTMLに
 * スキル解説を含めるために共有化した（AdSense/SEO 対策: 初期HTMLを空にしない）。
 */

type AnyObj = Record<string, any>;

const parseTableForSkill = (obj: AnyObj) => {
  if (obj.skill_name && !obj.name) obj.name = obj.skill_name;
  if (obj.visible_growth_table && !obj.table) {
    const vgt = obj.visible_growth_table;
    let headers = vgt.Header || vgt.header || null;
    if (!headers) {
      const firstKey = Object.keys(vgt).find((k) => Array.isArray(vgt[k]));
      if (firstKey) {
        headers = vgt[firstKey].map((_: unknown, i: number) => `LV ${i + 1}`);
      } else {
        headers = ['LV 1', 'LV 2', 'LV 3', 'LV 4', 'LV 5', 'LV 6'];
      }
    }
    const rows: AnyObj[] = [];
    for (const [k, v] of Object.entries(vgt)) {
      if (k.toLowerCase() === 'header') continue;
      if (Array.isArray(v)) rows.push({ label: k, values: v });
    }
    obj.table = { headers, rows };
  } else if (obj.visible_growth_tables && Array.isArray(obj.visible_growth_tables) && !obj.table) {
    let headers: string[] | null = null;
    const rows: AnyObj[] = [];
    for (const tableObj of obj.visible_growth_tables) {
      for (const [k, v] of Object.entries(tableObj as AnyObj)) {
        if (k.toLowerCase() === 'header' || k === '') continue;
        if (Array.isArray(v)) {
          rows.push({ label: k, values: v });
          if (!headers) headers = v.map((_: unknown, i: number) => `LV ${i + 1}`);
        }
      }
    }
    if (!headers) headers = ['LV 1', 'LV 2', 'LV 3', 'LV 4', 'LV 5', 'LV 6'];
    obj.table = { headers, rows };
  }
};

export function parseHeroSkills(rawData: AnyObj, skillKey: string, locale: string) {
  let parsedSkills: AnyObj[] = [];
  if (Array.isArray(rawData)) {
    parsedSkills = rawData;
  } else if (Array.isArray(rawData.skills)) {
    parsedSkills = rawData.skills;
  } else if (rawData.passive || rawData.skill1) {
    if (rawData.passive) parsedSkills.push({ id: 'P', ...rawData.passive });
    if (rawData.skill1) parsedSkills.push({ id: 'skill1', ...rawData.skill1 });
    if (rawData.skill2) parsedSkills.push({ id: 'skill2', ...rawData.skill2 });
    if (rawData.skill3) parsedSkills.push({ id: 'skill3', ...rawData.skill3 });
    if (rawData.skill4) parsedSkills.push({ id: 'skill4', ...rawData.skill4 });
  }

  parsedSkills.forEach((s) => {
    parseTableForSkill(s);
    if (s.forms && Array.isArray(s.forms)) {
      s.forms.forEach((form: AnyObj) => parseTableForSkill(form));
    }
  });

  // 多形態ヒーロー（スキル数が多い）のフォームグルーピング
  if (parsedSkills.length > 5 && !parsedSkills[0].forms) {
    let formCount = 1;
    let skillsPerForm = 0;
    const isMulan = skillKey === '154' && parsedSkills.length === 7;

    if (isMulan) {
      formCount = 2;
    } else if (parsedSkills.length === 10) { formCount = 2; skillsPerForm = 5; }
    else if (parsedSkills.length === 15) { formCount = 3; skillsPerForm = 5; }
    else if (parsedSkills.length === 6) { formCount = 2; skillsPerForm = 3; }
    else if (parsedSkills.length === 8) { formCount = 2; skillsPerForm = 4; }
    else if (parsedSkills.length % 5 === 0) { formCount = parsedSkills.length / 5; skillsPerForm = 5; }
    else if (parsedSkills.length % 4 === 0) { formCount = parsedSkills.length / 4; skillsPerForm = 4; }

    if (formCount > 1) {
      const groupedSkills: AnyObj[] = [];
      const formNames = formCount === 3
        ? ['Standard Form', 'Domination Form', 'Revenge Form']
        : ['Form 1', 'Form 2', 'Form 3'];

      if (skillKey === '507') {
        formNames[0] = locale === 'ja' ? '通常形態' : 'Standard Form';
        formNames[1] = locale === 'ja' ? '統御形態 (光)' : 'Domination Form (Light)';
        formNames[2] = locale === 'ja' ? '狂暴形態 (闇)' : 'Revenge Form (Dark)';
      } else if (skillKey === '154') {
        formNames[0] = locale === 'ja' ? '双剣形態' : 'Twin Swords Form';
        formNames[1] = locale === 'ja' ? '重剣形態' : 'Heavy Sword Form';
      } else if (skillKey === '502') {
        formNames[0] = locale === 'ja' ? '人形態' : 'Human Form';
        formNames[1] = locale === 'ja' ? '虎形態' : 'Tiger Form';
      }

      if (isMulan) {
        const commonPassive = parsedSkills[0];
        groupedSkills.push({
          ...commonPassive,
          forms: [
            { form_name: formNames[0], ...commonPassive },
            { form_name: formNames[1], ...commonPassive },
          ],
        });
        for (let i = 1; i <= 3; i++) {
          const baseSkill = parsedSkills[i];
          const formSkill = parsedSkills[i + 3];
          groupedSkills.push({
            ...baseSkill,
            forms: [
              { form_name: formNames[0], ...baseSkill },
              { form_name: formNames[1], ...formSkill },
            ],
          });
        }
      } else {
        for (let i = 0; i < skillsPerForm; i++) {
          const baseSkill = parsedSkills[i];
          const forms: AnyObj[] = [];
          for (let f = 0; f < formCount; f++) {
            const idx = f * skillsPerForm + i;
            if (parsedSkills[idx]) {
              forms.push({ form_name: formNames[f], ...parsedSkills[idx] });
            }
          }
          groupedSkills.push({ ...baseSkill, forms });
        }
      }
      parsedSkills = groupedSkills;
    }
  }

  // strengths / weaknesses はデータ上トップレベルにあるが、
  // 表示側（HeroDetailClient）は strategy.strengths を参照するため統合する
  let strategy: AnyObj | string = rawData.strategy || '';
  if (strategy && typeof strategy === 'object') {
    strategy = {
      ...strategy,
      strengths: (strategy as AnyObj).strengths ?? rawData.strengths ?? null,
      weaknesses: (strategy as AnyObj).weaknesses ?? rawData.weaknesses ?? null,
    };
  }

  return {
    skills: parsedSkills,
    lore: rawData.lore || '',
    strategy,
    playstyle: rawData.playstyle || null,
    meta: rawData.meta || null,
    skins: rawData.skins || [],
  };
}
