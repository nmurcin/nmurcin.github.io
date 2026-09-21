# V2 release QA

Reviewed September 21, 2026.

## Website

- Chrome browser automation: 10 cases, 140 checks passed across 1920, 1366, 768, 390, and 320 pixel widths in light and dark themes.
- Zero axe accessibility violations, horizontal overflow, console/page errors, failed requests, or broken authored images.
- Keyboard skip link, visible focus, mobile menu/Escape, image gallery arrows, dialog closing and focus restoration passed.
- Reduced-motion and JavaScript-disabled checks passed. Images inside the optional collapsed appendix were opened and loaded for verification.
- All local linked assets and downloads responded successfully. The isolated localhost server correctly returns 404 for the two separately hosted personal apps; production must return 200 for both.
- Desktop, phone, dark tablet, engineering project, experience, research, and contact screenshots were inspected. Fresh top-of-page captures confirmed the sticky header and hero layouts.
- GitHub profile: HTTP 200. LinkedIn returned HTTP 999 and AIAA returned HTTP 403 to automated requests; these source-backed URLs were retained, but external page content could not be verified automatically.
- No Lighthouse score is claimed.

The QA harness now excludes only the unused lightbox image without a src, loads real appendix images, and fails on download HTTP errors and failed route checks.

## Presentation and confidentiality

All 11 slides were regenerated and passed package integrity, layout geometry, font, slide-count, and round-trip import checks. Microsoft PowerPoint exported the PDF and slide renders. All 11 slides and all 11 rendered PDF pages were individually inspected. Text remains editable in PPTX and selectable in PDF.

Checked current resume authority, completed Blue Origin dates and resume-only wording, six Creo versions, 1.6-degree fin target, independent verification of all four fins, 5% acceptance criterion, and Pursuit's broader one-piece-flow attribution. No fabricated imagery or added Blue Origin technical information is present. See CLAIMS_AUDIT.md.

V1 PDF and current resume hashes match the supplied source files. Remote archive branch, V1 tag, and separate archive repository remain at original commit 83280310422c95757c72e008906c70ea10056f3d.

## Reproduce

Start the static server as described in README.md. With Playwright and axe-core available at the paths configured in tools/qa.cjs, run:

```powershell
node tools/qa.cjs
```

Set PORTFOLIO_URL=https://nmurcin.github.io to run the browser suite against production. Raw reports and screenshots are kept outside the repository in ../portfolio-v2-working/web-qa/.

Before production is declared verified, check the Pages workflow, deployed source/download hashes, both app URLs, and a missing-page response.
