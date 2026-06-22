# Implementation Plan: Responsive Tables Revamp

This plan outlines the steps to execute Milestone 3: Responsive Tables Revamp.

## 1. Objectives
- **PatchTable (`src/components/patches/PatchTable.tsx`)**:
  - Remove outer `overflow-x-auto` from the main wrapper (line 229) to prevent horizontal scroll issues on mobile.
  - Wrap the desktop `table` in a `<div className="hidden md:block overflow-x-auto">` container, removing `hidden md:table` from the table element itself.
  - Retain the card-based layout (`md:hidden`) on mobile screens (<md) and standard tabular layout on >=md screens.
  - Ensure all display text, menu names, numbers, values, and labels remain exactly the same.
- **Champion Skill Growth Tables (`src/app/[locale]/champions/[id]/page.tsx`)**:
  - Update line 611 from `md:ml-[72px]` to `ml-0 md:ml-[72px]` to explicitly remove the left margin on mobile viewports.
- **Compilation**:
  - Ensure `npm run build` succeeds without any errors.
- **Integrity**:
  - Run a Forensic Auditor to ensure no cheating/facade/hardcoding has been introduced.

## 2. Steps
1. **Apply Changes**: Spawn a `teamwork_preview_worker` to apply these code modifications.
2. **Review Changes**: Spawn a `teamwork_preview_reviewer` to review the modifications.
3. **Forensic Audit**: Spawn a `teamwork_preview_auditor` to audit the changes.
4. **Build Verification**: Have the worker run `npm run build` and report the output.

## 3. Verification Method
- Verify that the modifications to `PatchTable.tsx` and `page.tsx` match the specifications.
- Verify that the build succeeds.
- Verify that the Forensic Auditor passes.
