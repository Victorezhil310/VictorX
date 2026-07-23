/* ==========================================================================
   VictorX Engine — Model Registry, API Workbench & Playground
   ========================================================================== */

const PORTS = [
  { id: "meta",       name: "Meta",         color: "#7C9CFF", desc: "Llama open weights family." },
  { id: "deepseek",   name: "DeepSeek",     color: "#38BDF8", desc: "DeepSeek R1 reasoning models." },
  { id: "mistral",    name: "Mistral AI",   color: "#E5675F", desc: "Fast open weight models." },
  { id: "google",     name: "Google",       color: "#8FD14F", desc: "Gemma 3 open models." },
  { id: "qwen",       name: "Alibaba Qwen", color: "#C792EA", desc: "Qwen 2.5 series." }
];

const MODELS = [
  { id: "llama-3.3-70b",  name: "Llama 3.3 70B", size: "70B",  port: "meta",     tags: ["text-generation","reasoning"], haul: 5400000, added: 1, desc: "State of the art open reasoning model fine tuned for chat & coding.", apiModel: "meta-llama/llama-3.3-70b-instruct" },
  { id: "deepseek-r1",   name: "DeepSeek R1",   size: "671B", port: "deepseek", tags: ["reasoning","math","code"],    haul: 90300000, added: 2, desc: "Frontier reasoning model with deep chain of thought capabilities.", apiModel: "deepseek/deepseek-r1" },
  { id: "gemma-3-12b",   name: "Gemma 3 12B",   size: "12B",  port: "google",   tags: ["multimodal","chat"],         haul: 38800000, added: 3, desc: "Google DeepMind lightweight model for single GPU deployment.", apiModel: "google/gemma-2-27b-it" },
  { id: "qwen-2.5-14b",  name: "Qwen 2.5 14B",  size: "14B",  port: "qwen",     tags: ["multilingual","tools"],      haul: 35200000, added: 4, desc: "High performance multilingual model with 128K context.", apiModel: "qwen/qwen-2.5-72b-instruct" },
  { id: "mistral-7b",    name: "Mistral 7B",    size: "7B",   port: "mistral",  tags: ["text-generation","fast"],    haul: 31300000, added: 5, desc: "Fast instruction-tuned model v0.3 for low latency serving.", apiModel: "mistralai/mistral-7b-instruct" },
  { id: "llama-3.1-8b",   name: "Llama 3.1 8B",  size: "8B",   port: "meta",     tags: ["general","lightweight"],     haul: 81200000, added: 6, desc: "Meta general purpose fast open weight model.", apiModel: "meta-llama/llama-3.1-8b-instruct" },
  { id: "codellama-13b", name: "CodeLlama 13B", size: "13B",  port: "meta",     tags: ["code","infilling"],          haul: 5800000,  added: 7, desc: "Specialized model for software synthesis and code completion.", apiModel: "meta-llama/codellama-13b-instruct" }
];

const ADMIN_VERIFICATION_PIN = '20032004';

let state = {
  search: "",
  port: "all",
  sort: "most_hauled",
  user: JSON.parse(localStorage.getItem("victor_user") || 'null'),
  keys: JSON.parse(localStorage.getItem("victor_apikeys") || '{"openrouter":"","openai":"","gemini":"","ollama":"http://localhost:11434"}'),
  installed: new Set(JSON.parse(localStorage.getItem("victor_installed") || '["gemma-3-12b","qwen-2.5-14b","llama-3.3-70b","deepseek-r1","mistral-7b","llama-3.1-8b"]')),
  adminAuthenticated: false
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
  return PORTS.find(p => p.id === id) || { name: "Open Weights", color: "#38bdf8" };
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
  t.style.padding = "10px 16px";
  t.style.borderRadius = "8px";
  t.style.fontSize = "13px";
  t.style.fontWeight = "600";
  t.style.boxShadow = "0 4px 14px rgba(0,0,0,0.5)";
  t.style.background = type === "error" ? "#7f1d1d" : type === "success" ? "#064e3b" : "#1f2937";
  t.style.color = type === "error" ? "#fca5a5" : type === "success" ? "#6ee7b7" : "#f9fafb";
  t.style.border = "1px solid " + (type === "error" ? "#991b1b" : type === "success" ? "#065f46" : "#374151");
  
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

// Render Functions
function updateStats() {
  const installedCountPill = document.getElementById("installedCountPill");
  const statInstalled = document.getElementById("statInstalled");
  if(installedCountPill) installedCountPill.innerText = `${state.installed.size} Models`;
  if(statInstalled) statInstalled.innerText = state.installed.size;
}

function renderChips() {
  const c = document.getElementById("portChips");
  if(!c) return;
  let html = `<button class="chip ${state.port === 'all' ? 'active' : ''}" data-port="all">All Ecosystems</button>`;
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

  if(resultCount) resultCount.innerText = `${filtered.length} Models`;

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
      <div class="model-card">
        <div class="card-top">
          <div>
            <span class="provider-badge" style="color:${p.color};">${escapeHtml(p.name)}</span>
            <h3 class="model-title">${escapeHtml(m.name)} <span style="font-size:12px; color:var(--text-muted);">(${m.size})</span></h3>
          </div>
          <span class="count-tag">⬇ ${fmt(m.haul)}</span>
        </div>
        <p class="model-desc">${escapeHtml(m.desc)}</p>
        <div class="card-meta-row">
          ${m.tags.map(t => `<span class="meta-tag">${t}</span>`).join('')}
        </div>
        <div class="card-bottom-actions">
          ${isInstalled 
            ? `<button class="btn btn-secondary launch-playground-btn style-flex-1" data-model="${m.id}">⚡ Playground</button>`
            : `<button class="btn btn-primary open-pull-modal style-flex-1" data-model="${m.id}">Pull Weights</button>`
          }
          <button class="btn btn-secondary test-api-btn" data-model="${m.apiModel}">⚡ Test API</button>
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
    const m = MODELS.find(x => x.id === id) || { id, name: id, size: "Weights" };
    g.innerHTML += `
      <div class="model-card">
        <div class="card-top">
          <h3 class="model-title">${escapeHtml(m.name)}</h3>
          <span class="badge yellow-badge">DOCKED</span>
        </div>
        <div class="card-bottom-actions" style="margin-top:12px;">
          <button class="btn btn-primary launch-playground-btn style-flex-1" data-model="${m.id}">⚡ Launch Chat</button>
          <button class="btn btn-secondary remove-dock-btn" data-model="${m.id}">Remove</button>
        </div>
      </div>
    `;
  });
}

