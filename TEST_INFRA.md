# Test Infrastructure Specification

This document describes the E2E test infrastructure designed and implemented for the Wild Rift Site Responsive UI Revamp project.

## 1. Architecture Overview

The E2E testing framework is implemented as an opaque-box, requirement-driven testing suite. It operates without relying on internal react state or database-specific implementation details.

- **Test Runner**: `scripts/run-e2e-tests.mjs`
- **Scraping Engine**: `axios` (HTTP requests) + `cheerio` (HTML parsing and DOM querying)
- **Port Management**: Auto-starts the Next.js development server on port `3001` if it is not already active, runs the test suite, and cleanly terminates the child process group on completion.

## 2. Test Case Classification

The test suite consists of **52 distinct cases** mapped across four tiers:

### Tier 1: Feature Coverage (20 Cases)
- **F1: Navigation Responsiveness (6 cases)**: Verifies the Hamburger button visibility, responsive classes on the Sidebar (`hidden lg:flex`), Close button visibility, and Avatar persistence.
- **F2: Responsive Tables (5 cases)**: Verifies that tables are wrapped in scrollable containers (`overflow-x-auto`), that `PatchTable` renders desktop-only (`hidden md:table`) and mobile-only card views (`md:hidden`), and that skill growth tables use responsive margins (`md:ml-[72px]`).
- **F3: Content Preservation (6 cases)**: Validates that text strings, translations, and champion lore (like Norra's fallback story) match perfectly across `/ja` and `/en` locales.
- **F4: Rights & Policy (3 cases)**: Performs image folder scans against a strict allowed-asset whitelist and verifies that no untracked image assets are checked in.

### Tier 2: Boundary & Corner Cases (20 Cases)
- **F1 Boundary (5 cases)**: Accessibility labels on buttons (`aria-label`), link mapping completeness, close menu triggers.
- **F2 Boundary (5 cases)**: Empty table search results placeholders, missing skill table handling, matching row/cell counts, and header styling.
- **F3 Boundary (6 cases)**: Invalid champion names rendering 404 UI, special characters in search parameters, calculator default inputs initialization, and expected calculated outputs.
- **F4 Boundary (4 cases)**: Checks that no DataDragon sprite sheets are saved locally, no temp/backup files exist, nesting depths are valid, and agent files are excluded.

### Tier 3: Cross-Feature Combinations (5 Cases)
- Dynamic menu translation switching (`F1 + F3`).
- CSS styling updates on filter state changes (`F1 + F2`).
- Concurrence of localized lore and responsive skill grids (`F2 + F3`).
- Advanced calculator responsive layouts (`F2 + F3`).
- Icon loader onerror fallback routines (`F2 + F4`).

### Tier 4: Real-World Workloads (7 Cases)
- Sequential user flows: roster navigation, search filtering, damage calculator builds, bilingual audits, asset verification scans, stats matching, and legal text checks.

## 3. Setup and Execution

To execute the test suite locally:

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Run the test script:
   ```bash
   node scripts/run-e2e-tests.mjs
   ```

The script will automatically detect if port `3001` is free, spin up the server, execute all tests, and clean up.
