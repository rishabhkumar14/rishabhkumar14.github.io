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

  // Tech stack: classy multi-row MARQUEE carousel. Run BEFORE the GSAP
  // scroll setup so it removes the animate-card-5/animate-in-up classes
  // first — that way GSAP never attaches opacity-0 reveal tweens to these
  // cards (which would otherwise leave clones invisible). The flat grid is
  // reflowed into 3 rows that scroll horizontally in alternating directions
  // (row 1 →, row 2 ←, row 3 →), looping seamlessly forever: each row's
  // content is duplicated once and the track translates exactly -50%, so the
  // loop has no seam (the per-card right margin bakes the gap into the width).
  // Pauses on hover (desktop), respects reduced-motion, and shows ALL icons
  // on phones too (they just scroll past). Progressive enhancement: if this
  // never runs (old cache), the original wrapped grid still renders fine.
  (function buildTechMarquee() {
    const grid = document.querySelector("#tech .tools-cards");
    if (!grid || grid.dataset.marquee === "1") return;
    const items = Array.prototype.slice.call(
      grid.querySelectorAll(".tools-cards__item"),
    );
    if (items.length < 6) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ROWS = 3;

    // Distribute items round-robin so each row is evenly filled and mixed.
    const rows = [];
    for (let r = 0; r < ROWS; r++) rows.push([]);
    items.forEach((item, i) => rows[i % ROWS].push(item));

    // Strip animation hooks + any inline styles so cards are purely CSS-
    // controlled (always visible), then drop the grid layout classes.
    const clearAnim = (el) => {
      el.classList.remove("animate-in-up");
      const s = el.style;
      s.opacity = "";
      s.transform = "";
      s.translate = "";
      s.rotate = "";
      s.scale = "";
    };
    const cleanCard = (item) => {
      item.classList.remove("grid-item-s", "animate-card-5", "d-flex");
      clearAnim(item);
      item
        .querySelectorAll(".tools-cards__icon, .tools-cards__caption")
        .forEach(clearAnim);
    };

    grid.classList.remove("d-flex", "justify-content-start", "flex-wrap");
    grid.classList.add("tools-marquee");
    grid.innerHTML = "";
    grid.dataset.marquee = "1";

    const baseDur = 42; // seconds for one full loop (longer = slower/classier)
    rows.forEach((rowItems, r) => {
      const row = document.createElement("div");
      row.className =
        "tools-marquee__row" +
        (r % 2 === 1 ? " tools-marquee__row--reverse" : "");

      const track = document.createElement("div");
      track.className = "tools-marquee__track";
      // The marquee is the ONLY way to browse all the tools on a phone, so
      // it must keep scrolling even under Reduce Motion — otherwise the
      // section is frozen and most icons are unreachable (this is why it
      // appeared static on real phones that have Reduce Motion enabled).
      // Under reduced-motion we just scroll more gently (slower) instead of
      // stopping. The interactive extras (cursor repel, scroll-roulette)
      // remain disabled under reduced-motion.
      const durSec = (reduce ? baseDur * 1.9 : baseDur) + r * 5;
      track.style.setProperty("--dur", durSec + "s");

      // Original cards, then a cleaned clone of each for the seamless loop.
      rowItems.forEach((it) => {
        cleanCard(it);
        track.appendChild(it);
      });
      rowItems.forEach((it) => {
        const clone = it.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });

      row.appendChild(track);
      grid.appendChild(row);
    });
  })();

  // Tech marquee MAGNET-REPEL: the rows keep scrolling, but individual cards
  // flee the cursor like same-pole magnets — pushed away with a strength that
  // grows as the cursor gets closer — and glide back to rest once it moves
  // away. Fine-pointer only (including hybrid touch laptops). Runs a continuous
  // rAF loop while the pointer is inside so cards still react to a stationary
  // cursor as they scroll past it.
  (function techMarqueeRepel() {
    const marquee = document.querySelector("#tech .tools-marquee");
    if (!marquee) return;
    const canRepel =
      window.matchMedia("(any-hover: hover) and (any-pointer: fine)").matches ||
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canRepel) return;
    // NOTE: intentionally NOT gated by prefers-reduced-motion. The repel only
    // moves cards in direct response to the user's own cursor (no autonomous
    // motion), and users with Reduce Motion on still expect the marquee +
    // hover interaction to work — gating it left the tools feeling dead to
    // the mouse on Reduce-Motion machines.

    const RADIUS = 210; // px: how close before a card starts fleeing
    const STRENGTH = 92; // px: max push at closest range
    const rows = Array.prototype.slice.call(
      marquee.querySelectorAll(".tools-marquee__row"),
    );
    let mx = 0;
    let my = 0;
    let inside = false;
    let raf = 0;

    const frame = () => {
      raf = 0;
      let anyOffset = false;
      rows.forEach((row) => {
        row.querySelectorAll(".tools-cards__item").forEach((item) => {
          const r = item.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (inside && dist < RADIUS) {
            const force = (1 - dist / RADIUS) * STRENGTH;
            const ox = (dx / dist) * force;
            const oy = (dy / dist) * force;
            item.style.transform = "translate(" + ox + "px," + oy + "px)";
            anyOffset = true;
          } else if (item.style.transform) {
            item.style.transform = "";
          }
        });
      });
      // Keep looping while the cursor is inside, or for one extra pass to
      // clear any lingering offsets after it leaves (CSS eases the return).
      if (inside || anyOffset) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    marquee.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      inside = true;
      rows.forEach((row) => row.classList.add("is-repelling"));
      kick();
    });
    marquee.addEventListener("pointerleave", () => {
      inside = false;
      rows.forEach((row) => row.classList.remove("is-repelling"));
      kick();
    });
  })();

  // Tech marquee CLICK-TO-POP: clicking a card makes it flash + collapse and
  // disappear. The marquee is an endless loop (every card is duplicated), so
  // removing one costs nothing visually. Works on every device (tap on phone,
  // click on desktop). Delegated so it covers originals AND clones.
  (function techMarqueePop() {
    const marquee = document.querySelector("#tech .tools-marquee");
    if (!marquee) return;

    // Spawn a short firework of particles at (x, y) in viewport coords.
    const explode = (x, y) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const burst = document.createElement("div");
      burst.className = "tools-burst";
      burst.style.left = x + "px";
      burst.style.top = y + "px";
      const N = 14;
      for (let i = 0; i < N; i++) {
        const p = document.createElement("span");
        p.className = "tools-burst__particle";
        const ang = (Math.PI * 2 * i) / N + Math.random() * 0.5;
        const dist = 36 + Math.random() * 46;
        p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        p.style.setProperty("--dy", Math.sin(ang) * dist + "px");
        p.style.animationDelay = Math.random() * 0.05 + "s";
        // Slight size + warm-tone variety for a livelier burst.
        const sz = 5 + Math.random() * 6;
        p.style.width = sz + "px";
        p.style.height = sz + "px";
        burst.appendChild(p);
      }
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 750);
    };

    marquee.addEventListener("click", (e) => {
      const item = e.target.closest(".tools-cards__item");
      if (!item || item.classList.contains("is-popping")) return;
      item.style.transform = ""; // drop any repel offset so the pop is clean
      item.classList.add("is-popping");
      const done = () => {
        // Explosion at the card's last position, just as it vanishes.
        const r = item.getBoundingClientRect();
        explode(r.left + r.width / 2, r.top + r.height / 2);
        // Collapse the slot (eased) so the row reflows smoothly, then remove.
        const w = item.getBoundingClientRect().width;
        item.style.width = w + "px";
        item.style.overflow = "hidden";
        void item.offsetWidth; // reflow so the start width is registered
        item.style.transition =
          "width 0.3s ease, margin 0.3s ease, padding 0.3s ease";
        item.style.width = "0px";
        item.style.margin = "0";
        item.style.padding = "0";
        item.addEventListener("transitionend", () => item.remove(), {
          once: true,
        });
        // Fallback removal in case no transition fires.
        setTimeout(() => item.isConnected && item.remove(), 450);
      };
      item.addEventListener("animationend", done, { once: true });
    });
  })();

  // Tech marquee PHONE ROULETTE-ON-SCROLL: touch users can't hover, so
  // instead the rows spin FAST like a roulette wheel while the page is being
  // scrolled, then ease back to their normal smooth crawl when scrolling
  // stops. Implemented by ramping each marquee animation's playbackRate
  // (smooth, no position jumps). Touch / coarse-pointer only; desktop keeps
  // the magnet-repel. Reduced-motion skips it.
  (function techMarqueeScrollRoulette() {
    const marquee = document.querySelector("#tech .tools-marquee");
    if (!marquee) return;
    const isTouch = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;
    if (!isTouch) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracks = Array.prototype.slice.call(
      marquee.querySelectorAll(".tools-marquee__track"),
    );
    if (!tracks.length) return;

    const BASE = 1; // normal smooth speed
    const MAX = 9; // roulette top speed
    let target = BASE; // where playbackRate is heading
    let current = BASE; // eased actual rate
    let lastY = window.scrollY || window.pageYOffset || 0;
    let idleTimer = 0;

    const setRate = (rate) => {
      tracks.forEach((track) => {
        track.getAnimations().forEach((a) => {
          a.playbackRate = rate;
        });
      });
    };

    // Each frame: ease current → target, and apply. gsap.ticker is robust
    // under Lenis smooth-scroll (native scroll events are unreliable there).
    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(current - target) < 0.02) current = target;
      setRate(current);
    };
    if (window.gsap && gsap.ticker) gsap.ticker.add(tick);

    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      const v = Math.abs(y - lastY);
      lastY = y;
      // Map scroll speed → target rate (more flick = faster spin).
      target = Math.min(MAX, BASE + v * 0.25);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        target = BASE;
      }, 140);
    };
    // Listen on both window scroll and Lenis (via gsap.ticker sampling) so
    // it works regardless of how the page scrolls.
    window.addEventListener("scroll", onScroll, { passive: true });
    if (window.gsap && gsap.ticker) gsap.ticker.add(onScroll);
  })();

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

  // Keep ScrollTrigger in lockstep with Lenis's virtual scroll position.
  lenis.on("scroll", ScrollTrigger.update);

  // ---- Keep scroll metrics fresh as the page grows ----
  // The page has many lazy-loaded images (projects, research, tools). As they
  // decode, the document height changes. If Lenis / ScrollTrigger keep a stale
  // (shorter) measurement, a first-time visitor can hit a premature "bottom"
  // before reaching the contact form. Recompute both whenever the height
  // changes so the full page always stays scrollable.
  let recomputeRaf = 0;
  const recomputeScroll = () => {
    if (recomputeRaf) cancelAnimationFrame(recomputeRaf);
    recomputeRaf = requestAnimationFrame(() => {
      recomputeRaf = 0;
      if (typeof lenis.resize === "function") lenis.resize();
      ScrollTrigger.refresh();
    });
  };
  // After every asset the browser reports as fully loaded.
  window.addEventListener("load", recomputeScroll);
  // Each lazy image that finishes (or fails) can shift the layout.
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", recomputeScroll, { passive: true });
    img.addEventListener("error", recomputeScroll, { passive: true });
  });
  // Catch any other height changes (fonts, widgets settling, content reveals).
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(recomputeScroll);
    const scrollRoot =
      document.querySelector(".content__wrapper") || document.body;
    ro.observe(scrollRoot);
  }
  // A couple of delayed passes cover assets that report ready before they have
  // actually been laid out.
  setTimeout(recomputeScroll, 600);
  setTimeout(recomputeScroll, 2000);
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

  // Grid 5x — only the tech tool cards used this; if the marquee consumed
  // them (no .animate-card-5 left) we skip the batch to avoid a GSAP
  // "target not found" warning.
  if (document.querySelector(".animate-card-5")) {
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
      onLeave: (batch) =>
        gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
      onEnterBack: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
      onLeaveBack: (batch) =>
        gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
    });

    ScrollTrigger.addEventListener("refreshInit", () =>
      gsap.set(".animate-card-5", { y: 0, opacity: 1 }),
    );
  }

  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-2", { y: 0, opacity: 1 }),
  );
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-3", { y: 0, opacity: 1, rotationX: 0, scale: 1 }),
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
