/* ==========================================================================
   VICTOR OG ULTIMATE ENGINE
   - Real-time HUD system status metrics simulation (CPU/RAM/GPU/Disk)
   - Live clock counter & Activity Log feed
   - Interactive Console Commander & Voice Assistant
   - Model Registry (Ollama, Meta, DeepSeek, Mistral, Google, Qwen)
   - Apidog API Workbench & Code Generator
   - Admin Security PIN (20032004)
   ========================================================================== */

const PORTS = [
  { id: "ollama",     name: "Ollama",       color: "#00f0ff", desc: "Local-first runtime dock." },
  { id: "meta",       name: "Meta",         color: "#7C9CFF", desc: "Llama 3 open weights family." },
  { id: "deepseek",   name: "DeepSeek",     color: "#38BDF8", desc: "DeepSeek R1 reasoning models." },
  { id: "mistral",    name: "Mistral AI",   color: "#E5675F", desc: "Fast open weight models." },
  { id: "google",     name: "Google",       color: "#8FD14F", desc: "Gemma 3 open models." },
  { id: "qwen",       name: "Alibaba Qwen", color: "#C792EA", desc: "Qwen 2.5 series." }
];

const MODELS = [
  { id: "gemma3-12b",    name: "GEMMA 3 12B",   size: "12B",  port: "google",   tags: ["vision","chat"],    haul: 38800000, added: 1, desc: "Google DeepMind frontier model for single GPU.", apiModel: "google/gemma-2-27b-it" },
  { id: "qwen2.5-14b",   name: "QWEN 2.5 14B",  size: "14B",  port: "qwen",     tags: ["tools","code"],     haul: 35200000, added: 2, desc: "Multilingual model with 128K context window.", apiModel: "qwen/qwen-2.5-72b-instruct" },
  { id: "llama3.3-70b",  name: "LLAMA 3.3 70B", size: "70B",  port: "meta",     tags: ["reasoning","tools"], haul: 5400000, added: 3, desc: "State of the art open reasoning model.", apiModel: "meta-llama/llama-3.3-70b-instruct" },
  { id: "deepseek-r1",   name: "DEEPSEEK R1",   size: "671B", port: "deepseek", tags: ["thinking","code"],  haul: 90300000, added: 4, desc: "Open reasoning model approaching top proprietary APIs.", apiModel: "deepseek/deepseek-r1" },
  { id: "glm4-9b",       name: "GLM 4 9B",      size: "9B",   port: "ollama",   tags: ["chat","tools"],     haul: 12000000, added: 5, desc: "General language model fine tuned for instructions.", apiModel: "glm-4-9b" },
  { id: "mistral-7b",    name: "MISTRAL 7B",    size: "7B",   port: "mistral",  tags: ["chat","general"],   haul: 31300000, added: 6, desc: "High performance compact model v0.3.", apiModel: "mistralai/mistral-7b-instruct" },
  { id: "llama3.1-8b",   name: "LLAMA 3.1 8B",  size: "8B",   port: "meta",     tags: ["tools","chat"],     haul: 81200000, added: 7, desc: "Meta general purpose fast model.", apiModel: "meta-llama/llama-3.1-8b-instruct" },
  { id: "codellama-13b", name: "CODELLAMA 13B", size: "13B",  port: "meta",     tags: ["code"],             haul: 5800000,  added: 8, desc: "Code generation and completion model.", apiModel: "meta-llama/codellama-13b-instruct" }
];

const ADMIN_VERIFICATION_PIN = '20032004';

let state = {
  search: "",
  port: "all",
  sort: "most_hauled",
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["gemma3-12b","qwen2.5-14b","llama3.3-70b","deepseek-r1","glm4-9b","mistral-7b"]')),
  isListening: false,
  adminAuthenticated: false,
  uptimeSeconds: 8075
};

function saveState() {
  localStorage.setItem("victor_installed", JSON.stringify(Array.from(state.installed)));
  localStorage.setItem("victor_apikeys", JSON.stringify(state.keys));
  if(state.user) localStorage.setItem("victor_user", JSON.stringify(state.user));
  else localStorage.removeItem("victor_user");
}

