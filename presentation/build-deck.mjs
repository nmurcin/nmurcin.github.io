import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(process.env.PORTFOLIO_REPO ?? path.join(scriptDir, ".."));
const runtimeRoot = process.env.CODEX_PRIMARY_RUNTIME ?? "C:/Users/Nathaniel/.cache/codex-runtimes/codex-primary-runtime/dependencies";
const runtimeNode = process.env.RUNTIME_NODE ?? path.join(runtimeRoot, "node/bin/node.exe");
const runtimeNodeModules = process.env.RUNTIME_NODE_MODULES ?? path.join(runtimeRoot, "node/node_modules");
const python = process.env.RUNTIME_PYTHON ?? path.join(runtimeRoot, "python/python.exe");
const skill = process.env.PRESENTATION_SKILL_DIR ?? "C:/Users/Nathaniel/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const privateDir = path.resolve(process.env.PORTFOLIO_DECK_WORKDIR ?? "C:/Users/Nathaniel/Projects/portfolio-v2-working/deck");
const stagingDir = path.join(repo, "presentation/.codex-finalizer");
const finalPptx = path.join(repo, "downloads/Nathaniel_Murcin_Engineering_Portfolio_V2.pptx");
const resumeSource = process.env.PORTFOLIO_RESUME ?? "C:/Documents/Resumes/ATL/Nathaniel_Murcin_Resume.pdf";
const oldPortfolioSource = process.env.PORTFOLIO_V1_PDF ?? "C:/Documents/Resumes/Portfolio - Nathaniel Murcin.pdf";

process.env.RUNTIME_NODE = runtimeNode;
process.env.RUNTIME_NODE_MODULES = runtimeNodeModules;
process.env.RUNTIME_PYTHON = python;
const { Presentation, PresentationFile } = await import(pathToFileURL(path.join(runtimeNodeModules, "@oai/artifact-tool/dist/artifact_tool.mjs")).href);

const C = { warm: "#F6F5F0", navy: "#102B40", gold: "#B3A369", goldText: "#756026", ink: "#132D3F", gray: "#52616B", pale: "#E7E4DB", white: "#FFFFFF" };
const FONT = "Arial";
const W = 1280, H = 720, M = 64;

await fs.mkdir(privateDir, { recursive: true });
await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(path.dirname(finalPptx), { recursive: true });

const pres = Presentation.create({ slideSize: { width: W, height: H } });

