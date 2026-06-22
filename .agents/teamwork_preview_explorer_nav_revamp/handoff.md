# Handoff Report — Nav Revamp Explorer

## 1. Observation
I directly observed the layout structure and roles across the three target files:

*   **`src/app/[locale]/layout.tsx`**
    *   An async Server Component:
        ```typescript
        export default async function RootLayout({
          children,
          params
        }: Readonly<{
          children: React.ReactNode;
          params: Promise<{ locale: string }>;
        }>)
        ```
    *   Imports and wraps the layout directly (Lines 81–87):
        ```typescript
        <NextIntlClientProvider messages={messages}>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
        ```

*   **`src/components/layout/Sidebar.tsx`**
    *   Line 9:
        ```typescript
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800">
        ```
    *   Imports Lucide icons (Line 2) and translation hooks (Line 6).
    *   Contains static navigational `Link` items mapping to `/`, `/tier-list`, `/patches`, `/champions`, and `/calculator`.

*   **`src/components/layout/Header.tsx`**
    *   Line 1: `"use client";`
    *   Lines 19–22:
        ```typescript
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="font-semibold text-slate-800">
            {t("title")}
          </div>
        ```

## 2. Logic Chain
1. **Server vs Client Component Limitation**: Since `RootLayout` is a server component, it cannot use `useState` to control whether the navigation drawer is open or closed.
2. **State Coordination**: The toggle interaction originates in `Header` (client-side click event) and needs to update the styling of `Sidebar`. Therefore, they must share a common state parent.
3. **LayoutShell Pattern**: Creating a new client-side React Fragment component `LayoutShell` is the cleanest solution. It wraps `Sidebar` and the content container inside `layout.tsx` and passes the state callbacks `isOpen` and `onClose` / `onMenuToggle` downward.
4. **Tailwind Drawer Implementation**: Using Tailwind CSS utility classes, the sidebar can be hidden on small viewports (`-translate-x-full lg:translate-x-0`) and absolute/fixed positioned (`fixed z-50 lg:static`). An overlay backdrop is conditionally rendered to handle close-on-click events.

## 3. Caveats
- No caveats. The proposed changes are standard Next.js / Tailwind CSS layout improvements and do not present major complexity or risk.

## 4. Conclusion
We recommend introducing a `LayoutShell` wrapper, modifying `Header` and `Sidebar` to accept layout toggling props, using Tailwind's transform transition classes for a smooth slide-in, and hooking up `onClose` to the navigational links and backdrop. This satisfies all requirements without changing any user-visible text.

## 5. Verification Method
1. **Compile Verification**: Execute `npm run build` to verify there are no compilation or layout hydration issues.
2. **Responsive Rendering Verification**:
   - Shrink browser width below `1024px` (or open Chrome DevTools and select a mobile preset):
     - The sidebar must not be visible.
     - A hamburger menu icon button must appear in the header.
     - Click the menu button: the sidebar must slide in smoothly from the left.
     - Click the shaded backdrop overlay, the Close `X` button, or any navigation link: the sidebar must slide out of view.
   - Enlarge browser width to `>=1024px` (PC screen):
     - The sidebar must remain fixed at the left side with a width of `256px`.
     - The hamburger menu button and backdrop overlay must not be visible.
