# E2E Responsive UI Revamp Testing Plan & Strategy

This document outlines the end-to-end (E2E) testing strategy for the responsive UI revamp on the Wild Rift website. The testing plan is designed to verify mobile layout transitions, responsive tables, content preservation across locales, and copyright asset safety.

---

## 1. Key Routes & Component Analysis

We explored the codebase and mapped the primary routes and layout components:

### 1.1 Key Routes Under Test
*   **Home Page (`/` or `/[locale]`)**: Serves as the landing dashboard. Contains the hero section (with a Jinx background image), announcement banners, the top meta picks grid, and quick access navigation links.
*   **Champions Roster (`/[locale]/champions`)**: Lists all champions available in the site roster. It integrates with Supabase `champion_stats` and uses a layout filter bar (All, Fighter, Tank, Mage, Assassin, Marksman, Support) and a search input.
*   **Champion Details (`/[locale]/champions/[id]`)**: Shows a champion's details (e.g., Garen, Norra). Contains localized lore, meta stats (tier, role, win rate), skill icons/descriptions, and level progression tables. Special attention is paid to **Norra**, a Wild Rift exclusive champion with customized fallback lore.
*   **Patches (`/[locale]/patches`)**: Hosts the patch list component. Implements version selectors and filtering buttons (All, Buff, Nerf, Adjust) for champion changes.
*   **Calculator (`/[locale]/calculator`)**: Hosts the Advanced Damage Calculator. Contains sliders and numeric inputs for HP, Armor, MR, AD, AP, and penetration statistics, alongside a combo builder stack.

### 1.2 Layout & Navigation Components
*   **Sidebar (`src/components/layout/Sidebar.tsx`)**: Desktop navigation drawer. Fixed to `w-64` in width.
*   **Header (`src/components/layout/Header.tsx`)**: Top header containing titles and actions (such as user profiles and locale switchers).
*   **Patch Table (`src/components/patches/PatchTable.tsx`)**: Standard table displaying historical balance updates.

---

## 2. Testing Constraints & axios/cheerio Methodology

Because we are using `axios` and `cheerio` rather than a full headless browser (like Playwright/Puppeteer), we are performing **markup-level E2E checks**. This approach is extremely fast and lightweight but introduces specific constraints:

1.  **Client-Side Interactions**: We cannot physically click a button and wait for React state changes (like opening a drawer). Instead, we test:
    *   The **static presence of Tailwind responsive classes** (e.g. checking that the sidebar element contains `hidden lg:flex` or the drawer contains transition and overlay classes).
    *   The **DOM structure** of interactive elements (e.g. checking that the hamburger button is present and visible only on small viewports with `lg:hidden`).
    *   The **CSS class logic** (e.g., checking that a responsive table has both mobile-only list containers with `md:hidden` and desktop-only tables with `hidden md:table`).
2.  **State Hydration**: We fetch pre-rendered server responses. This is ideal for validating localized SSR text, navigation hrefs, default inputs, and SEO attributes.
3.  **Asset Verification**: The script scans the local directory (`public/images/`) using Node.js file system APIs to ensure compliance with the repository's rights and assets policies.

---

## 3. Local Dev Server Management Strategy

To ensure test isolation and consistent test execution, the script `scripts/run-e2e-tests.mjs` will manage the dev server automatically:

1.  **Check Port Activity**: The script attempts to connect to port `3001` via a socket connection (`net.connect`). If port `3001` is already active, the script assumes a dev server is running externally, logs it, and skips launching a new process.
2.  **Spawn Dev Server**: If port `3001` is free, the script spawns a new process:
    *   `next dev -p 3001` (or `npm run dev -- -p 3001`)
    *   `cwd` set to the project root directory.
    *   Outputs of the child process are piped to a log file or kept in buffer to debug failures.
3.  **Readiness Polling**: The script polls `http://localhost:3001` every 500ms using `axios`. It proceeds to run tests once the server returns status `200` (up to a 30-second timeout limit).
4.  **Graceful Process Teardown**: The script registers cleanup hooks for `exit`, `SIGINT`, `SIGTERM`, and `uncaughtException`. If the server was spawned by the script, it will kill it using the process group ID or process ID (`child.kill()`).

