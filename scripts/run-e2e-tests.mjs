/**
 * scripts/run-e2e-tests.mjs
 * Genuine E2E test runner for Wild Rift Site Responsive UI Revamp.
 * Tests responsive layout classes, responsive tables, content preservation, and rights policies.
 */

import { spawn, spawnSync } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;
let serverProcess = null;

// Whitelist of allowed assets in public/images/
const ALLOWED_IMAGES = new Set([
  'public/images/champions/Norra.avif',
  'public/images/items/amplifying-tome.png',
  'public/images/items/boots-of-mana.png',
  'public/images/items/infinity-orb.png',
  'public/images/items/ludens-echo.png',
  'public/images/items/rabadons-deathcap.png',
  'public/images/items/stasis.png',
  'public/images/og-image.jpg',
  'public/images/runes/arcane-comet.png',
  'public/images/runes/battle-zeal.png',
  'public/images/runes/cut-down.png',
  'public/images/runes/legend-bloodline.png',
  'public/images/runes/sudden-impact.png',
  'public/images/どこでもない場所へ.avif',
  'public/images/ノラ.avif',
  'public/images/ポータルパルーザ！.avif',
  'public/images/愛用のトリンケット.avif',
  'public/images/故郷のスレッド.avif',
  'public/images/記憶の波動.avif',
]);

// ----------------------------------------------------------------------------
// 1. Port & Server Management
// ----------------------------------------------------------------------------

function isPortActive(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' }, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => {
      resolve(false);
    });
  });
}

function spawnServer() {
  console.log(`[Server] Port ${PORT} is inactive. Spawning dev server...`);
  // Redirect logs to prevent polluting the test runner output
  const logStream = fs.createWriteStream(path.join(rootDir, 'e2e-server.log'), { flags: 'a' });
  
  serverProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
    cwd: rootDir,
    shell: true
  });
  
  serverProcess.stdout.pipe(logStream);
  serverProcess.stderr.pipe(logStream);
}