function rect(slide, x, y, w, h, fill, line = "none") {
  return slide.shapes.add({ geometry: "rect", position: { left: x, top: y, width: w, height: h }, fill, line: line === "none" ? { fill: "none", width: 0 } : line });
}
function textbox(slide, text, x, y, w, h, opts = {}) {
  const shape = slide.shapes.add({ geometry: "textbox", position: { left: x, top: y, width: w, height: h }, fill: "none", line: { fill: "none", width: 0 } });
  shape.text = text;
  shape.text.style = {
    typeface: FONT,
    fontSize: opts.size ?? 25,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
    lineSpacing: opts.lineSpacing ?? 1.08,
    autoFit: opts.autoFit ?? "none",
    insets: opts.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}
function rich(slide, paragraphs, x, y, w, h, opts = {}) {
  const shape = textbox(slide, "", x, y, w, h, opts);
  shape.text.set(paragraphs);
  return shape;
}
function rule(slide, x, y, w, color = C.gold, h = 3) { return rect(slide, x, y, w, h, color); }
function title(slide, text, number, dark = false) {
  textbox(slide, text, M, 46, 1020, 56, { size: 42, bold: true, color: dark ? C.white : C.navy });
  rule(slide, M, 112, 1152, dark ? C.gold : C.gold, 3);
  textbox(slide, String(number).padStart(2, "0"), 1170, 49, 46, 30, { size: 18, bold: true, color: dark ? C.gold : C.gray, align: "right" });
}
function footer(slide, text, dark = false) {
  textbox(slide, text, M, 676, 980, 24, { size: 18, color: dark ? C.pale : C.gray });
}
async function image(slide, rel, x, y, w, h, alt, fit = "cover") {
  const full = path.join(repo, rel);
  const bytes = await fs.readFile(full);
  const ext = path.extname(full).toLowerCase();
  const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  return slide.images.add({ blob: bytes, contentType: type, alt, fit, position: { left: x, top: y, width: w, height: h } });
}
async function optionalImage(slide, rel, x, y, w, h, alt, fit = "cover") {
  try { await fs.access(path.join(repo, rel)); await image(slide, rel, x, y, w, h, alt, fit); return true; } catch { return false; }
}
function note(slide, text, old = false) {
  slide.speakerNotes.textFrame.setText(`Factual source: ${resumeSource}.${old ? ` Supporting public project evidence: ${oldPortfolioSource}.` : ""} ${text}`.trim());
}

// 1. Title
{
  const s = pres.slides.add(); s.background.fill = C.navy;
  rule(s, M, 78, 74, C.gold, 4);
  textbox(s, "NATHANIEL MURCIN", M, 132, 560, 70, { size: 50, bold: true, color: C.white });
  textbox(s, "Aerospace Engineering", M, 220, 500, 45, { size: 29, color: C.gold });
  textbox(s, "Georgia Institute of Technology", M, 278, 500, 36, { size: 23, color: C.pale });
  textbox(s, "Engineering portfolio", M, 589, 400, 28, { size: 18, bold: true, color: C.pale });
  await image(s, "assets/v2_p3_0.jpeg", 655, 52, 561, 616, "Carbon fiber fin layup in progress", "contain");
  textbox(s, "GTXR fin layup", 655, 674, 300, 22, { size: 18, color: C.pale });
  note(s, "Image: repository asset assets/v2_p3_0.jpeg.");
}

// 2. Profile
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Engineering profile", 2);
  textbox(s, "Education", M, 146, 340, 32, { size: 19, bold: true, color: C.goldText });
  textbox(s, "Georgia Institute of Technology", M, 187, 480, 36, { size: 28, bold: true });
  textbox(s, "B.S. Aerospace Engineering\nExpected May 2027\nB.S./M.S. Aerospace Engineering Program\nMinor in Astrophysics\nGPA 4.00", M, 237, 500, 205, { size: 24, color: C.gray, lineSpacing: 1.2 });
  rule(s, 620, 146, 3, C.gold, 470);
  textbox(s, "Capability areas", 666, 146, 400, 32, { size: 19, bold: true, color: C.goldText });
  textbox(s, "Fluid systems and aerospace hardware\nStructural analysis and experimental testing\nPrecision tooling and manufacturing", 666, 188, 520, 124, { size: 25, bold: true, lineSpacing: 1.15 });
  textbox(s, "Experience", 666, 363, 300, 32, { size: 19, bold: true, color: C.goldText });
  textbox(s, "Blue Origin", 666, 405, 330, 26, { size: 19, bold: true });
  textbox(s, "May 2026 - Aug. 2026", 996, 405, 220, 26, { size: 18, color: C.gray, align: "right" });
  textbox(s, "Pursuit Aerospace", 666, 446, 330, 26, { size: 19, bold: true });
  textbox(s, "Aug. 2025 - Dec. 2025", 996, 446, 220, 26, { size: 18, color: C.gray, align: "right" });
  textbox(s, "Georgia Tech Experimental Rocketry", 666, 487, 360, 26, { size: 18, bold: true });
  textbox(s, "Aug. 2023 - Present", 996, 487, 220, 26, { size: 18, color: C.gray, align: "right" });
  textbox(s, "Ben T. Zinn Combustion Laboratory", 666, 528, 380, 26, { size: 18, bold: true });
  textbox(s, "Jan. 2026 - Present", 996, 528, 220, 26, { size: 18, color: C.gray, align: "right" });
  footer(s, "Aerospace hardware / Analysis / Manufacturing / Test");
  note(s, "All education, capability, and date text comes from the resume.");
}

