export function initTimer() {
  /* =========================
     DOM
  ========================= */

  const focusBtn = document.getElementById("focusBtn");
  const breakBtn = document.getElementById("breakBtn");
  const restBtn = document.getElementById("restBtn");

  const focusDisplay = document.getElementById("focusDisplay");
  const breakDisplay = document.getElementById("breakDisplay");
  const restDisplay = document.getElementById("restDisplay");

  const resetBtn = document.getElementById("resetBtn");
  const startBtn = document.getElementById("startBtn");
  const nextBtn = document.getElementById("nextBtn");

  const progress = document.querySelector(".progress");
  const timers = document.querySelectorAll(".timer");

  /* =========================
     STATE
  ========================= */

  focusBtn.classList.add("active-btn");

  let intervalId = null;
  let pomodoroCount = 0;

  const soundOn = new Audio("./sounds/on.mp3");
  const soundOff = new Audio("./sounds/off.mp3");

  /* =========================
     HELPERS
  ========================= */

  function getActiveDisplay() {
    if (!focusDisplay.classList.contains("hidden")) return focusDisplay;
    if (!breakDisplay.classList.contains("hidden")) return breakDisplay;
    return restDisplay;
  }

  function timerRemove() {
    const icon = startBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }

    progress.classList.remove("active-progress");
    timers.forEach((el) => el.classList.remove("active-timer"));

    clearInterval(intervalId);
    intervalId = null;
  }

  function setMode(show, btn) {
    timerRemove();

    focusDisplay.classList.add("hidden");
    breakDisplay.classList.add("hidden");
    restDisplay.classList.add("hidden");
    show.classList.remove("hidden");

    focusBtn.classList.remove("active-btn");
    breakBtn.classList.remove("active-btn");
    restBtn.classList.remove("active-btn");
    btn.classList.add("active-btn");
  }

  function resetDisplay(display, minutes) {
    display.textContent = `${String(minutes).padStart(2, "0")}:00`;
  }

  /* =========================
     EVENTS — START / PAUSE
  ========================= */

  startBtn.addEventListener("click", () => {
    const icon = startBtn.querySelector("i");
    if (!icon) return;

    if (icon.classList.contains("fa-play")) {
      icon.classList.replace("fa-play", "fa-pause");
      soundOn.currentTime = 0;
      soundOn.play();
      startTimer();
    } else {
      soundOff.currentTime = 0;
      soundOff.play();
      timerRemove();
    }
  });

  /* =========================
     EVENTS — MODES
  ========================= */

  focusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setMode(focusDisplay, focusBtn);
  });

  breakBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setMode(breakDisplay, breakBtn);
  });

  restBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setMode(restDisplay, restBtn);
  });

  /* =========================
     EVENTS — NEXT MODE
  ========================= */

  nextBtn.addEventListener("click", () => {
    const active = getActiveDisplay();

    soundOn.currentTime = 0;
    soundOn.play();

    if (active === focusDisplay) breakBtn.click();
    else if (active === breakDisplay) restBtn.click();
    else focusBtn.click();
  });

  /* =========================
     EVENTS — RESET
  ========================= */

  resetBtn.addEventListener("click", () => {
    timerRemove();
    soundOff.currentTime = 0;
    soundOff.play();

    pomodoroCount = 0;

    const active = getActiveDisplay();

    if (active === focusDisplay)
      resetDisplay(focusDisplay, focusDuration.value);
    else if (active === breakDisplay)
      resetDisplay(breakDisplay, breakDuration.value);
    else resetDisplay(restDisplay, restDuration.value);
  });

  /* =========================
     TIMER LOOP
  ========================= */

  function startTimer() {
    if (intervalId) return;

    progress.classList.add("active-progress");
    timers.forEach((el) => el.classList.add("active-timer"));

    const display = getActiveDisplay();
    let [minutes, seconds] = display.textContent.split(":").map(Number);
    let totalSeconds = minutes * 60 + seconds;

    intervalId = setInterval(() => {
      totalSeconds--;

      if (totalSeconds < 0) {
        clearInterval(intervalId);
        intervalId = null;

        const icon = startBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
        }

        if (display === focusDisplay) {
          pomodoroCount++;

          if (pomodoroCount >= Number(restInterval.value)) {
            alert("End of session");
            pomodoroCount = 0;
            return;
          }

          if (pomodoroCount === Number(restInterval.value)) restBtn.click();
          else breakBtn.click();
        } else {
          focusBtn.click();
        }

        const icon2 = startBtn.querySelector("i");
        if (icon2) {
          icon2.classList.remove("fa-play");
          icon2.classList.add("fa-pause");
        }

        startTimer();
        return;
      }

      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;

      display.textContent = `${String(mins).padStart(2, "0")}:${String(
        secs,
      ).padStart(2, "0")}`;
    }, 1000);
  }
}
