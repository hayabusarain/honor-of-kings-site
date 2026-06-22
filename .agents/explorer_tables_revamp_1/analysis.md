# Analysis Report: Responsive Tables Revamp

This report presents a detailed analysis of the responsive layout behavior and component structure of two critical areas in the application:
1. The **PatchTable** component (`src/components/patches/PatchTable.tsx`).
2. The **Champion Skill Growth Tables** in the Champion Detail page (`src/app/[locale]/champions/[id]/page.tsx`).

---

## 1. PatchTable Component Analysis (`src/components/patches/PatchTable.tsx`)

### Current Structure & Render Mechanism
`PatchTable` is a Client Component (`"use client"`) that fetches patch data from Supabase and renders a table of changes (buffs, nerfs, adjustments, new additions).
- **Data State**: 
  - `patches`: Stores raw patch rows from the `patches` table.
  - `patchMetas`: Stores meta predictions from `patch_meta`.
  - `iconMap`: A map of item/rune names to image URLs dynamically populated by fetching data from DataDragon.
- **Filtering Logic**: 
  - Filtered by `searchQuery` (checking localized name/description) and `filterType` (`buff` | `nerf` | `adjust` | `all`).
  - Supports cross-version search when a search query is entered or a filter type other than `all` is active.
- **Responsiveness**: 
  - The component already handles screen size differences using Tailwind's layout utilities.
  - **Desktop layout (`>=md`)**: Renders an HTML `table` with CSS class `hidden md:table w-full text-left border-collapse` (Lines 254-336).
  - **Mobile layout (`<md`)**: Renders a list of stackable cards using a `div` with CSS class `md:hidden space-y-4` (Lines 338-411).

### Identified Technical Debt & Code Duplication
While the layout is visually responsive, it contains significant duplicate rendering code between the desktop and mobile views:
1. **Avatar/Icon Logic duplication**: 
   - Desktop view (Lines 270–308) and Mobile view (Lines 346–382) use identical, complex blocks of code containing DDragon URLs, hardcoded fallback strings, and error handlers (`onError`) for both champion avatars and items/runes (using `iconMap`).
2. **Change Type Badge duplication**:
   - The CSS class mappings for change types (`buff` -> emerald, `nerf` -> rose, `adjust` -> amber, `new` -> purple, fallback -> slate) are duplicated in Lines 314–329 and Lines 390–404.
3. **Description Rendering duplication**:
   - The conditional check for locale selection (`locale === 'en' ? (patch.description_en || patch.description) : patch.description`) and invocation of `renderDescription()` is duplicated in Line 331 and Line 407.

### Refactoring Proposal
To make the component more maintainable, easier to extend, and cleanly structured, we propose extracting the repeated UI parts into simple, local helper components within the same file. This keeps the core layout readable while preserving the exact layout, CSS styling, labels, values, and localized text.

