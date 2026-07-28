/* ============================================================
   toyalimalvl — diário visual
   JS puro. Sem bibliotecas. Sem dependências.
   Adicionar novos .post não exige nenhuma alteração aqui:
   o MutationObserver cuida de qualquer elemento novo.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Loading screen ---------- */
  var loading = document.getElementById("loading");

  function hideLoading() {
    if (!loading) return;
    loading.classList.add("is-hidden");
  }

  window.addEventListener("load", function () {
    // pequena pausa intencional — "collecting memories..." precisa de tempo para respirar
    setTimeout(hideLoading, 900);
  });

  // salvaguarda: nunca deixar a pessoa presa na tela de loading
  setTimeout(hideLoading, 3500);

  /* ---------- Fade-in ao entrar no viewport ---------- */
  var observer;

  function observePost(el) {
    if (!observer) return;
    observer.observe(el);
  }

  function initObserver() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".post").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".post").forEach(observePost);
  }

  /* ---------- Observa novos .post adicionados dinamicamente ----------
     Isso garante que qualquer foto nova colada no HTML (ou injetada
     futuramente via JS) herde a mesma animação de entrada, sem que
     ninguém precise tocar neste arquivo. */
  function watchForNewPosts() {
    var mural = document.querySelector(".mural");
    if (!mural || !("MutationObserver" in window)) return;

    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1 && node.classList && node.classList.contains("post")) {
            observePost(node);
          }
        });
      });
    });

    mo.observe(mural, { childList: true });
  }

  /* ---------- Cursor refinado (ponto + anel) ---------- */
  function initCustomCursor() {
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    // telas de toque: sem cursor customizado, sem "cursor: none"
    var isTouch = window.matchMedia("(hover: none)").matches ||
      "ontouchstart" in window;
    if (isTouch) {
      document.body.classList.add("no-custom-cursor");
      return;
    }

    var ringX = 0, ringY = 0;
    var targetX = 0, targetY = 0;
    var raf = null;

    function onMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform =
        "translate(" + targetX + "px, " + targetY + "px) translate(-50%, -50%)";
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      // o anel segue com um leve atraso, o ponto acompanha exatamente
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform =
        "translate(" + ringX + "px, " + ringY + "px) translate(-50%, -50%)";

      if (Math.abs(targetX - ringX) > 0.1 || Math.abs(targetY - ringY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    document.addEventListener("mousemove", onMove);

    // esconde o cursor quando sai da janela, mostra quando volta
    document.addEventListener("mouseleave", function () {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });

    // engrossa o anel sobre elementos interativos
    var interactiveSelector = "a, button, .post, .username, input, textarea";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        ring.classList.add("is-active");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        ring.classList.remove("is-active");
      }
    });
  }

  /* ---------- Timeline: fade-in dos itens ao entrar no viewport ---------- */
  function initTimelineObserver() {
    var items = document.querySelectorAll(".timeline-item");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var timelineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) { timelineObserver.observe(el); });
  }

  /* ---------- Parallax suave para [data-parallax="soft"] ---------- */
  function initParallax() {
    var els = document.querySelectorAll('[data-parallax="soft"]');
    if (!els.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var ticking = false;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      els.forEach(function (el) {
        // efeito bem discreto: acompanha o scroll a uma fração da velocidade
        var offset = scrollY * 0.04;
        el.style.transform = "translateY(" + offset.toFixed(2) + "px)";
      });
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Easter egg: clique no username ---------- */
  function initUsernameEasterEgg() {
    var username = document.getElementById("username");
    var toast = document.getElementById("easter-toast");
    if (!username || !toast) return;

    var timer = null;

    username.addEventListener("click", function () {
      toast.classList.add("is-visible");
      clearTimeout(timer);
      timer = setTimeout(function () {
        toast.classList.remove("is-visible");
      }, 2200);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initObserver();
    watchForNewPosts();
    initUsernameEasterEgg();
    initCustomCursor();
    initTimelineObserver();
    initParallax();
  });
})();