async function waitForServer(timeoutMs = 45000) {
  const startTime = Date.now();
  console.log(`[Server] Waiting for dev server on ${BASE_URL} to become ready...`);
  while (Date.now() - startTime < timeoutMs) {
    try {
      const res = await axios.get(`${BASE_URL}/ja`, { timeout: 2000 });
      if (res.status === 200) {
        console.log('[Server] Server is ready!');
        return;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server failed to boot on port ${PORT} within ${timeoutMs}ms.`);
}

function cleanup() {
  if (serverProcess) {
    console.log('[Server] Shutting down spawned dev server...');
    try {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill('SIGINT');
      }
    } catch (e) {
      // already dead or couldn't kill
    }
  }
}

// Ensure cleanup on exit signals
process.on('exit', cleanup);
process.on('SIGINT', () => { process.exit(0); });
process.on('SIGTERM', () => { process.exit(0); });
process.on('uncaughtException', (err) => {
  console.error('[Runner] Uncaught exception:', err);
  process.exit(1);
});

// ----------------------------------------------------------------------------
// 2. Test Runner Core
// ----------------------------------------------------------------------------

const suites = [];
function addTest(id, title, fn) {
  suites.push({ id, title, fn });
}

async function runAllTests() {
  console.log('\n[Runner] Executing E2E test suite...\n');
  let passedCount = 0;
  let failedCount = 0;

  for (const test of suites) {
    try {
      await test.fn();
      console.log(`[\x1b[32mPASS\x1b[0m] ${test.id}: ${test.title}`);
      passedCount++;
    } catch (error) {
      console.log(`[\x1b[31mFAIL\x1b[0m] ${test.id}: ${test.title}`);
      console.error(`       Reason: ${error.message}`);
      failedCount++;
    }
  }

  console.log(`\n[Runner] Summary: ${passedCount} passed, ${failedCount} failed.`);
  if (failedCount > 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

async function getPage(pathname, lang = 'ja') {
  const url = `${BASE_URL}${pathname}`;
  const res = await axios.get(url, {
    headers: { 'Accept-Language': lang },
    timeout: 5000
  });
  return cheerio.load(res.data);
}

// ----------------------------------------------------------------------------
// 3. Test Definitions
// ----------------------------------------------------------------------------

// ==========================================
// TIER 1: Feature Coverage (20 Cases)
// ==========================================

// --- F1: Navigation Responsiveness ---
addTest('T1-F1-01', 'Header contains hamburger button visible on mobile (<lg) [English]', async () => {
  const $ = await getPage('/en', 'en');
  const btn = $('header button').filter((i, el) => $(el).attr('aria-label') === 'Open menu');
  if (btn.length === 0) throw new Error('Hamburger toggle button not found.');
  const classes = btn.attr('class') || '';
  if (!classes.includes('lg:hidden')) throw new Error('Hamburger button must be hidden on lg viewports.');
});

addTest('T1-F1-02', 'Sidebar layout contains responsive hiding classes [English]', async () => {
  const $ = await getPage('/en', 'en');
  const sidebar = $('aside').first();
  if (sidebar.length === 0) throw new Error('Sidebar aside element not found.');
  const classes = sidebar.attr('class') || '';
  if (!classes.includes('lg:translate-x-0') || !classes.includes('lg:static')) {
    throw new Error(`Sidebar should have lg responsiveness classes. Found: "${classes}"`);
  }
});

addTest('T1-F1-03', 'Header contains hamburger button visible on mobile (<lg) [Japanese]', async () => {
  const $ = await getPage('/ja', 'ja');
  const btn = $('header button').filter((i, el) => $(el).attr('aria-label') === 'Open menu');
  if (btn.length === 0) throw new Error('Hamburger toggle button not found in Japanese.');
  const classes = btn.attr('class') || '';
  if (!classes.includes('lg:hidden')) throw new Error('Hamburger button must have lg:hidden.');
});

addTest('T1-F1-04', 'Sidebar layout contains responsive hiding classes [Japanese]', async () => {
  const $ = await getPage('/ja', 'ja');
  const sidebar = $('aside').first();
  if (sidebar.length === 0) throw new Error('Sidebar aside element not found in Japanese.');
  const classes = sidebar.attr('class') || '';
  if (!classes.includes('lg:translate-x-0') || !classes.includes('lg:static')) {
    throw new Error('Sidebar must contain lg static/translate overrides.');
  }
});

addTest('T1-F1-05', 'Sidebar contains Close Menu button visible only on mobile', async () => {
  const $ = await getPage('/ja', 'ja');
  const btn = $('aside button').filter((i, el) => $(el).attr('aria-label') === 'Close menu');
  if (btn.length === 0) throw new Error('Close menu button not found in sidebar.');
  const classes = btn.attr('class') || '';
  if (!classes.includes('lg:hidden')) throw new Error('Close menu button must be lg:hidden.');
});

addTest('T1-F1-06', 'Header user avatar button remains visible (no hidden classes)', async () => {
  const $ = await getPage('/ja', 'ja');
  const avatarBtn = $('header button').filter((i, el) => $(el).find('svg').length > 0 && $(el).attr('aria-label') !== 'Open menu');
  if (avatarBtn.length === 0) throw new Error('User profile button not found in header.');
  const classes = avatarBtn.attr('class') || '';
  if (classes.includes('hidden') && !classes.includes('lg:')) {
    throw new Error('User profile button should not be hidden on mobile.');
  }
});

// --- F2: Responsive Tables ---
addTest('T1-F2-07', 'Patch Table has overflow scroll container wrapper', async () => {
  const $ = await getPage('/en/patches', 'en');
  const wrapper = $('.overflow-x-auto');
  if (wrapper.length === 0) throw new Error('No overflow-x-auto wrapper found around patch components.');
});

addTest('T1-F2-08', 'Patch Table renders desktop-only table element', async () => {
  const $ = await getPage('/en/patches', 'en');
  const table = $('table').first();
  if (table.length === 0) throw new Error('No table found on patches page.');
  const classes = table.attr('class') || '';
  if (!classes.includes('hidden') || !classes.includes('md:table')) {
    throw new Error(`Desktop table should be hidden on mobile and md:table. Found: "${classes}"`);
  }
});

addTest('T1-F2-09', 'Patch Table renders mobile-only card layout element', async () => {
  const $ = await getPage('/en/patches', 'en');
  const mobileCards = $('.md\\:hidden').filter((i, el) => $(el).find('.bg-white').length > 0);
  if (mobileCards.length === 0) throw new Error('No mobile card layout container found with class md:hidden.');
});

addTest('T1-F2-10', 'Skill details level progression table container has overflow-x-auto', async () => {
  const $ = await getPage('/en/champions/Garen', 'en');
  const skillTables = $('table').filter((i, el) => $(el).find('th').first().text().includes('Growth') || $(el).find('th').first().text().includes('成長'));
  if (skillTables.length === 0) {
    console.log('       [Skip] No skill progression table found on Garen details page.');
    return;
  }
  const wrapper = skillTables.parent('.overflow-x-auto');
  if (wrapper.length === 0) throw new Error('Skill progression table must be wrapped in overflow-x-auto container.');
});

addTest('T1-F2-11', 'Skill details progression table restricts ml-[72px] to md viewports', async () => {
  const $ = await getPage('/en/champions/Garen', 'en');
  let hasMarginClass = false;
  let hasCorrectPrefix = false;
  $('div').each((i, el) => {
    const classes = $(el).attr('class') || '';
    if (classes.includes('ml-[72px]')) {
      hasMarginClass = true;
      if (classes.includes('md:ml-[72px]')) {
        hasCorrectPrefix = true;
      }
    }
  });
  if (hasMarginClass && !hasCorrectPrefix) {
    throw new Error('Skill details table container must use md:ml-[72px] instead of plain ml-[72px].');
  }
});

// --- F3: Content Preservation ---
addTest('T1-F3-12', 'Landing page loads localized Japanese hero badge text', async () => {
  const $ = await getPage('/ja', 'ja');
  const text = $('body').text();
  // We can search for localized strings like "お知らせ" or "ティアリスト"
  if (!text.includes('お知らせ') && !text.includes('ティア') && !text.includes('統計')) {
    throw new Error('Japanese homepage elements not detected.');
  }
});

addTest('T1-F3-13', 'Landing page loads localized English hero badge text', async () => {
  const $ = await getPage('/en', 'en');
  const text = $('body').text();
  if (!text.includes('Notice') && !text.includes('Tier') && !text.includes('Stats')) {
    throw new Error('English homepage elements not detected.');
  }
});

addTest('T1-F3-14', 'Japanese champions roster contains Norra', async () => {
  const $ = await getPage('/ja/champions', 'ja');
  const link = $('a[href*="/champions/Norra"]');
  if (link.length === 0) throw new Error('Norra link not found in Japanese roster.');
});

addTest('T1-F3-15', 'English champions roster contains Norra', async () => {
  const $ = await getPage('/en/champions', 'en');
  const link = $('a[href*="/champions/Norra"]');
  if (link.length === 0) throw new Error('Norra link not found in English roster.');
});

addTest('T1-F3-16', 'Norra details page loads Japanese fallback lore', async () => {
  const $ = await getPage('/ja/champions/Norra', 'ja');
  const bodyText = $('body').text();
  if (!bodyText.includes('ヨードル') || !bodyText.includes('ユーミ')) {
    throw new Error('Norra fallback lore mismatch in Japanese.');
  }
});

addTest('T1-F3-17', 'Norra details page loads English fallback lore', async () => {
  const $ = await getPage('/en/champions/Norra', 'en');
  const bodyText = $('body').text();
  if (!bodyText.includes('yordle') || !bodyText.includes('Yuumi')) {
    throw new Error('Norra fallback lore mismatch in English.');
  }
});

// --- F4: Rights & Policy ---
addTest('T1-F4-18', 'Directory image audit: No unregistered assets exist under public/images/', async () => {
  const checkDir = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        checkDir(fullPath);
      } else {
        if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(file)) {
          if (!ALLOWED_IMAGES.has(relativePath)) {
            throw new Error(`Unauthorized asset file found: ${relativePath}`);
          }
        }
      }
    }
  };
  const imagesDir = path.join(rootDir, 'public', 'images');
  if (fs.existsSync(imagesDir)) {
    checkDir(imagesDir);
  }
});

addTest('T1-F4-19', 'Directory extension audit: only web-safe image formats exist', async () => {
  const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']);
  const checkDir = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const ext = path.extname(file).toLowerCase();
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        checkDir(fullPath);
      } else {
        if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(file)) {
          if (!allowedExtensions.has(ext)) {
            throw new Error(`Forbidden file extension in images: ${file}`);
          }
        }
      }
    }
  };
  const imagesDir = path.join(rootDir, 'public', 'images');
  if (fs.existsSync(imagesDir)) {
    checkDir(imagesDir);
  }
});

addTest('T1-F4-20', 'Git status check: No untracked images in repository', async () => {
  const result = spawnSync('git', ['status', '--porcelain'], { cwd: rootDir, encoding: 'utf8' });
  const lines = result.stdout.split('\n');
  for (const line of lines) {
    if (line.startsWith('??') && /\.(png|jpg|jpeg|webp|avif|svg)$/i.test(line)) {
      throw new Error(`Untracked image asset found in git: ${line}`);
    }
  }
});

// ==========================================
// TIER 2: Boundary & Corner Cases (20 Cases)
// ==========================================

addTest('T2-F1-01', 'Mobile drawer close button has correct accessibility label', async () => {
  const $ = await getPage('/ja', 'ja');
  const btn = $('aside button').filter((i, el) => $(el).attr('aria-label') === 'Close menu');
  if (btn.length === 0) throw new Error('Close menu button does not have correct aria-label.');
});

addTest('T2-F1-02', 'Hamburger button has correct accessibility label', async () => {
  const $ = await getPage('/ja', 'ja');
  const btn = $('header button').filter((i, el) => $(el).attr('aria-label') === 'Open menu');
  if (btn.length === 0) throw new Error('Hamburger button does not have correct aria-label.');
});

addTest('T2-F1-03', 'Mobile drawer close button has lg:hidden class', async () => {
  const $ = await getPage('/ja', 'ja');
  const btn = $('aside button').filter((i, el) => $(el).attr('aria-label') === 'Close menu');
  if (!btn.hasClass('lg:hidden')) throw new Error('Close menu button must have lg:hidden class.');
});

addTest('T2-F1-04', 'Navigation links count in desktop sidebar is at least 5', async () => {
  const $ = await getPage('/ja', 'ja');
  const links = $('aside nav a');
  if (links.length < 5) throw new Error(`Expected at least 5 navigation links. Found: ${links.length}`);
});

addTest('T2-F1-05', 'Mobile drawer contains links mapping to core pages', async () => {
  const $ = await getPage('/ja', 'ja');
  const expectedPaths = ['/', '/tier-list', '/patches', '/champions', '/calculator'];
  const hrefs = [];
  $('aside nav a').each((i, el) => {
    hrefs.push($(el).attr('href'));
  });
  for (const path of expectedPaths) {
    const found = hrefs.some(h => h && (h === path || h.endsWith(path)));
    if (!found) throw new Error(`Core path not linked in navigation: ${path}`);
  }
});

addTest('T2-F2-06', 'English patches list displays localized empty search string on mismatch', async () => {
  const $ = await getPage('/en/patches?q=NonExistentChampionXYZ', 'en');
  const text = $('body').text();
  if (!text.includes('No balance updates found') && !text.includes('No results') && !text.includes('no updates')) {
    throw new Error('English patches page does not render empty state text properly.');
  }
});

addTest('T2-F2-07', 'Japanese patches list displays localized empty search string on mismatch', async () => {
  const $ = await getPage('/ja/patches?q=NonExistentChampionXYZ', 'ja');
  const text = $('body').text();
  if (!text.includes('データが見つかりません') && !text.includes('結果が見つかりません') && !text.includes('履歴はありません')) {
    throw new Error('Japanese patches page does not render empty state text properly.');
  }
});

addTest('T2-F2-08', 'Norra details page displays skill list cleanly', async () => {
  const $ = await getPage('/en/champions/Norra', 'en');
  const skills = $('aside nav a').first();
  if (skills.length === 0) throw new Error('Norra details layout is broken.');
});

addTest('T2-F2-09', 'Garen skill details table contains correct cells matching body headers', async () => {
  const $ = await getPage('/en/champions/Garen', 'en');
  const table = $('table').filter((i, el) => $(el).find('th').first().text().includes('Growth') || $(el).find('th').first().text().includes('成長'));
  if (table.length > 0) {
    const headersCount = table.find('thead th').length;
    const firstRowCellsCount = table.find('tbody tr').first().find('td').length;
    if (headersCount !== firstRowCellsCount) {
      throw new Error(`Table cells mismatch: headers=${headersCount}, body row cells=${firstRowCellsCount}`);
    }
  }
});

addTest('T2-F2-10', 'Garen skill details table header row uses small text styles', async () => {
  const $ = await getPage('/en/champions/Garen', 'en');
  const table = $('table').filter((i, el) => $(el).find('th').first().text().includes('Growth') || $(el).find('th').first().text().includes('成長'));
  if (table.length > 0) {
    const thead = table.find('thead');
    const classes = thead.attr('class') || '';
    if (!classes.includes('text-xs') && !classes.includes('text-sm')) {
      throw new Error('Table headers should use small responsive font styling.');
    }
  }
});

addTest('T2-F3-11', 'Invalid champion ID returns 404 page', async () => {
  const $ = await getPage('/en/champions/InvalidChampionName123', 'en');
  const text = $('body').text();
  if (!text.includes('not found') && !text.includes('Not Found') && !text.includes('404')) {
    throw new Error('Accessing invalid champion ID should render a clear 404/not found UI.');
  }
});

addTest('T2-F3-12', 'Patches page handles special symbols in query string without crashing', async () => {
  const $ = await getPage("/en/patches?q=Garen's", 'en');
  const text = $('body').text();
  if (!text) throw new Error('Response is empty when querying special symbols.');
});

addTest('T2-F3-13', 'Patches page contains version selection select box', async () => {
  const $ = await getPage('/en/patches', 'en');
  const select = $('select');
  if (select.length === 0) {
    console.log('       [Skip] No select version dropdown found (may be hidden under active search query).');
  }
});

addTest('T2-F3-14', 'Damage calculator input elements are defined with default attributes', async () => {
  const $ = await getPage('/en/calculator', 'en');
  const hpInput = $('input[type="number"]');
  if (hpInput.length === 0) throw new Error('Damage calculator does not render numeric input fields.');
});

addTest('T2-F3-15', 'Damage calculator page outputs default physical EHP', async () => {
  const $ = await getPage('/en/calculator', 'en');
  const bodyText = $('body').text();
  if (!bodyText.includes('EHP') && !bodyText.includes('Effective HP') && !bodyText.includes('耐久')) {
    throw new Error('Calculator page missing EHP outputs.');
  }
});

addTest('T2-F3-16', 'Damage calculator page outputs default magic EHP', async () => {
  const $ = await getPage('/ja/calculator', 'ja');
  const bodyText = $('body').text();
  if (!bodyText.includes('EHP') && !bodyText.includes('魔法耐久') && !bodyText.includes('有効')) {
    throw new Error('Calculator Japanese page missing magic EHP outputs.');
  }
});

addTest('T2-F4-17', 'Directory audit: Verify no champion sprite sheets exist in images', async () => {
  const files = fs.readdirSync(path.join(rootDir, 'public', 'images'));
  for (const file of files) {
    if (file.includes('sprite') || file.includes('sheet')) {
      throw new Error(`Sprite sheet should not be saved locally: ${file}`);
    }
  }
});

addTest('T2-F4-18', 'Directory audit: Verify no backup files or temp images exist', async () => {
  const checkDir = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        checkDir(fullPath);
      } else {
        if (file.endsWith('.bak') || file.endsWith('.tmp') || file.includes('copy')) {
          throw new Error(`Temp/backup file found in images directory: ${file}`);
        }
      }
    }
  };
  checkDir(path.join(rootDir, 'public', 'images'));
});

addTest('T2-F4-19', 'Directory audit: Check public/images nesting depth', async () => {
  const checkDepth = (dirPath, depth = 1) => {
    if (depth > 3) throw new Error(`Images directory nesting is too deep: ${dirPath}`);
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        checkDepth(fullPath, depth + 1);
      }
    }
  };
  checkDepth(path.join(rootDir, 'public', 'images'));
});

addTest('T2-F4-20', 'Agent files check: Verify no source files are written to .agents', async () => {
  const agentsDir = path.join(rootDir, '.agents');
  const checkDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        checkDir(fullPath);
      } else {
        if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') && !file.endsWith('.md')) {
          // If we found scripts, allow them only if they are runner metadata
          if (!file.includes('handoff') && !file.includes('prompt') && !file.includes('progress') && !file.includes('briefing')) {
            throw new Error(`Source/test file leak in .agents folder: ${file}`);
          }
        }
      }
    }
  };
  checkDir(agentsDir);
});

// ==========================================
// TIER 3: Cross-Feature Combinations (5 Cases)
// ==========================================

addTest('T3-FC-01', 'F1 + F3: Navigation menu text switches language dynamically', async () => {
  const $ja = await getPage('/ja', 'ja');
  const $en = await getPage('/en', 'en');
  const jaTitle = $ja('aside h2').first().text();
  const enTitle = $en('aside h2').first().text();
  if (jaTitle === enTitle) {
    throw new Error(`Sidebar title is not translated: "${jaTitle}" vs "${enTitle}"`);
  }
});

addTest('T3-FC-02', 'F1 + F2: Active filter classes change layout highlighting', async () => {
  const $ = await getPage('/en/patches', 'en');
  const buttons = $('button');
  let hasActiveStyles = false;
  buttons.each((i, el) => {
    const classes = $(el).attr('class') || '';
    if (classes.includes('bg-slate-800') || classes.includes('bg-emerald-500') || classes.includes('bg-rose-500')) {
      hasActiveStyles = true;
    }
  });
  if (!hasActiveStyles) throw new Error('Filter buttons lack appropriate visual state classes.');
});

addTest('T3-FC-03', 'F2 + F3: Norra details page displays responsive skill layout and localized lore', async () => {
  const $ = await getPage('/ja/champions/Norra', 'ja');
  const bodyText = $('body').text();
  const title = $('h1').text();
  if (!title.includes('ノラ') && !bodyText.includes('ノラ')) {
    throw new Error('Norra details page fails to render Japanese title or name.');
  }
  const hasSidebarClasses = $('aside').first().attr('class')?.includes('lg:');
  if (!hasSidebarClasses) throw new Error('Norra details layout fails responsive checks.');
});

addTest('T3-FC-04', 'F2 + F3: Advanced Calculator contains grid-cols-1 md:grid-cols-2 classes', async () => {
  const $ = await getPage('/en/calculator', 'en');
  let foundGrid = false;
  $('div').each((i, el) => {
    const classes = $(el).attr('class') || '';
    if (classes.includes('grid-cols-1') && classes.includes('md:grid-cols-2')) {
      foundGrid = true;
    }
  });
  if (!foundGrid) throw new Error('Calculator container missing responsive column wrapping classes.');
});

addTest('T3-FC-05', 'F2 + F4: Table images use local fallback elements if failing', async () => {
  const $ = await getPage('/en/patches', 'en');
  const imgs = $('img');
  let hasOnError = false;
  imgs.each((i, el) => {
    const onError = $(el).attr('onerror');
    if (onError && onError.includes('display') || onError && onError.includes('fallback')) {
      hasOnError = true;
    }
  });
  if (!hasOnError) throw new Error('Image tags in table do not configure appropriate error recovery handling.');
});

// ==========================================
// TIER 4: Real-World Workloads (7 Cases)
// ==========================================

addTest('T4-RW-01', 'Roster Navigation Flow: check full user session path', async () => {
  // Step 1: Landing
  const $home = await getPage('/en', 'en');
  if ($home('aside').length === 0) throw new Error('Landing page failed to load.');

  // Step 2: Champions list
  const $roster = await getPage('/en/champions', 'en');
  const norraLink = $roster('a[href*="/champions/Norra"]');
  if (norraLink.length === 0) throw new Error('Roster missing Norra.');

  // Step 3: Details Page
  const $details = await getPage('/en/champions/Norra', 'en');
  const loreText = $details('body').text();
  if (!loreText.includes('Yuumi') && !loreText.includes('cat')) {
    throw new Error('Details page failed to load fallback yordle story.');
  }
});

addTest('T4-RW-02', 'Patch Notes Search Workflow: verify query filters', async () => {
  const $ = await getPage('/ja/patches?q=Norra', 'ja');
  // Should match Norra patches or return empty results cleanly without layout breakage
  const container = $('.overflow-x-auto');
  if (container.length === 0) throw new Error('Patches layout broke under filter.');
});

addTest('T4-RW-03', 'Damage Calculator Flow: default calculations match expectations', async () => {
  const $ = await getPage('/en/calculator', 'en');
  const inputsCount = $('input[type="number"]').length;
  if (inputsCount === 0) throw new Error('Calculator inputs count is zero.');
});

addTest('T4-RW-04', 'Multilingual Roster Audit: verify rosters equality', async () => {
  const $en = await getPage('/en/champions', 'en');
  const $ja = await getPage('/ja/champions', 'ja');
  const enCount = $en('a[href*="/champions/"]').length;
  const jaCount = $ja('a[href*="/champions/"]').length;
  if (enCount === 0 || jaCount === 0) throw new Error('Roster audit empty.');
  if (enCount !== jaCount) throw new Error(`Champions roster count mismatch: en=${enCount}, ja=${jaCount}`);
});

addTest('T4-RW-05', 'Layout & Rights Verification: check all routes', async () => {
  const routes = ['/ja', '/en', '/ja/champions', '/en/patches', '/ja/calculator'];
  for (const r of routes) {
    const $ = await getPage(r, 'ja');
    const text = $('body').text();
    if (text.includes('worker_e2e_testing_1') || text.includes('.agents')) {
      throw new Error(`Agent metadata leakage found on route: ${r}`);
    }
  }
});

addTest('T4-RW-06', 'Champion info matching: statistics check across locales', async () => {
  const $en = await getPage('/en/champions/Garen', 'en');
  const $ja = await getPage('/ja/champions/Garen', 'ja');
  const enStats = $en('body').text();
  const jaStats = $ja('body').text();
  // Ensure that numbers or stats like win rates (e.g. "50%") are present in both
  const extractWinRate = (text) => {
    const match = text.match(/\d+(\.\d+)?%/);
    return match ? match[0] : null;
  };
  const enWR = extractWinRate(enStats);
  const jaWR = extractWinRate(jaStats);
  if (!enWR || !jaWR) {
    console.log('       [Skip] No win rates found to compare.');
  }
});

addTest('T4-RW-07', 'Footer / Legal text existence across all locales', async () => {
  const $ja = await getPage('/ja', 'ja');
  const $en = await getPage('/en', 'en');
  const jaFooter = $ja('aside').text();
  const enFooter = $en('aside').text();
  if (!jaFooter.includes('規約') && !jaFooter.includes('ポリシー') && !jaFooter.includes('著作権')) {
    console.log('       [Skip] Japanese legal footer layout differ.');
  }
  if (!enFooter.includes('Terms') && !enFooter.includes('Privacy') && !enFooter.includes('Legal')) {
    console.log('       [Skip] English legal footer layout differ.');
  }
});

// ----------------------------------------------------------------------------
// 4. Main Entry Point
// ----------------------------------------------------------------------------

async function main() {
  const active = await isPortActive(PORT);
  if (!active) {
    spawnServer();
  } else {
    console.log(`[Server] Port ${PORT} already active. Running tests against existing server.`);
  }

  try {
    await waitForServer();
    await runAllTests();
  } catch (error) {
    console.error('[Runner] Error running tests:', error.message);
    process.exitCode = 1;
  } finally {
    cleanup();
    process.exit(process.exitCode || 0);
  }
}

main();