function fmt(n) {
  return n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : n;
}

function portInfo(id) {
  return PORTS.find(p => p.id === id) || { name: "Ollama", color: "#00f0ff" };
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

function toast(msg, type = "info") {
  const container = document.getElementById("toast");
  if(!container) return;
  const t = document.createElement("div");
  t.style.padding = "8px 14px";
  t.style.borderRadius = "4px";
  t.style.fontSize = "12px";
  t.style.fontFamily = "var(--font-mono)";
  t.style.background = type === "error" ? "rgba(255,0,85,0.9)" : type === "success" ? "rgba(0,255,136,0.9)" : "rgba(0,240,255,0.9)";
  t.style.color = "#000";
  t.style.fontWeight = "bold";
  t.style.boxShadow = "0 0 15px rgba(0,240,255,0.5)";
  
  t.innerText = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function openModal(id) {
  const m = document.getElementById(id);
  if(m) m.style.display = "flex";
}

function closeModal(id) {
  const m = document.getElementById(id);
  if(m) m.style.display = "none";
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Clock & Metrics Update Timer
function startHudTimers() {
  setInterval(() => {
    const now = new Date();
    const clockEl = document.getElementById("hudClock");
    if(clockEl) {
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
      clockEl.innerText = `${dateStr} | ${dayName} | ${now.toLocaleTimeString()}`;
    }

    // Uptime
    state.uptimeSeconds++;
    const hrs = String(Math.floor(state.uptimeSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((state.uptimeSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(state.uptimeSeconds % 60).padStart(2, '0');
    const uptimeEl = document.getElementById("uptimeVal");
    if(uptimeEl) uptimeEl.innerText = `${hrs}:${mins}:${secs}`;

    // Fluctuate System Stats
    const cpu = Math.floor(20 + Math.random() * 15);
    const ram = Math.floor(45 + Math.random() * 8);
    const gpu = Math.floor(30 + Math.random() * 10);
    const disk = 62;

    updateMetric("cpuVal", "cpuBar", cpu);
    updateMetric("ramVal", "ramBar", ram);
    updateMetric("gpuVal", "gpuBar", gpu);
    updateMetric("diskVal", "diskBar", disk);
  }, 1000);
}

function updateMetric(valId, barId, pct) {
  const valEl = document.getElementById(valId);
  const barEl = document.getElementById(barId);
  if(valEl) valEl.innerText = `${pct}%`;
  if(barEl) barEl.style.width = `${pct}%`;
}

// Voice Toggle
function toggleVoiceListening() {
  state.isListening = !state.isListening;
  const stateText = document.getElementById("listeningText");
  const micBtn = document.getElementById("micBtn");

  if(state.isListening) {
    if(stateText) stateText.innerText = "VICTOR IS LISTENING & PROCESSING...";
    if(micBtn) micBtn.style.boxShadow = "0 0 25px #00ff88";
    toast("Voice Assistant Activated - Listening...", "success");
    addConsoleLine("VICTOR", "Voice Assistant Listening... How can I help Boss?");
  } else {
    if(stateText) stateText.innerText = "VICTOR IS STANDBY...";
    if(micBtn) micBtn.style.boxShadow = "0 0 15px rgba(0,240,255,0.3)";
    toast("Voice Assistant Standby", "info");
  }
}

// Console Commander
function handleConsoleSubmit(e) {
  if(e) e.preventDefault();
  const input = document.getElementById("consoleInput");
  const cmd = input?.value.trim();
  if(!cmd) return;

  input.value = "";
  addConsoleLine("YOU", cmd);

  const lower = cmd.toLowerCase();
  let reply = "Understood Boss. Executing task...";

  if(lower.includes("hello") || lower.includes("hi")) {
    reply = "Hello Boss! VICTOR OG Core is online and ready for your command.";
  } else if(lower.includes("youtube") || lower.includes("music")) {
    reply = "Opening YouTube... Launching Lo-Fi beats workstation stream.";
  } else if(lower.includes("news") || lower.includes("summary")) {
    reply = "Summarizing latest AI news: Open-source models performing at SOTA levels!";
  } else if(lower.includes("status")) {
    reply = "System Status: CPU 23% | RAM 48% | GPU 31% | All 6 Ollama Models RUNNING.";
  } else if(lower.includes("help")) {
    reply = "Commands available: 'status', 'pull <model>', 'open workbench', 'run llama', 'news'";
  } else if(lower.includes("workbench")) {
    scrollToSection("apidogWorkbench");
    reply = "Navigating to API Testing Workbench.";
  } else if(lower.includes("pull")) {
    openPullModal("llama3.3-70b");
    reply = "Initializing download dock for model.";
  }

  setTimeout(() => {
    addConsoleLine("VICTOR", reply);
    addActivityLog(cmd.toUpperCase());
  }, 400);
}

function addConsoleLine(sender, text) {
  const out = document.getElementById("consoleOutput");
  if(!out) return;
  const line = document.createElement("div");
  line.className = `c-line ${sender === 'YOU' ? 'usr' : 'sys'}`;
  line.innerHTML = `<span class="c-tag">${sender}:</span> ${escapeHtml(text)}`;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function addActivityLog(text) {
  const log = document.getElementById("activityLog");
  if(!log) return;
  const time = new Date().toLocaleTimeString();
  const item = document.createElement("div");
  item.innerHTML = `<span>${time}</span> ${escapeHtml(text.slice(0, 20))}`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

// Render Functions
function updateStats() {
  const installedCountPill = document.getElementById("installedCountPill");
  if(installedCountPill) installedCountPill.innerText = `${state.installed.size} MODELS DOCKED`;
}

function renderChips() {
  const c = document.getElementById("portChips");
  if(!c) return;
  let html = `<button class="chip ${state.port === 'all' ? 'active' : ''}" data-port="all">ALL PORTS</button>`;
  PORTS.forEach(p => {
    html += `<button class="chip ${state.port === p.id ? 'active' : ''}" data-port="${p.id}">${escapeHtml(p.name)}</button>`;
  });
  c.innerHTML = html;

  c.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.port = btn.dataset.port;
      renderChips();
      renderGrid();
    });
  });
}

function renderGrid() {
  const g = document.getElementById("modelGrid");
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");
  if(!g) return;

  const filtered = MODELS.filter(m => {
    if(state.port !== "all" && m.port !== state.port) return false;
    if(state.search) {
      const q = state.search.toLowerCase();
      if(!m.name.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q) && !m.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if(resultCount) resultCount.innerText = `${filtered.length} MODELS ON MANIFEST`;

  if(filtered.length === 0) {
    g.innerHTML = "";
    if(emptyState) emptyState.classList.remove("hidden");
    return;
  }
  if(emptyState) emptyState.classList.add("hidden");

  g.innerHTML = "";
  filtered.forEach(m => {
    const p = portInfo(m.port);
    const isInstalled = state.installed.has(m.id);

    g.innerHTML += `
      <div class="model-card" style="border-left-color:${p.color};">
        <div class="card-header">
          <div>
            <span class="provider-tag" style="color:${p.color};">${escapeHtml(p.name)}</span>
            <h3 class="model-name">${escapeHtml(m.name)} <span>(${m.size})</span></h3>
          </div>
          <span class="hud-badge green">⬇ ${fmt(m.haul)}</span>
        </div>
        <p style="font-size:11px; color:#78a6b8; margin-bottom:8px;">${escapeHtml(m.desc)}</p>
        <div class="card-actions">
          ${isInstalled 
            ? `<button class="hud-action-btn launch-playground-btn" data-model="${m.id}">⚡ PLAYGROUND</button>`
            : `<button class="hud-action-btn primary open-pull-modal" data-model="${m.id}">PULL MODEL</button>`
          }
          <button class="hud-action-btn test-api-btn" data-model="${m.apiModel}">⚡ TEST API</button>
        </div>
      </div>
    `;
  });
}

function renderInstalledGrid() {
  const g = document.getElementById("installedGrid");
  const emptyDockState = document.getElementById("emptyDockState");
  if(!g) return;

  if(state.installed.size === 0) {
    g.innerHTML = "";
    if(emptyDockState) emptyDockState.classList.remove("hidden");
    return;
  }
  if(emptyDockState) emptyDockState.classList.add("hidden");

  g.innerHTML = "";
  Array.from(state.installed).forEach(id => {
    const m = MODELS.find(x => x.id === id) || { id, name: id.toUpperCase(), size: "14B" };
    g.innerHTML += `
      <div class="model-card">
        <div class="card-header">
          <h3 class="model-name">${escapeHtml(m.name)}</h3>
          <span class="hud-badge green">RUNNING</span>
        </div>
        <div class="card-actions" style="margin-top:10px;">
          <button class="hud-action-btn primary launch-playground-btn" data-model="${m.id}">⚡ LAUNCH CHAT</button>
          <button class="hud-action-btn remove-dock-btn" data-model="${m.id}">REMOVE</button>
        </div>
      </div>
    `;
  });
}

function renderPorts() {
  const grid = document.getElementById("portGrid");
  if(!grid) return;
  grid.innerHTML = "";
  PORTS.forEach(p => {
    grid.innerHTML += `
      <div class="port-card">
        <div class="port-icon">🔌</div>
        <div>
          <strong style="color:#fff; font-family:var(--font-orbitron);">${escapeHtml(p.name)}</strong>
          <div style="font-size:11px; color:#78a6b8;">${escapeHtml(p.desc)}</div>
        </div>
      </div>
    `;
  });
}

// API Workbench Runner
function initApidogWorkbench() {
  document.getElementById("apiSendBtn")?.addEventListener("click", handleSendApiRequest);
  document.getElementById("apiSaveBtn")?.addEventListener("click", () => toast("API Request saved to database", "success"));

  document.querySelectorAll(".pane-tab-bar .pane-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".pane-tab-bar .pane-tab").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const targetTab = e.target.dataset.tab;
      document.querySelectorAll(".pane-panel").forEach(p => p.classList.add("hidden"));
      if(targetTab === 'body') document.getElementById("tabBody")?.classList.remove("hidden");
      if(targetTab === 'headers') document.getElementById("tabHeaders")?.classList.remove("hidden");
      if(targetTab === 'params') document.getElementById("tabParams")?.classList.remove("hidden");
      if(targetTab === 'code') {
        document.getElementById("tabCode")?.classList.remove("hidden");
        generateCodeSnippets();
      }
    });
  });
  generateCodeSnippets();
}

async function handleSendApiRequest() {
  const endpoint = document.getElementById("apiEndpointInput")?.value || "https://openrouter.ai/api/v1/chat/completions";
  const method = document.getElementById("apiMethod")?.value || "POST";
  const bodyText = document.getElementById("apiRequestBody")?.value || "{}";

  const startTime = performance.now();
  let responseData;
  let status = 200;

  try {
    if(endpoint.includes("openrouter.ai") && state.keys.openrouter) {
      const res = await fetch(endpoint, { method, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${state.keys.openrouter}` }, body: bodyText });
      status = res.status;
      responseData = await res.json();
    } else {
      await new Promise(r => setTimeout(r, 200));
      responseData = { id: "gen-" + Date.now(), object: "chat.completion", model: "meta-llama/llama-3.3-70b-instruct", choices: [{ message: { role: "assistant", content: "Quantum computing operates on superposition and entanglement to solve complex math." } }] };
    }
  } catch(e) {
    status = 500;
    responseData = { error: e.message };
  }

  const latency = Math.round(performance.now() - startTime);
  const jsonStr = JSON.stringify(responseData, null, 2);

  document.getElementById("apiResponseViewer").innerText = jsonStr;
  document.getElementById("apiResponseStatus").innerText = `${status} OK`;
  document.getElementById("apiResponseTime").innerText = `${latency} ms`;
  document.getElementById("apiResponseSize").innerText = `${jsonStr.length} B`;
  toast("Request Executed Successfully", "success");
}

function generateCodeSnippets() {
  const el = document.getElementById("generatedCodeSnippet");
  if(!el) return;
  const endpoint = document.getElementById("apiEndpointInput")?.value || "";
  const method = document.getElementById("apiMethod")?.value || "POST";
  const body = document.getElementById("apiRequestBody")?.value || "";

  el.innerText = `curl -X ${method} "${endpoint}" -H "Content-Type: application/json" -d '${body.replace(/\n/g, '')}'`;
}

// Pull Simulator
function openPullModal(modelId) {
  const m = MODELS.find(x => x.id === modelId) || { id: modelId, name: modelId.toUpperCase(), size: "70B", desc: "Model download" };
  document.getElementById("pullModalTitle").innerText = `PULLING ${m.name}`;
  document.getElementById("pullModalDesc").innerText = m.desc;
  openModal("pullModalOverlay");
  startPullSimulation(m);
}

function startPullSimulation(m) {
  const progressBar = document.getElementById("pullProgressBar");
  const layersEl = document.getElementById("pullLayers");
  layersEl.innerHTML = "";
  let pct = 0;

  const timer = setInterval(() => {
    pct += 25;
    if(progressBar) progressBar.style.width = `${pct}%`;
    layersEl.innerHTML += `<div style="color:var(--green);">✔ PULLED SHARD: layer-${pct/25}.safetensors</div>`;

    if(pct >= 100) {
      clearInterval(timer);
      state.installed.add(m.id);
      saveState();
      updateStats();
      renderInstalledGrid();
      renderGrid();
      toast(`Successfully docked ${m.name}`, "success");
      closeModal("pullModalOverlay");
    }
  }, 250);
}

// Playground Chat
function openPlayground(modelId = "llama3.3-70b") {
  openModal("playgroundModalOverlay");
  const select = document.getElementById("pgModelSelect");
  if(select) {
    select.innerHTML = `<option value="${modelId}">${modelId.toUpperCase()}</option>`;
  }
}

// Admin PIN (20032004)
function setupAdminPIN() {
  const inputs = document.querySelectorAll(".pin-digit");
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if(e.target.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
      checkPIN();
    });
  });
}

function checkPIN() {
  const inputs = document.querySelectorAll(".pin-digit");
  const pin = Array.from(inputs).map(i => i.value).join("");
  if(pin.length === 8) {
    if(pin === ADMIN_VERIFICATION_PIN) {
      state.adminAuthenticated = true;
      closeModal("adminPinOverlay");
      openModal("adminDashboardOverlay");
      toast("Admin access granted", "success");
    } else {
      document.getElementById("pinError")?.classList.remove("hidden");
    }
  }
}

// Master Initialization
function initApp() {
  startHudTimers();
  updateStats();
  renderChips();
  renderGrid();
  renderInstalledGrid();
  renderPorts();
  initApidogWorkbench();
  setupAdminPIN();

  // Search filter
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });

  document.getElementById("consoleForm")?.addEventListener("submit", handleConsoleSubmit);
  document.getElementById("pinVerifyBtn")?.addEventListener("click", checkPIN);
  document.getElementById("pinCancelBtn")?.addEventListener("click", () => closeModal("adminPinOverlay"));

  // Event Delegation
  document.addEventListener("click", (e) => {
    if(e.target.closest(".btn-close")) {
      e.target.closest(".modal-overlay, .pin-overlay").style.display = "none";
    }
    const pullBtn = e.target.closest(".open-pull-modal");
    if(pullBtn) openPullModal(pullBtn.dataset.model);

    const pgBtn = e.target.closest(".launch-playground-btn");
    if(pgBtn) openPlayground(pgBtn.dataset.model);

    const testBtn = e.target.closest(".test-api-btn");
    if(testBtn) {
      scrollToSection("apidogWorkbench");
      toast("Loaded endpoint into API Workbench", "info");
    }

    const removeBtn = e.target.closest(".remove-dock-btn");
    if(removeBtn) {
      const modelId = removeBtn.dataset.model;
      if(modelId && confirm(`Remove ${modelId} from dock?`)) {
        state.installed.delete(modelId);
        saveState();
        updateStats();
        renderInstalledGrid();
        renderGrid();
        toast(`Removed ${modelId}`);
      }
    }
  });
}

if(document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
