let pomodoroBtn = document.getElementById("pomodoroBtn");
let shortBreakBtn = document.getElementById("shortBreakBtn");
let longBreakBtn = document.getElementById("longBreakBtn");

let timer = document.getElementById("timer");
let shortBreakDisplay = document.getElementById("shortBreakDisplay");
let longBreakDisplay = document.getElementById("longBreakDisplay");
let configSection = document.getElementById("editSection");

let workDuration = document.getElementById("workDuration");
let shortBreakDuration = document.getElementById("shortBreakDuration");
let longBreakDuration = document.getElementById("longBreakDuration");
let breakInterval = document.getElementById("breakInterval");
let configTime = document.getElementById("config");

let startBtn = document.getElementById("startBtn");
let resetBtn = document.getElementById("resetBtn");
let saveBtn = document.getElementById("saveSettingsBtn");

let savedTime = JSON.parse(localStorage.getItem("time"));
if (savedTime) {
  workDuration.value = savedTime.work;
  shortBreakDuration.value = savedTime.short;
  longBreakDuration.value = savedTime.long;
  breakInterval.value = savedTime.break;
}

let intervalId = null;

timer.textContent = `${String(workDuration.value).padStart(2, "0")}:00`;
shortBreakDisplay.textContent = `${String(shortBreakDuration.value).padStart(
  2,
  "0"
)}:00`;
longBreakDisplay.textContent = `${String(longBreakDuration.value).padStart(
  2,
  "0"
)}:00`;

function bindSliderValue(sliderId, valueId) {
  let slider = document.getElementById(sliderId);
  let valueSpan = document.getElementById(valueId);

  valueSpan.textContent = slider.value;

  slider.addEventListener("input", () => {
    valueSpan.textContent = slider.value;
  });
}

bindSliderValue("workDuration", "workValue");
bindSliderValue("shortBreakDuration", "shortValue");
bindSliderValue("longBreakDuration", "longValue");
bindSliderValue("breakInterval", "intervalValue");

startBtn.addEventListener("click", function () {
  if (startBtn.textContent === "Start") {
    startBtn.textContent = "Stop";
    document.querySelector(".progress").classList.add("active-progress");
    startTimer();
    document.querySelectorAll(".timer").forEach((el) => {
      el.classList.add("active-btn");
    });
  } else {
    startBtn.textContent = "Start";
    document.querySelector(".progress").classList.remove("active-progress");
    document.querySelectorAll(".timer").forEach((el) => {
      el.classList.remove("active-btn");
    });

    clearInterval(intervalId);
    intervalId = null;
  }
});

pomodoroBtn.addEventListener("click", function (e) {
  e.preventDefault();

  clearInterval(intervalId);
  intervalId = null;
  timer.textContent = `${String(workDuration.value).padStart(2, "0")}:00`;
  startBtn.textContent = "Start";
  timer.classList.remove("hidden");
  shortBreakDisplay.classList.add("hidden");
  longBreakDisplay.classList.add("hidden");
  configSection.classList.add("hidden");

  pomodoroBtn.classList.add("active-btn");
  shortBreakBtn.classList.remove("active-btn");
  longBreakBtn.classList.remove("active-btn");
  startBtn.classList.remove("hidden");
  configSection.classList.add("hidden");
  saveBtn.classList.add("hidden");
  resetBtn.classList.remove("hidden");
});

shortBreakBtn.addEventListener("click", function (e) {
  e.preventDefault();

  clearInterval(intervalId);
  intervalId = null;
  startBtn.textContent = "Start";
  shortBreakDisplay.textContent = `${String(shortBreakDuration.value).padStart(
    2,
    "0"
  )}:00`;
  timer.classList.add("hidden");
  shortBreakDisplay.classList.remove("hidden");
  longBreakDisplay.classList.add("hidden");

  shortBreakBtn.classList.add("active-btn");
  pomodoroBtn.classList.remove("active-btn");
  longBreakBtn.classList.remove("active-btn");
  startBtn.classList.remove("hidden");
  configSection.classList.add("hidden");
  saveBtn.classList.add("hidden");
  resetBtn.classList.remove("hidden");
});