// API Workbench Runner
function initApidogWorkbench() {
  document.getElementById("apiSendBtn")?.addEventListener("click", handleSendApiRequest);
  document.getElementById("apiSaveBtn")?.addEventListener("click", () => toast("API Request saved to database", "success"));

  document.querySelectorAll(".tab-header .tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-header .tab-btn").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
      const targetTab = e.target.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.add("hidden"));
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
  const m = MODELS.find(x => x.id === modelId) || { id: modelId, name: modelId, size: "Weights", desc: "Model weight download" };
  document.getElementById("pullModalTitle").innerText = `Pulling ${m.name}`;
  document.getElementById("pullModalDesc").innerText = m.desc;
  openModal("pullModalOverlay");

  const btn = document.getElementById("pullConfirmBtn");
  if(btn) {
    btn.disabled = false;
    btn.innerText = "Start Pull";
    btn.onclick = () => startPullSimulation(m);
  }
}

function startPullSimulation(m) {
  const progressBar = document.getElementById("pullProgressBar");
  const layersEl = document.getElementById("pullLayers");
  const btn = document.getElementById("pullConfirmBtn");

  if(btn) { btn.disabled = true; btn.innerText = "Downloading..."; }
  if(layersEl) layersEl.innerHTML = "";
  let pct = 0;

  const timer = setInterval(() => {
    pct += 25;
    if(progressBar) progressBar.style.width = `${pct}%`;
    if(layersEl) layersEl.innerHTML += `<div style="color:var(--green);">✔ Pulled shard: layer-${pct/25}.safetensors</div>`;

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

// AI Playground Chat
function openPlayground(modelId = "llama-3.3-70b") {
  openModal("playgroundModalOverlay");
  const select = document.getElementById("pgModelSelect");
  if(select) {
    select.innerHTML = "";
    Array.from(state.installed).forEach(id => {
      const m = MODELS.find(x => x.id === id) || { id, name: id };
      select.innerHTML += `<option value="${m.id}" ${m.id === modelId ? 'selected' : ''}>${m.name}</option>`;
    });
  }
}

// Admin Security PIN (20032004)
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
  updateStats();
  renderChips();
  renderGrid();
  renderInstalledGrid();
  initApidogWorkbench();
  setupAdminPIN();

  // Search filter
  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
  });

  document.getElementById("adminPinBtn")?.addEventListener("click", () => openModal("adminPinOverlay"));
  document.getElementById("openUpiModalBtn")?.addEventListener("click", () => openModal("upiModalOverlay"));
  document.getElementById("openApiKeysBtn")?.addEventListener("click", () => openModal("apiKeysModalOverlay"));
  document.getElementById("pinVerifyBtn")?.addEventListener("click", checkPIN);
  document.getElementById("pinCancelBtn")?.addEventListener("click", () => closeModal("adminPinOverlay"));

  // Event Delegation
  document.addEventListener("click", (e) => {
    if(e.target.closest(".btn-close")) {
      const overlay = e.target.closest(".modal-overlay") || e.target.closest(".pin-overlay");
      if(overlay) overlay.style.display = "none";
    }
    const pullBtn = e.target.closest(".open-pull-modal");
    if(pullBtn) openPullModal(pullBtn.dataset.model);

    const pgBtn = e.target.closest(".launch-playground-btn");
    if(pgBtn) openPlayground(pgBtn.dataset.model);

    const testBtn = e.target.closest(".test-api-btn");
    if(testBtn) {
      document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth" });
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