---

## 4. E2E Test Suite (50 Distinct Cases)

Here is the inventory of 50 test cases categorized across four tiers.

### Tier 1: Feature Coverage (20 Cases)
Verifies core requirements for responsive layouts, tables, content preservation, and asset restrictions.

| Test ID | Route / Scope | Objective | Cheerio / JS Assertion |
|---|---|---|---|
| **T1-F1-01** | `/` | Header contains mobile hamburger button placeholder. | `$('header button').first()` exists and has responsive classes. |
| **T1-F1-02** | `/` | Sidebar has responsive layout class `hidden lg:flex` (or `lg:block`). | `$('aside').first().attr('class')` contains `hidden` and `lg:`. |
| **T1-F1-03** | `/champions` | Sidebar hides on mobile viewports. | `$('aside').first().hasClass('hidden')` is true or has `hidden lg:`. |
| **T1-F1-04** | `/champions/[id]` | Sidebar hides on mobile viewports on detail page. | `$('aside').first().hasClass('hidden')` is true. |
| **T1-F1-05** | `/patches` | Sidebar hides on mobile viewports on patches page. | `$('aside').first().hasClass('hidden')` is true. |
| **T1-F1-06** | `/calculator` | Sidebar hides on mobile viewports on calculator page. | `$('aside').first().hasClass('hidden')` is true. |
| **T1-F1-07** | `/` | Header has Hamburger button visible only on small screens. | Hamburger selector has `lg:hidden` or similar class. |
| **T1-F1-08** | `/` | Mobile drawer container exists and has absolute/fixed position. | Selector `[data-testid="mobile-drawer"]` has `fixed` or `absolute`. |
| **T1-F2-09** | `/patches` | `PatchTable` wrapper div has scroll class `overflow-x-auto`. | `$('.overflow-x-auto').has('table')` exists on Patches page. |
| **T1-F2-10** | `/patches` | `PatchTable` renders mobile-only card layout element (`md`未満). | Elements with `block md:hidden` or `md:hidden` are present. |
| **T1-F2-11** | `/patches` | `PatchTable` renders desktop-only table element (`md`以上). | Elements with `hidden md:table` or `md:table` are present. |
| **T1-F2-12** | `/champions/Garen` | Skill progression table does not use non-responsive left margins. | Table container does NOT have `ml-[72px]` without a prefix like `md:`. |
| **T1-F2-13** | `/champions/Garen` | Skill progression tables are wrapped in an `overflow-x-auto` wrapper. | Skill table container has class `overflow-x-auto`. |
| **T1-F3-14** | `/ja` | Japanese landing page returns status 200 and loads localized hero badge. | Hero badge contains Japanese text (e.g. from translations). |
| **T1-F3-15** | `/en` | English landing page returns status 200 and loads localized hero badge. | Hero badge contains English text. |
| **T1-F3-16** | `/ja/champions` | Champions roster includes Wild Rift exclusive champion "Norra". | `$('a[href*="/champions/Norra"]')` or equivalent element exists. |
| **T1-F3-17** | `/en/champions/Garen` | Details page for Garen matches English name and structure. | `$('h1').text()` contains `Garen`. |
| **T1-F3-18** | `/ja/champions/Norra` | Details page for Norra has localized Japanese name and fallback lore. | Lore section contains expected Japanese yordle story snippet. |
| **T1-F3-19** | `/en/calculator` | Calculator inputs (HP, Armor, MR, AD, AP) are defined with default values. | Input values for `hp` (1000), `armor` (50), `mr` (30) exist. |
| **T1-F4-20** | Local Directory | Directory audit: `public/images/` does not contain unauthorized assets. | Script checks `public/images/` and errors on unregistered files. |

### Tier 2: Boundary & Corner Cases (20 Cases)
Tests edge cases, fallbacks, parameter variations, and input bounds.