longBreakBtn.addEventListener("click", function (e) {
  e.preventDefault();

  clearInterval(intervalId);
  intervalId = null;
  startBtn.textContent = "Start";
  longBreakDisplay.textContent = `${String(longBreakDuration.value).padStart(
    2,
    "0"
  )}:00`;
  timer.classList.add("hidden");
  shortBreakDisplay.classList.add("hidden");
  longBreakDisplay.classList.remove("hidden");

  longBreakBtn.classList.add("active-btn");
  pomodoroBtn.classList.remove("active-btn");
  shortBreakBtn.classList.remove("active-btn");
  startBtn.classList.remove("hidden");
  configSection.classList.add("hidden");
  saveBtn.classList.add("hidden");
  resetBtn.classList.remove("hidden");
});

configTime.addEventListener("click", function () {
  document.querySelector(".top-buttons").classList.add("hidden");
  document.querySelector(".bottom-buttons").classList.add("hidden");
  document.querySelector(".editButtons").classList.remove("hidden");
  timer.classList.add("hidden");
  shortBreakDisplay.classList.add("hidden");
  longBreakDisplay.classList.add("hidden");

  configSection.classList.remove("hidden");
  saveBtn.classList.remove("hidden");

  let ranges = document.querySelectorAll('input[type="range"]');
  ranges.forEach((range) => {
    range.addEventListener("input", () => {
      let val = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.background = `linear-gradient(to right, #e1e2ab ${val}%, #444 ${val}%)`;
    });
  });
});

saveBtn.addEventListener("click", function () {
  document.querySelector(".top-buttons").classList.remove("hidden");
  document.querySelector(".bottom-buttons").classList.remove("hidden");
  document.querySelector(".editButtons").classList.add("hidden");
  configSection.classList.add("hidden");
  timer.classList.remove("hidden");

  timer.textContent = `${String(workDuration.value).padStart(2, "0")}:00`;
  shortBreakDisplay.textContent = `${String(shortBreakDuration.value).padStart(
    2,
    "0"
  )}:00`;
  longBreakDisplay.textContent = `${String(longBreakDuration.value).padStart(
    2,
    "0"
  )}:00`;

  let timeData = {
    work: workDuration.value,
    short: shortBreakDuration.value,
    long: longBreakDuration.value,
    break: breakInterval.value,
  };

  localStorage.setItem("time", JSON.stringify(timeData));
});

resetBtn.addEventListener("click", function () {
  startBtn.textContent = "Start";
  clearInterval(intervalId);
  intervalId = null;
  pomodoroCount = 0;

  if (!timer.classList.contains("hidden")) {
    timer.textContent = `${String(workDuration.value).padStart(2, "0")}:00`;
  } else if (!shortBreakDisplay.classList.contains("hidden")) {
    shortBreakDisplay.textContent = `${String(
      shortBreakDuration.value
    ).padStart(2, "0")}:00`;
  } else if (!longBreakDisplay.classList.contains("hidden")) {
    longBreakDisplay.textContent = `${String(longBreakDuration.value).padStart(
      2,
      "0"
    )}:00`;
  }
});

let pomodoroCount = 0;

