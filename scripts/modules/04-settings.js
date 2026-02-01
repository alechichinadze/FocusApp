export function initSettings() {
  /* =========================
     DOM
  ========================= */

  const saveSetBtn = document.getElementById("saveSetBtn");
  const cancelSetBtn = document.getElementById("cancelSetBtn");

  const focusDuration = document.getElementById("focusDuration");
  const breakDuration = document.getElementById("breakDuration");
  const restDuration = document.getElementById("restDuration");
  const restInterval = document.getElementById("restInterval");

  const ranges = document.querySelectorAll('input[type="range"]');

  /* =========================
     STATE
  ========================= */

  let savedTime = JSON.parse(localStorage.getItem("time")) || {
    focus: "25",
    break: "5",
    rest: "15",
    interval: "4",
  };

  /* =========================
     HELPERS — SLIDER LABELS
  ========================= */

  function bindSliderValue(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueSpan = document.getElementById(valueId);

    valueSpan.textContent = slider.value;

    slider.addEventListener("input", () => {
      valueSpan.textContent = slider.value;
    });
  }

  function initSliderValues() {
    bindSliderValue("focusDuration", "workValue");
    bindSliderValue("breakDuration", "shortValue");
    bindSliderValue("restDuration", "longValue");
    bindSliderValue("restInterval", "intervalValue");
  }

  /* =========================
     HELPERS — RANGE COLOR
  ========================= */

  function updateRangeColor(range) {
    const val = ((range.value - range.min) / (range.max - range.min)) * 100;

    range.style.background = `linear-gradient(
      to right,
      #e1e2ab ${val}%,
      rgba(106, 106, 111, 1) ${val}%
    )`;
  }

  function initRangeColors() {
    ranges.forEach((range) => {
      updateRangeColor(range);
      range.addEventListener("input", () => updateRangeColor(range));
    });
  }

  /* =========================
     APPLY STATE TO UI
  ========================= */

  function applySavedTime() {
    focusDuration.value = savedTime.focus;
    breakDuration.value = savedTime.break;
    restDuration.value = savedTime.rest;
    restInterval.value = savedTime.interval;

    focusDisplay.textContent = `${String(savedTime.focus).padStart(2, "0")}:00`;
    breakDisplay.textContent = `${String(savedTime.break).padStart(2, "0")}:00`;
    restDisplay.textContent = `${String(savedTime.rest).padStart(2, "0")}:00`;

    initSliderValues();
    initRangeColors();
  }

  /* =========================
     EVENTS
  ========================= */

  saveSetBtn.addEventListener("click", () => {
    const msg = document.querySelector(".savedMsg");
    msg.classList.add("show");

    setTimeout(() => {
      msg.classList.remove("show");
    }, 2000);

    savedTime = {
      focus: focusDuration.value,
      break: breakDuration.value,
      rest: restDuration.value,
      interval: restInterval.value,
    };

    localStorage.setItem("time", JSON.stringify(savedTime));
    applySavedTime();
  });

  cancelSetBtn.addEventListener("click", () => {
    applySavedTime();
  });

  /* =========================
     INIT
  ========================= */

  applySavedTime();
}
