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

// ===================== HOME: PROJECT MARQUEE — real horizontal scroll =====================
function initWorkMarquee() {
  const viewport = document.querySelector("[data-work-viewport]");
  const track = document.querySelector("[data-work-track]");
  if (!viewport || !track) return;

  const tiles = Array.from(track.querySelectorAll(".work-tile"));

  function updateTileFocus() {
    const vpRect = viewport.getBoundingClientRect();
    const centerX = vpRect.left + vpRect.width / 2;
    tiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      const tileCenter = rect.left + rect.width / 2;
      const dist = Math.abs(tileCenter - centerX);
      const norm = Math.min(1, dist / (vpRect.width * 0.62));
      const scale = 1 - norm * 0.1;
      const opacity = 1 - norm * 0.45;
      tile.style.transform = `scale(${scale.toFixed(3)})`;
      tile.style.opacity = opacity.toFixed(3);
    });
  }

  // recalc the depth effect on scroll, throttled to one calc per frame
  let ticking = false;
  viewport.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateTileFocus();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // a plain vertical mouse-wheel gesture now scrolls the strip horizontally;
  // genuine horizontal trackpad swipes (deltaX) are left to the browser
  viewport.addEventListener(
    "wheel",
    (e) => {
      const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontalIntent) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );

  // click-and-drag scrolling
  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  viewport.addEventListener("pointerdown", (e) => {
    isDown = true;
    viewport.classList.add("dragging");
    startX = e.clientX;
    startScroll = viewport.scrollLeft;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    viewport.scrollLeft = startScroll - (e.clientX - startX);
  });
  const endDrag = () => {
    isDown = false;
    viewport.classList.remove("dragging");
  };
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointerleave", endDrag);

  updateTileFocus();
  window.addEventListener("resize", updateTileFocus);
}

// ===================== SKILLS PAGE: ACCORDION =====================
function initAccordions() {
  document.querySelectorAll("[data-accordion-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("[data-accordion]").classList.toggle("open");
    });
  });
}

// ===================== LOG PAGES (protosem + iot share this) =====================
function renderProtosemStrip() {
  // no-op placeholder kept for parity if a homepage teaser strip is added later
}

function renderLogEntries(list, entries) {
  if (!entries.length) {
    list.innerHTML = `<div class="log-empty">no entries yet</div>`;
    return;
  }

  list.innerHTML = entries
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

  initLogModal(list, entries);
}

function renderProtosemPage() {
  const list = document.querySelector("[data-log-list]");
  if (!list || typeof protosemLog === "undefined") return;
  renderLogEntries(list, protosemLog);
}

function renderIoTPage() {
  const list = document.querySelector("[data-log-list]");
  if (!list || typeof iotLog === "undefined") return;
  renderLogEntries(list, iotLog);
}

// Escapes text that's going into innerHTML (entry text comes from a file
// we wrote ourselves, but this is cheap insurance and keeps code blocks
// with < > & from breaking the layout).
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Builds the rich body of a log entry: the personal intro paragraph(s),
// plus any optional structured sections an entry provides (concepts,
// hardware, wiring, a diagram line, code blocks, troubleshooting,
// reflection). Every section is optional — a plain {date, title, text}
// entry (like most Protosem ones) still renders exactly as before.
function renderEntryBody(entry) {
  let html = "";

  if (entry.text) {
    html += entry.text
      .split(/\n\n+/)
      .map((para) => `<p class="log-text">${escapeHtml(para)}</p>`)
      .join("");
  }

  if (entry.concepts) {
    html += `
      <div class="log-section">
        <h6>concepts, in my own words</h6>
        <p>${escapeHtml(entry.concepts)}</p>
      </div>`;
  }

  if (entry.hardware && entry.hardware.length) {
    html += `
      <div class="log-section">
        <h6>hardware &amp; software</h6>
        <ul>${entry.hardware.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>
      </div>`;
  }

  if (entry.diagram || (entry.wiring && entry.wiring.length)) {
    html += `<div class="log-section"><h6>wiring &amp; data flow</h6>`;
    if (entry.diagram) {
      html += `<div class="diagram-line">${escapeHtml(entry.diagram)}</div>`;
    }
    if (entry.wiring && entry.wiring.length) {
      html += `<ul>${entry.wiring.map((w) => `<li>${escapeHtml(w)}</li>`).join("")}</ul>`;
    }
    html += `</div>`;
  }

  if (entry.code && entry.code.length) {
    html += `<div class="log-section"><h6>code</h6>`;
    html += entry.code
      .map(
        (block) => `
        <div class="code-block">
          ${block.label ? `<div class="code-label">${escapeHtml(block.label)}</div>` : ""}
          <pre><code>${escapeHtml(block.code)}</code></pre>
        </div>`
      )
      .join("");
    html += `</div>`;
  }

  if (entry.challenges && entry.challenges.length) {
    html += `
      <div class="log-section">
        <h6>troubleshooting</h6>
        <ul>${entry.challenges.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
      </div>`;
  }

  if (entry.reflection) {
    html += `
      <div class="log-section">
        <h6>reflection</h6>
        <p>${escapeHtml(entry.reflection)}</p>
      </div>`;
  }

  return html;
}

