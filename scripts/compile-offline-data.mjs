import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function extractBrackets(content, regex, openChar, closeChar) {
  const match = content.match(regex);
  if (!match) return null;
  
  const startIndex = content.indexOf(openChar, match.index + match[0].length - 1);
  if (startIndex === -1) return null;
  
  let count = 1;
  let i = startIndex + 1;
  let inString = null;
  
  while (i < content.length && count > 0) {
    const char = content[i];
    if (inString) {
      if (char === inString && content[i - 1] !== '\\') {
        inString = null;
      }
    } else if (char === '"' || char === "'" || char === '`') {
      inString = char;
    } else {
      if (char === openChar) {
        count++;
      } else if (char === closeChar) {
        count--;
      }
    }
    i++;
  }
  
  if (count === 0) {
    return content.substring(startIndex, i);
  }
  return null;
}

async function main() {
  const scriptsDir = path.join(rootDir, 'scripts');
  const files = fs.readdirSync(scriptsDir);
  
  const allPatches = [];
  const allMeta = [];
  const championStats = [];

  for (const file of files) {
    if (file.startsWith('insert-') && file.endsWith('.mjs')) {
      const filePath = path.join(scriptsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract version
      const versionMatch = content.match(/const\s+version\s*=\s*["']([^"']+)["']/);
      const version = versionMatch ? versionMatch[1] : '';
      
      // Extract patches array
      // Can be named patches, patchNotes, or changes
      let arrayStr = extractBrackets(content, /const\s+(patches|patchNotes|changes)\s*=\s*\[/, '[', ']');
      
      if (arrayStr) {
        try {
          const fn = new Function('version', `return ${arrayStr}`);
          const patches = fn(version);
          if (Array.isArray(patches)) {
            patches.forEach((p, idx) => {
              if (!p.id) {
                p.id = `${p.version || version}-${p.champion_name_en}-${idx}`;
              }
              if (!p.version && version) {
                p.version = version;
              }
              allPatches.push(p);
            });
          }
        } catch (e) {
          console.error(`Failed to parse patches in ${file}:`, e.message);
        }
      }
      
      // Extract meta object or array
      // Can be named meta, metaPrediction, newMeta, or patchMetas
      let metaStr = extractBrackets(content, /const\s+(metaPrediction|meta|newMeta)\s*=\s*\{/, '{', '}');
      if (metaStr) {
        try {
          const fn = new Function('version', `return ${metaStr}`);
          const meta = fn(version);
          if (meta && meta.version) {
            allMeta.push(meta);
          }
        } catch (e) {
          console.error(`Failed to parse meta in ${file}:`, e.message);
        }
      }
      
      let patchMetasStr = extractBrackets(content, /const\s+patchMetas\s*=\s*\[/, '[', ']');
      if (patchMetasStr) {
        try {
          const fn = new Function('version', `return ${patchMetasStr}`);
          const metas = fn(version);
          if (Array.isArray(metas)) {
            metas.forEach(m => {
              if (m && m.version) {
                allMeta.push(m);
              }
            });
          }
        } catch (e) {
          console.error(`Failed to parse patchMetas in ${file}:`, e.message);
        }
      }
    }
  }

  // Read tier lists to compile champion stats
  const tierFiles = files.filter(f => f.startsWith('insert-tier-list') && f.endsWith('.mjs'));
  for (const file of tierFiles) {
    const filePath = path.join(scriptsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract role
    const roleMatch = content.match(/const\s+role\s*=\s*["']([^"']+)["']/);
    const role = roleMatch ? roleMatch[1] : 'ADC';
    
    // We can extract rawData or list using our bracket logic!
    let dataStr = extractBrackets(content, /const\s+(rawData|list)\s*=\s*\[/, '[', ']');
    
    // Fallback: if it's a string literal like const rawData = `...`
    if (!dataStr) {
      const match = content.match(/const\s+rawData\s*=\s*`([\s\S]*?)`/);
      if (match) {
        const linesStr = match[1];
        const lines = linesStr.trim().split('\n');
        
        // Extract map
        const mapStr = extractBrackets(content, /const\s+CHAMPION_MAP\s*=\s*\{/, '{', '}');
        let championMap = {};
        if (mapStr) {
          try {
            championMap = new Function(`return ${mapStr}`)();
          } catch (e) {
            console.error(`Failed to parse CHAMPION_MAP in ${file}:`, e.message);
          }
        }
        
        const calculateTier = (winRate, pickRate, banRate) => {
          const score = (winRate * 0.6) + (pickRate * 0.3) + (banRate * 0.1);
          if (winRate > 51.5 && score > 35) return 'S';
          if (winRate > 50.5 && score > 32) return 'A';
          if (winRate >= 49.5 && score > 30) return 'B';
          return 'C';
        };

        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length < 5) continue;
          const cnName = parts[1];
          const winRate = parseFloat(parts[2].replace('%', ''));
          const pickRate = parseFloat(parts[3].replace('%', ''));
          const banRate = parseFloat(parts[4].replace('%', ''));
          const mapped = championMap[cnName];
          if (mapped) {
            const tier = calculateTier(winRate, pickRate, banRate);
            championStats.push({
              id: `${mapped.en}-${role}`,
              champion_name: mapped.jp,
              champion_name_en: mapped.en,
              win_rate: winRate,
              pick_rate: pickRate,
              ban_rate: banRate,
              tier: tier,
              role: role,
              created_at: new Date().toISOString()
            });
          }
        }
      }
    } else {
      // It is an array of objects (like insert-tier-list.mjs)
      try {
        const fn = new Function(`return ${dataStr}`);
        const data = fn();
        if (Array.isArray(data)) {
          const calculateTier = (winRate, pickRate, banRate) => {
            const score = winRate + (pickRate * 0.1) + (banRate * 0.1);
            if (score >= 53.0) return 'S';
            if (score >= 51.5) return 'A';
            if (score >= 49.5) return 'B';
            return 'C';
          };
          
          data.forEach(c => {
            const tier = calculateTier(c.win, c.pick, c.ban);
            championStats.push({
              id: `${c.en}-TOP`,
              champion_name: c.jp,
              champion_name_en: c.en,
              win_rate: c.win,
              pick_rate: c.pick,
              ban_rate: c.ban,
              tier: tier,
              role: 'TOP',
              created_at: new Date().toISOString()
            });
          });
        }
      } catch (e) {
        console.error(`Failed to parse tier array in ${file}:`, e.message);
      }
    }
  }

  // Ensure directories exist
  const dataDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write outputs
  fs.writeFileSync(path.join(dataDir, 'patches.json'), JSON.stringify(allPatches, null, 2));
  fs.writeFileSync(path.join(dataDir, 'patch_meta.json'), JSON.stringify(allMeta, null, 2));
  fs.writeFileSync(path.join(dataDir, 'champion_stats.json'), JSON.stringify(championStats, null, 2));
  
  console.log(`Successfully compiled:
  - ${allPatches.length} patches
  - ${allMeta.length} patch metas
  - ${championStats.length} champion stats`);
}

main().catch(console.error);