function startTimer() {
  if (intervalId) return;

  let display;
  if (!timer.classList.contains("hidden")) {
    display = timer;
  } else if (!shortBreakDisplay.classList.contains("hidden")) {
    display = shortBreakDisplay;
  } else if (!longBreakDisplay.classList.contains("hidden")) {
    display = longBreakDisplay;
  }

  let [minutes, seconds] = display.textContent.split(":").map(Number);
  let totalSeconds = minutes * 60 + seconds;

  intervalId = setInterval(() => {
    totalSeconds--;

    if (totalSeconds < 0) {
      clearInterval(intervalId);
      intervalId = null;

      if (display === timer) {
        pomodoroCount++;
        if (pomodoroCount >= Number(breakInterval.value)) {
          alert("End of session");
          pomodoroCount = 0;
          startBtn.textContent = "Start";
          return;
        }
        if (pomodoroCount === Number(breakInterval.value)) {
          longBreakBtn.click();
        } else {
          shortBreakBtn.click();
        }
      } else {
        pomodoroBtn.click();
      }

      startBtn.textContent = "Stop";
      startTimer();
    }

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    display.textContent = `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }, 1000);
}

//todo list
let taskInpt = document.getElementById("inpt1");
let searchInpt = document.getElementById("inpt2");
let enterBtn = document.querySelector(".addBtn");
let sortBtn = document.querySelector(".sortBtn");
let formCont = document.getElementById("taskList");
let imgDiv = document.querySelector(".imgDiv");
let themeToggle = document.getElementById("themeToggle");
let body = document.body;

let isSorted = localStorage.getItem("isSorted") === "true";

let data = [];
data = JSON.parse(localStorage.getItem("task")) || [];

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-theme");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
  }
}); //<= Theme toggle

//RENDER
function render(item) {
  let newEl = document.createElement("div");
  newEl.className = "newEl fade-in";

  formCont.prepend(newEl);

  setTimeout(() => {
    newEl.classList.remove("fade-in");
  }, 200);

  let dateSpan = document.createElement("div");
  dateSpan.textContent = item.displayDate;
  dateSpan.className = "dateDiv";
  newEl.appendChild(dateSpan);

  let taskDiv = document.createElement("div");
  taskDiv.className = "taskDiv";
  taskDiv.textContent = item.note;
  newEl.appendChild(taskDiv);

  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.setAttribute("title", "Delete note");
  deleteBtn.className = "deleteBtn";
  newEl.appendChild(deleteBtn);

  if (item.done) {
    newEl.classList.add("striked");
  }

  newEl.addEventListener("click", function (e) {
    let container = e.target.closest(".newEl");
    if (container) {
      container.classList.toggle("striked");
      item.done = container.classList.contains("striked");
      localStorage.setItem("task", JSON.stringify(data));
    }
  });

  deleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    newEl.classList.add("fade-out");

    setTimeout(() => {
      newEl.remove();
      data = data.filter(
        (obj) => obj.note !== item.note || obj.date !== item.date
      );
      localStorage.setItem("task", JSON.stringify(data));
      let remaining = document.querySelectorAll(".newEl");
      if (remaining.length === 0) {
        imgDiv.classList.add("visible");
      }
    }, 200);
  });
} // <= sample

enterBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (!taskInpt.value.trim()) {
    alert("Add task");
    return;
  }

  let now = new Date();

  let taskObj = {
    done: false,
    note: taskInpt.value,
    date: now.toISOString(),
    createdAt: now.getTime(),
    displayDate: now.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  if (isSorted === false) {
    data.push(taskObj);
  } else data.unshift(taskObj);

  localStorage.setItem("task", JSON.stringify(data));

  render(taskObj);
  toggleImgDiv();
  taskInpt.value = "";
}); // <= Adding task

function renderAll() {
  formCont.innerHTML = "";
  let sortedData = [...data];

  if (isSorted) {
    sortedData.sort((a, b) => a.createdAt - b.createdAt);
  } else {
    sortedData.sort((a, b) => b.createdAt - a.createdAt);
  }

  sortedData.forEach(render);
}

renderAll();
toggleImgDiv();

function toggleImgDiv() {
  let shouldShow = data.length === 0;
  if (shouldShow) {
    imgDiv.classList.add("visible");
  } else {
    imgDiv.classList.remove("visible");
  }
}

sortBtn.addEventListener("click", (e) => {
  e.preventDefault();

  isSorted = !isSorted;
  localStorage.setItem("isSorted", JSON.stringify(isSorted));

  if (isSorted === false) {
    data.sort((a, b) => a.createdAt - b.createdAt);
  } else {
    data.sort((a, b) => b.createdAt - a.createdAt);
  }

  localStorage.setItem("task", JSON.stringify(data));
  renderAll();
});

searchInpt.addEventListener("input", function (e) {
  let query = e.target.value.toLowerCase();

  formCont.innerHTML = "";

  let filtered = data.filter((item) => item.note.toLowerCase().includes(query));
  filtered.forEach(render);
});

const cont = document.querySelector(".cont");
const timerApp = document.querySelector(".timerApp");

let notesBtn = document.getElementById("notesBtn");
let timerBtn = document.getElementById("timerBtn");
let statsBtn = document.getElementById("statsBtn");

notesBtn.addEventListener("click", function () {
  timerApp.style = "display: none";
  cont.style = "display: block";
});

timerBtn.addEventListener("click", function () {
  timerApp.style = "display: flex";
  cont.style = "display: none";
});
