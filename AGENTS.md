# AGENTS.md - Developer & Agent Guidance

This project is a Next.js 16 (Turbopack) web application for **Honor of Kings Global (HoK)**.

---

## ⚡ Quick Start & Verification Rules

1. **Local Development**:
   - `npm run dev` starts the dev server on `http://localhost:3000`.
   - Never deploy to production without explicit user confirmation.
2. **Build Verification**:
   - Always run `npm run build` after editing components or data. All static pages must compile cleanly with 0 TypeScript / Turbopack errors.
3. **Data Audit (must pass before commit)**:
   - `npm run audit` — checks i18n key parity, Japanese leakage in EN data, broken image references, ja/en skill data gaps, and hero naming conventions. Run it after ANY data file change.
   - `npm run smoke` — opens 26 key pages in a real browser (requires `npm run dev` running) and checks for console errors, 404s, and Japanese text on EN pages.
   - CI (GitHub Actions) runs audit + lint + build on every push.
4. **Hero Naming Convention**:
   - `name` = Japanese in-game name (Kanji for Chinese-origin heroes: 大司命, 白龍 — NOT オーグラン/アオイン). `name_en` = official global name (Augran, Ao'yin, Chicha, Luara, Flowborn).
   - The fields `jpName` / `enName` are abolished — do not re-add them.

---

## 🔑 Data & Routing Architecture

1. **Authentic HoK Hero Data**:
   - Valid HoK heroes begin at ID 105 (Lian Po / 廉頗).
   - Main datasets reside in `src/data/hok_heroes.json` and `src/data/hero_counters.json`.
   - Summoner Spells are located in `src/data/hok_spells.json` (do not import `hok_summoners.json`).

2. **Internationalization & Navigation**:
   - Uses `next-intl` with `@/i18n/routing`.
   - Hero Detail Page route is `/heroes/${id}` (plural). Never use `/heros/`.
   - Ensure both `messages/ja.json` and `messages/en.json` maintain matching JSON keys.

3. **Global Terminology**:
   - Monsters: `Tyrant`, `Overlord`, `Tempest Dragon`, `Spirit Crab` (In Japanese UI: `タイラント`, `オーバーロード`, `テンペストドラゴン`, `スピリットクラブ`).
   - Items: `Mortal Punisher`, `Venomous Staff`, `Ominous Premonition`.
   - Hero Names: Follow HoK Global Japanese in-game UI (Chinese-origin heroes use Kanji like `孫尚香`, `趙雲`, `程咬金`; Western-origin heroes use Katakana/English like `アンジェラ`, `ドリア`).

---

## 📌 Recent Handover & Updates
- **Handover Doc**: See [`HANDOVER.md`](file:///c:/Users/81901/Desktop/%E3%82%AA%E3%83%8A%E3%83%BC%E3%82%AA%E3%83%96%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88/HANDOVER.md) for full audit history and text refactoring details.
- **Latest Fixes (Commit `4a2f14e`)**:
  - Japanese prose polished across `messages/ja.json`, `public/data/skills/ja.json`, `macro/page.tsx`, and `src/content/listNotes.ts`.
  - Machine-translated pronouns ("彼", "彼女") replaced with actual hero names across all 22 hero counter/synergy entries.
  - Typo fixes: `ギャンク` -> `ガンク`, `初回清掃` -> `初回のジャングルクリア`, `川の川の精霊` -> `川の精霊`.
  - All 500 pages compile cleanly with 0 TS/Turbopack errors and pass `npm run audit`.
