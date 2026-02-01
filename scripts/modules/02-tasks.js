import { goToTimer } from "./01-navigation.js";

export function initTasks() {
  /* =========================
     DOM
  ========================= */

  const taskInput = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");

  /* =========================
     STATE
  ========================= */

  let tasks = JSON.parse(localStorage.getItem("task")) || [];

  /* =========================
     RENDER TASK
  ========================= */

  function renderTask(task) {
    const taskItem = document.createElement("div");
    taskItem.className = "taskItem fade-in";

    taskList.prepend(taskItem);

    setTimeout(() => {
      taskItem.classList.remove("fade-in");
    }, 200);

    /* =========================
       CONTENT
    ========================= */

    const dateEl = document.createElement("div");
    dateEl.className = "taskDate";
    dateEl.textContent = task.displayDate;
    taskItem.appendChild(dateEl);

    const textEl = document.createElement("div");
    textEl.className = "taskText";
    textEl.textContent = task.note;
    taskItem.appendChild(textEl);

    const actions = document.createElement("div");
    actions.className = "taskActions";
    taskItem.appendChild(actions);

    const taskTimerBtn = document.createElement("button");
    taskTimerBtn.className = "taskTimerBtn";
    taskTimerBtn.title = "Start timer";
    taskTimerBtn.innerHTML = '<i class="fas fa-stopwatch"></i>';
    actions.appendChild(taskTimerBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.title = "Delete task";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    actions.appendChild(deleteBtn);

    if (task.done) taskItem.classList.add("striked");

    /* =========================
       INTERACTIONS
    ========================= */

    let holdTimer;

    taskItem.addEventListener("touchstart", (e) => {
      holdTimer = setTimeout(() => {
        const container = e.target.closest(".taskItem");
        if (!container) return;

        container.classList.toggle("striked");
        task.done = container.classList.contains("striked");
        localStorage.setItem("task", JSON.stringify(tasks));
      }, 800);
    });

    ["touchmove", "touchend"].forEach((evt) =>
      taskItem.addEventListener(evt, () => clearTimeout(holdTimer)),
    );

    taskItem.addEventListener("dblclick", () => taskTimerBtn.click());

    /* =========================
       TIMER START
    ========================= */

    taskTimerBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      goToTimer();

      // скрываем UI таймера
      document.querySelector(".timerDisplay").style.display = "none";
      document.querySelector(".timerModes").style.display = "none";

      document.querySelector(".progress")?.classList.remove("active-progress");
      document
        .querySelectorAll(".timer")
        .forEach((el) => el.classList.remove("active-timer"));

      resetBtn.click();
      focusBtn.classList.remove("active-btn");

      nextBtn.disabled = true;
      startBtn.disabled = true;
      resetBtn.disabled = true;

      // countdown overlay
      const overlay = document.querySelector(".timerCountdown");
      const txt = overlay.querySelector(".countdown");

      let n = 3;
      txt.textContent = n;
      overlay.style.display = "flex";

      const countdown = setInterval(() => {
        n--;

        if (n <= 0) {
          clearInterval(countdown);
          overlay.style.display = "none";

          setTimeout(() => {
            nextBtn.disabled = false;
            startBtn.disabled = false;
            resetBtn.disabled = false;
            focusBtn.click();
            startBtn.click();
          }, 300);

          // возвращаем UI таймера
          document.querySelector(".timerDisplay").style.display = "flex";
          document.querySelector(".timerModes").style.display = "flex";
        } else {
          txt.textContent = n;
        }
      }, 1000);
    });

    /* =========================
       DELETE
    ========================= */

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      taskItem.classList.add("fade-out");

      setTimeout(() => {
        taskItem.remove();
        tasks = tasks.filter(
          (t) => t.note !== task.note || t.date !== task.date,
        );
        localStorage.setItem("task", JSON.stringify(tasks));
      }, 200);
    });

    const mq = window.matchMedia("(max-width: 767px)");
    if (mq.matches) {
      taskList.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  /* =========================
       MOBILE KEYBOARD FIX
    ========================= */

  function handleKeyboard() {
    const keyboardHeight =
      window.innerHeight - (visualViewport.height + visualViewport.offsetTop);

    const form = document.querySelector(".taskForm");
    const list = document.querySelector(".taskList");

    if (keyboardHeight > 0) {
      form.style.transform = `translateY(-${keyboardHeight}px)`;
      list.style.transform = `translateY(-${keyboardHeight}px)`;
    } else {
      form.style.transform = "translateY(0)";
      list.style.transform = "translateY(0)";
    }
  }

  visualViewport.addEventListener("resize", handleKeyboard);
  visualViewport.addEventListener("scroll", handleKeyboard);

  /* =========================
     ADD TASK
  ========================= */

  addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!taskInput.value.trim()) {
      alert("Add task");
      return;
    }

    const now = new Date();

    const task = {
      done: false,
      note: taskInput.value,
      date: now.toISOString(),
      createdAt: now.getTime(),
      displayDate: now.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    tasks.push(task);
    localStorage.setItem("task", JSON.stringify(tasks));

    renderTask(task);
    taskInput.value = "";
  });

  /* =========================
     INIT
  ========================= */

  function renderInitial() {
    taskList.innerHTML = "";
    tasks.forEach(renderTask);
  }

  renderInitial();
}
