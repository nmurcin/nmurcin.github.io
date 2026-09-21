# Engineering Portfolio V2 deck

The editable PowerPoint is generated from `build-deck.mjs` with the bundled `@oai/artifact-tool` runtime.

## Regenerate

From the repository root, run:

```powershell
& 'C:\Users\Nathaniel\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'presentation\build-deck.mjs'
```

The script writes the finished editable deck to:

`downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pptx`

Use Microsoft PowerPoint's PDF export to create:

`downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pdf`

## Future project images

- Passthrough hardware: `assets/projects/passthrough/passthrough-hardware.jpg`
- Fin design tree or trade-study screenshot: `assets/projects/fins/fin-design-tree.jpg`

The generator checks whether each file exists. When absent, both slides use finished text compositions with no broken image or visible placeholder. Rebuild the deck after adding either image.

## Sources and confidentiality

All résumé-derived copy uses `C:\Documents\Resumes\ATL\Nathaniel_Murcin_Resume.pdf` as the factual authority. The Blue Origin slide contains only résumé text and neutral typography. It contains no internal image, P&ID, reconstructed system diagram, or inferred technical detail.

## PowerPoint PDF export and visual review

On Windows with Microsoft PowerPoint installed, run from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File presentation/export-pdf.ps1 -RenderDirectory ../portfolio-v2-working/deck/review
```

This exports the PDF and optional 1600 x 900 slide images. Review every slide after regeneration. The output remains editable in PPTX; the PDF preserves selectable text. Keep render images outside the public repository.

The final September 21, 2026 release contains 11 slides. All slides and all PDF pages were rendered and individually inspected. Structural/package, layout, font, slide-count, and round-trip import checks passed. No synthetic project images were used.
