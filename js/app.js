// ------------------------------------------------
// Table of Contents
// ------------------------------------------------
//
//  01. Loader & Loading Animation
//  02. Bootstrap Scroll Spy Plugin Settings
//  03. Lenis Scroll Plugin
//  04. Parallax
//  05. Scroll Animations
//  06. Smooth Scrolling
//  07. Swiper Slider
//  08. Contact Form
//  09. Modernizr SVG Fallback
//  10. Chrome Smooth Scroll
//  11. Images Moving Ban
//  12. Detecting Mobile/Desktop
//  13. PhotoSwipe Gallery Images Replace
//  14. Color Switch
//
// ------------------------------------------------
// Table of Contents End
// ------------------------------------------------

$(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  // --------------------------------------------- //
  // Loader & Loading Animation Start
  // --------------------------------------------- //
  // Only wait for above-the-fold imagery (the hero avatar) before
  // dismissing the loader. Below-the-fold images are lazy-loaded, so
  // waiting on the whole <body> would keep the loader up for the full
  // ~25 MB of media. A hard timeout guarantees the loader never sticks
  // even if the hero image is slow or cached oddly.
  const heroImg = document.getElementById("avatarImage");
  const imgLoad = imagesLoaded(heroImg ? [heroImg] : []);

  let loaderDismissed = false;
  const dismissLoader = () => {
    if (loaderDismissed) return;
    loaderDismissed = true;

    document.getElementById("loaderContent").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("loader").classList.add("loaded");
      document.getElementById("svgBackground").classList.add("loaded");
    }, 300);

    gsap.set(".animate-headline", { y: 50, opacity: 0 });
    ScrollTrigger.batch(".animate-headline", {
      interval: 0.1,
      batchMax: 4,
      duration: 6,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          ease: "sine",
          stagger: { each: 0.15, grid: [1, 4] },
          overwrite: true,
        }),
      onLeave: (batch) =>
        gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
      onEnterBack: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
      onLeaveBack: (batch) =>
        gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
    });
  };

  // Dismiss as soon as the hero image is ready...
  imgLoad.on("always", dismissLoader);
  // ...or after 2s no matter what, so a slow hero never blocks the page.
  setTimeout(dismissLoader, 2000);
  // --------------------------------------------- //
  // Loader & Loading Animation End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Scroll Spy Start \u2014 lightweight IntersectionObserver-based replacement
  // for bootstrap.ScrollSpy. Highlights the menu link whose target section
  // is currently the most visible in the viewport (mirrors the original
  // behaviour: toggles `.active` on the matching `#menu .menu__link`).
  // --------------------------------------------- //
  (function initScrollSpy() {
    const menu = document.getElementById("menu");
    if (!menu) return;
    const links = Array.from(menu.querySelectorAll('a[href^="#"]'));
    const byId = new Map();
    const sections = [];
    links.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      const section = id && document.getElementById(id);
      if (section) {
        byId.set(section, link);
        sections.push(section);
      }
    });
    if (!sections.length) return;
    function activate(link) {
      links.forEach((l) => l.classList.toggle("active", l === link));
    }
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the visible section with the largest intersection ratio.
        let best = null;
        entries.forEach((e) => {
          if (
            e.isIntersecting &&
            (!best || e.intersectionRatio > best.intersectionRatio)
          ) {
            best = e;
          }
        });
        if (best) {
          const link = byId.get(best.target);
          if (link) activate(link);
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: [0.1, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
  })();
  // --------------------------------------------- //
  // Scroll Spy End
  // --------------------------------------------- //

  // Get the avatar image element
  //const avatarImage = document.getElementById("avatarImage");
  const originalSrc = avatarImage.src;
  const altSrc1 = "img/avatars/1715794805623.jpeg";
  const altSrc2 = "img/avatars/1715794805624.jpeg";

  avatarImage.addEventListener("click", function () {
    const currentSrc = this.src.split("/").pop();
    const origSrcFilename = originalSrc.split("/").pop();
    const altSrc1Filename = altSrc1.split("/").pop();
    const altSrc2Filename = altSrc2.split("/").pop();

    if (currentSrc === origSrcFilename) {
      this.src = altSrc1;
    } else if (currentSrc === altSrc1Filename) {
      this.src = altSrc2;
    } else {
      this.src = originalSrc;
    }
  });

  // --------------------------------------------- //
  // Lenis Scroll Plugin Start
  // --------------------------------------------- //
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  // --------------------------------------------- //
  // Lenis Scroll Plugin End
  // --------------------------------------------- //

  // ------------------------------------------------------------------------------ //
  // Parallax (apply parallax effect to any element with a data-speed attribute) Start
  // ------------------------------------------------------------------------------ //
  gsap.to("[data-speed]", {
    y: (i, el) =>
      (1 - parseFloat(el.getAttribute("data-speed"))) *
      ScrollTrigger.maxScroll(window),
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      scrub: 0,
    },
  });
  // --------------------------------------------- //
  // Parallax End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Scroll Animations Start
  // --------------------------------------------- //
  // Animation In Up
  const animateInUp = document.querySelectorAll(".animate-in-up");
  animateInUp.forEach((element) => {
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        ease: "sine",
      },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: element,
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Animation Rotation
  const animateRotation = document.querySelectorAll(".animate-rotation");
  animateRotation.forEach((section) => {
    var value = $(section).data("value");
    gsap.fromTo(
      section,
      {
        ease: "sine",
        rotate: 0,
      },
      {
        rotate: value,
        scrollTrigger: {
          trigger: section,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // Animation Cards Stack
  // Grid 2x
  gsap.set(".animate-card-2", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-2", {
    interval: 0.1,
    batchMax: 2,
    duration: 2,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 2] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
  });

  // Grid 3x — Achievement cards: no reveal animation, interactive 3D tilt
  gsap.set(".animate-card-3", { opacity: 1, y: 0 });

  // Reusable interactive 3D tilt that follows the cursor
  const applyTilt = (selector, maxTilt, hoverScale) => {
    document.querySelectorAll(selector).forEach((card) => {
      gsap.set(card, {
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      });

      const move = (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height; // 0..1
        gsap.to(card, {
          rotationY: (px - 0.5) * 2 * maxTilt,
          rotationX: -(py - 0.5) * 2 * maxTilt,
          scale: hoverScale,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const reset = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", reset);
    });
  };

  applyTilt(".animate-card-3 .achievements__card", 12, 1.04);
  applyTilt(".tools-cards__card", 16, 1.08);

  // Achievement numbers: count-up on scroll into view
  document.querySelectorAll(".achievements__number").forEach((el) => {
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const counter = { val: 0 };
    el.textContent = "0" + suffix;
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.val) + suffix;
          },
        }),
    });
  });

  // Grid 5x
  gsap.set(".animate-card-5", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-5", {
    interval: 0.1,
    batchMax: 5,
    delay: 1000,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 5] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });

  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-2", { y: 0, opacity: 1 }),
  );
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-3", { y: 0, opacity: 1, rotationX: 0, scale: 1 }),
  );
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-5", { y: 0, opacity: 1 }),
  );
  // --------------------------------------------- //
  // Scroll Animations End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Smooth Scrolling Start
  // --------------------------------------------- //
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            1000,
            function () {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            },
          );
        }
      }
    });
  // --------------------------------------------- //
  // Smooth Scrolling End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Swiper Slider — removed (no .swiper-tools / .swiper-testimonials
  // markup exists in index.html; Swiper bundle stripped from libs.min.js).
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Contact Form Start (Web3Forms)
  // --------------------------------------------- //
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          document.querySelector(".form__reply").classList.add("is-visible");
          form.classList.add("is-hidden");
          form.reset();
        } else {
          alert(
            "An error occurred while sending the email. Please try again later.",
          );
        }
      } catch (err) {
        alert(
          "An error occurred while sending the email. Please try again later.",
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
  // --------------------------------------------- //
  // Contact Form End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Modernizr SVG Fallback Start
  // --------------------------------------------- //
  if (!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function () {
      return $(this).attr("src").replace(".svg", ".png");
    });
  }
  // --------------------------------------------- //
  // Modernizr SVG Fallback End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Chrome Smooth Scroll Start
  // --------------------------------------------- //
  try {
    $.browserSelector();
    if ($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch (err) {}
  // --------------------------------------------- //
  // Chrome Smooth Scroll End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Images Moving Ban Start
  // --------------------------------------------- //
  $("img, a").on("dragstart", function (event) {
    event.preventDefault();
  });
  // --------------------------------------------- //
  // Images Moving Ban End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // Detecting Mobile/Desktop Start
  // --------------------------------------------- //
  //smtp password: 576CE5774D7CF3299159AEC4E22BFB1961C2
  //smtp username: rishabhdell14@gmail.com
  //smtp server: smtp.elasticemail.com
  //smtp port: 2025
  var isMobile = false;
  if (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    $("html").addClass("touch");
    isMobile = true;
  } else {
    $("html").addClass("no-touch");
    isMobile = false;
  }
  //IE, Edge
  var isIE =
    /MSIE 9/i.test(navigator.userAgent) ||
    /rv:11.0/i.test(navigator.userAgent) ||
    /MSIE 10/i.test(navigator.userAgent) ||
    /Edge\/\d+/.test(navigator.userAgent);
  // --------------------------------------------- //
  // Detecting Mobile/Desktop End
  // --------------------------------------------- //

  // --------------------------------------------- //
  // PhotoSwipe Gallery Images Replace Start
  // --------------------------------------------- //
  $(".gallery__link").each(function () {
    $(this)
      .append('<div class="picture"></div>')
      .children(".picture")
      .css({ "background-image": "url(" + $(this).attr("data-image") + ")" });
  });
  // --------------------------------------------- //
  // PhotoSwipe Gallery Images Replace End
  // --------------------------------------------- //
});

// --------------------------------------------- //
// Color Switch Start
// --------------------------------------------- //
const themeBtn = document.querySelector(".color-switcher");

function getCurrentTheme() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  localStorage.getItem("template.theme")
    ? (theme = localStorage.getItem("template.theme"))
    : null;
  return theme;
}

function loadTheme(theme) {
  const root = document.querySelector(":root");
  if (theme === "light") {
    themeBtn.innerHTML = `<em></em><i class="ph-bold ph-moon-stars"></i>`;
  } else {
    themeBtn.innerHTML = `<em></em><i class="ph-bold ph-sun"></i>`;
  }
  root.setAttribute("color-scheme", `${theme}`);
}

themeBtn.addEventListener("click", () => {
  let theme = getCurrentTheme();
  if (theme === "dark") {
    theme = "light";
  } else {
    theme = "dark";
  }
  localStorage.setItem("template.theme", `${theme}`);
  loadTheme(theme);
});

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(getCurrentTheme());
});

// --------------------------------------------- //
// Color Switch End
// --------------------------------------------- //
