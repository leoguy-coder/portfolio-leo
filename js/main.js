/* =========================================================
   LÉO GUY — Portfolio
   GSAP ScrollTrigger + Lenis
   ========================================================= */
(function () {
  "use strict";

  var P = (window.PROJECTS || []).slice();
  var savedOrder = window.PROJECT_ORDER || [];
  function projectKey(p) { return [p.cat, p.client, p.title].join("::"); }
  if (savedOrder.length) {
    var positions = {};
    savedOrder.forEach(function (key, index) { positions[key] = index; });
    P.sort(function (a, b) {
      var ai = positions[projectKey(a)];
      var bi = positions[projectKey(b)];
      if (ai === undefined && bi === undefined) return 0;
      if (ai === undefined) return 1;
      if (bi === undefined) return -1;
      return ai - bi;
    });
  }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Vignette YouTube — maxres n'existe pas toujours, hqdefault est garanti */
  function thumb(id) {
    return id ? "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg" : "";
  }
  function thumbFallback(id) {
    return id ? "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg" : "";
  }
  function watch(id) {
    return id ? "https://www.youtube.com/watch?v=" + id : "";
  }

  /* -------------------------------------------------------
     Construction des sections projet
     ------------------------------------------------------- */
  var host = document.getElementById("projects");

  /* Numéro affiché, calculé depuis l'ordre du tableau */
  function num(i) { return String(i + 1).padStart(2, "0"); }

  P.forEach(function (p, i) {
    var sec = document.createElement("section");
    // Alternance des fonds : le 1er projet (Bando) est noir, puis rouge, etc.
    sec.className = "project " + (i % 2 === 0 ? "project--dark" : "project--red");

    var media, still = "";
    if (p.loop) {
      // Poster local extrait de la boucle : plus net que la vignette YouTube
      media =
        '<video muted loop playsinline preload="none" ' +
        'poster="assets/img/posters/' + p.loop + '.jpg">' +
        '<source src="assets/loops/' + p.loop + '.mp4" type="video/mp4"></video>';
    } else if (p.yt) {
      still = " is-still";
      media =
        '<img src="' + thumb(p.yt) + '" alt="' + p.client + " — " + p.title + '" ' +
        'loading="lazy" data-fallback="' + thumbFallback(p.yt) + '">';
    } else {
      still = " is-empty";
      media = "";
    }

    var link = p.yt
      ? '<a class="project__link" href="' + watch(p.yt) + '" target="_blank" rel="noopener" ' +
        'aria-label="Voir ' + p.title + ' sur YouTube"></a>'
      : "";

    // Composition : titre en haut, client en bas — tous deux en rouge sur la vidéo
    sec.innerHTML =
      '<div class="project__stage">' +
        '<div class="project__sticky">' +
          '<div class="project__num">' + num(i) + "</div>" +
          '<div class="project__frame' + still + '">' + media + "</div>" +
          '<div class="project__title">' +
            "<h2>" + p.title + "</h2>" +
            '<div class="client">' + p.client + "</div>" +
          "</div>" +
          link +
        "</div>" +
      "</div>";

    host.appendChild(sec);
  });

  /* Vignette YouTube absente ou dégradée → bascule sur le repli.
     Appelé après chaque construction (projets, puis index du menu). */
  function wireThumbFallbacks(root) {
    root.querySelectorAll("img[data-fallback]").forEach(function (img) {
      var swap = function () {
        if (!img.dataset.fallback) return;
        img.src = img.dataset.fallback;
        img.removeAttribute("data-fallback");
      };
      img.addEventListener("error", swap);
      // YouTube renvoie parfois une image grise de 120x90 au lieu d'un 404
      img.addEventListener("load", function () {
        if (img.naturalWidth < 400) swap();
      });
      if (img.complete && img.naturalWidth > 0 && img.naturalWidth < 400) swap();
    });
  }
  wireThumbFallbacks(host);

  /* -------------------------------------------------------
     Index du menu
     ------------------------------------------------------- */
  var menuList = document.getElementById("menuList");
  var menu = document.getElementById("menu");
  var activeMenuPreview = null;

  function stopMenuPreview() {
    if (!activeMenuPreview) return;
    var previous = activeMenuPreview;
    activeMenuPreview = null;
    previous.row.classList.remove("is-previewing");
    previous.video.pause();
    if (previous.video.readyState) previous.video.currentTime = 0;
  }

  function playMenuPreview(row, video) {
    if (reduce || !menu.classList.contains("open") || !video.parentElement.offsetWidth) return;
    if (activeMenuPreview && activeMenuPreview.video === video) return;
    stopMenuPreview();
    var request = { row: row, video: video };
    activeMenuPreview = request;
    // Charger uniquement la boucle demandée, pas toutes les vidéos du menu.
    if (!video.getAttribute("src")) video.src = video.dataset.src;
    video.muted = true;
    video.play().catch(function () {
      if (activeMenuPreview === request) stopMenuPreview();
    });
  }

  var menuPreviewObserver = window.IntersectionObserver
    ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting && activeMenuPreview && activeMenuPreview.row === entry.target) {
          stopMenuPreview();
        }
      });
    }, { root: menu })
    : null;

  P.forEach(function (p, i) {
    var a = document.createElement(p.yt ? "a" : "div");
    a.className = "mrow";
    a.dataset.cat = p.cat;
    if (p.yt) {
      a.href = watch(p.yt);
      a.target = "_blank";
      a.rel = "noopener";
    } else if (p.loop) {
      a.tabIndex = 0;
    }
    // Au repos, conserver la vignette YouTube ; le poster local sert de repli.
    var mthumb = p.yt
      ? thumbFallback(p.yt)
      : (p.loop ? "assets/img/posters/" + p.loop + ".jpg" : "");
    // Repli : YouTube n'a pas de vignette pour tous les clips (il renvoie
    // alors une image grise de 120px) → on prend le poster local.
    var mfall = p.loop ? "assets/img/posters/" + p.loop + ".jpg" : "";
    a.innerHTML =
      '<div class="mrow__n">' + num(i) + "</div>" +
      '<div class="mrow__thumb">' +
        (mthumb ? '<img src="' + mthumb + '" alt="" loading="lazy"' +
                  (mfall ? ' data-fallback="' + mfall + '"' : "") + ">" : "") +
        (p.loop ? '<video muted loop playsinline preload="none" aria-hidden="true" ' +
          'disablepictureinpicture disableremoteplayback data-src="assets/loops/' + p.loop + '.mp4"></video>' : "") +
      "</div>" +
      "<div>" +
        '<div class="mrow__client">' + p.client + "</div>" +
        '<div class="mrow__title">' + p.title + "</div>" +
      "</div>" +
      '<div class="mrow__role">' + (p.role || "") + "</div>";
    menuList.appendChild(a);
    var preview = a.querySelector("video");
    if (preview) {
      preview.addEventListener("playing", function () {
        if (activeMenuPreview && activeMenuPreview.video === preview) {
          a.classList.add("is-previewing");
        } else {
          preview.pause();
        }
      });
      preview.addEventListener("error", function () {
        if (activeMenuPreview && activeMenuPreview.video === preview) stopMenuPreview();
      });
      a.addEventListener("pointerenter", function (event) {
        if (event.pointerType !== "touch") playMenuPreview(a, preview);
      });
      a.addEventListener("focus", function () { playMenuPreview(a, preview); });
      function stopThisPreview() {
        if (activeMenuPreview && activeMenuPreview.video === preview) stopMenuPreview();
      }
      a.addEventListener("pointerleave", stopThisPreview);
      a.addEventListener("blur", stopThisPreview);
      if (menuPreviewObserver) menuPreviewObserver.observe(a);
    }
  });
  wireThumbFallbacks(menuList);

  /* Ouverture / fermeture du menu */
  var menuBtn = document.getElementById("menuBtn");
  var lenis = null;

  function setMenu(open) {
    stopMenuPreview();
    menu.classList.toggle("open", open);
    document.querySelector(".nav").classList.toggle("menu-open", open);
    menuBtn.textContent = open ? "Close" : "Menu";
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    // Lenis est mis en pause pour figer la page derrière ; le menu, lui,
    // défile nativement grâce à data-lenis-prevent.
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) menu.scrollTop = 0;
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!menu.classList.contains("open"));
  });
  menuList.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopMenuPreview();
  });

  /* Le wordmark du menu ramène en haut de la page d'accueil */
  var menuHome = document.getElementById("menuHome");
  if (menuHome) {
    menuHome.addEventListener("click", function () {
      setMenu(false);
      if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* Filtres du menu */
  document.querySelectorAll(".menu__filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      stopMenuPreview();
      document.querySelectorAll(".menu__filters button")
        .forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      var f = b.dataset.f;
      menuList.querySelectorAll(".mrow").forEach(function (r) {
        r.classList.toggle("hide", f !== "all" && r.dataset.cat !== f);
      });
    });
  });

  /* -------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------- */
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }
  }

  /* -------------------------------------------------------
     Animation : la vidéo grandit jusqu'au plein écran
     ------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    var nav = document.querySelector(".nav");

    /* Le showreel ne tourne que tant que le hero est à l'écran :
       inutile de décoder 1600px pendant qu'on scrolle les 33 projets. */
    var hero = document.getElementById("heroVideo");
    if (hero) {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top bottom",
        end: "bottom top",
        // onToggle plutôt que onEnter : ScrollTrigger n'émet pas onEnter
        // pour un élément déjà dans le viewport au chargement.
        onToggle: function (self) {
          if (self.isActive) hero.play().catch(function () {});
          else hero.pause();
        }
      });
      hero.play().catch(function () {}); // état initial
    }

    /* Facteur d'agrandissement pour que le cadre 16/9 remplisse l'écran.
       Recalculé à chaque refresh (redimensionnement, rotation). */
    function fillScale(frame) {
      var w = frame.offsetWidth, h = frame.offsetHeight;
      if (!w || !h) return 1;
      return Math.max(window.innerWidth / w, window.innerHeight / h) * 1.002;
    }

    document.querySelectorAll(".project").forEach(function (sec) {
      var frame = sec.querySelector(".project__frame");
      var title = sec.querySelector(".project__title");
      var num   = sec.querySelector(".project__num");
      var vid   = sec.querySelector("video");
      var isRed = sec.classList.contains("project--red");

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.querySelector(".project__stage"),
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            // Nav en noir seulement sur les interstitiels rouges
            if (self.isActive) {
              nav.classList.toggle("on-red", isRed && self.progress < 0.42);
            }
          },
          onLeave:     function () { nav.classList.remove("on-red"); },
          onLeaveBack: function () { nav.classList.remove("on-red"); }
        }
      });

      // 1. le cadre grandit jusqu'à remplir l'écran (transform : pas de reflow)
      tl.fromTo(frame,
                { scale: 1 },
                { scale: function () { return fillScale(frame); },
                  ease: "power2.inOut", duration: 1 }, 0)
        // 2. le numéro s'efface
        .to(num, { opacity: 0, duration: .3, ease: "none" }, 0)
        // 3. titre (haut) et client (bas) apparaissent une fois le plein écran atteint
        .to(title, { opacity: 1, duration: .28 }, .58)
        .fromTo(title.querySelector("h2"),
                { y: -22 }, { y: 0, duration: .45, ease: "power2.out" }, .58)
        .fromTo(title.querySelector(".client"),
                { y: 22 }, { y: 0, duration: .45, ease: "power2.out" }, .58);

      if (vid) {
        // Préchargement anticipé : la boucle est téléchargée un écran avant
        // d'être visible, pour éviter le à-coup au démarrage.
        ScrollTrigger.create({
          trigger: sec,
          start: "top bottom+=120%",
          once: true,
          onEnter: function () {
            vid.preload = "auto";
            vid.load();
          }
        });

        // Lecture uniquement quand la section est à l'écran
        ScrollTrigger.create({
          trigger: sec,
          start: "top bottom",
          end: "bottom top",
          onEnter:      function () { vid.play().catch(function () {}); },
          onEnterBack:  function () { vid.play().catch(function () {}); },
          onLeave:      function () { vid.pause(); },
          onLeaveBack:  function () { vid.pause(); }
        });
      }
    });
  } else {
    // Sans GSAP (ou mouvement réduit) : tout est visible d'emblée
    document.querySelectorAll(".project__frame").forEach(function (f) {
      f.style.width = "92%";
    });
    document.querySelectorAll(".project__title,.project__cta")
      .forEach(function (t) { t.style.opacity = 1; });
    document.querySelectorAll(".project__stage")
      .forEach(function (s) { s.style.height = "100svh"; });
  }

  /* -------------------------------------------------------
     Curseur « scroll »
     ------------------------------------------------------- */
  var cur = document.getElementById("cursor");
  if (cur && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var cx = 0, cy = 0, tx = 0, ty = 0, shown = false;

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX;
      ty = e.clientY + 26;           // légèrement sous la pointe
      if (!shown) {
        cx = tx; cy = ty;            // pas de vol depuis le coin au 1er mouvement
        shown = true;
      }
      var t = e.target;
      var q = function (sel) { return t && t.closest && t.closest(sel); };

      if (q(".project__link")) {
        // Sur un projet, le clic ouvre la vidéo : on annonce l'action
        cur.textContent = "View";
        cur.classList.add("is-on");
      } else if (q("a,button,input,textarea,.menu")) {
        // Ailleurs, sur un élément cliquable, « scroll » serait trompeur
        cur.classList.remove("is-on");
      } else {
        cur.textContent = "scroll";
        cur.classList.add("is-on");
      }
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      cur.classList.remove("is-on");
    });

    (function follow() {
      cx += (tx - cx) * 0.18;        // léger retard : le mot glisse
      cy += (ty - cy) * 0.18;
      cur.style.transform =
        "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(follow);
    })();
  }

})();
