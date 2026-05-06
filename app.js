const APP_VERSION = 2;
const STORAGE_KEY = "focusflow-enterprise-state";
const LEGACY_STORAGE_KEY = "focusflow-state";
const VIEWS = ["home", "planner", "focus", "insights", "goals", "team"];

const defaultState = {
  schemaVersion: APP_VERSION,
  currentView: "home",
  search: "",
  energy: "steady",
  capacity: "balanced",
  timerDuration: 25 * 60,
  timerRemaining: 25 * 60,
  timerRunning: false,
  activeTaskId: 1,
  focusOptions: {
    oneTask: true,
    music: false,
    blocker: true
  },
  breakdownSteps: ["define audience", "create agenda", "prepare slides", "build demo flow", "rehearse", "send follow-up"],
  sessionNotes: "Demo story: start with the sales manager view, then show rep follow-up automation.",
  reflection: {
    finished: "Drafted demo agenda and confirmed audience.",
    blocked: "Context switching after messages.",
    tomorrow: "Rehearse demo flow before opening inbox."
  },
  tasks: [
    {
      id: 1,
      title: "Prepare Salesforce demo",
      detail: "Audience, agenda, demo flow, rehearsal",
      owner: "Maya",
      goal: "Expand enterprise pipeline",
      urgency: 5,
      impact: 5,
      effort: 3,
      estimate: 50,
      deadline: "Today",
      status: "planned",
      risk: "High context switching before the demo block",
      blockers: ["Inbox open", "Unclear rehearsal script"]
    },
    {
      id: 2,
      title: "Review onboarding funnel",
      detail: "Find the step with highest drop-off",
      owner: "Jules",
      goal: "Improve activation",
      urgency: 4,
      impact: 4,
      effort: 2,
      estimate: 45,
      deadline: "Tomorrow",
      status: "planned",
      risk: "Data pull depends on analytics export",
      blockers: ["Analytics export"]
    },
    {
      id: 3,
      title: "Send investor update draft",
      detail: "Summarize revenue, risk, and next milestones",
      owner: "Maya",
      goal: "Maintain investor confidence",
      urgency: 3,
      impact: 5,
      effort: 2,
      estimate: 35,
      deadline: "Friday",
      status: "done",
      risk: "Needs one concise risk section",
      blockers: []
    },
    {
      id: 4,
      title: "Define Q3 launch risks",
      detail: "Create owner-level mitigation list",
      owner: "Nora",
      goal: "Launch readiness",
      urgency: 3,
      impact: 5,
      effort: 2,
      estimate: 40,
      deadline: "Friday",
      status: "backlog",
      risk: "Dependency visibility is low",
      blockers: ["Cross-team inputs"]
    },
    {
      id: 5,
      title: "Refactor usage export job",
      detail: "Reduce failed exports and support larger accounts",
      owner: "Owen",
      goal: "Platform reliability",
      urgency: 2,
      impact: 4,
      effort: 5,
      estimate: 90,
      deadline: "Next week",
      status: "backlog",
      risk: "High effort for current energy level",
      blockers: ["Test fixture coverage"]
    },
    {
      id: 6,
      title: "Outline study plan for algorithms",
      detail: "Build a realistic three-week practice cadence",
      owner: "Maya",
      goal: "Skill development",
      urgency: 4,
      impact: 3,
      effort: 3,
      estimate: 30,
      deadline: "Thursday",
      status: "backlog",
      risk: "Likely to be squeezed by meetings",
      blockers: []
    }
  ],
  schedule: [
    { time: "09:00", duration: 20, title: "Review top commitments", note: "Pick one outcome for the morning", type: "plan" },
    { time: "09:30", duration: 50, taskId: 1, title: "Prepare Salesforce demo", note: "Protected focus block", type: "focus" },
    { time: "10:30", duration: 25, title: "Admin sweep", note: "Messages and email batch", type: "admin" },
    { time: "11:15", duration: 45, taskId: 2, title: "Review onboarding funnel", note: "Analysis block", type: "focus" },
    { time: "14:00", duration: 35, taskId: 3, title: "Investor update draft", note: "Writing block", type: "focus" }
  ],
  focusSessions: [42, 55, 25, 70, 38, 62, 20],
  distractions: [
    { source: "Messages", count: 6 },
    { source: "Email", count: 4 },
    { source: "Browser", count: 3 },
    { source: "Meetings", count: 2 }
  ],
  distractionLog: [
    { label: "Messages", time: "09:14" },
    { label: "Browser tab", time: "10:03" }
  ],
  goals: [
    {
      id: 1,
      title: "Launch self-serve onboarding",
      owner: "Growth",
      progress: 64,
      scope: "Team",
      milestones: [
        { title: "Map activation events", status: "done" },
        { title: "Ship funnel dashboard", status: "active" },
        { title: "Test lifecycle email copy", status: "next" }
      ]
    },
    {
      id: 2,
      title: "Become sharper at deep work",
      owner: "Personal",
      progress: 48,
      scope: "Private",
      milestones: [
        { title: "Protect 5 morning blocks", status: "active" },
        { title: "Review distraction pattern", status: "next" },
        { title: "Cut one recurring meeting", status: "next" }
      ]
    },
    {
      id: 3,
      title: "Improve enterprise demo conversion",
      owner: "Revenue",
      progress: 36,
      scope: "Team",
      milestones: [
        { title: "Finalize demo narrative", status: "active" },
        { title: "Create follow-up package", status: "next" },
        { title: "Run enablement rehearsal", status: "next" }
      ]
    }
  ],
  team: {
    updates: [
      { author: "Maya", role: "Founder", text: "Demo flow is moving. Rehearsal needs one protected block.", time: "09:42" },
      { author: "Owen", role: "Engineer", text: "Usage export fix is scoped. I need analytics fixture confirmation.", time: "10:08" },
      { author: "Nora", role: "Ops", text: "Launch risk owners are identified for four of six dependencies.", time: "10:31" }
    ],
    policies: [
      "Aggregate analytics at team level by default",
      "Private tasks are excluded from manager reports",
      "Focus health reports show trends, not individual surveillance",
      "Calendar and task content can be disconnected per workspace"
    ],
    metrics: [
      { value: "71%", label: "Committed priorities on track" },
      { value: "2.8h", label: "Average protected focus today" },
      { value: "18%", label: "Distraction rate improvement" }
    ]
  }
};

