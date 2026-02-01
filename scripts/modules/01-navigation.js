export function initNavigation() {
  /* =========================
     DOM
  ========================= */

  const tasksBtn = document.getElementById("tasksBtn");
  const timerBtn = document.getElementById("timerBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const indicator = document.querySelector(".nav-indicator");

  /* =========================
     STATE
  ========================= */

  const tabs = [tasksBtn, timerBtn, settingsBtn];
  let currentIndex = 0;

  let startX = 0;
  let startY = 0;

  /* =========================
     CORE
  ========================= */

  function activateTab(i) {
    if (i < 0 || i >= tabs.length) return;

    document.querySelector(".taskPage").style.display =
      i === 0 ? "flex" : "none";
    document.querySelector(".timerPage").style.display =
      i === 1 ? "flex" : "none";
    document.querySelector(".setPage").style.display =
      i === 2 ? "flex" : "none";

    const btn = tabs[i];
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    indicator.style.width = `${btn.offsetWidth}px`;

    currentIndex = i;
    navigator.vibrate?.(10);
  }

  /* =========================
     EVENTS — BUTTONS
  ========================= */

  tasksBtn.addEventListener("click", () => activateTab(0));
  timerBtn.addEventListener("click", () => activateTab(1));
  settingsBtn.addEventListener("click", () => activateTab(2));

  /* =========================
     EVENTS — SWIPE
  ========================= */

  let swipeLocked = false;

  document.addEventListener("touchstart", (e) => {
    if (e.target.closest('input[type="range"]')) {
      swipeLocked = true;
      return;
    }

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
    if (swipeLocked) {
      swipeLocked = false;
      return;
    }

    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      activateTab(currentIndex + (dx < 0 ? 1 : -1));
    }
  });

  /* =========================
     EVENTS — RESIZE
  ========================= */

  window.addEventListener("resize", () => {
    const btn = tabs[currentIndex];
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    indicator.style.width = `${btn.offsetWidth}px`;
  });

  /* =========================
     INIT
  ========================= */

  activateTab(0);
}

export function goToTimer() {
  const timerBtn = document.getElementById("timerBtn");
  timerBtn?.click();
}