// 3. Blue Origin
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Professional aerospace experience", 3);
  textbox(s, "BLUE ORIGIN", M, 145, 300, 30, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Fluids & Manufacturing Engineering Intern", M, 181, 700, 38, { size: 28, bold: true });
  textbox(s, "Cape Canaveral, FL  /  May 2026 - Aug. 2026", M, 226, 700, 28, { size: 20, color: C.gray });
  rule(s, M, 279, 1152, C.pale, 2);
  textbox(s, "FLUIDS ENGINEERING", M, 312, 500, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Designed a cryogenic tank-farm P&ID for a large-scale ground-test facility. Reduced component count about 60% versus heritage designs by downsizing, eliminating branches, and challenging requirements.", M, 352, 510, 142, { size: 23, lineSpacing: 1.12 });
  textbox(s, "Sized, selected, and validated cryogenic piping, valves, and relief devices. Developed the BOM and coordinated with suppliers through procurement.", M, 510, 510, 112, { size: 21, color: C.gray });
  rule(s, 620, 312, 3, C.gold, 309);
  textbox(s, "LUNAR MANUFACTURING", 666, 312, 500, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Designed 6 Creo versions for an adaptable gripping fixture. Reduced fasteners from 8 to 1 while improving technician usability and preventing slippage, part damage, and metal-chip FOD. The design passed PDR.", 666, 352, 550, 154, { size: 23, lineSpacing: 1.12 });
  textbox(s, "Validated the fixture with hand calculations and Creo static structural FEA.", 666, 522, 520, 64, { size: 21, color: C.gray });
  textbox(s, "Preliminary hazard analysis and CONOPS supported formal HAZOP review.", M, 638, 1120, 28, { size: 18, color: C.gray });
  note(s, "Blue Origin experience: current resume, Fluids Engineering and Lunar Manufacturing.");
}

// 4. Fins
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Fin design and thermoforming", 4);
  await image(s, "assets/v2_p3_2.jpeg", M, 147, 590, 424, "CNC-machined aluminum tooling for fin core thermoforming", "cover");
  textbox(s, "CNC-machined aluminum tooling", M, 580, 590, 22, { size: 18, color: C.gray });
  const hasTree = await optionalImage(s, "assets/projects/fins/fin-design-tree.jpg", 700, 190, 516, 146, "Fin design trade-study structure", "contain");
  textbox(s, "Structured trade study", 700, 148, 500, 32, { size: 20, bold: true, color: C.goldText });
  textbox(s, hasTree ? "Materials, geometry, and manufacturing constraints informed the trade study." : "Evaluated materials, geometries, and manufacturing constraints. Down-selected feasible concepts using analytical feasibility, machinability, and engineering first principles.", 700, hasTree ? 339 : 191, 500, hasTree ? 45 : 132, { size: hasTree ? 18 : 23, lineSpacing: 1.12 });
  rule(s, 700, hasTree ? 390 : 356, 516, C.pale, 2);
  textbox(s, "Thermoforming process", 700, hasTree ? 405 : 385, 400, 32, { size: 20, bold: true, color: C.goldText });
  textbox(s, "Co-developed and evaluated a process for double-wedge PMI foam fin cores using CNC-machined aluminum tooling and 3D metrology.", 700, hasTree ? 445 : 427, 516, 103, { size: 23, lineSpacing: 1.12 });
  textbox(s, "0.28 mm", 700, 555, 230, 62, { size: 46, bold: true, color: C.navy });
  textbox(s, "average global geometric error", 931, 577, 285, 26, { size: 19, color: C.gray });
  footer(s, "Georgia Tech Experimental Rocketry  /  Fin Design & Manufacturing Lead");
  note(s, "Image: repository asset assets/v2_p3_2.jpeg. Fin design and thermoforming claims: current resume, GTXR.");
}

// 5. Alignment jig
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Fin alignment jig", 5);
  await image(s, "assets/v2_p4_0.webp", M, 147, 346, 245, "CAD model of modular four-tower fin alignment jig", "contain");
  await image(s, "assets/v2_p4_1.webp", 467, 147, 346, 245, "Machined aluminum components for fin alignment jig", "contain");
  await image(s, "assets/v2_p5_1.jpeg", 870, 147, 346, 245, "Fin alignment jig in use on the airframe", "contain");
  textbox(s, "CAD", M, 401, 346, 22, { size: 18, bold: true, color: C.gray });
  textbox(s, "Machining", 467, 401, 346, 22, { size: 18, bold: true, color: C.gray });
  textbox(s, "Assembly", 870, 401, 346, 22, { size: 18, bold: true, color: C.gray });
  textbox(s, "Roll-coupling problem", M, 463, 213, 52, { size: 20, bold: true });
  textbox(s, "1.6\u00B0 fin cant requirement", 306, 463, 245, 52, { size: 20, bold: true });
  textbox(s, "Modular four-tower fixture", 610, 463, 248, 52, { size: 20, bold: true });
  textbox(s, "CAD, CAM, and machining", 918, 463, 275, 52, { size: 20, bold: true });
  rule(s, M, 537, 1129, C.gold, 3);
  textbox(s, "<0.1\u00B0", M, 562, 210, 64, { size: 45, bold: true, color: C.navy });
  textbox(s, "Independent metrology verified all four fins within <0.1\u00B0 of the 1.6\u00B0 target.", 285, 575, 850, 52, { size: 24, color: C.gray });
  footer(s, "Designed, CAM programmed, and machined by Nathaniel Murcin");
  note(s, "Images: repository assets v2_p4_0.webp, v2_p4_1.webp, and v2_p5_1.jpeg. Sequence and metrics come from the resume; roll-coupling context appears in the supplied V1 portfolio.", true);
}