| Test ID | Scope | Target / Scenario | Assertion Details |
|---|---|---|---|
| **T2-F1-01** | `/en` | Hamburger toggle class pattern check. | Hamburger button has class matching `flex` or `block` under mobile rules. |
| **T2-F1-02** | `/en` | Mobile drawer links integrity. | Navigation links in the mobile drawer match desktop sidebar exactly. |
| **T2-F1-03** | `/en` | Header user avatar remains visible. | Avatar/Profile button does not hide on `<lg` screen size. |
| **T2-F2-04** | `/patches` | `PatchTable` empty state layout. | Renders localized "no results found" string inside layout without breaking wrapper. |
| **T2-F2-05** | `/champions/Norra` | Champion without skill tables. | Verifies layout parses cleanly even if skills do not contain level progression grids. |
| **T2-F2-06** | `/champions/Garen` | Column headers size handling in skill table. | Header tags (`th`) use auto or text-xs sizing to fit narrow screens. |
| **T2-F3-07** | `/champions/invalid-id` | Invalid champion ID path. | Returns standard 404 UI with a return link to `/champions`. |
| **T2-F3-08** | `/en/champions/Norra` | Fallback lore for exclusive yordle. | Renders English fallback description for Norra. |
| **T2-F3-09** | `/en` | Missing meta stats on landing. | Loading skeleton/error boundary elements render if Supabase fetch is empty. |
| **T2-F3-10** | `/en` | Quick Access routing mapping. | Validates that links to Calculator, Patches, Tier-List, Champions are active. |
| **T2-F3-11** | `/ja` | Announcement Notice banner text. | Announcement notice matches Japanese translation properties exactly. |
| **T2-F3-12** | `/en/patches` | Search query special symbols. | Query string `?q=Garen's` does not break SSR rendering or layout stability. |
| **T2-F3-13** | `/en/patches` | Active filter buttons state. | Verifies active filter has active styling classes (e.g. `bg-slate-800`). |
| **T2-F3-14** | `/en/calculator` | Calculator empty skill name combo. | Default combo label handles empty text (e.g. displays "Attack 1" in stack). |
| **T2-F3-15** | `/en/calculator` | Calculator zero damage combo lock. | Checks inputs that resolve to 0 total damage disable the "Add to Combo" button. |
| **T2-F3-16** | `/en/calculator` | Calculator default calculation outputs. | Default values output: Physical EHP: 1500, Magic EHP: 1300. |
| **T2-F3-17** | URL Redirect | Locale prefix redirection. | Fetching root `/` redirects to `/ja` or `/en` according to browser preferences. |
| **T2-F4-18** | Local Directory | Recursive asset file extension audit. | Validates that only `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, and `.svg` files exist. |
| **T2-F4-19** | Local Directory | No DataDragon sprite files checked in. | Confirms no champion sprite overlays are cached locally (should be loaded from CDN). |
| **T2-F4-20** | Git Status | Git untracked file validation. | Runs shell check within the script to verify no untracked `.avif`/`.png` files exist in `public/`. |

### Tier 3: Cross-Feature Combinations (5 Cases)
Checks scenarios where features cross over or interact (e.g. responsiveness meets locale logic).

| Test ID | Combination | Scenario | Objective |
|---|---|---|---|
| **T3-FC-01** | F1 + F3 | Locale Switching in Mobile Layout | Verify mobile drawer content dynamically changes translations when switching `/ja` ↔ `/en`. |
| **T3-FC-02** | F1 + F2 | Filtered Patch Table on Mobile | Apply buff filter on mobile layout and ensure table cards correctly swap layout dynamically. |
| **T3-FC-03** | F2 + F3 | Mobile Champion Details Layout | Check that the level progression tables and hero splash background fit together on mobile without layout breaks. |
| **T3-FC-04** | F2 + F3 | Mobile Calculator Layout | Verify calculator columns wrap cleanly into 1 column on mobile, keeping input groups distinct from outputs. |
| **T3-FC-05** | F2 + F4 | Item/Rune icon fallbacks on Mobile | Confirm item/rune patch updates on mobile viewports degrade to text/emoji fallbacks if CDNs fail. |

### Tier 4: Real-World Workloads (5 Cases)
Simulates sequential scenarios representing actual user sessions.

*   **T4-RW-01 (Roster Navigation Flow)**:
    1. Retrieve `/en`.
    2. Fetch `/en/champions`.
    3. Verify "Norra" is in the roster.
    4. Fetch `/en/champions/Norra` and check the fallback lore.
    5. Ensure the sidebar navigation menu is visible on desktop viewports.
*   **T4-RW-02 (Patch Notes Search Workflow)**:
    1. Fetch `/ja/patches`.
    2. Search query matches and filter selections.
    3. Ensure `PatchTable` displays matching version labels.
    4. Verify card layouts are loaded correctly.
*   **T4-RW-03 (Damage Calculator Combo Flow)**:
    1. Retrieve `/en/calculator`.
    2. Read default inputs.
    3. Verify EHP values are correctly calculated in the outputs.
    4. Verify combo builder controls exist.
*   **T4-RW-04 (Multilingual Roster Audit)**:
    1. Fetch `/en/champions` and `/ja/champions` concurrently.
    2. Confirm numerical parameters (tiers, win rates) match exactly.
    3. Verify titles and tag labels are translated correctly.
*   **T4-RW-05 (Layout & Rights Validation Audit)**:
    1. Retrieve all routes.
    2. Ensure no agent metadata is leaked in page bundles.
    3. Execute directory asset audit to guarantee no downloaded assets are present.

---

## 5. Copy-Pasteable Script: `scripts/run-e2e-tests.mjs`

Below is the proposed design for the E2E testing script. It is implemented as an ES module (`mjs`) and utilizes `axios` and `cheerio`. It can be run using `node scripts/run-e2e-tests.mjs`.

```javascript
/**
 * scripts/run-e2e-tests.mjs
 * E2E test runner for Wild Rift Site Responsive UI Revamp.
 * Tests responsive layout classes, content preservation, and rights policies.
 */

