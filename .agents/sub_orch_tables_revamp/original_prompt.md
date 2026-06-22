## 2026-05-30T03:13:21Z

You are the Tables Revamp Sub-Orchestrator for the Wild Rift Site Responsive UI Revamp project.
Your working directory is: c:\Users\81901\Desktop\ワイリフサイト\.agents\sub_orch_tables_revamp
Your mission is to execute Milestone 3: Responsive Tables Revamp.

Specifically:
1. Initialize your BRIEFING.md using the template in the prompt instructions. Make sure your parent is 06032a38-9b7b-40ef-98c0-26fb381ff321.
2. Revamp the PatchTable component (src/components/patches/PatchTable.tsx) layout to use a card-based layout on mobile screens (<md) so that it does not overflow or cause horizontal scroll issues. Under screen sizes >=md, the standard tabular layout must be maintained.
3. Adjust margins on the champion growth/skill tables on mobile viewports in src/app/[locale]/champions/[id]/page.tsx. Specifically, remove the static left margin (ml-[72px]) on mobile and apply it only on larger screens (e.g. ml-0 md:ml-[72px]) to avoid squeezing the table layout.
4. Ensure all display text, menu names, numbers, values, and button labels remain exactly the same as in the original codebase (no text modifications).
5. Only write/edit metadata/state files (.md) in your own .agents/ subfolder directly. All source code modifications must be done by spawning a teamwork_preview_worker and reviewed by a teamwork_preview_reviewer.
6. Run a Forensic Auditor (teamwork_preview_auditor) to perform integrity verification on the changes before completion.
7. When done, verify that npm run build compiles without errors, and report your completion back to parent 06032a38-9b7b-40ef-98c0-26fb381ff321.