// 6. Passthrough
{
  const s = pres.slides.add(); s.background.fill = C.navy; title(s, "Emergency electrical passthrough", 6, true);
  const hasPhoto = await optionalImage(s, "assets/projects/passthrough/passthrough-hardware.jpg", 704, 148, 512, 450, "Flight-critical NPT electrical passthrough hardware", "contain");
  const textW = hasPhoto ? 560 : 900;
  textbox(s, "During launch integration, the sole flight unit failed.", M, 157, textW, 60, { size: 28, bold: true, color: C.white });
  textbox(s, "Designed and fabricated a flight-critical NPT electrical passthrough.", M, 246, textW, 85, { size: 25, color: C.pale });
  textbox(s, "14 hours", M, 375, 280, 64, { size: 50, bold: true, color: C.gold });
  textbox(s, "design and fabrication turnaround", M, 438, 420, 28, { size: 19, color: C.pale });
  textbox(s, "2\u00D7 MEOP", hasPhoto ? M : 505, hasPhoto ? 502 : 375, 300, 64, { size: 50, bold: true, color: C.gold });
  textbox(s, "hydrostatic test passed", hasPhoto ? M : 505, hasPhoto ? 565 : 438, 300, 28, { size: 19, color: C.pale });
  rule(s, M, 632, 1152, C.gold, 3);
  textbox(s, "The hardware enabled successful flight.", M, 647, 900, 34, { size: 24, bold: true, color: C.white });
  note(s, "Electrical passthrough claims: current resume, GTXR.");
}

