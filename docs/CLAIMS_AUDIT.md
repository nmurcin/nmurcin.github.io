# V2 claims and confidentiality audit

Audit date: 2026-09-20

Factual authority: `C:\Documents\Resumes\ATL\Nathaniel_Murcin_Resume.pdf`

Reviewed outputs:

- `index.html`
- `presentation/build-deck.mjs`
- `downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pptx`
- `downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pdf`
- root `resume.pdf`

## Result

No blocking factual or confidentiality defect was found in the reviewed V2 website or deck.

The Blue Origin website section (`index.html`, experience section) and slide 3 (`presentation/build-deck.mjs`) are strict subsets or minor meaning-preserving edits of the current resume. They use the completed May 2026-August 2026 date range and past-tense verbs. No Blue Origin photograph, P&ID, system diagram, inferred architecture, or fabricated technical visual is present.

## Claim mapping

| Topic | Public treatment | Authority | Status |
| --- | --- | --- | --- |
| Blue Origin dates, role, location | Website experience section; slides 2-3 | Current resume, Experience / Blue Origin | Verified |
| Blue Origin fluids work and approximately 60% result | Website experience section; slide 3 | Current resume, Blue Origin / Fluids Engineering | Verified; public copy is a subset |
| Blue Origin manufacturing fixture and validation | Website experience section; slide 3 | Current resume, Blue Origin / Lunar Manufacturing | Verified; public copy is a subset |
| Fin trade study and thermoforming | Selected work; slide 4 | Current resume, GTXR bullets 1-2 | Verified |
| 0.28 mm fin result | Selected work; slide 4 | Current resume, GTXR bullet 2 | Verified as measured average global geometric error |
| 1.6 degree target and less-than-0.1 degree result | Selected work; slide 5 | Current resume, GTXR bullet 3 | Verified; copy preserves independent metrology and all-four-fins scope |
| Passthrough turnaround, test, and flight result | Selected work; slide 6 | Current resume, GTXR bullet 4 | Verified |
| Composite test and model validation | Selected work; slide 7 | Current resume, GTXR bullet 5 | Verified; 5% is consistently labeled an acceptance criterion, not a measured error |
| Pursuit metrics and qualification | Experience; slide 8 | Current resume, Pursuit Aerospace | Verified |
| Zinn research | Research section; slide 9 | Current resume, Ben T. Zinn Combustion Laboratory | Verified |
| Publication names, years, and identifiers | Research section; slide 9 | Current resume, Publications | Verified; both are identified as AIAA Regional Student Conference Proceedings |
| Mock launch rail and two-week delivery | Additional work; slide 11 | Preserved V1 portfolio, page 5 | Verified against legacy source; intentionally secondary |

## Attribution review

- Team language is retained for the thermoforming process (`Co-developed`).
- Personal design, fabrication, analysis, and test verbs match the current resume.
- The Pursuit 55% result is attributed to broader one-piece-flow changes rather than solely to the gauges.
- Independent metrology is explicitly retained for the fin-alignment result.
- No sole-ownership claim was added to team outcomes.

## Resume identity

The deployed root copy and the supplied current resume have the same SHA-256 hash:

`DBD219CE4C4D57CAF5A82FBB13259FBA883D8D13235A99BE8559B19D267305D5`

## Limitations

- This audit treats the supplied current resume as authoritative and does not independently verify employer or project facts.
- The mock launch rail is intentionally sourced from the preserved V1 portfolio because it does not appear in the current resume.
- No public photographs are available for Blue Origin, Pursuit Aerospace, composite shear testing, or the passthrough. Their text-only treatment should remain until real, publishable evidence is supplied.
- The future passthrough and fin design-tree images require a new confidentiality and claim-context review before publication.

## Final release review - 2026-09-21

Rechecked the final website and 11-slide deck against the supplied current resume. Blue Origin sentences remain subsets of the resume, with no technical expansion or project images. The final deck explicitly attributes the 55% manufacturing result to broader one-piece-flow changes and uses the correct degree and multiplication symbols. The 5% value remains an acceptance criterion. All 11 PowerPoint renders and PDF pages were inspected individually.

The V1 PDF and current resume were rehashed; both remain byte-identical to their supplied sources and the hashes recorded above.