#### Proposed Extraction: `PatchAvatar` and `ChangeTypeBadge`
```tsx
// Local helper component to render the patch icon (champion or item/rune)
function PatchAvatar({ 
  patch, 
  iconMap 
}: { 
  patch: Patch; 
  iconMap: Record<string, string>; 
}) {
  const isChampion = (patch as any).is_champion !== false;
  const nameEn = patch.champion_name_en || '';
  const nameDefault = patch.champion_name || '';

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300">
      {isChampion ? (
        <img 
          src={nameEn === 'Norra' ? '/images/ノラ.avif' : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${nameEn.replace(/[^a-zA-Z0-9]/g, '') || ''}.png`}
          alt={nameEn || nameDefault}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-icon')) {
              const fallback = document.createElement('div');
              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-inner';
              fallback.innerText = nameDefault.substring(0, 1) || '?';
              parent.appendChild(fallback);
            }
          }}
        />
      ) : iconMap[nameEn.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || ''] ? (
        <img 
          src={iconMap[nameEn.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']}
          alt={nameEn || nameDefault}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
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

// Local helper component to render the change type badge
function ChangeTypeBadge({ changeType }: { changeType: string }) {
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "buff":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "nerf":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      case "adjust":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "new":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(changeType)}`}>
      {changeType.toUpperCase()}
    </span>
  );
}
```

#### Proposed Refactored Main Return JSX:
By feeding these helper components back into the dual-render tree, the return JSX is reduced and simplified significantly:
```tsx
{/* ... Inside return block ... */}
<div className="overflow-x-auto">
  {/* ... (Version selector block) ... */}

  {filteredPatches.length === 0 ? (
    <div className="text-center py-12 text-slate-400 font-medium">
      {t("noResults")}
    </div>
  ) : (
    <>
      {/* Desktop View (>=md) */}
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-600 text-sm">
            <th className="p-3 border-b border-slate-200 font-semibold w-16"></th>
            <th className="p-3 border-b border-slate-200 font-semibold">{t("version")}</th>
            <th className="p-3 border-b border-slate-200 font-semibold">{t("champion")}</th>
            <th className="p-3 border-b border-slate-200 font-semibold">{t("type")}</th>
            <th className="p-3 border-b border-slate-200 font-semibold">{t("description")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatches.map((patch) => (
            <tr 
              key={patch.id} 
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="p-3 align-top">
                <PatchAvatar patch={patch} iconMap={iconMap} />
              </td>
              <td className="p-3 text-sm font-black text-indigo-900 align-top pt-5 whitespace-nowrap">
                {patch.version}
              </td>
              <td className="p-3 text-sm font-bold text-slate-800 align-top pt-5">
                {locale === 'en' ? (patch.champion_name_en || patch.champion_name) : patch.champion_name}
              </td>
              <td className="p-3 text-sm align-top pt-5 whitespace-nowrap">
                <ChangeTypeBadge changeType={patch.change_type} />
              </td>
              <td className="p-3">
                {renderDescription(locale === 'en' ? (patch.description_en || patch.description) : patch.description)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View (<md) */}
      <div className="md:hidden space-y-4">
        {filteredPatches.map((patch) => (
          <div 
            key={patch.id} 
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PatchAvatar patch={patch} iconMap={iconMap} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">
                    {locale === 'en' ? (patch.champion_name_en || patch.champion_name) : patch.champion_name}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Patch {patch.version}</span>
                </div>
              </div>
              <ChangeTypeBadge changeType={patch.change_type} />
            </div>
            <div className="text-sm text-slate-700 pl-1">
              {renderDescription(locale === 'en' ? (patch.description_en || patch.description) : patch.description)}
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
```

---

## 2. Champion Growth/Skill Tables Margins (`src/app/[locale]/champions/[id]/page.tsx`)

### The `ml-[72px]` Margin Issue
In the Champion Detail page, under each champion skill section, there is a level-up progression details table.
- **Definition Location**: `src/app/[locale]/champions/[id]/page.tsx` (Line 611):
  ```tsx
  <div className="mt-2 md:ml-[72px] overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
  ```
- **Rationale for Desktop Layout**: 
  - The skill header utilizes a `flex gap-4` layout containing a `w-14` (56px) icon.
  - `56px (icon width) + 16px (gap-4) = 72px`.
  - On desktop, the skill description is aligned exactly to the right of the icon.
  - To align the growth table with the description text block and avoid placing it under the icon, a left margin of `72px` (`ml-[72px]`) is added.
- **Mobile Viewport Behavior**:
  - The component currently sets `md:ml-[72px]`.
  - In Tailwind CSS, utility classes with the `md:` prefix apply *only* on screens `>= md` (768px). On smaller (mobile) screens, the `md:` classes do not apply.
  - Therefore, the browser falls back to the default style, which has no margin-left (equivalent to `0`).
- **Proposed Enhancement**:
  - To make the margin behavior explicit, self-documenting, and robust against style leaking or inheritance issues from other layout elements, we propose using `ml-0 md:ml-[72px]`.
  - This ensures that on viewports smaller than `md`, the margin-left is guaranteed to be `0`, allowing the growth table to occupy the full width of its card container.
  - The `overflow-x-auto` wrapper ensures that if the table is wider than the viewport, it remains scrollable horizontally inside the wrapper, rather than breaking the flex grid or causing parent layout overflows.

#### Verification of Proposed Change:
- **Code Line 611 Modification**:
  *Before*:
  ```tsx
  <div className="mt-2 md:ml-[72px] overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
  ```
  *After*:
  ```tsx
  <div className="mt-2 ml-0 md:ml-[72px] overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
  ```

This explicit class override confirms layout compliance with the Milestone 3 specification while ensuring that no text, values, or labels are changed.
