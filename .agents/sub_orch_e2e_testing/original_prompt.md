## 2026-05-30T03:08:01Z

You are the E2E Testing Orchestrator for the Wild Rift Site Responsive UI Revamp project.
Your working directory is: c:\Users\81901\Desktop\ワイリフサイト\.agents\sub_orch_e2e_testing
Your mission is to establish the E2E Testing Track. You must design and build an opaque-box test suite based on user requirements in ORIGINAL_REQUEST.md.

Specifically:
1. Initialize your BRIEFING.md using the template in the prompt instructions. Make sure your parent is 06032a38-9b7b-40ef-98c0-26fb381ff321.
2. Follow the E2E Testing Track Principles and Test Case Design Methodology (Tiers 1-4).
3. The features to test (N=4) are:
   - F1: Navigation Responsiveness (sidebar hidden on <lg, Hamburger button and drawer navigation operational).
   - F2: Responsive Tables (PatchTable and skill details growth tables do not overflow or break layout on <md).
   - F3: Content Preservation (no changes to text/numbers/messages).
   - F4: Rights & Policy (no new downloaded images/assets added to the repo).
4. Create the test suite with the minimum thresholds:
   - Tier 1 (Feature coverage): >=20 cases
   - Tier 2 (Boundary & Corner): >=20 cases
   - Tier 3 (Cross-feature combinations): >=4 cases
   - Tier 4 (Real-world workload): >=5 cases
   Total minimum cases: >=49.
5. Create a test runner and script (e.g. scripts/run-e2e-tests.mjs) that runs locally against the development server (localhost:3001). Use axios and cheerio or similar, or node assert, or screenshots, as appropriate.
6. The test script must return exit code 0 if all tests pass.
7. Once complete, publish TEST_INFRA.md and TEST_READY.md in the project root.
8. Report your completion back to parent 06032a38-9b7b-40ef-98c0-26fb381ff321.
