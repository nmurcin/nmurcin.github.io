const { chromium } = require('../../.pixel-tv-tools/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8765';
const repo = path.resolve(__dirname, '..');
const output = path.resolve(repo, '..', 'portfolio-v2-working', 'web-qa');
const browserPath = process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const axePath = path.resolve(repo, '..', 'portfolio-v2-working', 'qa-tools', 'node_modules', 'axe-core', 'axe.min.js');
const viewports = [
  { name: 'wide-1920', width: 1920, height: 1080 },
  { name: 'laptop-1366', width: 1366, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'phone-320', width: 320, height: 700 },
];

fs.mkdirSync(output, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  browserPath,
  cases: [],
  reducedMotion: {},
  noJavaScript: {},
  localLinks: [],
  directRoutes: [],
  externalLinks: [],
};
const axeReport = [];

function check(list, name, pass, details = null) {
  list.push({ name, pass: Boolean(pass), details });
}

async function loadLazyImages(page) {
  // Lazy images inside a closed disclosure are valid but cannot be scrolled into view.
  // Open those disclosures for loading, then restore their initial state.
  await page.locator('details:not([open])').evaluateAll(details => details.forEach(detail => {
    detail.dataset.qaInitiallyClosed = '';
    detail.open = true;
  }));
  const images = page.locator('img[src]');
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(element => new Promise(resolve => {
      if (element.complete) return resolve();
      const done = () => resolve();
      element.addEventListener('load', done, { once: true });
      element.addEventListener('error', done, { once: true });
      setTimeout(done, 5000);
    }));
  }
  await page.locator('details[data-qa-initially-closed]').evaluateAll(details => details.forEach(detail => {
    detail.open = false;
    delete detail.dataset.qaInitiallyClosed;
  }));
  await page.evaluate(() => scrollTo(0, 0));
}

async function responseRecord(url) {
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const body = Buffer.from(await response.arrayBuffer());
    return {
      url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      bytes: body.length,
      sha256: crypto.createHash('sha256').update(body).digest('hex'),
      location: response.headers.get('location'),
    };
  } catch (error) {
    return { url, error: String(error) };
  }
}

