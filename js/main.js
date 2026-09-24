/* =====================================================================
   Academic portfolio — interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Scroll progress ---------- */
  var progress = document.getElementById("scrollProgress");
  var header = document.getElementById("siteHeader");

  function onScroll() {
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    if (progress) progress.style.width = Math.min(pct, 100) + "%";
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.classList.contains("nav-link")) {
          header.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 8, 6) * 45 + "ms";
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = nav ? nav.querySelectorAll(".nav-link") : [];
  var sectionIds = Array.prototype.map.call(navLinks, function (l) { return l.getAttribute("href"); });
  var sections = sectionIds
    .map(function (id) { return id ? document.querySelector(id) : null; })
    .filter(Boolean);

  function setActiveNav() {
    var probe = window.scrollY + (window.innerHeight * 0.32);
    var currentId = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= probe) currentId = "#" + sec.id;
    });
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) {
      currentId = sectionIds[sectionIds.length - 1];
    }
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === currentId);
    });
  }

  var ticking = false;
  function onScrollFrame() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll();
        setActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScrollFrame, { passive: true });
  window.addEventListener("resize", onScrollFrame, { passive: true });
  onScroll();
  setActiveNav();
})();
