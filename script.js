/* ============================================================
   INVITACIÓN JULI & MAXI
   - Cuenta regresiva
   - Acordeones
   - Música de fondo (play / mute)
============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initCountdown();
  initAccordions();
  initMusic();
});

/* ------------------------------------------------------------
   0. REVEAL AL SCROLLEAR
   Marca los bloques como visibles cuando entran en pantalla,
   generando un fade + leve subida (los estilos están en el CSS).
------------------------------------------------------------ */
function initReveal() {
  // Bloques que queremos animar al entrar en viewport.
  // El hero queda fuera a propósito (es lo primero que se ve).
  const selectors = [
    ".countdown-section",
    ".info-section",
    ".gallery-section",
    ".details-section",
    ".photo-banner",
    ".thanks"
  ];
  const targets = document.querySelectorAll(selectors.join(","));
  if (!targets.length) return;

  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  // Si el navegador no soporta IntersectionObserver, mostramos todo.
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // se anima una sola vez
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* ------------------------------------------------------------
   1. CUENTA REGRESIVA
   Lee la fecha desde data-wedding en el HTML.
------------------------------------------------------------ */
function initCountdown() {
  const countdownEl = document.querySelector(".countdown");
  if (!countdownEl) return;

  const targetDate = new Date(countdownEl.dataset.wedding).getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function update() {
    const now = Date.now();
    let diff = targetDate - now;

    // Si la fecha ya pasó, dejamos todo en cero.
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}


/* ------------------------------------------------------------
   2. ACORDEONES
   Abre/cierra cada panel y cierra los demás del mismo grupo.
------------------------------------------------------------ */
function initAccordions() {
  const triggers = document.querySelectorAll(".accordion__trigger");

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Cerrar los demás dentro del mismo .accordion
      const group = trigger.closest(".accordion");
      group.querySelectorAll(".accordion__trigger").forEach(function (t) {
        t.setAttribute("aria-expanded", "false");
        t.nextElementSibling.style.maxHeight = null;
      });

      // Abrir el actual (si estaba cerrado)
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";

        // Si el panel tiene imágenes (ej: SVG dresscode) que aún no cargaron,
        // recalculamos la altura cuando terminen de cargar.
        panel.querySelectorAll("img").forEach(function (img) {
          if (!img.complete) {
            img.addEventListener("load", function () {
              if (trigger.getAttribute("aria-expanded") === "true") {
                panel.style.maxHeight = panel.scrollHeight + "px";
              }
            }, { once: true });
          }
        });
      }
    });
  });
}


/* ------------------------------------------------------------
   3. MÚSICA DE FONDO
   Los navegadores no dejan reproducir audio sin interacción,
   por eso arranca al primer click del usuario en el botón.
------------------------------------------------------------ */
function initMusic() {
  const button = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-music");
  if (!button || !audio) return;

  audio.volume = 0.5;

  button.addEventListener("click", function () {
    if (audio.paused) {
      audio
        .play()
        .then(function () {
          button.classList.add("is-playing");
          button.setAttribute("aria-pressed", "true");
          button.setAttribute("aria-label", "Silenciar música");
        })
        .catch(function (err) {
          console.log("[v0] No se pudo reproducir la música:", err.message);
        });
    } else {
      audio.pause();
      button.classList.remove("is-playing");
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", "Reproducir música");
    }
  });
}

// Agrega automáticamente la clase reveal a todas las secciones
document.querySelectorAll("section").forEach(section => {
    section.classList.add("reveal");
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(section => {
    observer.observe(section);
});

