# Table Responsive Design and Margin Alignment Analysis Report

## Summary of Findings
This report provides a detailed analysis of two key responsive layouts: `PatchTable`'s transition between tabular and card layouts across mobile and desktop viewports, and the alignment of the skill growth/level progression tables in the Champion Details page. The investigation confirms that both components utilize responsive utility classes (`md:`) to alter layout structures and margin indentations conditionally for smaller viewports.

---

## 1. Structure of `PatchTable` & Mobile Layout Refactoring

### Current Structure Analysis
`PatchTable` in `src/components/patches/PatchTable.tsx` handles patch history rendering. It implements a dual-rendering responsive layout:

- **Desktop Viewport (`>=md` / >=768px)**:
  - Rendered via a semantic HTML `<table>` element (Line 254).
  - Uses CSS class `hidden md:table` to hide the table structure on small screens and display it as a table on larger screens.
  - Columns include: Icon/Avatar (w-16), Version, Champion, Type, and Description.
- **Mobile Viewport (`<md` / <768px)**:
  - Rendered via a flex container `<div className="md:hidden space-y-4">` (Line 338).
  - Uses CSS class `md:hidden` to hide this list structure on medium and larger viewports.
  - Renders patch details as individual cards. Each card has a header with the avatar, name/version text, and change type badge, followed by the description below.

### Redundancy & Refactoring Plan
The current implementation duplicates rendering logic for the **Champion/Item Avatar** and the **Change Type Badge**:
1. **Avatar Logic**:
   - Desktop (Lines 271-307)
   - Mobile (Lines 346-381)
2. **Change Type Badge**:
   - Desktop (Lines 314-329)
   - Mobile (Lines 390-405)

#### Proposed Refactor
To improve maintainability and ensure readability without changing any labels, text, or values, the duplicated logic should be extracted into lightweight, local sub-components within `PatchTable.tsx` or as utility render functions.

##### Component 1: `PatchAvatar`
Extracts the fallback avatar rendering logic.
```tsx
function PatchAvatar({ 
  patch, 
  iconMap 
}: { 
  patch: Database["public"]["Tables"]["patches"]["Row"]; 
  iconMap: Record<string, string>;
}) {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300">
      {(patch as any).is_champion !== false ? (
        <img 
          src={patch.champion_name_en === 'Norra' ? '/images/ノラ.avif' : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${patch.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '') || ''}.png`}
          alt={patch.champion_name_en || patch.champion_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent && !parent.querySelector('.fallback-icon')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-inner';
              fallback.innerText = patch.champion_name?.substring(0, 1) || '?';
              parent.appendChild(fallback);
            }
          }}
        />
      ) : iconMap[patch.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || ''] ? (
        <img 
          src={iconMap[patch.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']}
          alt={patch.champion_name_en || patch.champion_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent && !parent.querySelector('.fallback-icon')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 font-black text-sm shadow-inner';
              fallback.innerText = '⚔️';
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <span className="text-lg">⚔️</span>
      )}
    </div>
  );
}
```

##### Component 2: `ChangeTypeBadge`
Extracts color styling logic.
```tsx
function ChangeTypeBadge({ changeType }: { changeType: string }) {
  const colorMap: Record<string, string> = {
    buff: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    nerf: "bg-rose-100 text-rose-700 border border-rose-200",
    adjust: "bg-amber-100 text-amber-700 border border-amber-200",
    new: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  const colorClass = colorMap[changeType] || "bg-slate-100 text-slate-700 border border-slate-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      {changeType.toUpperCase()}
    </span>
  );
}
```

By substituting these sub-components in the desktop table row and the mobile card, the file length is significantly reduced, styling is consolidated, and no values or texts are modified.

---

## 2. Champion Growth/Skill Tables Margins on Mobile

### Current Margin Definition
In the file `src/app/[locale]/champions/[id]/page.tsx`, the level progression (growth) table container is defined at **Line 611**:
```tsx
<div className="mt-2 md:ml-[72px] overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
```

### Rationale for `72px`
- The skill details header/description is aligned adjacent to the skill icon.
- The skill icon has a width of `w-14` (which equals `56px`), and the flexbox gap is `gap-4` (which equals `16px`).
- Thus, the total horizontal offset of the skill name and description from the left edge is `56px + 16px = 72px`.
- On desktop, applying `md:ml-[72px]` to the sibling progression table aligns the table perfectly with the start of the description text, creating a clean visual hierarchy.

### Mobile Viewport Adjustment
Because the code uses the responsive prefix `md:` (`md:ml-[72px]`), this margin is **only active on screen sizes of 768px (`md`) and wider**. 
- On mobile viewports (`<768px`), this margin is already implicitly disabled (resolving to standard alignment of `margin-left: 0`).
- To make this behavior explicit and avoid any potential layout shift or style leakage from other parent rules, it can be updated to use:
  ```tsx
  ml-0 md:ml-[72px]
  ```
- This directly enforces `margin-left: 0` on mobile viewports while restoring the `72px` margin on desktop viewports. No other attributes, classes, or texts need to be altered.
