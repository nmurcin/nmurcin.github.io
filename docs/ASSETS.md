# Asset inventory and provenance

This inventory records the V1 raster sources retained at their original paths and the byte-identical descriptive copies prepared for V2. Dimensions are intrinsic pixel dimensions. Hashes are SHA-256.

## Raster source inventory

| Source | Dimensions | Bytes | SHA-256 | V2 descriptive copy | Supported purpose / caption |
| --- | ---: | ---: | --- | --- | --- |
| `favicon.ico` | 48 x 48 | 418 | `3626a629def5435d930f8cf282038ed3a5510066fa213fa8f03de64c8d974f13` | - | Existing site icon. |
| `assets/v2_p3_0.jpeg` | 680 x 774 | 88,842 | `8cca7ccddf13679f1d00a5f1b2371d4574505dfa4d635c248aab51b0c15b35b7` | `assets/projects/fins/fin-layup.jpg` | Carbon-fiber fin can during tip-to-tip layup. |
| `assets/v2_p3_1.jpeg` | 1075 x 602 | 121,607 | `d645e54b5c76354019705f8d57d87af3b89f4c433ed16c721353ff2d13cee807` | `assets/projects/fins/vacuum-bagging.jpg` | Vacuum bagging after carbon-fiber layup. |
| `assets/v2_p3_2.jpeg` | 973 x 520 | 40,851 | `aca8ab543022f04ce834246284830efde69f9d20b3c6a88d47b8aaef282eb99f` | `assets/projects/fins/thermoforming-tooling.jpg` | Machined aluminum molds for fin-core thermoforming. |
| `assets/v2_p3_3.jpeg` | 735 x 768 | 141,531 | `69102389ae1d74cecdeed6e8859e6219c9700bc5fb019a3b0fd3fe25536035a1` | `assets/projects/fins/prepared-fins.jpg` | Prepared carbon-fiber fins staged for final attachment. |
| `assets/v2_p4_0.webp` | 793 x 660 | 50,924 | `9b3e95d8ded631b22fb73130b6cf65eb1a284aae9b40478e2cb30985084b2bc5` | `assets/projects/alignment-jig/cad.webp` | Exploded 3D CAD view of the fin alignment jig assembly. |
| `assets/v2_p4_1.webp` | 800 x 1066 | 160,438 | `636c0658c4974307d6407e5b4930925e2ce431337844f464ca9d60a18436c902` | `assets/projects/alignment-jig/machined-parts.webp` | Machined aluminum alignment-jig parts. |
| `assets/v2_p5_0.jpeg` | 564 x 713 | 62,536 | `34671027b43a9f5abe17021d5fe9e8a7d7b7f1a58c5ca9fa10425a1b3b8dfbe0` | `assets/projects/alignment-jig/on-airframe.jpg` | Alignment jig in use setting fin cant. |
| `assets/v2_p5_1.jpeg` | 764 x 839 | 86,599 | `21f99e14fdad0cef5a2e2d6b48f7856b476c25a2f6ac30bdafc856c95cc0edb4` | `assets/projects/alignment-jig/in-use.jpg` | Alignment jig clamped to the rocket airframe to set fin cant. |
| `assets/v2_p5_2.jpeg` | 759 x 839 | 100,760 | `3cec2d4b26437728e009b7398f994962e73c78ac38bd14bd5792a1bcc4ef2efb` | `assets/projects/alignment-jig/setup.jpg` | Alignment jig prepared for use. |
| `assets/v2_p6_0.jpeg` | 578 x 523 | 27,886 | `573aac74512cef0720fb868b539b003c376bd981d33b0b77cb2878d47cab40d4` | `assets/projects/launch-rail/guide.jpg` | Machined aluminum rail-guide hardware mounted to the wooden rail. |
| `assets/v2_p6_1.jpeg` | 578 x 523 | 34,058 | `9cf8bf8c46dfe7dfe07949c88136dd69c5cdbc21e80000766ab1fc9049c4ad07` | `assets/projects/launch-rail/cradle.jpg` | Rocket airframe seated in the launch-rail cradle. |
| `assets/v2_p6_3.jpeg` | 697 x 1069 | 132,962 | `6244b0181845a9898d5d2ad35b83d08cc0e4012fa97cf53c14980a05e14f5b15` | `assets/projects/launch-rail/mock-test.jpg` | Assembled functional rail at the mock test, with the rocket loaded. |
| `assets/v2_p7_0.jpeg` | 399 x 486 | 24,753 | `9e7b63ed6ac51788036bb95626b0c67b990cb12a56a3520480214df16652479d` | - | Cuckoo-clock CAD render; optional additional CAD archive material. |
| `assets/v2_p7_3.jpeg` | 387 x 478 | 16,328 | `0f886e0d737fc743356f1f2d36e2016562b3a1a8a47ca73b81c0cfb5ec5a2b5f` | - | Sustainer-shroud CAD model; optional additional CAD archive material. |
| `assets/v2_p7_5.jpeg` | 764 x 799 | 93,415 | `10a0191211e6ec9d20af676ba13fc48e70633388b79406a1aa5d6fb38d4fa38a` | - | Turbine electric-bike CAD model from a team project; optional additional CAD archive material. |
| `assets/v2_p7_6.jpeg` | 788 x 568 | 53,402 | `ad64327f6709204cbfec6989ce45d4ba6029902e29650984f4a395ecd36c80b3` | - | Dimensioned cuckoo-clock detail drawing; optional additional CAD archive material. |
| `assets/v2_p7_7.png` | 441 x 662 | 59,707 | `68b737297a07d3f5bd032751591bcb4434579616ccc1fb420832ee21d19ff897` | - | Alignment-jig tower-base engineering drawing; optional supporting technical image. |

The existing vector sources `assets/favicon.svg` and `assets/gt-logo.svg` are retained but are outside this raster inventory.

## Copy integrity

Each V2 descriptive copy has the same byte count and SHA-256 hash as its source in the table. The original V1 paths remain in place for compatibility and recovery.

The current resume was copied from `C:/Documents/Resumes/ATL/Nathaniel_Murcin_Resume.pdf` to `resume.pdf`.

- Source and destination SHA-256: `dbd219ce4c4d57caf5a82fbb13259fba883d8d13235a99be8559b19d267305d5`

The existing slide/PDF portfolio was copied from `C:/Documents/Resumes/Portfolio - Nathaniel Murcin.pdf` to `archive/Portfolio_Nathaniel_Murcin_V1.pdf`.

- Source and archive SHA-256: `d0327ffd64e8bd56d740b416d02442e9d274a4a75c3343a119fbe52ca8758b57`

## Future approved image slots

- Electrical passthrough photograph: `assets/projects/passthrough/passthrough-hardware.jpg`
- Fin design-tree or trade-study screenshot: `assets/projects/fins/fin-design-tree.jpg`

Neither file currently exists. The folder-level README files define the no-fabrication and graceful-fallback requirements.

## Current public-image gaps

No source photographs are currently available for Blue Origin, Pursuit Aerospace, composite shear-modulus testing, or the emergency electrical passthrough. Blue Origin must remain text and metric driven using only current-resume language. Pursuit and shear testing should also use supported text and metrics unless approved real imagery is supplied. The passthrough must use its documented future image slot; do not generate or draw substitute hardware.
