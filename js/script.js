// ============================================================
// Tejaswi Krishnaraj — portfolio v2 — shared script
// ============================================================

// ===================== SITE LOADER =====================
function initLoader() {
  const loader = document.querySelector("[data-site-loader]");
  if (!loader) return;
  const textEl = loader.querySelector("[data-loader-quote]");
  const quote = "Curiosity, compiled.";

  textEl.innerHTML = quote
    .split("")
    .map((ch, i) => `<span class="lq-char" style="animation-delay:${i * 35}ms">${ch === " " ? "&nbsp;" : ch}</span>`)
    .join("");

  document.body.style.overflow = "hidden";

  const totalMs = 1700;
  setTimeout(() => {
    loader.classList.add("done");
    document.body.style.overflow = "";
    setTimeout(() => loader.remove(), 700);
  }, totalMs);
}

// ===================== NAV =====================
function initNav() {
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = document.querySelector("[data-menu-close]");
  const overlay = document.querySelector(".nav-overlay");
  if (!openBtn || !overlay) return;

  const open = () => overlay.classList.add("open");
  const close = () => overlay.classList.remove("open");

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

// ===================== HOME: TYPEWRITER DESCRIPTION =====================
function initTypewriter() {
  const el = document.querySelector("[data-typewriter-text]");
  if (!el) return;

  const lines = [
    "AI & Data Science student who'd rather build than just read about it.",
    "I move between machine learning notebooks and embedded circuit boards.",
    "Currently building AutiPath — indoor navigation for autistic children.",
    "Curious how the brain computes, one experiment at a time.",
  ];
  let li = 0, ci = 0, deleting = false;

  function tick() {
    const line = lines[li];
    if (!deleting) {
      ci++;
      el.textContent = line.slice(0, ci);
      if (ci === line.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 34);
    } else {
      ci--;
      el.textContent = line.slice(0, ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; setTimeout(tick, 450); return; }
      setTimeout(tick, 16);
    }
  }
  tick();
}

// ===================== HOME: SKILLS TICKER (pure CSS marquee, just duplicate content) =====================
function initSkillsMarquee() {
  const track = document.querySelector("[data-skills-marquee]");
  if (!track) return;
  track.innerHTML = track.innerHTML + track.innerHTML;
}

// ===================== HOME: PROJECT MARQUEE — scroll-scrubbed =====================
function initWorkMarquee() {
  const viewport = document.querySelector("[data-work-viewport]");
  const track = document.querySelector("[data-work-track]");
  if (!viewport || !track) return;

  // duplicate tiles once so the scrub has room to move without hitting an edge instantly
  track.innerHTML = track.innerHTML + track.innerHTML;

  let lastScrollY = window.scrollY;
  let offset = 0;
  const maxOffset = () => -(track.scrollWidth / 2);

  function onScroll() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    lastScrollY = currentY;

    offset -= delta * 0.6;
    if (offset > 0) offset = maxOffset();
    if (offset < maxOffset()) offset = 0;

    track.style.transform = `translateX(${offset}px)`;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

// ===================== SKILLS PAGE: ACCORDION =====================
function initAccordions() {
  document.querySelectorAll("[data-accordion-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("[data-accordion]").classList.toggle("open");
    });
  });
}

// ===================== PROTOSEM =====================
function renderProtosemStrip() {
  // no-op placeholder kept for parity if a homepage teaser strip is added later
}

function renderProtosemPage() {
  const list = document.querySelector("[data-log-list]");
  if (!list || typeof protosemLog === "undefined") return;

  if (!protosemLog.length) {
    list.innerHTML = `<div class="log-empty">no entries yet</div>`;
    return;
  }

  list.innerHTML = protosemLog
    .map((e, i) => {
      const thumbs = (e.images || [])
        .slice(0, 3)
        .map(() => `<span class="lth-dot"></span>`)
        .join("");
      return `
      <button class="log-entry" type="button" data-log-index="${i}">
        <div class="log-date">${e.date}</div>
        <div>
          <h3 class="log-title">${e.title}</h3>
          ${thumbs ? `<div class="log-thumb-hint">${thumbs}</div>` : ""}
        </div>
        <span class="log-open">read entry →</span>
      </button>`;
    })
    .join("");

  initProtosemModal(list);
}

