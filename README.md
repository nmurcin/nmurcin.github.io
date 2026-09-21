# Engineering portfolio V2

Static HTML/CSS/JavaScript for https://nmurcin.github.io/. No framework, bundler, or application server is required for production.

## Structure

- index.html: portfolio content and SEO/social metadata.
- styles.css / script.js: responsive layouts, light/dark themes, mobile navigation, native-dialog gallery.
- resume.pdf: current résumé, copied unchanged from the supplied source.
- assets/projects/: descriptive project assets. Original asset filenames remain available for old links.
- assets/project-media.js: generated registry of optional real photographs.
- downloads/: editable V2 PPTX and application-ready PDF.
- presentation/: reproducible presentation source. See docs/DECK.md.
- archive/Portfolio_Nathaniel_Murcin_V1.pdf: byte-identical copy of the supplied V1 slide portfolio.
- docs/: asset provenance, claims review, QA, and deployment/rollback instructions.
- tools/: asset registration and QA helpers.

## Run locally

From this directory:

    python -m http.server 8765 --bind 127.0.0.1

Open http://127.0.0.1:8765/. Production is GitHub Pages, main branch, root folder.
The site also works without JavaScript; image links open the originals.

## Update the résumé

Replace resume.pdf with the new approved PDF. Check dates and facts in index.html and the presentation source against it, regenerate the deck, and update sitemap.xml. The résumé is the authority for claims, especially Blue Origin. Never add Blue Origin imagery or details beyond the approved résumé.

## Add the two future images

Place real, approved images at these exact paths:

- assets/projects/passthrough/passthrough-hardware.jpg
- assets/projects/fins/fin-design-tree.jpg

Install Pillow if necessary, then register the images:

    python -m pip install Pillow
    python tools/update_assets.py

Commit the photographs and assets/project-media.js. No HTML editing is needed. Until registered, the website displays its complete text layout without broken-image requests. The deck generator detects the same optional files when regenerated. See docs/DECK.md for that workflow.

For replacement images at other existing paths, preserve the subject and update HTML width/height if dimensions change. Do not stretch images or use unrelated photos as evidence. See docs/ASSETS.md.

## Versions and deployment

V1 production commit: 83280310422c95757c72e008906c70ea10056f3d.

- Production repository: nmurcin/nmurcin.github.io
- Production branch and Pages source: main, / (root)
- V1 archive branch: archive/portfolio-v1
- V1 version tag: portfolio-v1-final-2026-09
- Additional private history backup: nmurcin/portfolio-v1-archive (main and V1 tag)
- V2 development branch: portfolio-v2

See docs/DEPLOYMENT.md for cutover and a history-preserving rollback.

## Personal application routes

/watch-together/ is served by nmurcin/watch-together.
/blue-origin-landings/ is served by nmurcin/blue-origin-landings.
Both are separate GitHub Pages project repositories using main / (root).
Their code and Pages settings are outside this repository and were not changed.
Removing their footer links does not remove their routes.
