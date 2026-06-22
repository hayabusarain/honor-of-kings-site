# Scope: Milestone 3: Responsive Tables Revamp

## Architecture
- **Components involved**:
  - `PatchTable` component (`src/components/patches/PatchTable.tsx`): Displays patch notes / adjustments in a tabular form. Needs to switch to a card-based layout on screen widths less than `md` (768px).
  - Champion detail page (`src/app/[locale]/champions/[id]/page.tsx`): Displays champion stats, skills, growth. Tables currently have a static `ml-[72px]` margin which needs to be responsive (`ml-0 md:ml-[72px]`).
- **Shared constraints**:
  - Display text, menu names, numbers, values, and button labels must remain exactly the same as in the original codebase (no text modifications).
  - Tabular layout must be preserved for screen widths >= `md` (768px).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration | Analyze PatchTable structure and Champion page layout | None | DONE |
| 2 | PatchTable Responsive Revamp | Revamp PatchTable to use card-based layout on mobile (<md) and standard table on >=md | M1 | DONE |
| 3 | Champion Margins Revamp | Remove static ml-[72px] on mobile growth/skill tables and set ml-0 md:ml-[72px] | M1 | DONE |
| 4 | Verification & Audit | Review changes, run Forensic Auditor, and perform npm run build | M2, M3 | DONE |

## Interface Contracts
### Components & Page
- `PatchTable`: No change to props interface, only internal JSX/TSX changes for responsive rendering.
- `src/app/[locale]/champions/[id]/page.tsx`: No change to page routes or API inputs, only styling adjustments.
