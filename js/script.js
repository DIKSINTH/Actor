/* ===================================================================
   Aarav Karthik — Actor Portfolio
   Vanilla JavaScript: nav, mobile menu, scroll spy, lightbox,
   works rendering, footer year.
   =================================================================== */

(function () {
  "use strict";

  /* ---------- Works data (editable) ----------
     Add your own projects here. If the array is empty, the section
     shows the "More stories coming soon." message.
     poster: local image path under assets/images/works/
     video:  local video file OR YouTube URL (omit to hide the button)
  */
  var WORKS = [
    {
      poster: "/assets/images/works/project-1.jpg",
      title: "Silent Echoes",
      category: "Short Film",
      year: "2024",
      role: "Lead Actor",
      desc: "A quiet story about a young man confronting his past, told through silence and expression.",
      video: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      poster: "/assets/images/works/project-2.jpg",
      title: "Thanimayil",
      category: "Independent Film",
      year: "2024",
      role: "Supporting Actor",
      desc: "A poetic short exploring loneliness and connection in the heart of the city."
    },
    {
      poster: "/assets/images/works/project-3.jpg",
      title: "Veyyil",
      category: "Acting Project",
      year: "2023",
      role: "Lead Actor",
      desc: "An emotional workshop piece capturing the heat of family bonds and personal ambition.",
      video: "/assets/videos/project-1.mp4"
    }
  ];

  /* ---------- DOM helpers ---------- */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------- 1. Initialize AOS ---------- */
  function initAOS() {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 80,
        easing: "ease-in-out"
      });
    }
  }

  /* ---------- 2. Header scroll state ---------- */
  function initHeaderScroll() {
    var header = $("#header");
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3. Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = $("#navToggle");
    var menu = $("#navMenu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function open() {
      menu.classList.add("open");
      toggle.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("open")) {
        close();
      } else {
        open();
      }
    });

    // Close on link click
    $$(".nav-link", menu).forEach(function (link) {
      link.addEventListener("click", close);
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (
        menu.classList.contains("open") &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        close();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        close();
      }
    });

    // Reset on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        close();
      }
    });
  }

  /* ---------- 4. Scroll-spy active nav link ---------- */
  function initScrollSpy() {
    var links = $$(".nav-link");
    var sections = links
      .map(function (l) {
        var id = l.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = "#" + entry.target.id;
            links.forEach(function (l) {
              if (l.getAttribute("href") === id) {
                l.classList.add("active");
              } else {
                l.classList.remove("active");
              }
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  /* ---------- 5. Render Works ---------- */
  function renderWorks() {
    var grid = $("#worksGrid");
    var empty = $("#worksEmpty");
    if (!grid) return;

    if (!WORKS.length) {
      grid.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    var html = WORKS.map(function (w) {
      var watchBtn = "";
      if (w.video) {
        var isExternal = /^https?:\/\//i.test(w.video);
        var target = isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        watchBtn =
          '<a class="work-watch" href="' +
          w.video +
          '"' +
          target +
          ">" +
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path fill="currentColor" d="M8 5v14l11-7z"/>' +
          "</svg>" +
          "Watch Video</a>";
      }

      return (
        '<article class="work-card" data-aos="fade-up">' +
        '<div class="work-poster" data-lightbox>' +
        '<img src="' +
        w.poster +
        '" alt="' +
        escapeAttr(w.title) +
        '" loading="lazy" />' +
        '<span class="work-category">' +
        escapeHtml(w.category) +
        "</span>" +
        "</div>" +
        '<div class="work-body">' +
        '<p class="work-year">' +
        escapeHtml(w.year) +
        "</p>" +
        '<h3 class="work-title">' +
        escapeHtml(w.title) +
        "</h3>" +
        '<p class="work-role">' +
        escapeHtml(w.role) +
        "</p>" +
        '<p class="work-desc">' +
        escapeHtml(w.desc) +
        "</p>" +
        watchBtn +
        "</div>" +
        "</article>"
      );
    }).join("");

    grid.innerHTML = html;

    // Re-scan AOS for newly added nodes
    if (window.AOS) {
      window.AOS.refreshHard();
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  /* ---------- 6. Lightbox ---------- */
  function initLightbox() {
    var lb = $("#lightbox");
    if (!lb) return;
    var lbImg = $("#lightboxImg");
    var closeBtn = $("#lightboxClose");
    var prevBtn = $("#lightboxPrev");
    var nextBtn = $("#lightboxNext");
    // Every clickable photo on the page: gallery, profile, work posters
    var triggers = $("[data-lightbox]");
    var images = triggers.map(function (el) {
      return el.querySelector("img");
    }).filter(Boolean);

    if (!images.length) {
      return;
    }

    var current = 0;

    function show(index) {
      current = (index + images.length) % images.length;
      var img = images[current];
      lbImg.setAttribute("src", img.getAttribute("src"));
      lbImg.setAttribute("alt", img.getAttribute("alt") || "");
    }

    function open(index) {
      show(index);
      lb.hidden = false;
      // force reflow for transition
      void lb.offsetWidth;
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      var t = setTimeout(function () {
        lb.hidden = true;
        lbImg.setAttribute("src", "");
        clearTimeout(t);
      }, 350);
    }

    function next() {
      show(current + 1);
    }

    function prev() {
      show(current - 1);
    }

    triggers.forEach(function (el, i) {
      el.addEventListener("click", function () {
        open(i);
      });
    });

    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      next();
    });
    prevBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      prev();
    });

    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden || !lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });

    // Swipe support for touch devices
    var touchStartX = 0;
    lb.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    lb.addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
          if (dx < 0) next();
          else prev();
        }
      },
      { passive: true }
    );
  }

  /* ---------- 7. Footer year ---------- */
  function setYear() {
    var el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initAOS();
    initHeaderScroll();
    initMobileNav();
    initScrollSpy();
    renderWorks();
    initLightbox();
    setYear();
  });
})();
