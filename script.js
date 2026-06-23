// Footer year
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ===== Scroll-reveal animations =====
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Tag elements that should animate in.
  const reveals = [];

  // Section headings + general content blocks fade up.
  document.querySelectorAll(
    ".section__head, .about__text, .about__facts, .tl__item, .pub, " +
    ".project__meta, .skills__group, .contact"
  ).forEach((el) => {
    el.classList.add("reveal");
    reveals.push(el);
  });

  // Project galleries slide in, alternating left / right per project.
  document.querySelectorAll(".project").forEach((project, i) => {
    const gallery = project.querySelector(".gallery");
    if (!gallery) return;
    gallery.classList.add("reveal", i % 2 === 0 ? "reveal--right" : "reveal--left");
    reveals.push(gallery);
  });

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((el) => io.observe(el));

  // Light stagger for skill cards within their row.
  document.querySelectorAll(".skills__group").forEach((el, i) => {
    el.style.transitionDelay = i * 0.09 + "s";
  });
})();

// ===== Lightbox: click or keyboard-activate any gallery image to enlarge =====
(function () {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return; // missing markup must not crash the rest of the script
  const lbImg = lightbox.querySelector(".lightbox__img");
  const lbCap = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  if (!lightbox || !lbImg || !lbCap || !closeBtn) return;

  // All gallery images (used to wire up click/keyboard activation).
  const allImgs = Array.from(document.querySelectorAll(".gallery__item img"));
  let lastFocused = null; // element to restore focus to on close
  // Navigation is scoped to the gallery of the currently-open image.
  let imgs = []; // images in the active gallery, in DOM order
  let current = -1; // index into imgs of the image being shown

  function show(i) {
    if (i < 0 || i >= imgs.length) return;
    current = i;
    const img = imgs[i];
    const cap = img.closest("figure")?.querySelector("figcaption")?.textContent || "";
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lbCap.textContent = cap;
  }

  function step(delta) {
    if (current < 0 || imgs.length === 0) return;
    // Wrap around at both ends.
    show((current + delta + imgs.length) % imgs.length);
  }

  function open(img, trigger) {
    lastFocused = trigger || null;
    // Scope navigation to the gallery the clicked image belongs to.
    const gallery = img.closest(".gallery");
    imgs = gallery
      ? Array.from(gallery.querySelectorAll(".gallery__item img"))
      : [img];
    const idx = imgs.indexOf(img);
    show(idx < 0 ? 0 : idx);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus(); // move focus into the dialog
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.src = "";
    current = -1;
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus(); // restore focus to the triggering image
    }
    lastFocused = null;
  }

  // Make each gallery image operable by mouse AND keyboard.
  allImgs.forEach((img) => {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    if (!img.getAttribute("aria-label")) {
      img.setAttribute("aria-label", "Enlarge image: " + (img.alt || "gallery image"));
    }

    img.addEventListener("click", () => open(img, img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault(); // stop Space from scrolling the page
        open(img, img);
      }
    });
  });

  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });

  // Clickable prev / next arrows (mirror the ArrowLeft/ArrowRight keys).
  const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav--next");
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => { e.stopPropagation(); step(1); });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) { e.stopPropagation(); close(); }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Tab") {
      // Trap focus: cycle through the dialog's controls (prev / next / close).
      e.preventDefault();
      const focusables = [prevBtn, nextBtn, closeBtn].filter(Boolean);
      if (!focusables.length) return; // guard against modulo-by-zero
      const idx = focusables.indexOf(document.activeElement);
      const nextIdx = (idx + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
      focusables[nextIdx].focus();
    }
  });
})();

// ===== Scrollspy: highlight the nav link for the section in view =====
(function () {
  const links = Array.from(document.querySelectorAll(".nav__links a"));
  const map = new Map(); // section id -> nav link
  links.forEach((a) => {
    const id = a.getAttribute("href")?.replace("#", "");
    const section = id && document.getElementById(id);
    if (section) map.set(section, a);
  });
  if (!map.size || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      // Among the sections intersecting in this callback, pick the single
      // one covering the most of the rootMargin band so only one nav link
      // is ever marked active (adjacent sections can both intersect).
      let best = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting &&
            (!best || entry.intersectionRatio > best.intersectionRatio)) {
          best = entry;
        }
      });
      if (best) {
        links.forEach((l) => l.classList.remove("is-active"));
        map.get(best.target)?.classList.add("is-active");
      }
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  map.forEach((_link, section) => io.observe(section));
})();

// ===== Back to top =====
(function () {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    if (window.scrollY > window.innerHeight * 0.8) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
})();

// ===== Light / dark theme toggle =====
// The initial theme is applied pre-paint by the inline <head> script.
// This wires the button to flip it and persist the choice.
(function () {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const root = document.documentElement;
  const icon = btn.querySelector(".theme-toggle__icon");

  function sync(theme) {
    const isLight = theme === "light";
    if (icon) icon.textContent = isLight ? "☀" : "☾";
    btn.setAttribute("aria-pressed", String(isLight));
    btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }

  // Reflect whatever the pre-paint script set.
  sync(root.getAttribute("data-theme") || "dark");

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    sync(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked, theme still applies for this session */ }
  });

  // Follow the OS theme at runtime, but ONLY when the user hasn't made a
  // manual choice. A saved "theme" in localStorage always wins.
  const osScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const onOsScheme = (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) { /* storage blocked */ }
    if (saved !== null) return; // manual choice wins; don't override
    const osTheme = e.matches ? "dark" : "light";
    root.setAttribute("data-theme", osTheme);
    sync(osTheme);
    // Intentionally do NOT persist — this is OS-driven, not a manual choice.
  };
  if (osScheme.addEventListener) osScheme.addEventListener("change", onOsScheme);
  else if (osScheme.addListener) osScheme.addListener(onOsScheme);
})();

// ===== Mobile nav (hamburger) =====
// Toggles the collapsed nav dropdown shown by the <=620px media query.
(function () {
  const header = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!header || !toggle || !links) return;

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  // Close after choosing a destination so the page isn't left covered.
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  // Escape closes and returns focus to the toggle.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // While the menu is open, trap Tab focus within the header controls:
  // the visible nav links, the hamburger toggle, and the theme toggle
  // (the theme toggle stays visible at 44x44 on mobile).
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !header.classList.contains("is-open")) return;
    const focusables = Array.from(
      document.querySelectorAll("#navLinks a, #navToggle, #themeToggle")
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!focusables.length) return; // nothing to trap
    const idx = focusables.indexOf(document.activeElement);
    e.preventDefault();
    const nextIdx = (idx + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
    focusables[nextIdx].focus();
  });

  // A tap/click outside the header closes the menu.
  document.addEventListener("click", (e) => {
    if (header.classList.contains("is-open") && !header.contains(e.target)) {
      setOpen(false);
    }
  });

  // If the viewport grows back past the breakpoint, reset to the desktop bar.
  // Feature-detect addEventListener vs legacy addListener (iOS Safari <14).
  const mq = window.matchMedia("(min-width: 621px)");
  const onMq = (e) => { if (e.matches) setOpen(false); };
  if (mq.addEventListener) mq.addEventListener("change", onMq);
  else if (mq.addListener) mq.addListener(onMq);
})();