async function inspectPage(page, viewport, theme) {
  const item = {
    viewport,
    theme,
    checks: [],
    consoleErrors: [],
    pageErrors: [],
    requestFailures: [],
    failedResponses: [],
  };
  page.on('console', message => {
    if (message.type() === 'error') item.consoleErrors.push(message.text());
  });
  page.on('pageerror', error => item.pageErrors.push(String(error)));
  page.on('requestfailed', request => item.requestFailures.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on('response', response => {
    if (response.status() >= 400) item.failedResponses.push({ url: response.url(), status: response.status() });
  });

  await page.addInitScript(value => localStorage.setItem('theme', value), theme);
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await loadLazyImages(page);

  const state = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflowElements = [...document.querySelectorAll('body *')]
      .map(element => {
        const box = element.getBoundingClientRect();
        return { tag: element.tagName, id: element.id, className: String(element.className || ''), left: box.left, right: box.right };
      })
      .filter(box => box.right > width + 1 || box.left < -1)
      .slice(0, 20);
    const images = [...document.images].filter(image => image.hasAttribute('src')).map(image => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    }));
    const fragmentLinks = [...document.querySelectorAll('a[href^="#"]')].map(link => ({
      href: link.getAttribute('href'),
      exists: link.getAttribute('href') === '#' || Boolean(document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)))),
    }));
    return {
      theme: document.documentElement.dataset.theme,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: width,
      overflowElements,
      images,
      fragmentLinks,
      title: document.title,
      lang: document.documentElement.lang,
      main: Boolean(document.querySelector('main#main')),
      h1Count: document.querySelectorAll('h1').length,
    };
  });

  check(item.checks, 'requested theme applied', state.theme === theme, state.theme);
  check(item.checks, 'no horizontal document overflow', state.scrollWidth <= state.clientWidth + 1, { scrollWidth: state.scrollWidth, clientWidth: state.clientWidth, overflowElements: state.overflowElements });
  const brokenImages = state.images.filter(image => !image.complete || image.naturalWidth === 0);
  check(item.checks, 'all images loaded', brokenImages.length === 0, brokenImages);
  const missingTargets = state.fragmentLinks.filter(link => !link.exists);
  check(item.checks, 'all internal fragment targets exist', missingTargets.length === 0, missingTargets);
  check(item.checks, 'document landmarks and title', state.lang === 'en' && state.main && state.h1Count === 1 && state.title.length > 0, { title: state.title, lang: state.lang, main: state.main, h1Count: state.h1Count });

  const isMobile = viewport.width <= 620;
  if (isMobile) {
    const initiallyHidden = await page.locator('#navigation').evaluate(element => getComputedStyle(element).display === 'none');
    await page.locator('#menu-toggle').click();
    const opened = await page.locator('#menu-toggle').getAttribute('aria-expanded');
    const navVisible = await page.locator('#navigation').isVisible();
    await page.keyboard.press('Escape');
    const closed = await page.locator('#menu-toggle').getAttribute('aria-expanded');
    const focused = await page.evaluate(() => document.activeElement?.id);
    check(item.checks, 'mobile menu opens, closes with Escape, and restores focus', initiallyHidden && opened === 'true' && navVisible && closed === 'false' && focused === 'menu-toggle', { initiallyHidden, opened, navVisible, closed, focused });
  } else {
    check(item.checks, 'desktop navigation visible', await page.locator('#navigation').isVisible() && !(await page.locator('#menu-toggle').isVisible()));
  }

  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => {
    const element = document.activeElement;
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return { className: element.className, top: box.top, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  check(item.checks, 'skip link is first and visibly focused', String(skip.className).includes('skip-link') && skip.top >= 0 && skip.outlineStyle !== 'none' && skip.outlineWidth !== '0px', skip);
  await page.keyboard.press('Enter');
  check(item.checks, 'skip link targets main content', (await page.evaluate(() => location.hash)) === '#main', await page.evaluate(() => ({ hash: location.hash, active: document.activeElement?.id })));

  const firstImage = page.locator('.gallery .image-link').first();
  await firstImage.scrollIntoViewIfNeeded();
  await firstImage.click();
  const dialogOpen = await page.locator('#lightbox').evaluate(dialog => dialog.open);
  const initialCount = await page.locator('#lightbox-count').textContent();
  const initialFocus = await page.evaluate(() => document.activeElement?.id);
  await page.keyboard.press('ArrowRight');
  const nextCount = await page.locator('#lightbox-count').textContent();
  await page.locator('#lightbox-close').click();
  const restoredAfterButton = await page.evaluate(() => document.activeElement?.classList.contains('image-link'));
  await firstImage.click();
  await page.keyboard.press('Escape');
  const restoredAfterEscape = await page.evaluate(() => document.activeElement?.classList.contains('image-link'));
  check(item.checks, 'native dialog opens, focuses close, arrows, closes, and restores trigger focus', dialogOpen && initialFocus === 'lightbox-close' && initialCount !== nextCount && restoredAfterButton && restoredAfterEscape, { dialogOpen, initialFocus, initialCount, nextCount, restoredAfterButton, restoredAfterEscape });

  check(item.checks, 'no console errors', item.consoleErrors.length === 0, item.consoleErrors);
  check(item.checks, 'no uncaught page errors', item.pageErrors.length === 0, item.pageErrors);
  check(item.checks, 'no failed requests', item.requestFailures.length === 0, item.requestFailures);
  check(item.checks, 'no unexpected HTTP error responses', item.failedResponses.length === 0, item.failedResponses);

  if (fs.existsSync(axePath)) {
    await page.addScriptTag({ path: axePath });
    const axe = await page.evaluate(async () => axe.run(document, { resultTypes: ['violations', 'incomplete'] }));
    axeReport.push({ viewport: viewport.name, theme, violations: axe.violations, incomplete: axe.incomplete });
    check(item.checks, 'axe has no violations', axe.violations.length === 0, axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })));
  }

  await page.screenshot({ path: path.join(output, `${viewport.name}-${theme}.png`), fullPage: true });
  const reviewName = {
    'laptop-1366-light': 'review-laptop-light.jpg',
    'phone-390-light': 'review-phone-light.jpg',
    'tablet-768-dark': 'review-tablet-dark.jpg',
  }[`${viewport.name}-${theme}`];
  if (reviewName) await page.screenshot({ path: path.join(output, reviewName), type: 'jpeg', quality: 82 });
  if (viewport.name === 'laptop-1366' && theme === 'light') {
    await page.evaluate(() => {
      document.activeElement?.blur();
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelector('.site-header').style.visibility = 'hidden';
    });
    for (const [name, selector] of Object.entries({ fins: '#fins', alignment: '#alignment', experience: '#experience', research: '#research', contact: '#contact' })) {
      await page.locator(selector).screenshot({ path: path.join(output, `review-${name}.jpg`), type: 'jpeg', quality: 86 });
    }
    await page.locator('.site-header').evaluate(header => header.style.visibility = '');
  }
  return item;
}

