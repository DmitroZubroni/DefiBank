# Targeted product polish — 2026-11-18

Presentation-only milestone. Existing layout geometry, controls, route definitions, API/auth/wallet/contract/data code remain intact. Reference: company/www typography, subject-specific SVG craftsmanship and restrained surface hierarchy; not company/site.

## Changes
Layered navy surfaces, champagne metal controls, inset data/form surfaces, lighter heading weight, ledger table styling. Existing vault illustration gains machined grooves/index marks and matching champagne metal. Original vault ring rotation restored only in normal-motion mode; existing reduced-motion override retained.

## Verification
- Production Vite build passed; output under /private/tmp/product-polish, no tracked build artifacts.
- Every existing route checked at 320, 375, 768, 1024, 1280, 1440 CSS pixels; no document overflow or browser page errors.
- Actual full-page screenshots at 375 and 1440 included here. Bank has only a dark theme; Waves checked in light and dark themes.
- Axe color-contrast rule: zero violations at desktop across every route/theme. This is text contrast coverage, not a full accessibility certification; SVG artwork text is not covered by axe.
- Normal animation observed (bank vaultRingSpin; manufacturing diode-pulse). Reduced-motion: no active animations after settling.
- Rendered UI scan for Extended_Pictographic and decorative star: zero matches across all route/width/theme cases.
- Source emoji audit: bank service/contracts.js contains six legacy icon values, deliberately unchanged as protected metadata. Presentation maps to authored SVG; no metadata emoji rendered. Manufacturing decorative star replaced. No stored user text or payload edited.
- Interactions: bank withdrawal tab; manufacturing passport open/Escape, theme toggle, cabinet tab filtering; keyboard focus visible. No financial operation submitted.
- git diff --check passed.

## Scope and limitations
Existing dirty files excluded from this commit. Validation uses current local demo data. No live wallet, contract, network/auth integration, full security scan, Lighthouse or human usability test claimed. No new dependencies, external imagery/font requests or JavaScript runtime introduced for surface styling. Full temporary validation scripts: /private/tmp/product-polish/verify.mjs and interactions.mjs.