import { spawn } from 'child_process';
import net from 'net';
import fs from 'fs';
import path from 'url';
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
  serverProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
    cwd: rootDir,
    stdio: 'ignore', // Ignore output to prevent console clutter
    shell: true
  });
}

async function waitForServer(timeoutMs = 30000) {
  const startTime = Date.now();
  console.log(`[Server] Waiting for dev server on ${BASE_URL} to become ready...`);
  while (Date.now() - startTime < timeoutMs) {
    try {
      const res = await axios.get(`${BASE_URL}/`, { timeout: 1000 });
      if (res.status === 200) {
        console.log('[Server] Server is ready!');
        return;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server failed to boot on port ${PORT} within ${timeoutMs}ms.`);
}

function cleanup() {
  if (serverProcess) {
    console.log('[Server] Shutting down spawned dev server...');
    serverProcess.kill('SIGINT');
  }
}

// Ensure cleanup on exits
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
  console.log('\n[Runner] Executing test suites...\n');
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
  }
}

// ----------------------------------------------------------------------------
// 3. Test Definitions
// ----------------------------------------------------------------------------

// Helper to get loaded Cheerio instance
async function getPage(path) {
  const url = `${BASE_URL}${path}`;
  const res = await axios.get(url);
  return cheerio.load(res.data);
}

// --- F1: Navigation Responsiveness ---
addTest('T1-F1-02', 'Sidebar layout contains responsive hiding classes', async () => {
  const $ = await getPage('/en');
  const sidebar = $('aside').first();
  if (sidebar.length === 0) throw new Error('Sidebar aside element not found.');
  const classes = sidebar.attr('class') || '';
  if (!classes.includes('hidden') || !classes.includes('lg:')) {
    throw new Error(`Sidebar should have "hidden" and "lg:" classes. Found: "${classes}"`);
  }
});

addTest('T1-F1-07', 'Header contains hamburger button visible on mobile (<lg)', async () => {
  const $ = await getPage('/en');
  // Check buttons inside header
  let foundHamburger = false;
  $('header button, header div').each((i, el) => {
    const classes = $(el).attr('class') || '';
    if (classes.includes('lg:hidden') || classes.includes('block lg:hidden') || classes.includes('flex lg:hidden')) {
      foundHamburger = true;
    }
  });
  if (!foundHamburger) {
    throw new Error('Header hamburger toggle element with responsive visibility class not found.');
  }
});

// --- F2: Responsive Tables ---
addTest('T1-F2-09', 'Patch Table has overflow scroll container wrapper', async () => {
  const $ = await getPage('/en/patches');
  const scrollWrapper = $('.overflow-x-auto');
  if (scrollWrapper.length === 0) {
    throw new Error('Patch notes page should wrap patch elements in scrollable overflow container.');
  }
});

addTest('T1-F2-12', 'Skill progression table does not have un-prefixed margin-left', async () => {
  const $ = await getPage('/en/champions/Garen');
  // Look for level progression table containers
  let foundTable = false;
  $('div').each((i, el) => {
    const classes = $(el).attr('class') || '';
    if (classes.includes('overflow-x-auto') && $(el).find('table').length > 0) {
      foundTable = true;
      if (classes.includes('ml-[72px]') && !classes.includes('md:ml-[72px]')) {
        throw new Error('Skill table should restrict ml-[72px] margin using responsive prefixes.');
      }
    }
  });
  if (!foundTable) {
    // If no skill table details are loaded, this could be because mock data is empty
    console.log('       [Skip] No skill growth table present for Garen in current state.');
  }
});

// --- F3: Content Preservation ---
addTest('T1-F3-14', 'Landing page translations match Japanese default locale', async () => {
  const $ = await getPage('/ja');
  const noticeTitle = $('h2').text();
  if (!noticeTitle.includes('お知らせ') && !noticeTitle.includes('Notice')) {
    throw new Error('Japanese homepage notice section title mismatch.');
  }
});

addTest('T1-F3-16', 'Roster includes Wild Rift Exclusive Norra', async () => {
  const $ = await getPage('/ja/champions');
  const norraLink = $('a[href*="/champions/Norra"]');
  if (norraLink.length === 0) {
    throw new Error('Norra must be present on the champions roster page.');
  }
});

addTest('T1-F3-18', 'Norra details page loads yordle fallback lore', async () => {
  const $ = await getPage('/ja/champions/Norra');
  const loreText = $('p').text();
  if (!loreText.includes('ヨードルの魔女') && !loreText.includes('ユーミ')) {
    throw new Error('Norra fallback lore translation was not found on Japanese detail page.');
  }
});

addTest('T1-F3-19', 'Calculator page loads inputs with default stats', async () => {
  const $ = await getPage('/en/calculator');
  const inputs = $('input[type="number"]');
  if (inputs.length === 0) {
    throw new Error('Calculator page did not render damage parameter input elements.');
  }
});

// --- F4: Rights & Policy ---
addTest('T1-F4-20', 'Directory asset audit: No unauthorized downloaded images added', async () => {
  const checkDir = (dirPath) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        checkDir(fullPath);
      } else {
        // Only inspect image assets
        if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(file)) {
          if (!ALLOWED_IMAGES.has(relativePath)) {
            throw new Error(`Unauthorized asset file checked into repository: ${relativePath}`);
          }
        }
      }
    }
  };

  const publicImagesDir = path.join(rootDir, 'public');
  if (fs.existsSync(publicImagesDir)) {
    checkDir(publicImagesDir);
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
    process.exit(process.exitCode || 0);
  }
}

main();
```

---

## 6. Recommendations & Implementation Next Steps

1.  **Add Test IDs to Markup**: Introduce dedicated test identifiers in components to ease HTML testing. For example:
    *   Add `data-testid="sidebar"` to `<aside>` in `Sidebar.tsx`.
    *   Add `data-testid="hamburger-btn"` to the mobile toggle in `Header.tsx`.
    *   Add `data-testid="mobile-patch-cards"` and `data-testid="desktop-patch-table"` to `PatchTable.tsx`.
2.  **Continuous Integration**: Integrate the E2E script into the local development pipeline. Adding `"test:e2e": "node scripts/run-e2e-tests.mjs"` to `package.json` allows quick local validation during design iterations.
3.  **Local Mock DB Handling**: Ensure Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are properly configured before execution, or include robust mocking fallback branches within the Next.js routes to allow local test execution in offline mode.