function initProtosemModal(list) {
  let overlay = document.querySelector("[data-log-modal-overlay]");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "log-modal-overlay";
    overlay.setAttribute("data-log-modal-overlay", "");
    overlay.innerHTML = `
      <div class="log-modal" role="dialog" aria-modal="true">
        <button class="log-modal-close" type="button" data-log-modal-close aria-label="Close">✕</button>
        <div class="log-date" data-log-modal-date></div>
        <h3 data-log-modal-title></h3>
        <p class="log-text" data-log-modal-text></p>
        <div class="log-photo-pile" data-log-photo-pile style="display:none;">
          <h5>attached photos</h5>
          <div class="pile-stack" data-pile-stack></div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  const modalDate = overlay.querySelector("[data-log-modal-date]");
  const modalTitle = overlay.querySelector("[data-log-modal-title]");
  const modalText = overlay.querySelector("[data-log-modal-text]");
  const closeBtn = overlay.querySelector("[data-log-modal-close]");
  const pileWrap = overlay.querySelector("[data-log-photo-pile]");
  const pileStack = overlay.querySelector("[data-pile-stack]");

  const rotations = [-8, 4, -3, 9, -6, 5];

  const openModal = (index) => {
    const entry = protosemLog[index];
    if (!entry) return;
    modalDate.textContent = entry.date;
    modalTitle.textContent = entry.title;
    modalText.textContent = entry.text;

    if (entry.images && entry.images.length) {
      pileWrap.style.display = "block";
      pileStack.innerHTML = entry.images
        .map((src, i) => {
          const r = rotations[i % rotations.length];
          const offset = i * 6;
          return `<img class="pile-img" src="${src}" alt="Photo ${i + 1} from ${entry.title}" style="--r:${r}deg; transform: translate(${offset}px, ${-offset * 0.6}px) rotate(${r}deg); z-index:${i};" data-index="${i}">`;
        })
        .join("");
      // the whole stack opens the lightbox starting at the first photo —
      // individual lower photos in the pile are visually covered, so the
      // stack itself (not each image) is the click target.
      pileStack.onclick = () => openLightbox(entry.images, 0);
    } else {
      pileWrap.style.display = "none";
      pileStack.innerHTML = "";
    }

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  list.querySelectorAll("[data-log-index]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(Number(btn.getAttribute("data-log-index"))));
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}

// ===================== LIGHTBOX (horizontal scroll through images) =====================
function openLightbox(images, startIndex) {
  let lb = document.querySelector("[data-lightbox]");
  if (!lb) {
    lb = document.createElement("div");
    lb.className = "lightbox-overlay";
    lb.setAttribute("data-lightbox", "");
    lb.innerHTML = `
      <button class="lightbox-close" data-lightbox-close aria-label="Close">✕</button>
      <div class="lightbox-counter" data-lightbox-counter></div>
      <div class="lightbox-track" data-lightbox-track></div>
      <div class="lightbox-hint">scroll or swipe → to browse</div>
    `;
    document.body.appendChild(lb);

    lb.querySelector("[data-lightbox-close]").addEventListener("click", () => closeLightbox());
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox();
    });
  }

  const track = lb.querySelector("[data-lightbox-track]");
  const counter = lb.querySelector("[data-lightbox-counter]");
  track.innerHTML = images
    .map((src, i) => `<div class="lightbox-slide"><img src="${src}" alt="Photo ${i + 1}"></div>`)
    .join("");

  const updateCounter = () => {
    const slideWidth = track.clientWidth;
    const idx = Math.round(track.scrollLeft / slideWidth);
    counter.textContent = `${idx + 1} / ${images.length}`;
  };
  track.addEventListener("scroll", () => window.requestAnimationFrame(updateCounter), { passive: true });

  lb.classList.add("open");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    track.scrollTo({ left: startIndex * track.clientWidth, behavior: "instant" });
    updateCounter();
  });

  function closeLightbox() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// ===================== BOOTSTRAP =====================
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNav();
  initTypewriter();
  initSkillsMarquee();
  initWorkMarquee();
  initAccordions();
  renderProtosemPage();
});
