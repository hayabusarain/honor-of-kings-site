# Project: Wild Rift Site Responsive UI Revamp

## Architecture
This is a Next.js (App Router) website using Tailwind CSS and `next-intl` for localization.
- **Layout**: `src/app/[locale]/layout.tsx` embeds `Sidebar` and `Header` as core navigation components.
- **Pages**:
  - `src/app/[locale]/page.tsx` (Home/Dashboard)
  - `src/app/[locale]/champions/[id]/page.tsx` (Champion Details, containing growth data table)
  - `src/app/[locale]/patches/page.tsx` (Patches page, containing `PatchTable`)
- **Key Components**:
  - `src/components/layout/Sidebar.tsx` (Navigation sidebar, fixed 256px on desktop)
  - `src/components/layout/Header.tsx` (Top header bar, containing title and user profile button)
  - `src/components/patches/PatchTable.tsx` (Table of patch changes, to be made responsive)

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | E2E Test Track | Design and implement opaque-box test suite for mobile responsiveness and content preservation. | None | DONE | a33ed6db-7a1a-426c-b75f-b47112d36065 |
| 2 | Navigation Responsive Revamp | Hide sidebar on mobile (`lg`未満), introduce open/close menu (hamburger) and slide drawer in header. | M1 | DONE | 707e8fff-068c-4ee8-8042-71c25d0ae0b1 |
| 3 | Responsive Tables Revamp | Revamp `PatchTable` to card layout on mobile (`md`未満) and champion skill tables to use full width without `ml-[72px]` on mobile. | M2 | DONE | 2884ea3c-4af5-41e0-b99e-63284596a12a |
| 4 | Final Verification & Audit | Ensure all pages build, E2E tests pass 100%, and Forensic Audit is clean. | M3 | DONE | a86389d9-0527-4455-8140-960cd26d4a67 |

## Interface Contracts
### Header ↔ Sidebar Navigation Context / State
- If state needs to be shared to toggle the Sidebar drawer from the Header, we can introduce a simple responsive sidebar toggle state in the RootLayout, or use standard Tailwind absolute/relative positioning class overrides with peer/group triggers if CSS-only, or a React state.
- React state is cleaner: RootLayout passes toggle function or manages sidebar open/close. Since RootLayout is a Server Component, we can introduce a Client Component wrapper for the layout shell, or use client components for Header/Sidebar communicating via a custom event or a shared context if needed, or simply make Sidebar absolute on mobile and Header contain a client-side button that controls the sidebar visibility if Sidebar itself is Client, or wrap the navigation in a Client Component shell.
- Let's check: Header is `"use client"` but Sidebar is not (it does not have `"use client"` at the top, though it only uses `Link` and `useTranslations`). If Sidebar needs to maintain open/close state or we wrap them in a client shell, that will work.
- Actually, a simple shared state in a client wrapper or a simple React state in a parent client component wrapping Header and Sidebar is the most standard React pattern. Let's define the interface for state:
  - `isSidebarOpen: boolean`
  - `setIsSidebarOpen: (open: boolean) => void`

## Code Layout
- `src/components/layout/Header.tsx` - Header component
- `src/components/layout/Sidebar.tsx` - Sidebar component
- `src/components/patches/PatchTable.tsx` - Patch table component
- `src/app/[locale]/champions/[id]/page.tsx` - Champion details page