let timerId = null;
const state = loadState();

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const ui = mapElements([
  "viewTitle",
  "viewSubtitle",
  "todayLabel",
  "globalSearch",
  "syncStatus",
  "energySelect",
  "metricStrip",
  "priorityList",
  "meaningScore",
  "currentTaskTitle",
  "focusBlockTime",
  "homeFocusMeter",
  "homeTimer",
  "homeTimerLabel",
  "timeline",
  "riskList",
  "finishedInput",
  "blockedInput",
  "tomorrowInput",
  "breakdownInput",
  "breakdownList",
  "planConfidence",
  "capacitySelect",
  "durationSelect",
  "policyList",
  "weekGrid",
  "backlogCount",
  "taskForm",
  "taskName",
  "taskImpact",
  "taskEffort",
  "backlogTable",
  "focusTaskTitle",
  "focusTaskSelect",
  "focusMeter",
  "focusTimer",
  "focusStatus",
  "startPauseBtn",
  "oneTaskToggle",
  "musicToggle",
  "blockerToggle",
  "sessionNotes",
  "sessionStats",
  "distractionList",
  "weeklyScore",
  "meaningProgress",
  "scoreMeter",
  "focusChart",
  "sourceChart",
  "coachingList",
  "goalList",
  "milestoneBoard",
  "coachNote",
  "teamMetrics",
  "sharedGoals",
  "updatesList",
  "privacyList",
  "toast"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  let parsed = {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || "{}";
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  if (parsed.schemaVersion !== APP_VERSION) {
    parsed = migrateLegacyState(parsed);
  }

  const next = { ...clone(defaultState), ...parsed };
  next.schemaVersion = APP_VERSION;
  next.timerRunning = false;
  next.currentView = VIEWS.includes(next.currentView) ? next.currentView : "home";
  next.tasks = Array.isArray(next.tasks) && next.tasks.length ? next.tasks : clone(defaultState.tasks);
  next.goals = Array.isArray(next.goals) && next.goals.length ? next.goals : clone(defaultState.goals);
  next.schedule = Array.isArray(next.schedule) && next.schedule.length ? next.schedule : clone(defaultState.schedule);
  next.focusSessions = normalizeNumberArray(next.focusSessions, defaultState.focusSessions);
  next.distractions = Array.isArray(next.distractions) ? next.distractions : clone(defaultState.distractions);
  next.distractionLog = Array.isArray(next.distractionLog) ? next.distractionLog : clone(defaultState.distractionLog);
  next.focusOptions = { ...defaultState.focusOptions, ...(next.focusOptions || {}) };
  next.breakdownSteps = Array.isArray(next.breakdownSteps) ? next.breakdownSteps : clone(defaultState.breakdownSteps);
  next.sessionNotes = typeof next.sessionNotes === "string" ? next.sessionNotes : defaultState.sessionNotes;
  next.reflection = { ...defaultState.reflection, ...(next.reflection || {}) };
  next.team = {
    ...clone(defaultState.team),
    ...(next.team || {}),
    updates: Array.isArray(next.team?.updates) ? next.team.updates : clone(defaultState.team.updates),
    policies: Array.isArray(next.team?.policies) ? next.team.policies : clone(defaultState.team.policies),
    metrics: Array.isArray(next.team?.metrics) ? next.team.metrics : clone(defaultState.team.metrics)
  };
  next.timerDuration = Number(next.timerDuration) || defaultState.timerDuration;
  next.timerRemaining = Math.min(Math.max(Number(next.timerRemaining) || next.timerDuration, 0), next.timerDuration);

  if (!next.tasks.some((task) => task.id === next.activeTaskId)) {
    next.activeTaskId = next.tasks[0].id;
  }

  return next;
}

function migrateLegacyState(legacy) {
  const next = clone(defaultState);

  if (legacy && typeof legacy === "object") {
    next.currentView = VIEWS.includes(legacy.currentView) ? legacy.currentView : next.currentView;
    next.energy = legacy.energy || next.energy;
    next.timerRemaining = Number(legacy.timerRemaining) || next.timerRemaining;

    if (Array.isArray(legacy.priorities)) {
      legacy.priorities.forEach((oldTask) => {
        const match = next.tasks.find((task) => task.title === oldTask.title);
        if (match) match.status = oldTask.done ? "done" : "planned";
      });
    }
  }

  return next;
}

function normalizeNumberArray(value, fallback) {
  if (!Array.isArray(value) || value.length !== fallback.length) return clone(fallback);
  return value.map((item, index) => Number(item) || fallback[index]);
}

function mapElements(ids) {
  return ids.reduce((acc, id) => {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Missing required element: #${id}`);
    }
    acc[id] = element;
    return acc;
  }, {});
}

function persist() {
  try {
    const payload = { ...state, timerRunning: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    showToast("Unable to save local workspace state");
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

function icon(id) {
  return `<svg aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => ui.toast.classList.remove("show"), 2400);
}

function priorityScore(task) {
  const dueWeight = task.deadline === "Today" ? 6 : task.deadline === "Tomorrow" ? 4 : 2;
  const effortPenalty = Math.max(1, task.effort);
  return Math.max(1, Math.round(task.urgency * 2 + task.impact * 3 + dueWeight - effortPenalty));
}

function activeTask() {
  return (
    state.tasks.find((task) => task.id === state.activeTaskId) ||
    state.tasks.find((task) => task.status !== "done") ||
    state.tasks[0]
  );
}

function plannedTasks() {
  return state.tasks
    .filter((task) => task.status !== "done")
    .sort((a, b) => priorityScore(b) - priorityScore(a));
}

function filteredTasks() {
  const search = state.search.trim().toLowerCase();
  const sorted = [...state.tasks].sort((a, b) => priorityScore(b) - priorityScore(a));
  if (!search) return sorted;

  return sorted.filter((task) => {
    const haystack = `${task.title} ${task.detail} ${task.owner} ${task.goal} ${task.deadline}`.toLowerCase();
    return haystack.includes(search);
  });
}

function totalFocusMinutes() {
  return state.focusSessions.reduce((sum, minutes) => sum + minutes, 0);
}

function completedTasks() {
  return state.tasks.filter((task) => task.status === "done");
}

function productivityScore() {
  const meaningfulDone = completedTasks().reduce((sum, task) => sum + task.impact, 0);
  const distractionPenalty = state.distractions.reduce((sum, item) => sum + item.count, 0);
  return Math.min(100, Math.max(0, 42 + meaningfulDone * 3 + Math.round(totalFocusMinutes() / 14) - distractionPenalty));
}

function planConfidence() {
  const capacityPenalty = state.capacity === "meeting-heavy" ? 11 : state.capacity === "open" ? -4 : 0;
  const energyPenalty = state.energy === "low" ? 8 : state.energy === "high" ? -3 : 0;
  const overloadPenalty = plannedTasks().slice(0, 3).reduce((sum, task) => sum + task.estimate, 0) > 150 ? 6 : 0;
  return Math.max(62, Math.min(97, 91 - capacityPenalty - energyPenalty - overloadPenalty));
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const rest = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${rest}`;
}

function setProgress(circle, remaining, duration, circumference) {
  const ratio = duration ? 1 - remaining / duration : 0;
  circle.style.strokeDashoffset = `${circumference - circumference * ratio}`;
}

function statusLabel(status) {
  return status === "done" ? "Done" : status === "planned" ? "Planned" : "Backlog";
}

function renderAll() {
  renderShell();
  renderView();
  renderMetrics();
  renderPriorities();
  renderSchedule();
  renderRisks();
  renderPlanner();
  renderFocus();
  renderInsights();
  renderGoals();
  renderTeam();
}

function renderShell() {
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  ui.todayLabel.textContent = formatter.format(new Date());
  ui.globalSearch.value = state.search;
  ui.energySelect.value = state.energy;
  ui.capacitySelect.value = state.capacity;
  ui.durationSelect.value = String(state.timerDuration);
  ui.finishedInput.value = state.reflection.finished;
  ui.blockedInput.value = state.reflection.blocked;
  ui.tomorrowInput.value = state.reflection.tomorrow;
  ui.sessionNotes.value = state.sessionNotes;
  ui.oneTaskToggle.checked = state.focusOptions.oneTask;
  ui.musicToggle.checked = state.focusOptions.music;
  ui.blockerToggle.checked = state.focusOptions.blocker;
  ui.syncStatus.innerHTML = `${icon("icon-sync")} Calendar synced`;
}

function renderView() {
  $$(".view").forEach((view) => {
    const isActive = view.id === `${state.currentView}View`;
    view.classList.toggle("active", isActive);
    if (isActive) {
      ui.viewTitle.textContent = view.dataset.title;
      ui.viewSubtitle.textContent = view.dataset.subtitle;
    }
  });

  $$(".nav-btn").forEach((button) => {
    const isActive = button.dataset.view === state.currentView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function renderMetrics() {
  const completed = completedTasks().length;
  const score = productivityScore();
  const confidence = planConfidence();
  const distractions = state.distractions.reduce((sum, item) => sum + item.count, 0);

  const metrics = [
    { icon: "icon-check", value: `${completed}/${state.tasks.length}`, label: "meaningful priorities completed" },
    { icon: "icon-clock", value: `${Math.round(totalFocusMinutes() / 60)}h`, label: "protected focus logged this week" },
    { icon: "icon-alert", value: `${distractions}`, label: "tracked switches across sessions" },
    { icon: "icon-spark", value: `${confidence}%`, label: "AI plan confidence for today" }
  ];

  ui.metricStrip.innerHTML = metrics
    .map(
      (metric) => `
      <article class="metric-card">
        <div>
          <strong>${escapeHTML(metric.value)}</strong>
          <span>${escapeHTML(metric.label)}</span>
        </div>
        ${icon(metric.icon)}
      </article>`
    )
    .join("");

  ui.meaningScore.textContent = `${score} score`;
  ui.weeklyScore.textContent = `${score} score`;
  ui.scoreMeter.value = score;
  ui.meaningProgress.textContent = `${completed} priorities completed with ${Math.round(totalFocusMinutes() / 60)}h focus protected`;
  ui.planConfidence.textContent = `${confidence}% confidence`;
}

function renderPriorities() {
  const items = plannedTasks().slice(0, 3);

  ui.priorityList.innerHTML = items
    .map(
      (task) => `
      <article class="priority-item ${task.status === "done" ? "done" : ""}">
        <button class="check-btn" data-action="toggle-task" data-id="${task.id}" type="button" aria-label="Toggle ${escapeHTML(task.title)}">
          ${icon("icon-check")}
        </button>
        <div>
          <span class="priority-title">${escapeHTML(task.title)}</span>
          <span class="priority-sub">${escapeHTML(task.owner)} - ${escapeHTML(task.goal)} - ${escapeHTML(task.deadline)}</span>
        </div>
        <span class="task-meta">${priorityScore(task)} pts</span>
      </article>`
    )
    .join("");
}

function renderSchedule() {
  ui.timeline.innerHTML = state.schedule
    .map((block) => {
      const status = block.type === "focus" ? "Focus" : block.type === "admin" ? "Admin" : "Plan";
      return `
        <article class="timeline-item">
          <time>${escapeHTML(block.time)}</time>
          <div>
            <strong>${escapeHTML(block.title)}</strong>
            <small>${escapeHTML(block.note)} - ${block.duration} min</small>
          </div>
          <span class="status-pill">${status}</span>
        </article>`;
    })
    .join("");
}

function renderRisks() {
  const riskItems = plannedTasks()
    .filter((task) => task.risk || task.blockers.length)
    .slice(0, 3);

  ui.riskList.innerHTML = riskItems
    .map(
      (task) => `
      <article class="risk-item">
        ${icon("icon-alert")}
        <div>
          <span class="risk-title">${escapeHTML(task.title)}</span>
          <span class="risk-sub">${escapeHTML(task.risk)}${task.blockers.length ? ` - Blocker: ${escapeHTML(task.blockers[0])}` : ""}</span>
        </div>
      </article>`
    )
    .join("");
}

function renderPlanner() {
  renderBreakdown();
  renderPolicies();
  renderWeek();
  renderBacklog();
}

function renderBreakdown(steps = null) {
  if (steps) state.breakdownSteps = steps;
  ui.breakdownList.innerHTML = state.breakdownSteps.map((step) => `<li>${escapeHTML(step)}</li>`).join("");
}

function renderPolicies() {
  const duration = Math.round(state.timerDuration / 60);
  const policies = [
    `${state.energy} energy favors ${state.energy === "low" ? "shorter protected blocks" : "deep production blocks"}`,
    `${state.capacity} calendar load keeps admin batched outside focus windows`,
    `${duration} minute timer applies to the next focus session`
  ];

  ui.policyList.innerHTML = policies
    .map(
      (policy) => `
      <article class="policy-row">
        ${icon("icon-shield")}
        <div>
          <span class="risk-title">${escapeHTML(policy)}</span>
          <span class="risk-sub">Guardrail enforced in local planning model</span>
        </div>
      </article>`
    )
    .join("");
}

function renderWeek() {
  const multiplier = state.capacity === "open" ? 1.15 : state.capacity === "meeting-heavy" ? 0.78 : 1;
  const base = [
    { day: "Mon", capacity: 72, blocks: ["Demo prep", "Funnel review"] },
    { day: "Tue", capacity: 61, blocks: ["Customer calls", "Launch risks"] },
    { day: "Wed", capacity: 84, blocks: ["Deep work", "Demo rehearsal"] },
    { day: "Thu", capacity: 55, blocks: ["Study plan", "Admin batch"] },
    { day: "Fri", capacity: 68, blocks: ["Investor update", "Weekly reflection"] }
  ];

  ui.weekGrid.innerHTML = base
    .map((day) => {
      const capacity = Math.min(96, Math.round(day.capacity * multiplier));
      return `
        <article class="day-card">
          <strong>${day.day}</strong>
          <span class="day-capacity">${capacity}% capacity</span>
          <ul>${day.blocks.map((block) => `<li>${escapeHTML(block)}</li>`).join("")}</ul>
        </article>`;
    })
    .join("");
}

function renderBacklog() {
  const tasks = filteredTasks();
  ui.backlogCount.textContent = `${tasks.length} items`;

  ui.backlogTable.innerHTML = tasks
    .map(
      (task) => `
      <article class="task-row">
        <div>
          <span class="task-title">${escapeHTML(task.title)}</span>
          <span class="task-sub">${escapeHTML(task.owner)} - ${escapeHTML(task.goal)}</span>
        </div>
        <div><span class="task-cell-label">Impact</span>${task.impact}</div>
        <div><span class="task-cell-label">Effort</span>${task.effort}</div>
        <div><span class="task-cell-label">Due</span>${escapeHTML(task.deadline)}</div>
        <div><span class="task-cell-label">Score</span><span class="task-score">${priorityScore(task)}</span></div>
        <button class="icon-btn" data-action="activate-task" data-id="${task.id}" type="button" aria-label="Focus ${escapeHTML(task.title)}">
          ${icon("icon-focus")}
        </button>
      </article>`
    )
    .join("");
}

function renderFocus() {
  const task = activeTask();
  const elapsed = state.timerDuration - state.timerRemaining;
  const focusStatus = state.timerRunning ? "In progress" : "Ready";

  ui.currentTaskTitle.textContent = task.title;
  ui.focusTaskTitle.textContent = task.title;
  ui.focusBlockTime.textContent = state.schedule.find((block) => block.taskId === task.id)?.time || "Next open block";
  ui.homeTimer.textContent = formatTimer(state.timerRemaining);
  ui.focusTimer.textContent = formatTimer(state.timerRemaining);
  ui.focusStatus.textContent = focusStatus;
  ui.homeTimerLabel.textContent = state.focusOptions.blocker ? "Protected block" : "Manual focus";
  ui.focusTaskSelect.innerHTML = state.tasks
    .map((item) => `<option value="${item.id}">${escapeHTML(item.title)}</option>`)
    .join("");
  ui.focusTaskSelect.value = String(task.id);
  ui.startPauseBtn.setAttribute("aria-label", state.timerRunning ? "Pause timer" : "Start timer");
  ui.startPauseBtn.innerHTML = icon(state.timerRunning ? "icon-pause" : "icon-play");

  setProgress(ui.homeFocusMeter, state.timerRemaining, state.timerDuration, 326.73);
  setProgress(ui.focusMeter, state.timerRemaining, state.timerDuration, 490.09);

  ui.sessionStats.innerHTML = [
    { value: `${Math.round(elapsed / 60)}m`, label: "elapsed this session" },
    { value: `${task.estimate}m`, label: "estimated effort" },
    { value: `${state.distractionLog.length}`, label: "switches logged" }
  ]
    .map(
      (stat) => `
      <article class="session-stat">
        <strong>${escapeHTML(stat.value)}</strong>
        <span>${escapeHTML(stat.label)}</span>
      </article>`
    )
    .join("");

  ui.distractionList.innerHTML = state.distractionLog
    .slice()
    .reverse()
    .slice(0, 6)
    .map((item) => `<li><span>${escapeHTML(item.label)}</span><time>${escapeHTML(item.time)}</time></li>`)
    .join("");
}

function renderInsights() {
  const maxFocus = Math.max(...state.focusSessions, 90);
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  ui.focusChart.innerHTML = state.focusSessions
    .map((minutes, index) => {
      const height = Math.max(8, Math.round((minutes / maxFocus) * 100));
      return `
        <div class="bar" title="${minutes} minutes">
          <div class="bar-fill" style="height:${height}%"></div>
          <span class="bar-label">${days[index]}</span>
        </div>`;
    })
    .join("");

  const maxSource = Math.max(...state.distractions.map((item) => item.count), 1);
  ui.sourceChart.innerHTML = state.distractions
    .map(
      (item) => `
      <div class="source-row">
        <span>${escapeHTML(item.source)}</span>
        <div class="source-track"><div class="source-fill" style="width:${(item.count / maxSource) * 100}%"></div></div>
        <strong>${item.count}</strong>
      </div>`
    )
    .join("");

  const coaching = [
    "Move message review after the first focus block.",
    "Schedule rehearsal before calendar density rises.",
    "Keep weekly score tied to completed impact, not time spent."
  ];

  ui.coachingList.innerHTML = coaching
    .map(
      (item) => `
      <article class="coaching-row">
        ${icon("icon-spark")}
        <div>
          <span class="risk-title">${escapeHTML(item)}</span>
          <span class="risk-sub">Based on focus consistency, task impact, and switch pattern</span>
        </div>
      </article>`
    )
    .join("");
}

function renderGoals() {
  ui.goalList.innerHTML = state.goals
    .map(
      (goal) => `
      <article class="goal-card">
        <div class="goal-header">
          <div>
            <span class="goal-title">${escapeHTML(goal.title)}</span>
            <span class="goal-sub">${escapeHTML(goal.owner)} - ${escapeHTML(goal.scope)} - ${goal.progress}% complete</span>
          </div>
          <span class="tag">${goal.milestones.length} steps</span>
        </div>
        <meter min="0" max="100" value="${goal.progress}"></meter>
        <ul class="milestones">
          ${goal.milestones.map((milestone) => `<li>${escapeHTML(milestone.title)}</li>`).join("")}
        </ul>
      </article>`
    )
    .join("");

  ui.milestoneBoard.innerHTML = state.goals
    .flatMap((goal) =>
      goal.milestones.map(
        (milestone) => `
        <article class="milestone-item">
          <span>${escapeHTML(milestone.title)} <strong>${escapeHTML(goal.title)}</strong></span>
        </article>`
      )
    )
    .join("");
}

function renderTeam() {
  ui.teamMetrics.innerHTML = state.team.metrics
    .map(
      (metric) => `
      <article class="team-metric">
        <strong>${escapeHTML(metric.value)}</strong>
        <span>${escapeHTML(metric.label)}</span>
      </article>`
    )
    .join("");

  ui.sharedGoals.innerHTML = state.goals
    .filter((goal) => goal.scope === "Team")
    .map(
      (goal) => `
      <article class="shared-goal">
        <div class="shared-header">
          <div>
            <span class="shared-title">${escapeHTML(goal.title)}</span>
            <span class="shared-sub">${escapeHTML(goal.owner)} - ${goal.progress}% complete</span>
          </div>
          <span class="tag">${goal.milestones.filter((item) => item.status === "done").length}/${goal.milestones.length}</span>
        </div>
        <meter min="0" max="100" value="${goal.progress}"></meter>
      </article>`
    )
    .join("");

  ui.updatesList.innerHTML = state.team.updates
    .slice()
    .reverse()
    .map(
      (update) => `
      <article class="update-row">
        <div class="update-header">
          <div>
            <span class="update-author">${escapeHTML(update.author)}</span>
            <span class="goal-sub">${escapeHTML(update.role)}</span>
          </div>
          <time class="muted-count">${escapeHTML(update.time)}</time>
        </div>
        <span class="update-copy">${escapeHTML(update.text)}</span>
      </article>`
    )
    .join("");

  ui.privacyList.innerHTML = state.team.policies
    .map(
      (policy) => `
      <article class="privacy-row">
        ${icon("icon-shield")}
        <div>
          <span class="risk-title">${escapeHTML(policy)}</span>
          <span class="risk-sub">Enterprise workspace control</span>
        </div>
      </article>`
    )
    .join("");
}

function setView(view, options = {}) {
  if (!VIEWS.includes(view)) return;
  state.currentView = view;
  renderView();
  persist();

  if (options.updateHash !== false && window.location.hash !== `#${view}`) {
    history.replaceState(null, "", `#${view}`);
  }
}

function startTimer() {
  if (state.timerRunning) return;
  state.timerRunning = true;
  timerId = setInterval(() => {
    state.timerRemaining = Math.max(0, state.timerRemaining - 1);

    if (state.timerRemaining === 0) {
      finishFocusSession(false);
      showToast("Focus block complete");
      return;
    }

    renderFocus();
    persist();
  }, 1000);
  renderFocus();
  persist();
}

function pauseTimer() {
  state.timerRunning = false;
  clearInterval(timerId);
  renderFocus();
  persist();
}

function resetTimer() {
  pauseTimer();
  state.timerRemaining = state.timerDuration;
  renderFocus();
  persist();
}

function finishFocusSession(markTaskDone = true) {
  const elapsedMinutes = Math.max(1, Math.round((state.timerDuration - state.timerRemaining) / 60));
  const todayIndex = Math.min(6, new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const task = activeTask();

  pauseTimer();
  state.focusSessions[todayIndex] = Math.min(240, state.focusSessions[todayIndex] + elapsedMinutes);
  state.timerRemaining = state.timerDuration;

  if (markTaskDone && task) {
    task.status = "done";
  }

  renderAll();
  persist();
}

function toggleTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return;
  task.status = task.status === "done" ? "planned" : "done";
  renderAll();
  persist();
}

function activateTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) return;
  state.activeTaskId = task.id;
  if (task.status === "backlog") task.status = "planned";
  setView("focus");
  renderAll();
  persist();
}

function createBreakdown(goal) {
  const normalized = goal.toLowerCase();
  if (normalized.includes("salesforce") || normalized.includes("demo")) {
    return ["define audience", "create agenda", "prepare slides", "build demo flow", "rehearse", "send follow-up"];
  }
  if (normalized.includes("study") || normalized.includes("learn")) {
    return ["set outcome", "collect materials", "schedule practice blocks", "solve examples", "review mistakes", "teach it back"];
  }
  if (normalized.includes("launch")) {
    return ["define success metric", "map dependencies", "prepare launch checklist", "assign owners", "run QA pass", "write update"];
  }
  return ["define the outcome", "split the work", "choose first focus block", "remove blockers", "ship a small version", "reflect and adjust"];
}

function addTask(title, impact = 4, effort = 3) {
  const nextId = Math.max(...state.tasks.map((task) => task.id)) + 1;
  state.tasks.push({
    id: nextId,
    title,
    detail: "New task captured from planner",
    owner: "Maya",
    goal: "Inbox triage",
    urgency: state.energy === "high" ? 4 : 3,
    impact,
    effort,
    estimate: effort * 15,
    deadline: "This week",
    status: "backlog",
    risk: "Needs a clear first action",
    blockers: []
  });
  renderAll();
  persist();
}

function rebuildSchedule() {
  const firstThree = plannedTasks().slice(0, 3);
  const focusDuration = state.timerDuration / 60;
  const adminTime = state.capacity === "meeting-heavy" ? "12:15" : "10:30";

  state.schedule = [
    { time: "09:00", duration: 20, title: "Review top commitments", note: `${state.energy} energy planning pass`, type: "plan" },
    {
      time: "09:30",
      duration: focusDuration,
      taskId: firstThree[0]?.id,
      title: firstThree[0]?.title || "Deep work block",
      note: "Protected highest-impact task",
      type: "focus"
    },
    { time: adminTime, duration: 25, title: "Admin sweep", note: "Messages and calendar batch", type: "admin" },
    {
      time: "11:15",
      duration: Math.min(50, focusDuration),
      taskId: firstThree[1]?.id,
      title: firstThree[1]?.title || "Priority review",
      note: "Second execution block",
      type: "focus"
    },
    {
      time: "14:00",
      duration: Math.min(45, focusDuration),
      taskId: firstThree[2]?.id,
      title: firstThree[2]?.title || "Follow-up block",
      note: "Close open loop",
      type: "focus"
    }
  ];

  renderAll();
  persist();
}

function logDistraction(source = "App switch") {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  state.distractionLog.push({ label: source, time });
  const existing = state.distractions.find((item) => item.source === "Browser");
  if (existing) existing.count += 1;
  renderAll();
  persist();
}

function addGoal() {
  const nextId = Math.max(...state.goals.map((goal) => goal.id)) + 1;
  state.goals.push({
    id: nextId,
    title: "Build a calmer operating rhythm",
    owner: "Personal",
    progress: 12,
    scope: "Private",
    milestones: [
      { title: "Pick one weekly outcome", status: "active" },
      { title: "Reserve two focus blocks", status: "next" },
      { title: "Review Friday pattern", status: "next" }
    ]
  });
  renderAll();
  persist();
  showToast("Goal added");
}

function postTeamUpdate() {
  const task = activeTask();
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  state.team.updates.push({
    author: "Maya",
    role: "Workspace lead",
    text: `${task.title} is now the protected focus priority.`,
    time
  });
  renderTeam();
  persist();
  showToast("Team update posted");
}

function bindEvents() {
  $$(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  $("[data-view-link='home']").addEventListener("click", (event) => {
    event.preventDefault();
    setView("home");
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const id = Number(target.dataset.id);
    if (target.dataset.action === "toggle-task") toggleTask(id);
    if (target.dataset.action === "activate-task") activateTask(id);
  });

  ui.globalSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderBacklog();
    persist();
  });

  ui.energySelect.addEventListener("change", (event) => {
    state.energy = event.target.value;
    renderAll();
    persist();
  });

  ui.capacitySelect.addEventListener("change", (event) => {
    state.capacity = event.target.value;
    renderPlanner();
    renderMetrics();
    persist();
  });

  ui.durationSelect.addEventListener("change", (event) => {
    const nextDuration = Number(event.target.value);
    state.timerDuration = nextDuration;
    if (!state.timerRunning) state.timerRemaining = nextDuration;
    renderAll();
    persist();
  });

  $("#quickFocusBtn").addEventListener("click", () => {
    setView("focus");
    startTimer();
  });

  $("#homeStartBtn").addEventListener("click", () => {
    setView("focus");
    startTimer();
  });

  $("#homeBlockBtn").addEventListener("click", () => {
    state.focusOptions.blocker = true;
    ui.blockerToggle.checked = true;
    renderFocus();
    persist();
    showToast("Distraction blocking enabled");
  });

  $("#replanTodayBtn").addEventListener("click", () => {
    rebuildSchedule();
    showToast("Plan regenerated from current priorities");
  });

  ui.focusTaskSelect.addEventListener("change", (event) => {
    state.activeTaskId = Number(event.target.value);
    renderFocus();
    persist();
  });

  ui.startPauseBtn.addEventListener("click", () => {
    state.timerRunning ? pauseTimer() : startTimer();
  });

  $("#resetTimerBtn").addEventListener("click", resetTimer);
  $("#completeFocusBtn").addEventListener("click", () => {
    finishFocusSession(true);
    showToast("Priority completed");
  });

  [ui.oneTaskToggle, ui.musicToggle, ui.blockerToggle].forEach((toggle) => {
    toggle.addEventListener("change", () => {
      state.focusOptions.oneTask = ui.oneTaskToggle.checked;
      state.focusOptions.music = ui.musicToggle.checked;
      state.focusOptions.blocker = ui.blockerToggle.checked;
      renderFocus();
      persist();
    });
  });

  $("#breakdownBtn").addEventListener("click", () => {
    const goal = ui.breakdownInput.value.trim();
    if (!goal) return;
    renderBreakdown(createBreakdown(goal));
    persist();
    showToast("Breakdown generated");
  });

  $("#addPriorityBtn").addEventListener("click", () => {
    const title = ui.breakdownInput.value.trim();
    if (!title) return;
    addTask(title, 5, 3);
    showToast("Task added to ranked backlog");
  });

  ui.taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = ui.taskName.value.trim();
    if (!title) return;
    addTask(title, Number(ui.taskImpact.value), Number(ui.taskEffort.value));
    ui.taskName.value = "";
    showToast("Task captured");
  });

  ui.sessionNotes.addEventListener("input", (event) => {
    state.sessionNotes = event.target.value;
    persist();
  });

  $("#logDistractionBtn").addEventListener("click", () => {
    logDistraction();
    showToast("Switch logged");
  });

  $("#saveReflectionBtn").addEventListener("click", () => {
    state.reflection.finished = ui.finishedInput.value;
    state.reflection.blocked = ui.blockedInput.value;
    state.reflection.tomorrow = ui.tomorrowInput.value;
    persist();
    showToast("Reflection saved");
  });

  $("#addGoalBtn").addEventListener("click", addGoal);
  $("#applyCoachBtn").addEventListener("click", () => {
    state.schedule[1] = {
      time: "09:30",
      duration: state.timerDuration / 60,
      taskId: activeTask().id,
      title: "Demo flow rehearsal",
      note: "Protected deep work block",
      type: "focus"
    };
    renderSchedule();
    persist();
    showToast("Planner updated");
  });

  $("#addUpdateBtn").addEventListener("click", postTeamUpdate);
  $("#exportReportBtn").addEventListener("click", () => showToast("Team report prepared"));

  document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName);
    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      ui.globalSearch.focus();
    }
  });

  window.addEventListener("hashchange", () => {
    const view = window.location.hash.replace("#", "");
    setView(VIEWS.includes(view) ? view : "home", { updateHash: false });
  });

  window.addEventListener("beforeunload", () => {
    state.timerRunning = false;
    persist();
  });
}

function boot() {
  const hashView = window.location.hash.replace("#", "");
  if (VIEWS.includes(hashView)) state.currentView = hashView;
  bindEvents();
  renderAll();
  persist();
}

boot();
