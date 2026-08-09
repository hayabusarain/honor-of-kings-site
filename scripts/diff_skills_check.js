/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const _path = require('path');

function checkSkillsDiff() {
  console.log('Comparing current website skills data with newly extracted screenshot dataset...');

  const siteSkillsPath = 'public/data/skills/en.json';
  const rawOcrPath = 'scripts/data/raw_ocr_skills.json';
  const heroesPath = 'src/data/hok_heroes.json';

  const siteSkills = JSON.parse(fs.readFileSync(siteSkillsPath, 'utf8'));
  const rawOcr = JSON.parse(fs.readFileSync(rawOcrPath, 'utf8'));
  const heroes = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));

  const heroMapById = {};
  heroes.forEach(h => {
    heroMapById[h.id] = h;
  });

  const diffReport = {
    totalSiteHeroes: Object.keys(siteSkills).length,
    totalScreenshotGroups: Object.keys(rawOcr).length,
    heroDifferences: [],
    multiFormHeroes: []
  };

  // Analyze screenshot packages vs site heroes
  Object.keys(rawOcr).forEach(pkgKey => {
    const pkg = rawOcr[pkgKey];
    const group_id = pkg.group_id;
    const file_count = pkg.total_screenshots;

    if (file_count >= 8) {
      diffReport.multiFormHeroes.push({
        group_id,
        file_count,
        files: pkg.files
      });
    }
  });

  // Sample hero comparison (comparing first 10 heroes in siteSkills)
  const sampleHeroIds = Object.keys(siteSkills).slice(0, 15);
  sampleHeroIds.forEach(id => {
    const siteHero = siteSkills[id];
    const masterHero = heroMapById[id];
    const heroName = masterHero ? masterHero.name_en : `Hero ${id}`;

    diffReport.heroDifferences.push({
      hero_id: id,
      name: heroName,
      skillCount: siteHero.skills ? siteHero.skills.length : 0,
      skills: siteHero.skills ? siteHero.skills.map(s => ({
        type: s.type || s.skill_type,
        name: s.name,
        cooldown: s.cooldown || s.cd,
        cost: s.cost || s.mana_cost
      })) : []
    });
  });

  fs.mkdirSync('scratch', { recursive: true });
  const reportPath = 'scratch/skills_diff_report.json';
  fs.writeFileSync(reportPath, JSON.stringify(diffReport, null, 2), 'utf8');

  console.log(`✁ESkills Diff Report created in ${reportPath}`);
}

checkSkillsDiff();
