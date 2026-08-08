# AGENTS.md - Developer & Agent Guidance

This project is a Next.js 16 (Turbopack) web application for **Honor of Kings Global (HoK)**.

---

## ⚡ Quick Start & Verification Rules

1. **Local Development**:
   - `npm run dev` starts the dev server on `http://localhost:3000`.
   - Never deploy to production without explicit user confirmation.
2. **Build Verification**:
   - Always run `npm run build` after editing components or data. All 512 static pages must compile cleanly with 0 TypeScript / Turbopack errors.

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
