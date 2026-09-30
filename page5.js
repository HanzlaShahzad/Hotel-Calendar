/**
 * Pressure page — frontend with dummy data.
 * Swap DUMMY_* objects / fetch helpers for real API calls when backend is ready.
 */

(function () {
  "use strict";

  // ============================================================
  // DUMMY DATA (replace with API responses later)
  // ============================================================

  const DUMMY_MONTH = {
    year: 2026,
    month: 8, // 0-indexed: September
    title: "September 2026",
    subtitle: "how hard each day is going to be"
  };

  /**
   * Pressure levels: easy | steady | busy | heavy | too-much
   * Each day can have per-filter overrides; composite is the default.
   */
  const DUMMY_DAYS = {
    1: { level: "easy", levels: { everything: "easy", rooms: "easy", staffing: "easy", maintenance: "steady" } },
    2: { level: "easy", levels: { everything: "easy", rooms: "easy", staffing: "steady", maintenance: "easy" } },
    3: { level: "steady", levels: { everything: "steady", rooms: "steady", staffing: "steady", maintenance: "easy" } },
    4: { level: "steady", levels: { everything: "steady", rooms: "busy", staffing: "steady", maintenance: "steady" } },
    5: { level: "busy", levels: { everything: "busy", rooms: "busy", staffing: "busy", maintenance: "steady" } },
    6: { level: "busy", levels: { everything: "busy", rooms: "busy", staffing: "heavy", maintenance: "busy" } },
    7: { level: "steady", levels: { everything: "steady", rooms: "steady", staffing: "easy", maintenance: "steady" } },
    8: { level: "easy", levels: { everything: "easy", rooms: "easy", staffing: "easy", maintenance: "easy" } },
    9: { level: "steady", levels: { everything: "steady", rooms: "steady", staffing: "steady", maintenance: "easy" } },
    10: { level: "busy", levels: { everything: "busy", rooms: "busy", staffing: "busy", maintenance: "busy" } },
    11: { level: "heavy", levels: { everything: "heavy", rooms: "heavy", staffing: "busy", maintenance: "heavy" } },
    12: { level: "too-much", levels: { everything: "too-much", rooms: "too-much", staffing: "heavy", maintenance: "busy" } },
    13: { level: "heavy", levels: { everything: "heavy", rooms: "heavy", staffing: "heavy", maintenance: "steady" } },
    14: { level: "steady", levels: { everything: "steady", rooms: "steady", staffing: "steady", maintenance: "easy" } },
    15: { level: "easy", levels: { everything: "easy", rooms: "easy", staffing: "easy", maintenance: "easy" } },
    16: { level: "easy", levels: { everything: "easy", rooms: "easy", staffing: "steady", maintenance: "easy" } },
    17: { level: "steady", levels: { everything: "steady", rooms: "steady", staffing: "steady", maintenance: "steady" } },
    18: { level: "steady", levels: { everything: "steady", rooms: "busy", staffing: "steady", maintenance: "easy" } },
    19: { level: "busy", levels: { everything: "busy", rooms: "busy", staffing: "busy", maintenance: "busy" } },
    20: { level: "busy", levels: { everything: "busy", rooms: "busy", staffing: "heavy", maintenance: "steady" } },
    21: { level: "steady" },
    22: { level: "easy" },
    23: { level: "easy" },
    24: { level: "steady" },
    25: { level: "busy" },
    26: { level: "heavy" },
    27: { level: "steady" },
    28: { level: "easy" },
    29: { level: "steady" },
    30: { level: "busy" }
  };

  /** Detail payload for a selected day (keyed by day number) */
  const DUMMY_DAY_DETAILS = {
    12: {
      title: "Friday the 12th",
      capacityPercent: 184,
      metrics: [
        { key: "rooms", label: "rooms to clean", value: "58 of 32", percent: 100 },
        { key: "people", label: "people on", value: "9 of 11", percent: 82 },
        { key: "maintenance", label: "maintenance", value: "6 PM", percent: 55 },
        { key: "occupancy", label: "occupancy", value: "96%", percent: 96 }
      ],
      summary:
        "Kellerman arrives the same day 58 rooms turn, with two housekeepers off. Nothing about this day is going to go well as scheduled.",
      actions: [
        { id: "move-pms", label: "Move the 6 PMs to Tuesday", primary: true },
        { id: "ask-cover", label: "Ask for cover", primary: false },
        { id: "open-day", label: "Open the day", primary: false }
      ]
    }
  };

  // ============================================================
  // STATE
  // ============================================================

  let currentFilter = "everything";
  let currentView = "pressure";
  let selectedDay = 12; // default open to the heavy day shown in design

  // ============================================================
  // HELPERS
  // ============================================================

  function levelClass(level) {
    return "level-" + (level || "steady");
  }

  function labelForLevel(level) {
    const map = {
      easy: "easy",
      steady: "steady",
      busy: "busy",
      heavy: "heavy",
      "too-much": "too much"
    };
    return map[level] || level;
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function firstWeekday(year, month) {
    // 0 = Sunday
    return new Date(year, month, 1).getDay();
  }

  function showToast(message) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.classList.remove("show");
    }, 2600);
  }

  // ============================================================
  // RENDER
  // ============================================================

  function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    const year = DUMMY_MONTH.year;
    const month = DUMMY_MONTH.month;
    const total = daysInMonth(year, month);
    const startPad = firstWeekday(year, month);

    const frag = document.createDocumentFragment();

    // empty cells for padding
    for (let i = 0; i < startPad; i++) {
      const empty = document.createElement("button");
      empty.type = "button";
      empty.className = "day-cell empty";
      empty.disabled = true;
      empty.setAttribute("aria-hidden", "true");
      frag.appendChild(empty);
    }

    for (let d = 1; d <= total; d++) {
      const data = DUMMY_DAYS[d] || { level: "steady" };
      const level =
        (data.levels && data.levels[currentFilter]) || data.level || "steady";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "day-cell " +
        levelClass(level) +
        (selectedDay === d ? " selected" : "");
      btn.dataset.day = String(d);
      btn.setAttribute("aria-label", "Day " + d + ", " + labelForLevel(level));
      btn.innerHTML =
        '<span class="day-num">' +
        d +
        '</span><span class="day-label">' +
        labelForLevel(level) +
        "</span>";

      btn.addEventListener("click", function () {
        selectDay(d);
      });

      frag.appendChild(btn);
    }

    grid.innerHTML = "";
    grid.appendChild(frag);
  }

  function buildDetailForDay(day) {
    if (DUMMY_DAY_DETAILS[day]) {
      return DUMMY_DAY_DETAILS[day];
    }
    // synthetic detail so every day is interactive
    const data = DUMMY_DAYS[day] || { level: "steady" };
    const level = data.level || "steady";
    const capacityMap = {
      easy: 62,
      steady: 88,
      busy: 112,
      heavy: 145,
      "too-much": 184
    };
    const roomsMap = {
      easy: "18 of 32",
      steady: "28 of 32",
      busy: "38 of 32",
      heavy: "48 of 32",
      "too-much": "58 of 32"
    };
    const peopleMap = {
      easy: "11 of 11",
      steady: "10 of 11",
      busy: "9 of 11",
      heavy: "8 of 11",
      "too-much": "9 of 11"
    };

    const date = new Date(DUMMY_MONTH.year, DUMMY_MONTH.month, day);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const ordinal = day + (day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th");

    return {
      title: weekday + " the " + ordinal,
      capacityPercent: capacityMap[level] || 100,
      metrics: [
        {
          key: "rooms",
          label: "rooms to clean",
          value: roomsMap[level] || "30 of 32",
          percent: Math.min(100, Math.round(((capacityMap[level] || 100) / 100) * 80))
        },
        {
          key: "people",
          label: "people on",
          value: peopleMap[level] || "10 of 11",
          percent: level === "easy" ? 100 : level === "too-much" ? 82 : 90
        },
        {
          key: "maintenance",
          label: "maintenance",
          value: level === "too-much" ? "6 PM" : level === "heavy" ? "4 PM" : "2 PM",
          percent: level === "too-much" ? 55 : 35
        },
        {
          key: "occupancy",
          label: "occupancy",
          value: level === "too-much" ? "96%" : level === "heavy" ? "88%" : "72%",
          percent: level === "too-much" ? 96 : level === "heavy" ? 88 : 72
        }
      ],
      summary:
        level === "too-much" || level === "heavy"
          ? "High pressure day. Review staffing and rooms against capacity before the shift starts."
          : "Within normal operating range for this filter.",
      actions: [
        { id: "move-pms", label: "Move the 6 PMs to Tuesday", primary: true },
        { id: "ask-cover", label: "Ask for cover", primary: false },
        { id: "open-day", label: "Open the day", primary: false }
      ]
    };
  }

  function renderDayDetail(day) {
    const panel = document.getElementById("dayDetail");
    if (!panel) return;

    const detail = buildDetailForDay(day);

    document.getElementById("detailDayTitle").textContent = detail.title;
    document.getElementById("capacityBadge").textContent =
      detail.capacityPercent + "% of capacity";

    const metricsEl = document.getElementById("metricRows");
    metricsEl.innerHTML = "";
    detail.metrics.forEach(function (m) {
      const row = document.createElement("div");
      row.className = "metric-row";
      row.innerHTML =
        '<span class="metric-label">' +
        m.label +
        '</span>' +
        '<div class="metric-bar-track"><div class="metric-bar-fill ' +
        m.key +
        '" style="width:' +
        m.percent +
        '%"></div></div>' +
        '<span class="metric-value">' +
        m.value +
        "</span>";
      metricsEl.appendChild(row);
    });

    document.getElementById("daySummary").textContent = detail.summary;

    const actionsEl = document.getElementById("dayActions");
    actionsEl.innerHTML = "";
    detail.actions.forEach(function (a) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn" + (a.primary ? " primary" : "");
      btn.dataset.action = a.id;
      btn.textContent = a.label;
      btn.addEventListener("click", function () {
        handleAction(a.id, day);
      });
      actionsEl.appendChild(btn);
    });

    panel.hidden = false;
  }

  function selectDay(day) {
    selectedDay = day;
    document.querySelectorAll(".day-cell[data-day]").forEach(function (el) {
      el.classList.toggle("selected", Number(el.dataset.day) === day);
    });
    renderDayDetail(day);
  }

  // ============================================================
  // ACTIONS (dummy handlers — wire to backend later)
  // ============================================================

  function handleAction(actionId, day) {
    // Placeholder: call your API here
    // e.g. fetch('/api/pressure/actions', { method: 'POST', body: JSON.stringify({ action: actionId, day }) })

    const messages = {
      "move-pms": "Queued: Move 6 PMs from day " + day + " to Tuesday (dummy).",
      "ask-cover": "Request for cover on day " + day + " sent (dummy).",
      "open-day": "Opening full day view for day " + day + " (dummy)."
    };
    showToast(messages[actionId] || "Action: " + actionId);
    console.log("[Pressure] action", actionId, "day", day);
  }

  function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.classList.toggle("active", chip.dataset.filter === filter);
    });
    renderCalendar();
    if (selectedDay) {
      selectDay(selectedDay);
    }
  }

  function setView(view) {
    currentView = view;
    document.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    if (view !== "pressure") {
      showToast("View “" + view + "” — UI stub (same data, different layout later).");
    }
  }

  // ============================================================
  // API-READY HOOKS (swap these when backend exists)
  // ============================================================

  /**
   * Example: load month pressure from backend
   * async function loadMonth(year, month) {
   *   const res = await fetch(`/api/pressure?year=${year}&month=${month + 1}`);
   *   return res.json(); // { days: { 1: { level, levels }, ... }, details: { ... } }
   * }
   */

  function init() {
    const titleEl = document.getElementById("monthTitle");
    const subEl = document.getElementById("monthSubtitle");
    if (titleEl) titleEl.textContent = DUMMY_MONTH.title;
    if (subEl) subEl.textContent = DUMMY_MONTH.subtitle;

    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        setFilter(chip.dataset.filter);
      });
    });

    document.querySelectorAll(".view-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setView(btn.dataset.view);
      });
    });

    renderCalendar();
    selectDay(selectedDay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();