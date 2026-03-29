# Patch: `next-themes` React 19 Script Tag Warning

## Problem

After upgrading to **Next.js 16.2** (which uses React 19 / Turbopack), the following browser console error appears on every page load:

```
Encountered a script tag while rendering React component.
Scripts inside React components are never executed when rendering on the client.
Consider using template tag instead.
```

The full stack trace points to:

```
at ThemeProvider (src/app/_theme/ThemeProvider.tsx:4)
at ThemeProviderClient (src/app/_theme/ThemeProviderClient.tsx:21)
at RootLayout (src/app/layout.tsx:148)
```

### Root Cause

`next-themes` v0.4.6 renders a `<script>` tag via its internal `ThemeScript` component on **every render**, including client-side renders. React 19 introduced a new warning for inline `<script>` tags encountered during client-side rendering, since such scripts are never executed by the browser in that context (they only make sense in SSR-generated HTML where the browser runs them once before hydration to prevent flash of unstyled content — FOUC).

The relevant code in `node_modules/next-themes/dist/index.mjs` (pre-patch):

```js
_=t.memo(({...}) => {
  let p = JSON.stringify([...]).slice(1,-1);
  return t.createElement("script", {
    suppressHydrationWarning: true,
    nonce: typeof window === "undefined" ? nonce : "",
    dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` }
  });
});
```

The `nonce` was already gated behind `typeof window === "undefined"`, indicating the original author was aware the script is only meaningful on the server — but `null` was never returned for the client case.

## Upstream Fix

The fix is tracked in the upstream pull request:

- **PR**: [pacocoursey/next-themes#386](https://github.com/pacocoursey/next-themes/pull/386)
- **Branch**: [`jakubwarkusz/next-themes` — `fix/react-19-script-warning`](https://github.com/jakubwarkusz/next-themes/tree/fix/react-19-script-warning)
- **Status**: Open / not yet merged into `next-themes` at the time of writing (2026-03-21)

The fix is a one-liner — return `null` from `ThemeScript` when running on the client:

```ts
if (typeof window !== 'undefined') return null;
```

## Applied Workaround — `pnpm patch`

Until the fix is published in an official `next-themes` release, a `pnpm patch` is used to apply the change locally.

### Patch File

[patches/next-themes@0.4.6.patch](../patches/next-themes@0.4.6.patch)

The patch modifies both distribution files:

| File | Change |
|------|--------|
| `dist/index.mjs` | Adds `if(typeof window!=="undefined")return null;` at the top of `ThemeScript`; simplifies `nonce` (no longer conditionally empty) |
| `dist/index.js` | Same change in the CJS build |

### Registration in `package.json`

The patch is registered under the `pnpm.patchedDependencies` field:

```json
"pnpm": {
  "patchedDependencies": {
    "next-themes@0.4.6": "patches/next-themes@0.4.6.patch"
  }
}
```

This ensures `pnpm install` re-applies the patch automatically on every fresh install (e.g. in CI or after `node_modules` is deleted).

## How the Patch Was Created

```bash
# 1. Start the patch session — pnpm copies the package to a temp directory
pnpm patch next-themes@0.4.6

# 2. Edit .pnpm_patches/next-themes@0.4.6/dist/index.mjs and index.js
#    Add: if(typeof window!=="undefined")return null;
#    at the beginning of the ThemeScript memo component body
#    Remove the conditional nonce: typeof window==="undefined"?nonce:""
#    Replace with just: nonce

# 3. Commit the patch (writes patches/next-themes@0.4.6.patch)
pnpm patch-commit '/path/to/project/node_modules/.pnpm_patches/next-themes@0.4.6'

# 4. Add pnpm.patchedDependencies to package.json (pnpm patch-commit should do
#    this automatically, but verify it is present)

# 5. Reinstall to confirm the patch applies cleanly
pnpm install
```

## Verifying the Patch Is Active

```bash
grep -o 'typeof window!=="undefined")return null' node_modules/next-themes/dist/index.mjs
# Expected output: typeof window!=="undefined")return null

grep -o 'typeof window!=="undefined")return null' node_modules/next-themes/dist/index.js
# Expected output: typeof window!=="undefined")return null
```

If either command returns no output, the patch is not applied — run `pnpm install` again.

## How to Revert When the Official Fix Is Published

Once the PR is merged and a new `next-themes` version is released (e.g. `0.4.7` or `0.5.0`):

### Step 1 — Bump the version in `package.json`

```json
"next-themes": "^0.4.7"
```

(or whatever the new version is)

### Step 2 — Remove the patch file

```bash
rm patches/next-themes@0.4.6.patch
```

### Step 3 — Remove the `pnpm.patchedDependencies` entry from `package.json`

Remove the entire `pnpm` block (or just the `next-themes` entry inside it if other patches exist):

```json
// Remove this:
"pnpm": {
  "patchedDependencies": {
    "next-themes@0.4.6": "patches/next-themes@0.4.6.patch"
  }
}
```

### Step 4 — Install the new version

```bash
pnpm install
```

### Step 5 — Verify the warning is gone

Start the dev server and open the browser console — no `Encountered a script tag` warning should appear.

```bash
pnpm dev
```

### Step 6 — Commit the cleanup

```bash
git add patches/ package.json pnpm-lock.yaml
git commit -m "chore: remove next-themes patch, bump to vX.Y.Z with upstream fix"
```

## References

| Resource | URL |
|----------|-----|
| Upstream issue | https://github.com/pacocoursey/next-themes/issues/385 |
| Upstream PR with fix | https://github.com/pacocoursey/next-themes/pull/386 |
| Fork branch with fix | https://github.com/jakubwarkusz/next-themes/tree/fix/react-19-script-warning |
| React 19 script warning docs | https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template |
| pnpm patch docs | https://pnpm.io/cli/patch |