function initLogModal(list, entries) {
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
        <div class="log-body" data-log-modal-body></div>
        <div class="log-photo-pile" data-log-photo-pile style="display:none;">
          <h5>attached photos</h5>
          <div class="pile-stack" data-pile-stack></div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  const modalDate = overlay.querySelector("[data-log-modal-date]");
  const modalTitle = overlay.querySelector("[data-log-modal-title]");
  const modalBody = overlay.querySelector("[data-log-modal-body]");
  const closeBtn = overlay.querySelector("[data-log-modal-close]");
  const pileWrap = overlay.querySelector("[data-log-photo-pile]");
  const pileStack = overlay.querySelector("[data-pile-stack]");

  const rotations = [-8, 4, -3, 9, -6, 5];

  const openModal = (index) => {
    const entry = entries[index];
    if (!entry) return;
    modalDate.textContent = entry.date;
    modalTitle.textContent = entry.title;
    modalBody.innerHTML = renderEntryBody(entry);
    modalBody.scrollTop = 0;
    overlay.querySelector(".log-modal").scrollTop = 0;

    // combine photos + videos into one media list — order: images first, then videos
    const media = [
      ...(entry.images || []).map((src) => ({ type: "image", src })),
      ...(entry.videos || []).map((src) => ({ type: "video", src })),
    ];

    if (media.length) {
      pileWrap.style.display = "block";
      pileWrap.querySelector("h5").textContent = media.some((m) => m.type === "video")
        ? "attached photos & videos"
        : "attached photos";
      pileStack.innerHTML = media
        .map((m, i) => {
          const r = rotations[i % rotations.length];
          const offset = i * 6;
          const style = `--r:${r}deg; transform: translate(${offset}px, ${-offset * 0.6}px) rotate(${r}deg); z-index:${i};`;
          if (m.type === "video") {
            return `
              <div class="pile-video-wrap" style="${style}" data-index="${i}">
                <video class="pile-img" src="${m.src}" muted preload="metadata" playsinline></video>
                <span class="pile-play-icon">▶</span>
              </div>`;
          }
          return `<img class="pile-img" src="${m.src}" alt="Photo ${i + 1} from ${entry.title}" style="${style}" data-index="${i}">`;
        })
        .join("");
      // the whole stack opens the lightbox starting at the first item —
      // individual lower items in the pile are visually covered, so the
      // stack itself (not each photo/video) is the click target.
      pileStack.onclick = () => openLightbox(media, 0);
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

// ===================== LIGHTBOX (horizontal scroll through images/videos) =====================
function openLightbox(media, startIndex) {
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
  track.innerHTML = media
    .map((m, i) =>
      m.type === "video"
        ? `<div class="lightbox-slide"><video src="${m.src}" controls playsinline preload="metadata"></video></div>`
        : `<div class="lightbox-slide"><img src="${m.src}" alt="Photo ${i + 1}"></div>`
    )
    .join("");

  const pauseAllVideos = () => {
    track.querySelectorAll("video").forEach((v) => v.pause());
  };

  const updateCounter = () => {
    const slideWidth = track.clientWidth;
    const idx = Math.round(track.scrollLeft / slideWidth);
    counter.textContent = `${idx + 1} / ${media.length}`;
    // pause any video that's scrolled out of view so audio doesn't keep playing in the background
    track.querySelectorAll(".lightbox-slide").forEach((slide, i) => {
      if (i !== idx) {
        const v = slide.querySelector("video");
        if (v) v.pause();
      }
    });
  };
  track.addEventListener("scroll", () => window.requestAnimationFrame(updateCounter), { passive: true });

  lb.classList.add("open");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    track.scrollTo({ left: startIndex * track.clientWidth, behavior: "instant" });
    updateCounter();
  });

  function closeLightbox() {
    pauseAllVideos();
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
  renderIoTPage();
});
