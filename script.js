/* Navigation, theme selection, and optional full-image viewing. */
(() => {
  const root = document.documentElement;
  const theme = document.getElementById('theme-toggle');
  const system = matchMedia('(prefers-color-scheme: dark)');
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    theme.textContent = dark ? 'Light' : 'Dark';
    theme.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme');
    theme.setAttribute('aria-pressed', String(dark));
  }
  syncTheme();
  theme.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (_) {}
    syncTheme();
  });
  system.addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('theme'); } catch (_) {}
    if (!saved) { root.dataset.theme = event.matches ? 'dark' : 'light'; syncTheme(); }
  });
  const header = document.querySelector('.site-header');
  const menu = document.getElementById('menu-toggle');
  function closeMenu() { header.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('navigation').addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  matchMedia('(min-width:721px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.getElementById('year').textContent = new Date().getFullYear();

  const base = document.body.dataset.base || '';
  document.querySelectorAll('[data-media]').forEach(slot => {
    const asset = (window.PORTFOLIO_MEDIA || {})[slot.dataset.media];
    if (!asset) return;
    const figure = document.createElement('figure');
    const link = document.createElement('a');
    link.className = 'image-link'; link.href = base + asset.src;
    const image = document.createElement('img');
    Object.assign(image, {src: base + asset.src, alt: slot.dataset.media === 'passthrough' ? 'Flight electrical passthrough hardware' : 'Original fin design trade study', width: asset.width, height: asset.height, loading: 'lazy'});
    const caption = document.createElement('figcaption'); caption.textContent = image.alt;
    link.append(image); figure.append(link, caption); slot.replaceChildren(figure); slot.hidden = false;
  });

  const dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const preview = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  const close = document.getElementById('lightbox-close');
  const previous = document.getElementById('lightbox-prev');
  const next = document.getElementById('lightbox-next');
  let images = [], index = 0, trigger;
  function show(nextIndex) {
    index = (nextIndex + images.length) % images.length;
    const link = images[index];
    const img = link.querySelector('img');
    preview.src = link.href; preview.alt = img.alt;
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
    document.getElementById('lightbox-count').textContent = (index + 1) + ' / ' + images.length;
    previous.hidden = next.hidden = images.length < 2;
  }
  document.querySelectorAll('.media-group .image-link').forEach(link => {
    link.setAttribute('aria-label', 'Enlarge: ' + link.querySelector('img').alt);
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); trigger = link;
      images = [...link.closest('.media-group').querySelectorAll('.image-link')];
      show(images.indexOf(link)); dialog.showModal(); document.body.style.overflow = 'hidden'; close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => show(index - 1)); next.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (images.length < 2) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; preview.removeAttribute('src'); trigger?.focus(); });
})();
