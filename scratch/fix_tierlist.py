import re

file_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\app\[locale]\tier-list\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add import for hero_stats
if "import heroStats from '@/data/hero_stats.json';" not in content:
    content = content.replace("import hokHeroes from '@/data/hok_heroes.json';", "import hokHeroes from '@/data/hok_heroes.json';\nimport heroStats from '@/data/hero_stats.json';")

# Replace the data loading logic
new_fetch_logic = """
        const statsData = heroStats as any[];
        
        const localizedStats = statsData.map(stat => {
          const hokMatched = (hokHeroes as any[]).find(h => h.nameEn === stat.hero_name_en);
          return {
            ...stat,
            id: hokMatched ? hokMatched.id : stat.hero_name_en, // Used for image key later if needed
            nameEn: stat.hero_name_en,
            winRate: stat.win_rate,
            hero_name: locale === 'ja' ? (hokMatched?.nameJaOfficial || hokMatched?.nameJa || stat.hero_name) : stat.hero_name
          };
        }).sort((a, b) => b.winRate - a.winRate);
"""

# Replace the old logic
content = re.sub(
    r'const statsData = hokHeroes as any\[\];[\s\S]*?\}\)\)\.sort\(\(a, b\) => b\.winRate - a\.winRate\);',
    new_fetch_logic.strip(),
    content
)

# Fix image paths in the render loop. Let's see how it renders images:
# I see `src={`/images/heroes/${hero.id}.jpg`}` or similar in tier-list page? Let's check!
# The render logic for images in tier-list: `<img src={`/images/heroes/${hero.id}.jpg`}` - wait, earlier we know hokMatched.id is the numeric ID (e.g. 166). So `hero.id` mapped above is perfect.

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated tier-list/page.tsx")
