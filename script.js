/* Progressive enhancement: content and full-size image links work without JS. */
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
  system.addEventListener('change', e => {
    let saved; try { saved = localStorage.getItem('theme'); } catch (_) {}
    if (!saved) { root.dataset.theme = e.matches ? 'dark' : 'light'; syncTheme(); }
  });
  const header = document.querySelector('.site-header');
  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('navigation');
  function closeMenu() { header.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = header.classList.toggle('menu-open'); menu.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });
  matchMedia('(min-width:621px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  document.getElementById('year').textContent = new Date().getFullYear();
  // Missing future files are never requested. tools/update_assets.py registers real assets.
  const slots = [
    ['fin-design-tree', 'fin-design-tree-slot', 'Fin design trade-study structure', 'Fin design trade study'],
    ['passthrough', 'passthrough-photo-slot', 'Flight-critical NPT electrical passthrough hardware', 'Electrical passthrough hardware']
  ];
  slots.forEach(([key, id, alt, caption]) => {
    const asset = (window.PORTFOLIO_MEDIA || {})[key];
    if (!asset) return;
    const slot = document.getElementById(id);
    const figure = document.createElement('figure');
    const link = document.createElement('a'); link.href = asset.src; link.className = 'image-link';
    const img = document.createElement('img'); img.src = asset.src; img.alt = alt; img.width = asset.width; img.height = asset.height; img.loading = 'lazy';
    const cap = document.createElement('figcaption'); cap.textContent = caption;
    link.append(img); figure.append(link, cap); slot.append(figure); slot.hidden = false;
  });
  const dialog = document.getElementById('lightbox');
  const preview = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  let images = [], index = 0, trigger;
  function show(next) {
    index = (next + images.length) % images.length;
    const link = images[index], img = link.querySelector('img');
    preview.src = link.href; preview.alt = img.alt;
    caption.textContent = link.closest('figure').querySelector('figcaption')?.textContent || img.alt;
    document.getElementById('lightbox-count').textContent = (index + 1) + ' / ' + images.length;
    document.getElementById('lightbox-prev').hidden = images.length < 2;
    document.getElementById('lightbox-next').hidden = images.length < 2;
  }
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('.gallery .image-link').forEach(link => {
      link.setAttribute('aria-label', 'Enlarge: ' + link.querySelector('img').alt);
      link.addEventListener('click', e => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault(); trigger = link;
        images = [...link.closest('.gallery').querySelectorAll('.image-link')];
        show(images.indexOf(link)); dialog.showModal(); document.body.style.overflow = 'hidden';
        document.getElementById('lightbox-close').focus();
      });
    });
  }
  document.getElementById('lightbox-close').addEventListener('click', () => dialog.close());
  document.getElementById('lightbox-prev').addEventListener('click', () => show(index - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); } });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; preview.removeAttribute('src'); trigger?.focus(); });
})();