(async () => {
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  try {
    for (const viewport of viewports) {
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: theme });
        const page = await context.newPage();
        report.cases.push(await inspectPage(page, viewport, theme));
        await context.close();
      }
    }

    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const reducedPage = await reducedContext.newPage();
    await reducedPage.goto(baseURL + '/', { waitUntil: 'networkidle' });
    report.reducedMotion = await reducedPage.evaluate(() => ({
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      imageLinkTransition: getComputedStyle(document.querySelector('.image-link'), '::after').transitionDuration,
    }));
    report.reducedMotion.pass = report.reducedMotion.mediaMatches && report.reducedMotion.scrollBehavior === 'auto' && report.reducedMotion.imageLinkTransition === '0s';
    await reducedContext.close();

    const noJsContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(baseURL + '/', { waitUntil: 'networkidle' });
    await loadLazyImages(noJsPage);
    await noJsPage.screenshot({ path: path.join(output, 'phone-390-no-js.png'), fullPage: true });
    report.noJavaScript = await noJsPage.evaluate(() => ({
      navVisible: getComputedStyle(document.querySelector('#navigation')).display !== 'none',
      menuToggleVisible: getComputedStyle(document.querySelector('#menu-toggle')).display !== 'none',
      imageLinks: document.querySelectorAll('.gallery .image-link').length,
      brokenImages: [...document.images].filter(image => image.hasAttribute('src') && (!image.complete || image.naturalWidth === 0)).map(image => image.src),
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      jsClassPresent: document.documentElement.classList.contains('js'),
    }));
    report.noJavaScript.pass = report.noJavaScript.navVisible && !report.noJavaScript.menuToggleVisible && report.noJavaScript.imageLinks > 0 && report.noJavaScript.brokenImages.length === 0 && !report.noJavaScript.horizontalOverflow && !report.noJavaScript.jsClassPresent;
    await noJsContext.close();

    const routeContext = await browser.newContext();
    const routePage = await routeContext.newPage();
    await routePage.goto(baseURL + '/', { waitUntil: 'networkidle' });
    const hrefs = await routePage.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(Boolean))]);
    const localHrefs = hrefs.filter(href => !href.startsWith('#') && !href.startsWith('mailto:') && !/^https?:\/\//.test(href));
    const externalHrefs = hrefs.filter(href => /^https?:\/\//.test(href));
    for (const href of localHrefs) report.localLinks.push(await responseRecord(new URL(href, baseURL + '/').href));
    for (const href of externalHrefs) report.externalLinks.push(await responseRecord(href));
    await routeContext.close();

    for (const route of ['/watch-together/', '/blue-origin-landings/']) {
      report.directRoutes.push(await responseRecord(new URL(route, baseURL).href));
    }
    report.localLinksPass = report.localLinks.every(link => link.status >= 200 && link.status < 400);
    report.externalLinksPass = report.externalLinks.every(link => link.status !== 404 && link.status !== 410 && !link.error);
    const localBase = ['127.0.0.1', 'localhost'].includes(new URL(baseURL).hostname);
    report.directRoutesExpected = localBase ? '404 from isolated static-server root' : 'successful independent GitHub Pages routes';
    report.directRoutesPass = report.directRoutes.every(route => localBase ? route.status === 404 : route.status >= 200 && route.status < 400);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(output, 'qa-report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(output, 'axe-report.json'), JSON.stringify(axeReport, null, 2));
  const failedChecks = report.cases.flatMap(item => item.checks.filter(result => !result.pass).map(result => ({ viewport: item.viewport.name, theme: item.theme, ...result })));
  console.log(JSON.stringify({ failedChecks, reducedMotion: report.reducedMotion, noJavaScript: report.noJavaScript, localLinks: report.localLinks, externalLinks: report.externalLinks, directRoutes: report.directRoutes, axeViolations: axeReport.reduce((sum, run) => sum + run.violations.length, 0) }, null, 2));
  if (failedChecks.length || !report.reducedMotion.pass || !report.noJavaScript.pass || !report.localLinksPass || !report.externalLinksPass || !report.directRoutesPass) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 2;
});