// 7. Composite test
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Composite shear modulus testing", 7);
  textbox(s, "TEST OBJECTIVE", M, 155, 280, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Determine the in-plane shear modulus of composite sandwich panels.", M, 198, 500, 102, { size: 30, bold: true, lineSpacing: 1.08 });
  rule(s, M, 330, 520, C.pale, 2);
  textbox(s, "EXPERIMENT", M, 362, 280, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Designed and executed a plate-twist testing apparatus.", M, 404, 500, 95, { size: 27, lineSpacing: 1.1 });
  rule(s, 621, 155, 3, C.gold, 472);
  textbox(s, "MODEL VALIDATION", 678, 155, 350, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "5%", 678, 219, 300, 105, { size: 80, bold: true, color: C.navy });
  textbox(s, "acceptance criterion", 678, 322, 370, 38, { size: 25, color: C.gray });
  textbox(s, "The experiment verified the ANSYS model within the acceptance criterion for future fin development.", 678, 410, 500, 135, { size: 28, lineSpacing: 1.12 });
  footer(s, "Analysis  /  Experiment  /  Validation");
  note(s, "Composite testing and model validation: current resume, GTXR.");
}

// 8. Pursuit
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Manufacturing engineering impact", 8);
  textbox(s, "PURSUIT AEROSPACE", M, 143, 360, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Engineering Intern  /  Aug. 2025 - Dec. 2025", M, 179, 620, 30, { size: 22, color: C.gray });
  rule(s, M, 233, 1152, C.pale, 2);
  textbox(s, "15", M, 272, 110, 55, { size: 44, bold: true, color: C.navy });
  textbox(s, "quick-change dot-peen fixtures", 185, 278, 370, 34, { size: 24, bold: true });
  textbox(s, "6 s  to  1 s", 701, 272, 260, 55, { size: 38, bold: true, color: C.navy });
  textbox(s, "average load/unload time", 973, 282, 243, 30, { size: 20, color: C.gray });
  rule(s, M, 352, 1152, C.pale, 2);
  textbox(s, "40 s  to  2 s", M, 391, 280, 55, { size: 38, bold: true, color: C.navy });
  textbox(s, "inspection time using Go/No-Go gauges", 360, 402, 410, 30, { size: 20, color: C.gray });
  textbox(s, "55%", 869, 391, 130, 55, { size: 40, bold: true, color: C.navy });
  textbox(s, "less time between completed parts", 1007, 392, 209, 54, { size: 19, color: C.gray });
  textbox(s, "Broader one-piece-flow changes", 869, 449, 347, 24, { size: 18, color: C.gray });
  rule(s, M, 480, 1152, C.pale, 2);
  textbox(s, "3 days", M, 519, 160, 55, { size: 40, bold: true, color: C.navy });
  textbox(s, "less lead time", 227, 530, 170, 30, { size: 20, color: C.gray });
  textbox(s, "$1,000 / part", 508, 519, 260, 55, { size: 40, bold: true, color: C.navy });
  textbox(s, "avoided outsourced cleaning and shipping", 786, 530, 430, 30, { size: 20, color: C.gray });
  textbox(s, "Developed an in-house supercleaning process qualified for production use by Rolls-Royce and Pursuit Quality.", M, 610, 1100, 48, { size: 22, bold: true });
  note(s, "All metrics and qualification language come from the resume.");
}

// 9. Research and publications
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Research and publications", 9);
  textbox(s, "BEN T. ZINN COMBUSTION LABORATORY", M, 145, 520, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "Undergraduate Researcher", M, 184, 430, 34, { size: 27, bold: true });
  textbox(s, "Jan. 2026 - Present", 936, 188, 280, 28, { size: 20, color: C.gray, align: "right" });
  textbox(s, "Supported reacting jets-in-crossflow experiments by assembling regulated multi-gas delivery hardware and executing established MATLAB/PIV post-processing workflows.", M, 238, 1060, 80, { size: 24, lineSpacing: 1.12 });
  rule(s, M, 344, 1152, C.pale, 2);
  textbox(s, "AIAA REGIONAL STUDENT CONFERENCE PROCEEDINGS", M, 376, 650, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "2024", M, 425, 90, 33, { size: 24, bold: true, color: C.navy });
  textbox(s, "Shear Modulus Testing in Composite Sandwich Panels", 170, 423, 810, 34, { size: 25, bold: true });
  textbox(s, "AIAA 2024-85690  /  Co-author & presenter", 170, 467, 620, 26, { size: 19, color: C.gray });
  textbox(s, "2026", M, 532, 90, 33, { size: 24, bold: true, color: C.navy });
  textbox(s, "Viability of Thermoformed Closed-Cell Foam Cores for Carbon Fiber Sandwich Rocket Fins", 170, 528, 980, 64, { size: 24, bold: true, lineSpacing: 1.05 });
  textbox(s, "AIAA 2026-112793  /  Co-author & presenter", 170, 601, 620, 26, { size: 19, color: C.gray });
  note(s, "Research role and publication metadata come from the resume. Both papers are AIAA Regional Student Conference Proceedings.");
}

// 10. Capabilities and contact
{
  const s = pres.slides.add(); s.background.fill = C.navy; title(s, "Engineering capabilities", 10, true);
  textbox(s, "ANALYSIS", M, 157, 280, 28, { size: 18, bold: true, color: C.gold });
  textbox(s, "Structural FEA\nP&ID design\nCryogenic sizing and safety\nStructural and bolted-joint analysis\nFlutter analysis", M, 203, 430, 210, { size: 25, color: C.white, lineSpacing: 1.23 });
  rule(s, 570, 157, 3, C.gold, 366);
  textbox(s, "HARDWARE & MANUFACTURING", 622, 157, 500, 28, { size: 18, bold: true, color: C.gold });
  textbox(s, "GD&T and DFM\nComposite layups and 3D printing\nCNC mill, lathe, and waterjet\nInstron testing", 622, 203, 520, 170, { size: 25, color: C.white, lineSpacing: 1.25 });
  rule(s, M, 556, 1152, C.gold, 3);
  textbox(s, "nmurcin3@gatech.edu", M, 592, 340, 28, { size: 20, bold: true, color: C.white });
  textbox(s, "linkedin.com/in/nathaniel-murcin/", 455, 592, 395, 28, { size: 20, color: C.pale });
  textbox(s, "nmurcin.github.io", 940, 592, 276, 28, { size: 20, color: C.pale, align: "right" });
  textbox(s, "Nathaniel Murcin  /  Aerospace Engineering  /  Georgia Tech", M, 657, 740, 24, { size: 18, color: C.gold });
  note(s, "Capabilities and contact details come from the resume.");
}

// 11. Appendix
{
  const s = pres.slides.add(); s.background.fill = C.warm; title(s, "Appendix: mock launch rail", 11);
  await image(s, "assets/v2_p6_3.jpeg", M, 147, 525, 422, "Assembled mock launch rail", "contain");
  await image(s, "assets/v2_p6_0.jpeg", 620, 147, 290, 250, "Launch rail guide component", "contain");
  textbox(s, "Functional rail for the 2024-2025 GTXR mock test", M, 579, 525, 28, { size: 18, color: C.gray });
  textbox(s, "Two-week delivery", 958, 147, 258, 33, { size: 23, bold: true, color: C.goldText });
  textbox(s, "Completed bending and buckling calculations, modeled components in CAD, and manufactured the wood, steel, and aluminum parts.", 958, 202, 258, 230, { size: 23, lineSpacing: 1.14 });
  rule(s, 620, 453, 596, C.pale, 2);
  textbox(s, "Result", 620, 489, 120, 28, { size: 18, bold: true, color: C.goldText });
  textbox(s, "A functional assembled launch rail for the mock test.", 620, 531, 550, 72, { size: 29, bold: true });
  footer(s, "Supporting project  /  Georgia Tech Experimental Rocketry");
  note(s, "Images: repository assets v2_p6_3.jpeg and v2_p6_0.jpeg. Project claims come from the supplied V1 portfolio.", true);
}

const candidate = path.join(stagingDir, "candidate.pptx");
await (await PresentationFile.exportPptx(pres)).save(candidate);

const { finalizePresentation } = await import(pathToFileURL(path.join(skill, "container_tools/artifact_tool_utils.mjs")).href);
await fs.rm(finalPptx, { force: true });
const result = await finalizePresentation({
  explicitTotalSlideCount: 11,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  workspaceDir: repo,
  candidatePath: candidate,
  finalPath: finalPptx,
  pythonExecutable: python,
  integrityValidatorPath: path.join(skill, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skill, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
  fontPolicy: { basis: "design", families: [FONT] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, `Nathaniel_Murcin_Engineering_Portfolio_V2.${Date.now()}.validation.json`),
});
console.log(JSON.stringify({ finalPptx, candidate, result }, null, 2));
